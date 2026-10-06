"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

interface HumanoidRobotCanvasProps {
  className?: string;
  onInteract?: () => void;
}

export function HumanoidRobotCanvas({
  className = "",
  onInteract,
}: HumanoidRobotCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 650;

    // 1. Scene, Camera, High-Precision WebGL Renderer
    const scene = new THREE.Scene();

    // Camera framed with generous headroom so cranium is never clipped
    const camera = new THREE.PerspectiveCamera(28, width / height, 0.1, 100);
    camera.position.set(0, 0.25, 6.2);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;

    container.appendChild(renderer.domElement);

    // 2. Cinematic 3-Point Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.3);
    scene.add(ambientLight);

    // Key Light: Overhead crisp key
    const keyLight = new THREE.DirectionalLight(0xffffff, 3.0);
    keyLight.position.set(4, 7, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);

    // Rim Light: Razor-sharp electric cyan edge light
    const rimLight = new THREE.DirectionalLight(0x38bdf8, 4.8);
    rimLight.position.set(-4, 5, -5);
    scene.add(rimLight);

    // Fill Light: Soft slate-blue ambient fill
    const fillLight = new THREE.DirectionalLight(0x93c5fd, 0.85);
    fillLight.position.set(-4, -1, 3);
    scene.add(fillLight);

    // Chest Arc Reactor Light
    const coreLight = new THREE.PointLight(0x00f0ff, 2.8, 3.5);
    coreLight.position.set(0, -0.45, 0.9);
    scene.add(coreLight);

    // 3. Apple & Tesla-Grade Physical Materials
    // Body: Porcelain ceramic white with clearcoat gloss
    const ceramicMat = new THREE.MeshPhysicalMaterial({
      color: 0xfafafa,
      roughness: 0.1,
      metalness: 0.05,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
    });

    // Dark Obsidian Optical Visor Glass
    const visorGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0x05070f,
      roughness: 0.02,
      metalness: 0.95,
      clearcoat: 1.0,
      clearcoatRoughness: 0.02,
    });

    // Brushed Dark Titanium / Slate (Mechanical framework)
    const darkTitaniumMat = new THREE.MeshStandardMaterial({
      color: 0x181d26,
      roughness: 0.28,
      metalness: 0.85,
    });

    // Precision Graphite Accent
    const graphiteMat = new THREE.MeshStandardMaterial({
      color: 0x0d1117,
      roughness: 0.35,
      metalness: 0.7,
    });

    // Electric Cyan Luminous Elements
    const cyanGlowMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
    });

    // 4. Humanoid Android Hierarchy
    const humanoidRoot = new THREE.Group();
    scene.add(humanoidRoot);
    humanoidRoot.position.set(0, -0.15, 0);

    // --- HUMANOID HEAD GROUP ---
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 0.65, 0);
    humanoidRoot.add(headGroup);

    // Cranium / Upper Helmet (Smooth aerodynamic skull cap)
    const craniumGeo = new THREE.SphereGeometry(0.85, 32, 28, 0, Math.PI * 2, 0, Math.PI * 0.58);
    const craniumMesh = new THREE.Mesh(craniumGeo, ceramicMat);
    craniumMesh.position.set(0, 0.12, -0.05);
    headGroup.add(craniumMesh);

    // Rear Cranial Shell (Beveled backplate)
    const backHeadGeo = new RoundedBoxGeometry(1.45, 1.25, 1.15, 8, 0.45);
    const backHead = new THREE.Mesh(backHeadGeo, ceramicMat);
    backHead.position.set(0, 0.05, -0.22);
    headGroup.add(backHead);

    // Sleek Panoramic Visor (Wrap-around humanoid ocular shield)
    const visorGeo = new RoundedBoxGeometry(1.5, 0.52, 0.55, 10, 0.22);
    const visorMesh = new THREE.Mesh(visorGeo, visorGlassMat);
    visorMesh.position.set(0, 0.15, 0.42);
    headGroup.add(visorMesh);

    // Glowing Cyan Ocular Horizon Bar (Inside Visor)
    const ocularBarGeo = new RoundedBoxGeometry(1.18, 0.08, 0.06, 6, 0.02);
    const ocularBar = new THREE.Mesh(ocularBarGeo, cyanGlowMat);
    ocularBar.position.set(0, 0.16, 0.62);
    headGroup.add(ocularBar);

    // Dual Optical Iris Apertures (Left & Right Scanning Nodes)
    const irisRingGeo = new THREE.TorusGeometry(0.09, 0.025, 16, 32);
    const leftIris = new THREE.Mesh(irisRingGeo, cyanGlowMat);
    leftIris.position.set(-0.35, 0.16, 0.63);
    headGroup.add(leftIris);

    const rightIris = new THREE.Mesh(irisRingGeo, cyanGlowMat);
    rightIris.position.set(0.35, 0.16, 0.63);
    headGroup.add(rightIris);

    // Humanoid Cheek & Faceplate Armor (Angular ceramic plates)
    const cheekGeo = new RoundedBoxGeometry(1.36, 0.5, 0.45, 8, 0.18);
    const cheekMesh = new THREE.Mesh(cheekGeo, ceramicMat);
    cheekMesh.position.set(0, -0.22, 0.3);
    headGroup.add(cheekMesh);

    // Sculpted Cybernetic Jaw / Chin (Athletic, sleek titanium chin)
    const chinGeo = new RoundedBoxGeometry(0.68, 0.35, 0.38, 8, 0.14);
    const chinMesh = new THREE.Mesh(chinGeo, darkTitaniumMat);
    chinMesh.position.set(0, -0.5, 0.32);
    headGroup.add(chinMesh);

    // Chin Micro-LED Intake Slit
    const chinVentGeo = new RoundedBoxGeometry(0.32, 0.04, 0.04, 4, 0.01);
    const chinVent = new THREE.Mesh(chinVentGeo, cyanGlowMat);
    chinVent.position.set(0, -0.48, 0.5);
    headGroup.add(chinVent);

    // Temporal / Ear Sensor Drums (Flush titanium acoustic hubs)
    const earDrumGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.14, 32);
    earDrumGeo.rotateZ(Math.PI / 2);

    const leftEar = new THREE.Mesh(earDrumGeo, darkTitaniumMat);
    leftEar.position.set(-0.76, 0.12, -0.05);
    headGroup.add(leftEar);

    const rightEar = new THREE.Mesh(earDrumGeo, darkTitaniumMat);
    rightEar.position.set(0.76, 0.12, -0.05);
    headGroup.add(rightEar);

    // Halo Rings on Ear Hubs
    const earHaloGeo = new THREE.TorusGeometry(0.18, 0.02, 16, 32);
    earHaloGeo.rotateY(Math.PI / 2);

    const leftHalo = new THREE.Mesh(earHaloGeo, cyanGlowMat);
    leftHalo.position.set(-0.83, 0.12, -0.05);
    headGroup.add(leftHalo);

    const rightHalo = new THREE.Mesh(earHaloGeo, cyanGlowMat);
    rightHalo.position.set(0.83, 0.12, -0.05);
    headGroup.add(rightHalo);

    // --- ARTICULATED CERVICAL NECK ---
    const neckGroup = new THREE.Group();
    neckGroup.position.set(0, -0.68, 0);
    headGroup.add(neckGroup);

    // Central Titanium Vertebrae Column
    const spineColumn = new THREE.Mesh(
      new THREE.CylinderGeometry(0.28, 0.34, 0.38, 24),
      darkTitaniumMat
    );
    neckGroup.add(spineColumn);

    // Hydraulic Pistons on Left & Right
    const pistonGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.36, 16);
    const leftPiston = new THREE.Mesh(pistonGeo, graphiteMat);
    leftPiston.position.set(-0.25, 0, 0.05);
    neckGroup.add(leftPiston);

    const rightPiston = new THREE.Mesh(pistonGeo, graphiteMat);
    rightPiston.position.set(0.25, 0, 0.05);
    neckGroup.add(rightPiston);

    // Glowing Fiber Conduit Rings
    const neckRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.36, 0.02, 16, 32),
      cyanGlowMat
    );
    neckRing.rotation.x = Math.PI / 2;
    neckRing.position.set(0, -0.05, 0);
    neckGroup.add(neckRing);

    // --- HUMANOID UPPER TORSO & SHOULDERS (NO LEGS) ---
    const torsoGroup = new THREE.Group();
    torsoGroup.position.set(0, -0.75, 0);
    humanoidRoot.add(torsoGroup);

    // Clavicle & Upper Chest Framework
    const clavicleGeo = new RoundedBoxGeometry(2.2, 0.42, 0.9, 8, 0.18);
    const clavicleMesh = new THREE.Mesh(clavicleGeo, darkTitaniumMat);
    clavicleMesh.position.set(0, 0.38, 0);
    torsoGroup.add(clavicleMesh);

    // Left & Right Sculpted Pectoral Armor Plates (Ceramic White)
    const pecGeo = new RoundedBoxGeometry(0.92, 0.72, 0.35, 8, 0.16);
    const leftPec = new THREE.Mesh(pecGeo, ceramicMat);
    leftPec.position.set(-0.52, 0.02, 0.28);
    leftPec.rotation.y = 0.12;
    torsoGroup.add(leftPec);

    const rightPec = new THREE.Mesh(pecGeo, ceramicMat);
    rightPec.position.set(0.52, 0.02, 0.28);
    rightPec.rotation.y = -0.12;
    torsoGroup.add(rightPec);

    // Center Fusion Core / Arc Reactor (Glowing in Sternum)
    const reactorBezel = new THREE.Mesh(
      new THREE.CylinderGeometry(0.26, 0.26, 0.1, 32),
      darkTitaniumMat
    );
    reactorBezel.rotation.x = Math.PI / 2;
    reactorBezel.position.set(0, 0.05, 0.42);
    torsoGroup.add(reactorBezel);

    const reactorLight = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.18, 0.12, 32),
      cyanGlowMat
    );
    reactorLight.rotation.x = Math.PI / 2;
    reactorLight.position.set(0, 0.05, 0.45);
    torsoGroup.add(reactorLight);

    const reactorPulseRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.21, 0.02, 16, 32),
      cyanGlowMat
    );
    reactorPulseRing.position.set(0, 0.05, 0.48);
    torsoGroup.add(reactorPulseRing);

    // Aerodynamic Humanoid Deltoid / Shoulder Pauldrons
    const shoulderGeo = new RoundedBoxGeometry(0.72, 0.65, 0.75, 8, 0.22);
    const leftShoulder = new THREE.Mesh(shoulderGeo, ceramicMat);
    leftShoulder.position.set(-1.38, 0.25, 0);
    leftShoulder.rotation.z = 0.22;
    torsoGroup.add(leftShoulder);

    const rightShoulder = new THREE.Mesh(shoulderGeo, ceramicMat);
    rightShoulder.position.set(1.38, 0.25, 0);
    rightShoulder.rotation.z = -0.22;
    torsoGroup.add(rightShoulder);

    // Shoulder Titanium Core Hubs
    const shoulderHubGeo = new THREE.CylinderGeometry(0.16, 0.16, 0.78, 24);
    shoulderHubGeo.rotateZ(Math.PI / 2);
    const leftShoulderHub = new THREE.Mesh(shoulderHubGeo, darkTitaniumMat);
    leftShoulderHub.position.set(-1.38, 0.25, 0);
    torsoGroup.add(leftShoulderHub);

    const rightShoulderHub = new THREE.Mesh(shoulderHubGeo, darkTitaniumMat);
    rightShoulderHub.position.set(1.38, 0.25, 0);
    torsoGroup.add(rightShoulderHub);

    // Tapering Lower Torso Base (Fades gracefully into shadow, NO LEGS)
    const baseSpineGeo = new THREE.CylinderGeometry(0.72, 0.48, 0.55, 32);
    const baseSpine = new THREE.Mesh(baseSpineGeo, graphiteMat);
    baseSpine.position.set(0, -0.45, 0);
    torsoGroup.add(baseSpine);

    // Wide Diffuse Radial Floor Ambient Shadow
    const shadowGeo = new THREE.PlaneGeometry(4.8, 4.8);
    shadowGeo.rotateX(-Math.PI / 2);
    const shadowCanvas = document.createElement("canvas");
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const sCtx = shadowCanvas.getContext("2d")!;
    const grad = sCtx.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, "rgba(0, 0, 0, 0.7)");
    grad.addColorStop(0.4, "rgba(0, 0, 0, 0.2)");
    grad.addColorStop(1, "rgba(0, 0, 0, 0)");
    sCtx.fillStyle = grad;
    sCtx.fillRect(0, 0, 128, 128);
    const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      depthWrite: false,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.position.set(0, -1.15, 0);
    humanoidRoot.add(shadowMesh);

    // 5. Dignified, Organic Cursor Look-At & Weighted Inertia
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    let acknowledgePulse = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - (rect.left + rect.width / 2)) / window.innerWidth) * 2;
      const y = ((e.clientY - (rect.top + rect.height / 2)) / window.innerHeight) * 2;
      mouse.targetX = Math.max(-0.75, Math.min(0.75, x));
      mouse.targetY = Math.max(-0.55, Math.min(0.55, y));
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Dignified acknowledgment nod on click
    const handleInteract = () => {
      acknowledgePulse = 0.06;
      coreLight.intensity = 4.5;

      setTimeout(() => {
        coreLight.intensity = 2.8;
      }, 800);

      if (onInteract) onInteract();
    };

    triggerRef.current = handleInteract;

    // 6. Silky Cinematic Animation Loop
    let animId: number;
    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      animId = requestAnimationFrame(animate);

      const delta = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      // Heavy, natural robotic inertia
      mouse.x += (mouse.targetX - mouse.x) * 0.045;
      mouse.y += (mouse.targetY - mouse.y) * 0.045;

      // Slow, meditative breathing respiration
      const t = currentTime * 0.001;
      const hoverY = Math.sin(t) * 0.035;

      if (acknowledgePulse > 0) {
        acknowledgePulse = Math.max(0, acknowledgePulse - 0.12 * delta);
      }

      // Root position
      humanoidRoot.position.y = -0.15 + hoverY;
      humanoidRoot.position.z = 0.1 + mouse.y * 0.08;

      // Body rotational posture
      humanoidRoot.rotation.y = mouse.x * 0.18;
      humanoidRoot.rotation.x = -mouse.y * 0.1 + acknowledgePulse;

      // Head articulates smoothly on cervical vertebrae
      headGroup.rotation.y = mouse.x * 0.28;
      headGroup.rotation.x = -mouse.y * 0.16 + acknowledgePulse * 1.4;
      headGroup.rotation.z = -mouse.x * 0.05;

      // Visor optical scanning glow pulse
      const pulse = (Math.sin(t * 2.5) + 1) * 0.5;
      coreLight.intensity = 2.4 + pulse * 1.0;
      reactorPulseRing.scale.set(1 + pulse * 0.05, 1 + pulse * 0.05, 1);

      renderer.render(scene, camera);
    };

    animId = requestAnimationFrame(animate);

    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      shadowTexture.dispose();
    };
  }, [mounted, onInteract]);

  return (
    <div
      ref={containerRef}
      onClick={() => triggerRef.current?.()}
      className={`relative cursor-pointer select-none touch-none ${className}`}
      title="SCPSC Cyber Android"
    />
  );
}
