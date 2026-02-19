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

export default function GlobeScene({ projects, selectedProject, onSelectProject, isPaused }) {
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

    // Globe sphere with high-res world map texture
    const sphereGeo = new THREE.SphereGeometry(globeRadius, 128, 128);
    const textureLoader = new THREE.TextureLoader();
    
    // High-quality Earth texture
    const earthTexture = textureLoader.load(
      'https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg'
    );
    earthTexture.anisotropy = 16;
    
    // Bump map for terrain relief
    const bumpTexture = textureLoader.load(
      'https://unpkg.com/three-globe/example/img/earth-topology.png'
    );
    
    const sphereMat = new THREE.MeshPhongMaterial({
      map: earthTexture,
      bumpMap: bumpTexture,
      bumpScale: 0.015,
      specular: new THREE.Color(0x222222),
      shininess: 12,
      transparent: false,
    });
    const sphere = new THREE.Mesh(sphereGeo, sphereMat);
    globeGroup.add(sphere);

    // Enhanced lighting for photorealism
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(5, 3, 5);
    scene.add(directionalLight);
    
    const fillLight = new THREE.DirectionalLight(0x4477ff, 0.3);
    fillLight.position.set(-5, -1, -3);
    scene.add(fillLight);

    // Subtle wireframe overlay
    const wireGeo = new THREE.SphereGeometry(globeRadius + 0.005, 40, 40);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x4488ff,
      wireframe: true,
      transparent: true,
      opacity: 0.03,
    });
    globeGroup.add(new THREE.Mesh(wireGeo, wireMat));

    // Photorealistic atmosphere glow
    const glowGeo = new THREE.SphereGeometry(globeRadius + 0.18, 64, 64);
    const glowMat = new THREE.ShaderMaterial({
      transparent: true,
      side: THREE.BackSide,
      uniforms: {
        glowColor: { value: new THREE.Color(0x4499ff) },
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
          float intensity = pow(0.65 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.5);
          gl_FragColor = vec4(glowColor, intensity * 0.4);
        }
      `,
    });
    globeGroup.add(new THREE.Mesh(glowGeo, glowMat));

    // Subtle latitude/longitude grid lines
    const gridMaterial = new THREE.LineBasicMaterial({ color: 0x4488ff, transparent: true, opacity: 0.06 });
    
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

    // Markers and Labels
    markerMeshes.current = [];
    projects.forEach((project) => {
      const pos = latLonToVector3(project.lat, project.lon, globeRadius + 0.02);

      // Create text label sprite (no background)
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = 512;
      canvas.height = 220;
      
      let currentY = 30;
      
      // 1. Add year at top in yellow
      if (project.year) {
        context.font = 'bold 36px Arial';
        context.fillStyle = '#fbbf24'; // amber-400
        context.textAlign = 'center';
        context.textBaseline = 'top';
        context.fillText(project.year, canvas.width / 2, currentY);
        currentY += 48;
      }
      
      // 2. Add project name (bold, prominent)
      context.font = 'bold 52px Arial';
      context.fillStyle = 'white';
      context.textAlign = 'center';
      context.textBaseline = 'top';
      context.fillText(project.name, canvas.width / 2, currentY);
      currentY += 65;
      
      // 3. Add location below
      context.font = '34px Arial';
      context.fillStyle = 'rgba(255, 255, 255, 0.7)';
      context.textAlign = 'center';
      context.textBaseline = 'top';
      context.fillText(project.location || '', canvas.width / 2, currentY);
      
      const texture = new THREE.CanvasTexture(canvas);
      const spriteMaterial = new THREE.SpriteMaterial({ 
        map: texture,
        transparent: true,
        opacity: 0.9
      });
      const sprite = new THREE.Sprite(spriteMaterial);
      
      const labelPos = latLonToVector3(project.lat, project.lon, globeRadius + 0.35);
      sprite.position.copy(labelPos);
      sprite.scale.set(0.85, 0.35, 1);
      sprite.userData = { project };
      globeGroup.add(sprite);

      // Add line from marker to bottom center of label
      const lineEndPos = latLonToVector3(project.lat, project.lon, globeRadius + 0.2);
      const lineMaterial = new THREE.LineBasicMaterial({ 
        color: 0xffffff, 
        transparent: true, 
        opacity: 0.6,
        linewidth: 2
      });
      const linePoints = [pos, lineEndPos];
      const lineGeometry = new THREE.BufferGeometry().setFromPoints(linePoints);
      const line = new THREE.Line(lineGeometry, lineMaterial);
      globeGroup.add(line);

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
      dot.userData = { project };
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

      markerMeshes.current.push({ dot, ring, pulse, project });
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
      markerMeshes.current.forEach(({ pulse, ring, dot, project }, i) => {
        const scale = 1 + 0.4 * Math.sin(elapsed * 2 + i);
        pulse.scale.set(scale, scale, 1);
        pulse.material.opacity = 0.4 * (1 - (scale - 1) / 0.4);

        const isSelected = selectedProject?.id === project.id;
        const isHovered = hoveredMarker.current === project.id;
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
  }, [projects]);

  useEffect(() => {
    const cleanup = createGlobe();
    return cleanup;
  }, [createGlobe]);

  // Update selected project ref and pause state
  useEffect(() => {
    if (selectedProject) {
      autoRotate.current = false;
    }
  }, [selectedProject]);

  useEffect(() => {
    if (isPaused) {
      autoRotate.current = false;
    } else if (!selectedProject) {
      autoRotate.current = true;
    }
  }, [isPaused, selectedProject]);

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
          const proj = intersects[0].object.userData.project;
          hoveredMarker.current = proj?.id || null;
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
              const proj = intersects[0].object.userData.project;
              if (proj) onSelectProject(proj);
            }
          }
        }
      }
      isDragging.current = false;
      if (!selectedProject) {
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
  }, [onSelectProject, selectedProject]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full cursor-grab active:cursor-grabbing"
      style={{ touchAction: "none" }}
    />
  );
}