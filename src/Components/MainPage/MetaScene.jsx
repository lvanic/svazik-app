import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

const MetaScene = () => {
  const containerRef = useRef(null);
  const fbxModelRef = useRef(null);
  const target = useRef(new THREE.Vector3());
  const containerBounds = useRef({});

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current?.appendChild(renderer.domElement);

    const loader = new FBXLoader();

    loader.load(
      './model.fbx',
      function (model) {
        var finalModel = model;
        finalModel.rotation.y -= 89.5;
        fbxModelRef.current = finalModel;
        scene.add(fbxModelRef.current);

        const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x000000, 1);
        hemisphereLight.position.set(0, 0, 1);
        scene.add(hemisphereLight);
      },
      undefined,
      function (error) {
        console.error(error);
      }
    );

    camera.position.z = 150;
    camera.position.x += 20;
    camera.position.y -= 10;

    const onMouseMove = (event) => {
      const mouseX = event.clientX - containerBounds.current.left;
      const mouseY = event.clientY - containerBounds.current.top;

      target.current.x = (mouseX / containerBounds.current.width) * 50 - 1;
      target.current.y = -(mouseY / containerBounds.current.height) * 50 + 1;
    };

    containerBounds.current = containerRef.current.getBoundingClientRect();
    containerRef.current.addEventListener('mousemove', onMouseMove);

    const animate = () => {
      requestAnimationFrame(animate);

      if (fbxModelRef.current) {
        fbxModelRef.current.position.x += (target.current.x - fbxModelRef.current.position.x) * 0.5;
        fbxModelRef.current.position.y += (target.current.y - fbxModelRef.current.position.y) * 0.5;
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      containerBounds.current = containerRef.current.getBoundingClientRect();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      containerRef.current?.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      <div className="overlay" style={{ position: 'absolute', width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.3)' }}></div>
    </div>
  );
};

export default MetaScene;
