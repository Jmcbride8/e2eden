import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function Pie3D({ data, colors }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 0.8, 2);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);

    // Create 3D pie chart slices
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let currentAngle = -Math.PI / 2;
    const cylinderHeight = 0.6;
    const radius = 1.8;
    const segments = 64;

    data.forEach((item, index) => {
      const sliceAngle = (item.value / total) * Math.PI * 2;
      const color = new THREE.Color(colors[index % colors.length]);
      const midAngle = currentAngle + sliceAngle / 2;

      // Create cylinder slice geometry
      const geometry = new THREE.CylinderGeometry(radius, radius, cylinderHeight, segments, 1, false, currentAngle, sliceAngle);
      
      // Create three materials: top, side, bottom
      const materials = [
        new THREE.MeshPhongMaterial({
          color: color,
          emissive: new THREE.Color().copy(color).multiplyScalar(0.3),
          shininess: 100
        }),
        new THREE.MeshPhongMaterial({
          color: new THREE.Color().copy(color).multiplyScalar(0.7),
          emissive: new THREE.Color().copy(color).multiplyScalar(0.1),
          shininess: 80
        }),
        new THREE.MeshPhongMaterial({
          color: new THREE.Color().copy(color).multiplyScalar(0.5),
          shininess: 60
        })
      ];

      const mesh = new THREE.Mesh(geometry, materials);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      scene.add(mesh);

      currentAngle += sliceAngle;
    });

    // Lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 8, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0xfbbf24, 0.6);
    pointLight.position.set(-4, 6, 4);
    scene.add(pointLight);

    // Render once (no animation)
    renderer.render(scene, camera);

    // Handle resize
    const handleResize = () => {
      if (containerRef.current) {
        const newWidth = containerRef.current.clientWidth;
        const newHeight = containerRef.current.clientHeight;
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight);
        renderer.render(scene, camera);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (containerRef.current && renderer.domElement.parentNode === containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [data, colors]);

  return <div ref={containerRef} style={{ width: '100%', height: '400px' }} />;
}