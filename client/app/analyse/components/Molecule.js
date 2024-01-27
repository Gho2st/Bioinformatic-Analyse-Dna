import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { PDBLoader } from "three/addons/loaders/PDBLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"; // Import OrbitControls
import classes from "./Molecule.module.css";

export default function Molecule() {
  const containerRef = useRef();
  const animationRef = useRef();
  const controlsRef = useRef(); // Create a ref for the controls
  let atomsGroup; // Declare atomsGroup outside the loader.load callback

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      70,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      5000
    );


    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(
      containerRef.current.clientWidth,
      containerRef.current.clientHeight
    );
    containerRef.current.appendChild(renderer.domElement);

    // Initialize OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = true; // Enable zooming
    controlsRef.current = controls; // Save the controls to the ref

    const loader = new PDBLoader();
    loader.load("/models/5gvy.pdb", (pdbData) => {
      const atomsGeometry = pdbData.geometryAtoms;
      const atomsColors = atomsGeometry.attributes.color.array;

      atomsGroup = new THREE.Group();
      for (let i = 0; i < atomsGeometry.attributes.position.count; i++) {
        const sphereGeometry = new THREE.SphereGeometry(2.5,8, 8);
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

      const bondsMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ff00, // Kolor wiązań
        metalness: 0.5, // Stopień metaliczności
        roughness: 1.5, // Chropowatość powierzchni
      });

      // const bonds = new THREE.Mesh(pdbData.geometryBonds, bondsMaterial);

      scene.add(atomsGroup);
      // scene.add(bonds);

      const boundingBox = new THREE.Box3().setFromObject(atomsGroup);
      const center = boundingBox.getCenter(new THREE.Vector3());
      camera.position.set(center.x, center.y, center.z + 50);
      camera.lookAt(center);

      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);

      atomsGroup.rotation.set(0, 0, 0);
      // bonds.rotation.set(0, 0, 0);

      const animate = () => {
        atomsGroup.rotation.x += 0.003;
        atomsGroup.rotation.y += 0.003;
        // bonds.rotation.x += 0.005;
        // bonds.rotation.y += 0.005;

        controls.update(); // Update controls in the animation loop

        renderer.render(scene, camera);
        animationRef.current = requestAnimationFrame(animate);
      };

      animate();
    });

    return () => {
      cancelAnimationFrame(animationRef.current);
      controlsRef.current.dispose(); // Dispose of the controls
      containerRef.current.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} className={classes.moleculeContainer} />;
}
