"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

interface CuteRobotCanvasProps {
  className?: string;
  onInteract?: () => void;
}

export function CuteRobotCanvas({
  className = "",
  onInteract,
}: CuteRobotCanvasProps) {
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

    // Camera calibrated with generous vertical headroom so head is never cut off
    const camera = new THREE.PerspectiveCamera(30, width / height, 0.1, 100);
    camera.position.set(0, 0.2, 5.8);

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
    renderer.toneMappingExposure = 1.2;

    container.appendChild(renderer.domElement);

    // 2. Apple Studio Cinematic 3-Point Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    // Key Light: Overhead studio key
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.8);
    keyLight.position.set(4, 6, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);

    // Rim Light: Electric cyan backlight outlining the curved silhouette
    const rimLight = new THREE.DirectionalLight(0x38bdf8, 4.5);
    rimLight.position.set(-4, 4, -4);
    scene.add(rimLight);

    // Fill Light: Soft cool blue ambient bounce
    const fillLight = new THREE.DirectionalLight(0x93c5fd, 0.9);
    fillLight.position.set(-4, -1, 3);
    scene.add(fillLight);

    // Cyber Core Light: Soft cyan glow on chest
    const chestLight = new THREE.PointLight(0x00f0ff, 2.5, 3.0);
    chestLight.position.set(0, -0.4, 0.8);
    scene.add(chestLight);

    // 3. Apple-Grade Physical Materials
    // Ceramic White Shell
    const ceramicMat = new THREE.MeshPhysicalMaterial({
      color: 0xfafafa,
      roughness: 0.1,
      metalness: 0.05,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
    });

    // Dark Curved Obsidian Glass Visor
    const glassVisorMat = new THREE.MeshPhysicalMaterial({
      color: 0x05070f,
      roughness: 0.03,
      metalness: 0.92,
      clearcoat: 1.0,
      clearcoatRoughness: 0.02,
    });

    // Brushed Dark Titanium / Slate (for precision joints)
    const titaniumMat = new THREE.MeshStandardMaterial({
      color: 0x1c212a,
      roughness: 0.25,
      metalness: 0.8,
    });

    // Precision Matte Graphite
    const graphiteMat = new THREE.MeshStandardMaterial({
      color: 0x111620,
      roughness: 0.35,
      metalness: 0.6,
    });

    // Cyan Neon Micro-LED
    const cyanLedMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
    });

    // 4. Ultra-HD OLED Screen Faceplate (1024x768 Dynamic Canvas Texture)
    const faceCanvas = document.createElement("canvas");
    faceCanvas.width = 1024;
    faceCanvas.height = 768;
    const faceCtx = faceCanvas.getContext("2d")!;
    const faceTexture = new THREE.CanvasTexture(faceCanvas);
    faceTexture.colorSpace = THREE.SRGBColorSpace;

    const oledMat = new THREE.MeshBasicMaterial({
      map: faceTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
    });

    let eyeBlink = 1;
    let isBlinking = false;
    let nextBlink = performance.now() + 3500;
    let isWelcoming = false;

    function drawScreen() {
      faceCtx.clearRect(0, 0, faceCanvas.width, faceCanvas.height);
      faceCtx.save();

      faceCtx.shadowColor = "#00f0ff";
      faceCtx.shadowBlur = 36;
      faceCtx.fillStyle = "#38bdf8";
      faceCtx.strokeStyle = "#38bdf8";

      const leftX = 350;
      const rightX = 674;
      const eyeY = 370;

      if (isWelcoming) {
        // Sophisticated friendly curved eyes
        faceCtx.lineWidth = 26;
        faceCtx.lineCap = "round";

        faceCtx.beginPath();
        faceCtx.arc(leftX, eyeY + 14, 58, Math.PI * 1.15, Math.PI * 1.85, false);
        faceCtx.stroke();

        faceCtx.beginPath();
        faceCtx.arc(rightX, eyeY + 14, 58, Math.PI * 1.15, Math.PI * 1.85, false);
        faceCtx.stroke();
      } else {
        // High-precision, sleek OLED pill eyes (mature tech aesthetic)
        const eyeW = 50;
        const eyeH = 84 * Math.max(0.06, eyeBlink);

        faceCtx.beginPath();
        faceCtx.ellipse(leftX, eyeY, eyeW, eyeH, 0, 0, Math.PI * 2);
        faceCtx.fill();

        faceCtx.beginPath();
        faceCtx.ellipse(rightX, eyeY, eyeW, eyeH, 0, 0, Math.PI * 2);
        faceCtx.fill();

        // Inner optical reflection shine
        if (eyeBlink > 0.6) {
          faceCtx.fillStyle = "#ffffff";
          faceCtx.beginPath();
          faceCtx.arc(leftX + 12, eyeY - 22, 12, 0, Math.PI * 2);
          faceCtx.arc(rightX + 12, eyeY - 22, 12, 0, Math.PI * 2);
          faceCtx.fill();
        }
      }

      // Minimalist cyber smile line
      faceCtx.strokeStyle = "#38bdf8";
      faceCtx.lineWidth = 12;
      faceCtx.beginPath();
      faceCtx.arc(512, 480, 32, 0.18 * Math.PI, 0.82 * Math.PI, false);
      faceCtx.stroke();

      faceCtx.restore();
      faceTexture.needsUpdate = true;
    }

    drawScreen();

    // 5. Sophisticated Robot Bust (Head, Visor, Neck, Upper Torso - NO LEGS)
    const robotRoot = new THREE.Group();
    scene.add(robotRoot);
    robotRoot.position.set(0, -0.15, 0);

    // --- HEAD GROUP ---
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 0.55, 0);
    robotRoot.add(headGroup);

    // Sculpted Aerodynamic Head Shell
    const headGeo = new RoundedBoxGeometry(2.3, 1.75, 1.55, 12, 0.46);
    const headMesh = new THREE.Mesh(headGeo, ceramicMat);
    headMesh.castShadow = true;
    headGroup.add(headMesh);

    // Visor Inset Bezel (Dark Titanium)
    const visorBezelGeo = new RoundedBoxGeometry(1.92, 1.4, 0.12, 8, 0.3);
    const visorBezel = new THREE.Mesh(visorBezelGeo, graphiteMat);
    visorBezel.position.set(0, 0.02, 0.75);
    headGroup.add(visorBezel);

    // Curved Glossy Glass Visor Faceplate
    const glassGeo = new RoundedBoxGeometry(1.84, 1.32, 0.08, 6, 0.26);
    const glassMesh = new THREE.Mesh(glassGeo, glassVisorMat);
    glassMesh.position.set(0, 0.02, 0.79);
    headGroup.add(glassMesh);

    // OLED Screen
    const screenGeo = new THREE.PlaneGeometry(1.74, 1.24);
    const screenMesh = new THREE.Mesh(screenGeo, oledMat);
    screenMesh.position.set(0, 0.02, 0.84);
    headGroup.add(screenMesh);

    // Precision Side Acoustic Sensor Pods (Flush Titanium Discs with Cyan Rings)
    const podGeo = new THREE.CylinderGeometry(0.34, 0.34, 0.16, 32);
    podGeo.rotateZ(Math.PI / 2);

    const leftPod = new THREE.Mesh(podGeo, titaniumMat);
    leftPod.position.set(-1.22, 0.04, 0);
    headGroup.add(leftPod);

    const rightPod = new THREE.Mesh(podGeo, titaniumMat);
    rightPod.position.set(1.22, 0.04, 0);
    headGroup.add(rightPod);

    // Hairline Cyan LED Ring on Pods
    const ringGeo = new THREE.TorusGeometry(0.26, 0.03, 16, 32);
    ringGeo.rotateY(Math.PI / 2);

    const leftRing = new THREE.Mesh(ringGeo, cyanLedMat);
    leftRing.position.set(-1.31, 0.04, 0);
    headGroup.add(leftRing);

    const rightRing = new THREE.Mesh(ringGeo, cyanLedMat);
    rightRing.position.set(1.31, 0.04, 0);
    headGroup.add(rightRing);

    // Aerodynamic Top Crest / Sensor Node (Flush & Sleek, not a goofy stick)
    const crestGeo = new RoundedBoxGeometry(0.32, 0.14, 0.65, 8, 0.06);
    const crestMesh = new THREE.Mesh(crestGeo, titaniumMat);
    crestMesh.position.set(0, 0.94, -0.05);
    headGroup.add(crestMesh);

    const crestLightGeo = new RoundedBoxGeometry(0.12, 0.06, 0.38, 4, 0.02);
    const crestLight = new THREE.Mesh(crestLightGeo, cyanLedMat);
    crestLight.position.set(0, 1.02, -0.05);
    headGroup.add(crestLight);

    // Precision Neck Collar
    const neckGeo = new THREE.CylinderGeometry(0.44, 0.44, 0.26, 32);
    const neckMesh = new THREE.Mesh(neckGeo, titaniumMat);
    neckMesh.position.set(0, -0.9, 0);
    headGroup.add(neckMesh);

    const neckRingGeo = new THREE.TorusGeometry(0.46, 0.025, 16, 32);
    neckRingGeo.rotateX(Math.PI / 2);
    const neckRing = new THREE.Mesh(neckRingGeo, cyanLedMat);
    neckRing.position.set(0, -0.86, 0);
    headGroup.add(neckRing);

    // --- SLEEK BUST / UPPER TORSO (NO LEGS, NO LOWER BELLY) ---
    const bustGroup = new THREE.Group();
    bustGroup.position.set(0, -0.7, 0);
    robotRoot.add(bustGroup);

    // Sculpted Upper Chest & Shoulder Plate
    const chestGeo = new RoundedBoxGeometry(2.4, 0.95, 1.35, 10, 0.42);
    const chestMesh = new THREE.Mesh(chestGeo, ceramicMat);
    chestMesh.castShadow = true;
    bustGroup.add(chestMesh);

    // Inset Glowing Cyber Core Emblem
    const coreBezelGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.08, 32);
    coreBezelGeo.rotateX(Math.PI / 2);
    const coreBezel = new THREE.Mesh(coreBezelGeo, titaniumMat);
    coreBezel.position.set(0, 0.12, 0.68);
    bustGroup.add(coreBezel);

    const coreLightGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.1, 32);
    coreLightGeo.rotateX(Math.PI / 2);
    const coreLight = new THREE.Mesh(coreLightGeo, cyanLedMat);
    coreLight.position.set(0, 0.12, 0.72);
    bustGroup.add(coreLight);

    // Aerodynamic Shoulder Caps
    const shoulderGeo = new THREE.SphereGeometry(0.24, 24, 24);
    const leftShoulder = new THREE.Mesh(shoulderGeo, titaniumMat);
    leftShoulder.position.set(-1.22, 0.15, 0);
    bustGroup.add(leftShoulder);

    const rightShoulder = new THREE.Mesh(shoulderGeo, titaniumMat);
    rightShoulder.position.set(1.22, 0.15, 0);
    bustGroup.add(rightShoulder);

    // Smooth Base Floating Fade Plate
    const basePlateGeo = new THREE.CylinderGeometry(0.85, 0.7, 0.35, 32);
    const basePlate = new THREE.Mesh(basePlateGeo, graphiteMat);
    basePlate.position.set(0, -0.55, 0);
    bustGroup.add(basePlate);

    // Wide Diffuse Radial Floor Ambient Shadow
    const shadowGeo = new THREE.PlaneGeometry(4.2, 4.2);
    shadowGeo.rotateX(-Math.PI / 2);
    const shadowCanvas = document.createElement("canvas");
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const sCtx = shadowCanvas.getContext("2d")!;
    const grad = sCtx.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, "rgba(0, 0, 0, 0.65)");
    grad.addColorStop(0.4, "rgba(0, 0, 0, 0.18)");
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
    shadowMesh.position.set(0, -1.2, 0);
    robotRoot.add(shadowMesh);

    // 6. Dignified, Calm, Weighted Motion Tracking
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    let acknowledgeNod = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - (rect.left + rect.width / 2)) / window.innerWidth) * 2;
      const y = ((e.clientY - (rect.top + rect.height / 2)) / window.innerHeight) * 2;
      // Controlled, dignified tracking range (no wild flipping)
      mouse.targetX = Math.max(-0.7, Math.min(0.7, x));
      mouse.targetY = Math.max(-0.5, Math.min(0.5, y));
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Dignified acknowledgment nod on click
    const handleInteract = () => {
      acknowledgeNod = 0.05;
      isWelcoming = true;
      drawScreen();

      setTimeout(() => {
        isWelcoming = false;
        drawScreen();
      }, 1500);

      if (onInteract) onInteract();
    };

    triggerRef.current = handleInteract;

    // 7. Silky, Heavy, Cinematic Render Loop
    let animId: number;
    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      animId = requestAnimationFrame(animate);

      const delta = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      // Heavy inertia smoothing for robotic precision
      mouse.x += (mouse.targetX - mouse.x) * 0.045;
      mouse.y += (mouse.targetY - mouse.y) * 0.045;

      // Slow, tranquil breathing levitation
      const t = currentTime * 0.0011;
      const hoverY = Math.sin(t) * 0.035;

      // Acknowledgement nod decay
      if (acknowledgeNod > 0) {
        acknowledgeNod = Math.max(0, acknowledgeNod - 0.12 * delta);
      }

      // Root positioning
      robotRoot.position.y = -0.15 + hoverY;
      robotRoot.position.z = 0.12 + mouse.y * 0.08;

      // Calm, stately body rotation
      robotRoot.rotation.y = mouse.x * 0.2;
      robotRoot.rotation.x = -mouse.y * 0.1 + acknowledgeNod;

      // Head tracks cursor with poised intelligence
      headGroup.rotation.y = mouse.x * 0.28;
      headGroup.rotation.x = -mouse.y * 0.16 + acknowledgeNod * 1.5;
      headGroup.rotation.z = -mouse.x * 0.05;

      // Core light soft respiration pulse
      const pulse = (Math.sin(t * 2.2) + 1) * 0.5;
      chestLight.intensity = 1.6 + pulse * 0.8;

      // Natural, slow OLED blinking
      if (currentTime > nextBlink && !isBlinking) {
        isBlinking = true;
        eyeBlink = 1;
      }

      if (isBlinking) {
        eyeBlink -= delta * 10;
        if (eyeBlink <= 0.06) {
          eyeBlink = 0.06;
          isBlinking = false;
          nextBlink = currentTime + 3800 + Math.random() * 2500;
        }
        drawScreen();
      } else if (eyeBlink < 1) {
        eyeBlink = Math.min(1, eyeBlink + delta * 12);
        drawScreen();
      }

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
      faceTexture.dispose();
      shadowTexture.dispose();
    };
  }, [mounted, onInteract]);

  return (
    <div
      ref={containerRef}
      onClick={() => triggerRef.current?.()}
      className={`relative cursor-pointer select-none touch-none ${className}`}
      title="SCPSC Cyber Companion"
    />
  );
}
