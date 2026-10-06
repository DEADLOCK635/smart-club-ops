"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

interface TeslaOptimusBustCanvasProps {
  className?: string;
}

export function TeslaOptimusBustCanvas({
  className = "",
}: TeslaOptimusBustCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth || 700;
    const height = container.clientHeight || 560;

    // 1. Scene, Camera, High-Precision WebGL Renderer
    const scene = new THREE.Scene();

    // Perspective camera framed at eye-level to capture the face, shoulders & chest
    const camera = new THREE.PerspectiveCamera(32, width / height, 0.1, 100);
    camera.position.set(0, 0.4, 6.6);
    camera.lookAt(0, 0.05, 0);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0); // 100% transparent into website background
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;

    container.appendChild(renderer.domElement);

    // 2. Studio Environment for Photorealistic Mirror Reflections on Visor
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();

    const envScene = new THREE.Scene();
    envScene.background = new THREE.Color(0x000000);

    // Overhead Studio Strip Light
    const topStrip = new THREE.Mesh(
      new THREE.PlaneGeometry(16, 6),
      new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide })
    );
    topStrip.position.set(0, 9, 3);
    topStrip.rotation.x = Math.PI / 2;
    envScene.add(topStrip);

    // Left Rim Reflector (Crisp White Accent)
    const leftStrip = new THREE.Mesh(
      new THREE.PlaneGeometry(5, 14),
      new THREE.MeshBasicMaterial({ color: 0xf8fafc, side: THREE.DoubleSide })
    );
    leftStrip.position.set(-9, 3, -2);
    leftStrip.rotation.y = Math.PI / 3;
    envScene.add(leftStrip);

    // Right Rim Reflector
    const rightStrip = new THREE.Mesh(
      new THREE.PlaneGeometry(5, 14),
      new THREE.MeshBasicMaterial({ color: 0xf1f5f9, side: THREE.DoubleSide })
    );
    rightStrip.position.set(9, 3, 2);
    rightStrip.rotation.y = -Math.PI / 3;
    envScene.add(rightStrip);

    // Front Softbox
    const frontSoftbox = new THREE.Mesh(
      new THREE.PlaneGeometry(10, 10),
      new THREE.MeshBasicMaterial({ color: 0xe2e8f0, side: THREE.DoubleSide })
    );
    frontSoftbox.position.set(0, 3, 10);
    envScene.add(frontSoftbox);

    const envRenderTarget = pmremGenerator.fromScene(envScene, 0.04);
    scene.environment = envRenderTarget.texture;

    // 3. Cinematic Physical Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    // Crisp Key Light from front-right
    const keyLight = new THREE.DirectionalLight(0xffffff, 3.8);
    keyLight.position.set(4, 8, 6);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);

    // Crisp Rim Light from rear-left creating silhouette glint
    const rimLight = new THREE.DirectionalLight(0xffffff, 4.8);
    rimLight.position.set(-5, 6, -5);
    scene.add(rimLight);

    // Soft Cyber Glow Fill Light (subtle cyan bounce on dark edges)
    const cyanFill = new THREE.DirectionalLight(0x38bdf8, 1.3);
    cyanFill.position.set(-4, -2, 4);
    scene.add(cyanFill);

    // 4. Exact PBR Materials matching Tesla Optimus Reference
    // Mirror Gloss Black Obsidian Visor
    const glossVisorMat = new THREE.MeshPhysicalMaterial({
      color: 0x05070a,
      roughness: 0.02,
      metalness: 0.96,
      clearcoat: 1.0,
      clearcoatRoughness: 0.02,
      reflectivity: 1.0,
    });

    // Dark Obsidian Satin Body (Muscular chest, deltoids, arm guards)
    const darkObsidianMat = new THREE.MeshStandardMaterial({
      color: 0x121418,
      roughness: 0.38,
      metalness: 0.45,
    });

    // Matte Carbon-Fiber Composite (Chest center and back plate)
    const carbonMat = new THREE.MeshStandardMaterial({
      color: 0x0c0e11,
      roughness: 0.52,
      metalness: 0.3,
    });

    // Dark Titanium Mechanical Joints & Neck Pistons
    const darkTitaniumMat = new THREE.MeshStandardMaterial({
      color: 0x181c23,
      roughness: 0.28,
      metalness: 0.85,
    });

    // Chrome Trim
    const chromeMat = new THREE.MeshStandardMaterial({
      color: 0xd0d6e0,
      roughness: 0.12,
      metalness: 0.95,
    });

    // 5. Robot Hierarchy (Tesla Optimus Bust: Head to Torso · NO Legs)
    const robotRoot = new THREE.Group();
    scene.add(robotRoot);
    robotRoot.position.set(0, -0.15, 0);

    // --- HEAD GROUP ---
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 1.25, 0);
    robotRoot.add(headGroup);

    // Aerodynamic Cranium Shell (Sleek elongated head dome matching Tesla Optimus)
    const craniumGeo = new THREE.SphereGeometry(0.54, 32, 28);
    const craniumMesh = new THREE.Mesh(craniumGeo, darkObsidianMat);
    craniumMesh.scale.set(0.78, 1.12, 0.92);
    craniumMesh.position.set(0, 0.15, -0.06);
    headGroup.add(craniumMesh);

    // Iconic Mirror Black Oval Visor Face (Full Smooth Front Face Shield)
    const visorGeo = new THREE.SphereGeometry(0.52, 36, 32, 0, Math.PI * 2, 0, Math.PI * 0.58);
    const visorMesh = new THREE.Mesh(visorGeo, glossVisorMat);
    visorMesh.scale.set(0.74, 1.12, 0.58);
    visorMesh.rotation.x = 0.24;
    visorMesh.position.set(0, 0.08, 0.22);
    headGroup.add(visorMesh);

    // Lower Chin / Jaw Plate (Tapered, athletic)
    const jawGeo = new THREE.CylinderGeometry(0.24, 0.18, 0.35, 24);
    const jawMesh = new THREE.Mesh(jawGeo, darkObsidianMat);
    jawMesh.scale.set(1.1, 1.0, 0.8);
    jawMesh.position.set(0, -0.32, 0.12);
    headGroup.add(jawMesh);

    // Temporal Acoustic Hubs (Left & Right Ear Nodes)
    const earGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.06, 28);
    earGeo.rotateZ(Math.PI / 2);

    const leftEar = new THREE.Mesh(earGeo, darkTitaniumMat);
    leftEar.position.set(-0.44, 0.04, -0.05);
    headGroup.add(leftEar);

    const rightEar = new THREE.Mesh(earGeo, darkTitaniumMat);
    rightEar.position.set(0.44, 0.04, -0.05);
    headGroup.add(rightEar);

    // --- ARTICULATED CYBERNETIC NECK ---
    const neckGroup = new THREE.Group();
    neckGroup.position.set(0, -0.48, 0);
    headGroup.add(neckGroup);

    // Central Cervical Spine Column
    const neckCol = new THREE.Mesh(
      new THREE.CylinderGeometry(0.17, 0.21, 0.42, 24),
      darkTitaniumMat
    );
    neckGroup.add(neckCol);

    // Dual Hydraulic Struts on Neck
    const strutGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.4, 16);
    const leftStrut = new THREE.Mesh(strutGeo, chromeMat);
    leftStrut.position.set(-0.14, 0, 0.05);
    neckGroup.add(leftStrut);

    const rightStrut = new THREE.Mesh(strutGeo, chromeMat);
    rightStrut.position.set(0.14, 0, 0.05);
    neckGroup.add(rightStrut);

    // --- HUMANOID SCULPTED TORSO & BROAD DELTOIDS (NO LEGS) ---
    const torsoGroup = new THREE.Group();
    torsoGroup.position.set(0, 0.25, 0);
    robotRoot.add(torsoGroup);

    // Broad Trapezius / Clavicle Yoke
    const clavicleGeo = new RoundedBoxGeometry(2.35, 0.35, 0.75, 8, 0.16);
    const clavicleMesh = new THREE.Mesh(clavicleGeo, darkTitaniumMat);
    clavicleMesh.position.set(0, 0.3, 0);
    torsoGroup.add(clavicleMesh);

    // Muscular Anatomical Torso Shell (Continuous V-Tapered Humanoid Chest like Tesla Optimus)
    const chestCylGeo = new THREE.CylinderGeometry(1.08, 0.72, 1.65, 32, 1);
    const chestShell = new THREE.Mesh(chestCylGeo, darkObsidianMat);
    chestShell.scale.set(1.15, 1.0, 0.62);
    chestShell.position.set(0, -0.45, 0.08);
    torsoGroup.add(chestShell);

    // Left Pectoral Contour Plate
    const leftPecGeo = new RoundedBoxGeometry(0.85, 0.75, 0.25, 8, 0.14);
    const leftPec = new THREE.Mesh(leftPecGeo, darkObsidianMat);
    leftPec.position.set(-0.46, -0.15, 0.32);
    leftPec.rotation.y = 0.12;
    torsoGroup.add(leftPec);

    // Right Pectoral Contour Plate
    const rightPecGeo = new RoundedBoxGeometry(0.85, 0.75, 0.25, 8, 0.14);
    const rightPec = new THREE.Mesh(rightPecGeo, darkObsidianMat);
    rightPec.position.set(0.46, -0.15, 0.32);
    rightPec.rotation.y = -0.12;
    torsoGroup.add(rightPec);

    // Center Sternum Carbon Seam
    const sternumGeo = new RoundedBoxGeometry(0.08, 1.35, 0.32, 6, 0.03);
    const sternum = new THREE.Mesh(sternumGeo, carbonMat);
    sternum.position.set(0, -0.42, 0.32);
    torsoGroup.add(sternum);

    // Athletic Waist / Lumbar Band (Terminates the torso cleanly at waist)
    const waistBeltGeo = new THREE.CylinderGeometry(0.72, 0.68, 0.28, 32);
    const waistBelt = new THREE.Mesh(waistBeltGeo, darkTitaniumMat);
    waistBelt.scale.set(1.12, 1.0, 0.6);
    waistBelt.position.set(0, -1.35, 0.06);
    torsoGroup.add(waistBelt);

    // --- HUMANOID DELTOID SHOULDERS & ARMS ---
    // Muscular Rounded Shoulder Caps (Deltoid Pauldrons)
    const shoulderGeo = new THREE.SphereGeometry(0.46, 28, 24);
    
    const leftShoulder = new THREE.Mesh(shoulderGeo, darkObsidianMat);
    leftShoulder.scale.set(0.9, 1.25, 0.95);
    leftShoulder.position.set(-1.46, 0.15, 0);
    torsoGroup.add(leftShoulder);

    const rightShoulder = new THREE.Mesh(shoulderGeo, darkObsidianMat);
    rightShoulder.scale.set(0.9, 1.25, 0.95);
    rightShoulder.position.set(1.46, 0.15, 0);
    torsoGroup.add(rightShoulder);

    // Shoulder Core Hubs
    const sHubGeo = new THREE.CylinderGeometry(0.16, 0.16, 0.7, 24);
    sHubGeo.rotateZ(Math.PI / 2);

    const leftSHub = new THREE.Mesh(sHubGeo, darkTitaniumMat);
    leftSHub.position.set(-1.46, 0.15, 0);
    torsoGroup.add(leftSHub);

    const rightSHub = new THREE.Mesh(sHubGeo, darkTitaniumMat);
    rightSHub.position.set(1.46, 0.15, 0);
    torsoGroup.add(rightSHub);

    // Upper Arm Bicep Armature
    const bicepGeo = new THREE.CylinderGeometry(0.24, 0.22, 0.92, 24);
    
    const leftBicep = new THREE.Mesh(bicepGeo, darkObsidianMat);
    leftBicep.position.set(-1.52, -0.62, 0);
    torsoGroup.add(leftBicep);

    const rightBicep = new THREE.Mesh(bicepGeo, darkObsidianMat);
    rightBicep.position.set(1.52, -0.62, 0);
    torsoGroup.add(rightBicep);

    // Elbow Mechanical Articulation
    const elbowGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.42, 24);
    elbowGeo.rotateZ(Math.PI / 2);

    const leftElbow = new THREE.Mesh(elbowGeo, darkTitaniumMat);
    leftElbow.position.set(-1.52, -1.14, 0);
    torsoGroup.add(leftElbow);

    const rightElbow = new THREE.Mesh(elbowGeo, darkTitaniumMat);
    rightElbow.position.set(1.52, -1.14, 0);
    torsoGroup.add(rightElbow);

    // Forearms resting naturally at the sides
    const forearmGeo = new THREE.CylinderGeometry(0.22, 0.18, 0.88, 24);
    
    const leftForearm = new THREE.Mesh(forearmGeo, darkObsidianMat);
    leftForearm.position.set(-1.54, -1.62, 0.06);
    leftForearm.rotation.z = -0.06;
    torsoGroup.add(leftForearm);

    const rightForearm = new THREE.Mesh(forearmGeo, darkObsidianMat);
    rightForearm.position.set(1.54, -1.62, 0.06);
    rightForearm.rotation.z = 0.06;
    torsoGroup.add(rightForearm);

    // 6. Smooth Mouse Parallax, Drag-to-Orbit & Hover Interactivity
    let targetRotY = 0;
    let targetRotX = 0;
    let currentRotY = 0;
    let currentRotX = 0;

    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let dragRotY = 0;
    let dragRotX = 0;

    const handlePointerDown = (e: PointerEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
      container.setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (isDragging) {
        const deltaX = e.clientX - prevMouseX;
        const deltaY = e.clientY - prevMouseY;
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;

        dragRotY += deltaX * 0.007;
        dragRotX = Math.max(-0.35, Math.min(0.35, dragRotX + deltaY * 0.006));
      } else {
        // Subtle mouse parallax when hovering
        const rect = container.getBoundingClientRect();
        const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const normY = ((e.clientY - rect.top) / rect.height) * 2 - 1;

        targetRotY = normX * 0.32;
        targetRotX = -normY * 0.16;
      }
    };

    const handlePointerUp = (e: PointerEvent) => {
      isDragging = false;
      try {
        container.releasePointerCapture(e.pointerId);
      } catch (_) {}
    };

    container.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    // 7. Render Loop with Smooth Spring Damping & Idle Breathing
    let reqId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Gentle organic idle breathing
      const breath = Math.sin(elapsedTime * 1.6) * 0.02;
      robotRoot.position.y = -0.15 + breath;

      // Subtle head look drift
      const headNod = Math.sin(elapsedTime * 0.8) * 0.012;

      // Smooth interpolation toward target rotation
      currentRotY += (targetRotY + dragRotY - currentRotY) * 0.08;
      currentRotX += (targetRotX + dragRotX - currentRotX) * 0.08;

      // Apply rotation to robot root and articulated head
      robotRoot.rotation.y = currentRotY * 0.8;
      robotRoot.rotation.x = currentRotX * 0.7;

      headGroup.rotation.y = currentRotY * 0.35;
      headGroup.rotation.x = currentRotX * 0.35 + headNod;

      renderer.render(scene, camera);
    };

    animate();

    // 8. Responsive Resize
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 700;
      const h = container.clientHeight || 560;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(reqId);
      window.removeEventListener("resize", handleResize);
      container.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);

      pmremGenerator.dispose();
      envRenderTarget.dispose();
      renderer.dispose();
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, [mounted]);

  return (
    <div
      ref={containerRef}
      className={`relative flex w-full cursor-grab active:cursor-grabbing items-center justify-center select-none overflow-visible touch-none ${className}`}
      style={{
        // Soft bottom fade so the waist terminates cleanly into website background
        WebkitMaskImage: "linear-gradient(to bottom, black 86%, transparent 100%)",
        maskImage: "linear-gradient(to bottom, black 86%, transparent 100%)",
      }}
    />
  );
}
