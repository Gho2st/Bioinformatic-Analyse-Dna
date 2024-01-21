import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { PDBLoader } from "three/addons/loaders/PDBLoader";
import classes from "./Molecule.module.css";

export default function Molecule() {
  const containerRef = useRef();
  const animationRef = useRef();

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      2000
    );

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(
      containerRef.current.clientWidth,
      containerRef.current.clientHeight
    );
    containerRef.current.appendChild(renderer.domElement);

    const loader = new PDBLoader();
    loader.load("/models/aspirin.pdb", (pdbData) => {
      const atomsGeometry = pdbData.geometryAtoms;
      const atomsColors = atomsGeometry.attributes.color.array;

      // Utwórz sferę dla każdego atomu
      const atomsGroup = new THREE.Group();
      for (let i = 0; i < atomsGeometry.attributes.position.count; i++) {
        const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
        const sphereMaterial = new THREE.MeshPhongMaterial({
          color: new THREE.Color(
            atomsColors[i * 3],
            atomsColors[i * 3 + 1],
            atomsColors[i * 3 + 2]
          ),
          specular: 0x050505,
        });
        const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);

        const position = new THREE.Vector3();
        position.fromBufferAttribute(atomsGeometry.attributes.position, i);
        sphereMesh.position.copy(position);

        atomsGroup.add(sphereMesh);
      }

      const bonds = new THREE.Mesh(
        pdbData.geometryBonds,
        new THREE.MeshPhongMaterial({ color: 0x00ff00, specular: 0x050505 })
      );

      scene.add(atomsGroup);
      scene.add(bonds);

      // Ustawienie pozycji kamery na skupienie na molekule
      const boundingBox = new THREE.Box3().setFromObject(atomsGroup);
      const center = boundingBox.getCenter(new THREE.Vector3());
      camera.position.set(center.x, center.y, center.z + 30);
      camera.lookAt(center);

      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);

      // Ustawienie początkowej rotacji na zero
      atomsGroup.rotation.set(0, 0, 0);
      bonds.rotation.set(0, 0, 0);

      // Animation loop
      const animate = () => {
        atomsGroup.rotation.x += 0.005;
        atomsGroup.rotation.y += 0.005;
        bonds.rotation.x += 0.005;
        bonds.rotation.y += 0.005;

        renderer.render(scene, camera);
        animationRef.current = requestAnimationFrame(animate);
      };

      animate();
    });

    return () => {
      cancelAnimationFrame(animationRef.current);
      containerRef.current.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} className={classes.moleculeContainer} />;
}
