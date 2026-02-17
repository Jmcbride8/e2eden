import React, { useRef, useEffect, useMemo, useCallback } from "react";
import * as THREE from "three";

function latLonToVector3(lat, lon, radius) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

export default function GlobeScene({ locations, selectedLocation, onSelectLocation }) {
  const containerRef = useRef(null);
  const sceneRef = useRef({});
  const isDragging = useRef(false);
  const previousMouse = useRef({ x: 0, y: 0 });
  const rotationVelocity = useRef({ x: 0, y: 0 });
  const autoRotate = useRef(true);
  const markerMeshes = useRef([]);
  const raycaster = useRef(new THREE.Raycaster());
  const mouse = useRef(new THREE.Vector2());
  const hoveredMarker = useRef(null);

  const globeRadius = 2.5;

  const createGlobe = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 7;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Globe group
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // Globe sphere — wireframe style
    const sphereGeo = new THREE.SphereGeometry(globeRadius, 64, 64);
    const sphereMat = new THREE.MeshBasicMaterial({
      color: 0x1a2744,
      transparent: true,
      opacity: 0.35,
    });
    const sphere = new THREE.Mesh(sphereGeo, sphereMat);
    globeGroup.add(sphere);

    // Wireframe overlay
    const wireGeo = new THREE.SphereGeometry(globeRadius + 0.005, 40, 40);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x2d4a7a,
      wireframe: true,
      transparent: true,
      opacity: 0.08,
    });
    globeGroup.add(new THREE.Mesh(wireGeo, wireMat));

    // Atmosphere glow
    const glowGeo = new THREE.SphereGeometry(globeRadius + 0.15, 64, 64);
    const glowMat = new THREE.ShaderMaterial({
      transparent: true,
      side: THREE.BackSide,
      uniforms: {
        glowColor: { value: new THREE.Color(0x3b82f6) },
      },
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        uniform vec3 glowColor;
        void main() {
          float intensity = pow(0.6 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0);
          gl_FragColor = vec4(glowColor, intensity * 0.3);
        }
      `,
    });
    globeGroup.add(new THREE.Mesh(glowGeo, glowMat));

    // Latitude/longitude grid lines
    const gridMaterial = new THREE.LineBasicMaterial({ color: 0x2d4a7a, transparent: true, opacity: 0.12 });
    
    // Latitude lines
    for (let lat = -60; lat <= 60; lat += 30) {
      const points = [];
      for (let lon = 0; lon <= 360; lon += 2) {
        points.push(latLonToVector3(lat, lon, globeRadius + 0.01));
      }
      const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
      globeGroup.add(new THREE.Line(lineGeo, gridMaterial));
    }

    // Longitude lines
    for (let lon = 0; lon < 360; lon += 30) {
      const points = [];
      for (let lat = -90; lat <= 90; lat += 2) {
        points.push(latLonToVector3(lat, lon, globeRadius + 0.01));
      }
      const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
      globeGroup.add(new THREE.Line(lineGeo, gridMaterial));
    }

    // Markers
    markerMeshes.current = [];
    locations.forEach((loc) => {
      const pos = latLonToVector3(loc.lat, loc.lon, globeRadius + 0.02);

      // Outer ring
      const ringGeo = new THREE.RingGeometry(0.06, 0.085, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xf59e0b,
        transparent: true,
        opacity: 0.9,
        side: THREE.DoubleSide,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.copy(pos);
      ring.lookAt(new THREE.Vector3(0, 0, 0));
      globeGroup.add(ring);

      // Inner dot
      const dotGeo = new THREE.CircleGeometry(0.045, 32);
      const dotMat = new THREE.MeshBasicMaterial({
        color: 0xfbbf24,
        transparent: true,
        opacity: 1,
        side: THREE.DoubleSide,
      });
      const dot = new THREE.Mesh(dotGeo, dotMat);
      dot.position.copy(pos);
      dot.lookAt(new THREE.Vector3(0, 0, 0));
      dot.userData = { location: loc };
      globeGroup.add(dot);

      // Pulse ring
      const pulseGeo = new THREE.RingGeometry(0.085, 0.1, 32);
      const pulseMat = new THREE.MeshBasicMaterial({
        color: 0xf59e0b,
        transparent: true,
        opacity: 0.4,
        side: THREE.DoubleSide,
      });
      const pulse = new THREE.Mesh(pulseGeo, pulseMat);
      pulse.position.copy(pos);
      pulse.lookAt(new THREE.Vector3(0, 0, 0));
      globeGroup.add(pulse);

      markerMeshes.current.push({ dot, ring, pulse, location: loc });
    });

    // Ambient particles
    const particleCount = 800;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x4a6fa5,
      size: 0.015,
      transparent: true,
      opacity: 0.4,
    });
    scene.add(new THREE.Points(particleGeo, particleMat));

    sceneRef.current = { scene, camera, renderer, globeGroup };

    // Animation loop
    let frameId;
    const clock = new THREE.Clock();

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Auto-rotation
      if (autoRotate.current && !isDragging.current) {
        globeGroup.rotation.y += 0.002;
      }

      // Apply drag velocity
      if (!isDragging.current) {
        globeGroup.rotation.y += rotationVelocity.current.x;
        globeGroup.rotation.x += rotationVelocity.current.y;
        rotationVelocity.current.x *= 0.95;
        rotationVelocity.current.y *= 0.95;
      }

      // Clamp x rotation
      globeGroup.rotation.x = Math.max(-1.2, Math.min(1.2, globeGroup.rotation.x));

      // Pulse animation on markers
      markerMeshes.current.forEach(({ pulse, ring, dot, location }, i) => {
        const scale = 1 + 0.4 * Math.sin(elapsed * 2 + i);
        pulse.scale.set(scale, scale, 1);
        pulse.material.opacity = 0.4 * (1 - (scale - 1) / 0.4);

        const isSelected = selectedLocation?.name === location.name;
        const isHovered = hoveredMarker.current === location.name;
        const targetOpacity = isSelected ? 1 : isHovered ? 0.95 : 0.9;
        const targetScale = isSelected ? 1.5 : isHovered ? 1.3 : 1;
        
        dot.material.opacity += (targetOpacity - dot.material.opacity) * 0.1;
        ring.scale.lerp(new THREE.Vector3(targetScale, targetScale, 1), 0.1);
        
        if (isSelected) {
          dot.material.color.lerp(new THREE.Color(0xffffff), 0.05);
          ring.material.color.lerp(new THREE.Color(0xffffff), 0.05);
        } else {
          dot.material.color.lerp(new THREE.Color(0xfbbf24), 0.05);
          ring.material.color.lerp(new THREE.Color(0xf59e0b), 0.05);
        }
      });

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
  }, [locations]);

  useEffect(() => {
    const cleanup = createGlobe();
    return cleanup;
  }, [createGlobe]);

  // Update selected location ref
  useEffect(() => {
    if (selectedLocation) {
      autoRotate.current = false;
    }
  }, [selectedLocation]);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      const { camera, renderer } = sceneRef.current;
      const container = containerRef.current;
      if (!camera || !renderer || !container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Mouse interactions
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onPointerDown = (e) => {
      isDragging.current = true;
      autoRotate.current = false;
      previousMouse.current = { x: e.clientX, y: e.clientY };
    };

    const onPointerMove = (e) => {
      const rect = container.getBoundingClientRect();
      mouse.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      if (isDragging.current) {
        const dx = e.clientX - previousMouse.current.x;
        const dy = e.clientY - previousMouse.current.y;
        const { globeGroup } = sceneRef.current;
        if (globeGroup) {
          globeGroup.rotation.y += dx * 0.005;
          globeGroup.rotation.x += dy * 0.005;
          rotationVelocity.current = { x: dx * 0.003, y: dy * 0.003 };
        }
        previousMouse.current = { x: e.clientX, y: e.clientY };
      }

      // Hover detection
      const { camera, scene } = sceneRef.current;
      if (camera && scene) {
        raycaster.current.setFromCamera(mouse.current, camera);
        const dots = markerMeshes.current.map(m => m.dot);
        const intersects = raycaster.current.intersectObjects(dots);
        if (intersects.length > 0) {
          const loc = intersects[0].object.userData.location;
          hoveredMarker.current = loc?.name || null;
          container.style.cursor = "pointer";
        } else {
          hoveredMarker.current = null;
          container.style.cursor = isDragging.current ? "grabbing" : "grab";
        }
      }
    };

    const onPointerUp = (e) => {
      if (isDragging.current) {
        const dx = Math.abs(e.clientX - previousMouse.current.x);
        const dy = Math.abs(e.clientY - previousMouse.current.y);
        // If barely moved, treat as click
        if (dx < 3 && dy < 3) {
          const { camera } = sceneRef.current;
          if (camera) {
            raycaster.current.setFromCamera(mouse.current, camera);
            const dots = markerMeshes.current.map(m => m.dot);
            const intersects = raycaster.current.intersectObjects(dots);
            if (intersects.length > 0) {
              const loc = intersects[0].object.userData.location;
              if (loc) onSelectLocation(loc);
            }
          }
        }
      }
      isDragging.current = false;
      if (!selectedLocation) {
        setTimeout(() => { autoRotate.current = true; }, 3000);
      }
    };

    container.addEventListener("pointerdown", onPointerDown);
    container.addEventListener("pointermove", onPointerMove);
    container.addEventListener("pointerup", onPointerUp);
    container.addEventListener("pointerleave", () => { isDragging.current = false; });

    return () => {
      container.removeEventListener("pointerdown", onPointerDown);
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerup", onPointerUp);
      container.removeEventListener("pointerleave", () => {});
    };
  }, [onSelectLocation, selectedLocation]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full cursor-grab active:cursor-grabbing"
      style={{ touchAction: "none" }}
    />
  );
}