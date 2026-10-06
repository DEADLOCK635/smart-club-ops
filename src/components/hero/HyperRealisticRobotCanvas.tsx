"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

interface HyperRealisticRobotCanvasProps {
  className?: string;
  onInteract?: () => void;
}

export function HyperRealisticRobotCanvas({
  className = "",
  onInteract,
}: HyperRealisticRobotCanvasProps) {
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

    // Camera calibrated for generous vertical headroom (head will NEVER clip)
    const camera = new THREE.PerspectiveCamera(30, width / height, 0.1, 100);
    camera.position.set(0, 0.15, 5.6);

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
    renderer.toneMappingExposure = 1.35;

    container.appendChild(renderer.domElement);

    // 2. Generate Studio HDRI Environment Map for Hyper-Realistic PBR Reflections
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();

    // Create a virtual studio environment scene with bright softboxes & rim reflectors
    const envScene = new THREE.Scene();
    envScene.background = new THREE.Color(0x05070c);

    // Top Softbox
    const topLightBox = new THREE.Mesh(
      new THREE.PlaneGeometry(8, 8),
      new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide })
    );
    topLightBox.position.set(0, 8, 2);
    topLightBox.rotation.x = Math.PI / 2;
    envScene.add(topLightBox);

    // Left Studio Rim Reflector (Cyan glow)
    const leftRimBox = new THREE.Mesh(
      new THREE.PlaneGeometry(6, 10),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8, side: THREE.DoubleSide })
    );
    leftRimBox.position.set(-8, 3, -4);
    leftRimBox.rotation.y = Math.PI / 3;
    envScene.add(leftRimBox);

    // Right Studio Fill Reflector
    const rightRimBox = new THREE.Mesh(
      new THREE.PlaneGeometry(6, 10),
      new THREE.MeshBasicMaterial({ color: 0xdbeafe, side: THREE.DoubleSide })
    );
    rightRimBox.position.set(8, 3, 2);
    rightRimBox.rotation.y = -Math.PI / 3;
    envScene.add(rightRimBox);

    const envRenderTarget = pmremGenerator.fromScene(envScene, 0.04);
    scene.environment = envRenderTarget.texture;

    // 3. Cinematic Physical Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    // Key Light: High-intensity directional studio light
    const keyLight = new THREE.DirectionalLight(0xffffff, 3.2);
    keyLight.position.set(4, 7, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.bias = -0.0001;
    scene.add(keyLight);

    // Rim Light: Electric cyan backlight creating razor-sharp silhouette specular
    const rimLight = new THREE.DirectionalLight(0x00f0ff, 5.0);
    rimLight.position.set(-4, 4, -4);
    scene.add(rimLight);

    // Fill Light: Soft blue bottom bounce
    const fillLight = new THREE.DirectionalLight(0x93c5fd, 1.0);
    fillLight.position.set(-3, -2, 3);
    scene.add(fillLight);

    // Point Light: Inset cyber core light in chest
    const chestPointLight = new THREE.PointLight(0x00f0ff, 3.0, 3.5);
    chestPointLight.position.set(0, -0.42, 0.9);
    scene.add(chestPointLight);

    // 4. Hyper-Realistic Physical Materials (Apple Commercial CGI Grade)
    // Porcelain Ceramic White Body with High-Gloss Clearcoat
    const whiteCeramicMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      roughness: 0.08,
      metalness: 0.03,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04,
      reflectivity: 0.95,
    });

    // Outer Obsidian Glass Visor (True Glass with Clearcoat & Deep Refraction)
    const glassVisorMat = new THREE.MeshPhysicalMaterial({
      color: 0x03050a,
      roughness: 0.02,
      metalness: 0.88,
      clearcoat: 1.0,
      clearcoatRoughness: 0.02,
      transmission: 0.25,
      ior: 1.54,
      reflectivity: 1.0,
    });

    // Brushed Dark Titanium / Slate (Mechanical Frame & Joints)
    const darkTitaniumMat = new THREE.MeshStandardMaterial({
      color: 0x181d26,
      roughness: 0.22,
      metalness: 0.88,
    });

    // Precision Matte Graphite
    const matteGraphiteMat = new THREE.MeshStandardMaterial({
      color: 0x0d1117,
      roughness: 0.38,
      metalness: 0.65,
    });

    // Electric Cyan Luminous Elements
    const cyanNeonMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
    });

    // Metallic Cyan Anodized Hardware
    const cyanMetalMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      roughness: 0.15,
      metalness: 0.65,
    });

    // 5. Ultra High-Definition Screen (1024x768 Dynamic Canvas Texture)
    const faceCanvas = document.createElement("canvas");
    faceCanvas.width = 1024;
    faceCanvas.height = 768;
    const faceCtx = faceCanvas.getContext("2d")!;
    const faceTexture = new THREE.CanvasTexture(faceCanvas);
    faceTexture.colorSpace = THREE.SRGBColorSpace;

    const screenMat = new THREE.MeshBasicMaterial({
      map: faceTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
    });

    let eyeBlinkProgress = 1;
    let isBlinking = false;
    let nextBlinkTime = performance.now() + 3200;
    let isHappy = false;

    function renderFace() {
      faceCtx.clearRect(0, 0, faceCanvas.width, faceCanvas.height);
      faceCtx.save();

      faceCtx.shadowColor = "#00f0ff";
      faceCtx.shadowBlur = 40;
      faceCtx.fillStyle = "#38bdf8";
      faceCtx.strokeStyle = "#38bdf8";

      const leftX = 350;
      const rightX = 674;
      const eyeY = 370;

      if (isHappy) {
        // Cheerful curved eyes
        faceCtx.lineWidth = 28;
        faceCtx.lineCap = "round";

        faceCtx.beginPath();
        faceCtx.arc(leftX, eyeY + 16, 62, Math.PI * 1.15, Math.PI * 1.85, false);
        faceCtx.stroke();

        faceCtx.beginPath();
        faceCtx.arc(rightX, eyeY + 16, 62, Math.PI * 1.15, Math.PI * 1.85, false);
        faceCtx.stroke();
      } else {
        // High-precision, sleek OLED pill eyes (subtle digital tech)
        const eyeW = 54;
        const eyeH = 92 * Math.max(0.06, eyeBlinkProgress);

        faceCtx.beginPath();
        faceCtx.ellipse(leftX, eyeY, eyeW, eyeH, 0, 0, Math.PI * 2);
        faceCtx.fill();

        faceCtx.beginPath();
        faceCtx.ellipse(rightX, eyeY, eyeW, eyeH, 0, 0, Math.PI * 2);
        faceCtx.fill();

        // Inner lens specular highlight dot
        if (eyeBlinkProgress > 0.6) {
          faceCtx.fillStyle = "#ffffff";
          faceCtx.beginPath();
          faceCtx.arc(leftX + 14, eyeY - 24, 14, 0, Math.PI * 2);
          faceCtx.arc(rightX + 14, eyeY - 24, 14, 0, Math.PI * 2);
          faceCtx.fill();
        }
      }

      // Minimalist cyber smile line
      faceCtx.strokeStyle = "#38bdf8";
      faceCtx.lineWidth = 14;
      faceCtx.beginPath();
      faceCtx.arc(512, 485, 36, 0.18 * Math.PI, 0.82 * Math.PI, false);
      faceCtx.stroke();

      faceCtx.restore();
      faceTexture.needsUpdate = true;
    }

    renderFace();

    // 6. Hyper-Realistic Robot Bust Hierarchy (Head & Upper Torso - NO LEGS)
    const robotRoot = new THREE.Group();
    scene.add(robotRoot);
    // Lowered root slightly to guarantee generous headroom at top
    robotRoot.position.set(0, -0.25, 0);

    // --- HEAD GROUP ---
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 0.6, 0);
    robotRoot.add(headGroup);

    // Main TV Monitor Chassis (Beveled Rounded Box in Ceramic White)
    const headGeo = new RoundedBoxGeometry(2.32, 1.82, 1.6, 14, 0.48);
    const headMesh = new THREE.Mesh(headGeo, whiteCeramicMat);
    headMesh.castShadow = true;
    headGroup.add(headMesh);

    // Dark Titanium Inset Visor Bezel
    const visorBezelGeo = new RoundedBoxGeometry(1.94, 1.44, 0.14, 10, 0.32);
    const visorBezel = new THREE.Mesh(visorBezelGeo, matteGraphiteMat);
    visorBezel.position.set(0, 0.02, 0.77);
    headGroup.add(visorBezel);

    // Outer High-Gloss Curved Glass Visor (Reflects Studio Softboxes)
    const glassGeo = new RoundedBoxGeometry(1.86, 1.36, 0.08, 8, 0.28);
    const glassMesh = new THREE.Mesh(glassGeo, glassVisorMat);
    glassMesh.position.set(0, 0.02, 0.82);
    headGroup.add(glassMesh);

    // Sunken OLED Digital Display Screen (Placed behind the glass with 3D depth)
    const screenGeo = new THREE.PlaneGeometry(1.76, 1.28);
    const screenMesh = new THREE.Mesh(screenGeo, screenMat);
    screenMesh.position.set(0, 0.02, 0.8);
    headGroup.add(screenMesh);

    // Flush Side Acoustic Sensor Pods (Titanium Discs with Chamfers)
    const earPodGeo = new THREE.CylinderGeometry(0.36, 0.36, 0.2, 32);
    earPodGeo.rotateZ(Math.PI / 2);

    const leftEar = new THREE.Mesh(earPodGeo, darkTitaniumMat);
    leftEar.position.set(-1.24, 0.05, 0);
    headGroup.add(leftEar);

    const rightEar = new THREE.Mesh(earPodGeo, darkTitaniumMat);
    rightEar.position.set(1.24, 0.05, 0);
    headGroup.add(rightEar);

    // Concentric Cyan Micro-LED Halo Rings on Ear Pods
    const earRingGeo = new THREE.TorusGeometry(0.28, 0.035, 16, 32);
    earRingGeo.rotateY(Math.PI / 2);

    const leftEarRing = new THREE.Mesh(earRingGeo, cyanNeonMat);
    leftEarRing.position.set(-1.35, 0.05, 0);
    headGroup.add(leftEarRing);

    const rightEarRing = new THREE.Mesh(earRingGeo, cyanNeonMat);
    rightEarRing.position.set(1.35, 0.05, 0);
    headGroup.add(rightEarRing);

    // Aerodynamic Top Sensor Node (Low Profile, Never Hits Top of Screen)
    const topSensorGeo = new RoundedBoxGeometry(0.36, 0.12, 0.6, 6, 0.05);
    const topSensor = new THREE.Mesh(topSensorGeo, darkTitaniumMat);
    topSensor.position.set(0, 0.97, -0.05);
    headGroup.add(topSensor);

    const topDiodeGeo = new RoundedBoxGeometry(0.14, 0.06, 0.35, 4, 0.02);
    const topDiode = new THREE.Mesh(topDiodeGeo, cyanNeonMat);
    topDiode.position.set(0, 1.04, -0.05);
    headGroup.add(topDiode);

    // Articulated Cervical Neck Collar
    const neckGeo = new THREE.CylinderGeometry(0.44, 0.44, 0.26, 32);
    const neckMesh = new THREE.Mesh(neckGeo, darkTitaniumMat);
    neckMesh.position.set(0, -0.92, 0);
    headGroup.add(neckMesh);

    const neckRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.46, 0.025, 16, 32),
      cyanNeonMat
    );
    neckRing.rotation.x = Math.PI / 2;
    neckRing.position.set(0, -0.88, 0);
    headGroup.add(neckRing);

    // --- SLEEK BUST / UPPER TORSO (NO LEGS, NO LOWER BELLY) ---
    const bustGroup = new THREE.Group();
    bustGroup.position.set(0, -0.72, 0);
    robotRoot.add(bustGroup);

    // Sculpted Upper Chest & Shoulder Casing (White Ceramic)
    const chestGeo = new RoundedBoxGeometry(2.4, 0.98, 1.36, 12, 0.44);
    const chestMesh = new THREE.Mesh(chestGeo, whiteCeramicMat);
    chestMesh.castShadow = true;
    bustGroup.add(chestMesh);

    // Inset Glowing Cyber Core Emblem
    const coreFrameGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.08, 32);
    coreFrameGeo.rotateX(Math.PI / 2);
    const coreFrame = new THREE.Mesh(coreFrameGeo, darkTitaniumMat);
    coreFrame.position.set(0, 0.12, 0.69);
    bustGroup.add(coreFrame);

    const coreLightGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.1, 32);
    coreLightGeo.rotateX(Math.PI / 2);
    const coreLight = new THREE.Mesh(coreLightGeo, cyanNeonMat);
    coreLight.position.set(0, 0.12, 0.73);
    bustGroup.add(coreLight);

    // Aerodynamic Shoulder Caps
    const shoulderGeo = new THREE.SphereGeometry(0.24, 24, 24);
    const leftShoulder = new THREE.Mesh(shoulderGeo, darkTitaniumMat);
    leftShoulder.position.set(-1.22, 0.15, 0);
    bustGroup.add(leftShoulder);

    const rightShoulder = new THREE.Mesh(shoulderGeo, darkTitaniumMat);
    rightShoulder.position.set(1.22, 0.15, 0);
    bustGroup.add(rightShoulder);

    // Base Floating Fade Pedestal (Tapers down gracefully into ambient shadow)
    const basePedestalGeo = new THREE.CylinderGeometry(0.85, 0.65, 0.38, 32);
    const basePedestal = new THREE.Mesh(basePedestalGeo, matteGraphiteMat);
    basePedestal.position.set(0, -0.58, 0);
    bustGroup.add(basePedestal);

    // Wide Diffuse Radial Floor Ambient Shadow
    const shadowGeo = new THREE.PlaneGeometry(4.6, 4.6);
    shadowGeo.rotateX(-Math.PI / 2);
    const shadowCanvas = document.createElement("canvas");
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const sCtx = shadowCanvas.getContext("2d")!;
    const grad = sCtx.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, "rgba(0, 0, 0, 0.75)");
    grad.addColorStop(0.42, "rgba(0, 0, 0, 0.2)");
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
    shadowMesh.position.set(0, -1.25, 0);
    robotRoot.add(shadowMesh);

    // 7. Dignified, Heavy Inertia Cursor Look-At
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    let acknowledgeNod = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - (rect.left + rect.width / 2)) / window.innerWidth) * 2;
      const y = ((e.clientY - (rect.top + rect.height / 2)) / window.innerHeight) * 2;
      mouse.targetX = Math.max(-0.7, Math.min(0.7, x));
      mouse.targetY = Math.max(-0.5, Math.min(0.5, y));
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Click Interaction: Gentle acknowledgement nod
    const doAcknowledge = () => {
      acknowledgeNod = 0.055;
      isHappy = true;
      renderFace();

      setTimeout(() => {
        isHappy = false;
        renderFace();
      }, 1400);

      if (onInteract) onInteract();
    };

    triggerRef.current = doAcknowledge;

    // 8. Silky Smooth 60-120fps Animation Loop
    let animId: number;
    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      animId = requestAnimationFrame(animate);

      const delta = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      // Heavy inertia smoothing (poised, realistic robotics)
      mouse.x += (mouse.targetX - mouse.x) * 0.045;
      mouse.y += (mouse.targetY - mouse.y) * 0.045;

      // Meditative, slow breathing hover
      const t = currentTime * 0.0011;
      const hoverY = Math.sin(t) * 0.035;

      if (acknowledgeNod > 0) {
        acknowledgeNod = Math.max(0, acknowledgeNod - 0.12 * delta);
      }

      // Root positioning in space
      robotRoot.position.y = -0.25 + hoverY;
      robotRoot.position.z = 0.1 + mouse.y * 0.08;

      // Calm body rotation
      robotRoot.rotation.y = mouse.x * 0.2;
      robotRoot.rotation.x = -mouse.y * 0.1 + acknowledgeNod;

      // Head tracks cursor with poised intelligence
      headGroup.rotation.y = mouse.x * 0.28;
      headGroup.rotation.x = -mouse.y * 0.16 + acknowledgeNod * 1.4;
      headGroup.rotation.z = -mouse.x * 0.05;

      // Chest core respiration light pulse
      const pulse = (Math.sin(t * 2.2) + 1) * 0.5;
      chestPointLight.intensity = 1.8 + pulse * 0.8;

      // Natural, slow OLED blinking
      if (currentTime > nextBlinkTime && !isBlinking) {
        isBlinking = true;
        eyeBlinkProgress = 1;
      }

      if (isBlinking) {
        eyeBlinkProgress -= delta * 10;
        if (eyeBlinkProgress <= 0.06) {
          eyeBlinkProgress = 0.06;
          isBlinking = false;
          nextBlinkTime = currentTime + 3800 + Math.random() * 2500;
        }
        renderFace();
      } else if (eyeBlinkProgress < 1) {
        eyeBlinkProgress = Math.min(1, eyeBlinkProgress + delta * 12);
        renderFace();
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
      envRenderTarget.dispose();
      pmremGenerator.dispose();
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
