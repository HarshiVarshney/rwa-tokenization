import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function Hero({ connectWallet }) {
  const containerRef = useRef(null);
  const threeSceneRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || threeSceneRef.current) return;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(
      52,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 1.8, 13);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(
      containerRef.current.clientWidth,
      containerRef.current.clientHeight
    );
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // Building
    const building = new THREE.Group();

    const body = new THREE.Mesh(
      new THREE.BoxGeometry(3.8, 5.2, 3.8),
      new THREE.MeshPhongMaterial({ color: 0x1a2333, shininess: 40 })
    );
    building.add(body);

    const roof = new THREE.Mesh(
      new THREE.ConeGeometry(4.1, 2.2, 4),
      new THREE.MeshPhongMaterial({
        color: 0x00f5ff,
        shininess: 120,
        transparent: true,
        opacity: 0.85,
      })
    );
    roof.position.y = 3.8;
    roof.rotation.y = Math.PI / 4;
    building.add(roof);

    // Windows
    for (let i = 0; i < 18; i++) {
      const win = new THREE.Mesh(
        new THREE.PlaneGeometry(0.75, 0.75),
        new THREE.MeshPhongMaterial({
          color: 0x00f5ff,
          emissive: 0x00f5ff,
          emissiveIntensity: 0.9,
        })
      );
      win.position.set(
        (i % 4 - 1.5) * 1.05,
        2.1 - Math.floor(i / 4) * 1.35,
        1.91
      );
      building.add(win);
    }

    scene.add(building);

    // Lights
    const light = new THREE.DirectionalLight(0x00f5ff, 1.6);
    light.position.set(10, 15, 8);
    scene.add(light);

    scene.add(new THREE.AmbientLight(0x112233, 0.7));

    // Animation
    let rotation = 0;

    const animate = () => {
      rotation += 0.0028;

      building.rotation.y = rotation * 0.65;
      building.position.y = Math.sin(rotation * 1.8) * 0.18;

      renderer.render(scene, camera);
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Resize handling
    const handleResize = () => {
      if (!containerRef.current) return;

      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;

      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    window.addEventListener('resize', handleResize);

    // Store references
    threeSceneRef.current = { renderer, scene, camera };

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);

      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }

      if (renderer) {
        renderer.dispose();
        if (renderer.domElement) {
          renderer.domElement.remove();
        }
      }

      threeSceneRef.current = null;
    };
  }, []);

  return (
    <div className="hero">
      <div className="hero-content">
        <div className="badge">🏗️ Real Estate × Blockchain</div>

        <h1 className="hero-title">
          Own a piece<br />of tomorrow.
        </h1>

        <p className="hero-subtitle">
          Fractional ownership of premium buildings.<br />
          Instant rental income. Full transparency.
        </p>

        <button onClick={connectWallet} className="hero-cta">
          Connect Wallet & Start Owning
        </button>

        <div ref={containerRef} className="three-container" />
      </div>
    </div>
  );
}