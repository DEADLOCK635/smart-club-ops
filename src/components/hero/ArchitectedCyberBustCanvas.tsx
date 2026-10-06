"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

interface ArchitectedCyberBustCanvasProps {
  className?: string;
}

export function ArchitectedCyberBustCanvas({
  className = "",
}: ArchitectedCyberBustCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth || 1080;
    const height = container.clientHeight || 820;

    // ── 1. Scene, Camera & WebGL Renderer ───────────────────────────
    const scene = new THREE.Scene();

    // Camera framing: adjusted so the full helmet crown, visor, eyes, shoulders, chest, and belly are in view
    const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 100);
    camera.position.set(0, 0.38, 5.05);
    camera.lookAt(0, 0.16, 0);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0); // 100% transparent into website black canvas
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.45;

    container.appendChild(renderer.domElement);

    // ── 2. Studio HDR Reflection Map & Cinematic Key Lights ─────────
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();

    const envScene = new THREE.Scene();
    envScene.background = new THREE.Color(0x000000);

    // Top Studio Linear Diffuser (for curved specular highlight across the glossy black visor)
    const topStrip = new THREE.Mesh(
      new THREE.PlaneGeometry(16, 10),
      new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide })
    );
    topStrip.position.set(0, 8, 3.5);
    topStrip.rotation.x = Math.PI / 2;
    envScene.add(topStrip);

    // Left Studio Softbox
    const leftStrip = new THREE.Mesh(
      new THREE.PlaneGeometry(8, 18),
      new THREE.MeshBasicMaterial({ color: 0xf1f5f9, side: THREE.DoubleSide })
    );
    leftStrip.position.set(-8, 3, 0);
    leftStrip.rotation.y = Math.PI / 2.7;
    envScene.add(leftStrip);

    // Right Studio Softbox
    const rightStrip = new THREE.Mesh(
      new THREE.PlaneGeometry(8, 18),
      new THREE.MeshBasicMaterial({ color: 0xe2e8f0, side: THREE.DoubleSide })
    );
    rightStrip.position.set(8, 3, 0);
    rightStrip.rotation.y = -Math.PI / 2.7;
    envScene.add(rightStrip);

    // Front Camera Bounce (subtle reflection dot on upper visor)
    const frontDot = new THREE.Mesh(
      new THREE.SphereGeometry(0.35, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    frontDot.position.set(-0.25, 2.6, 6.2);
    envScene.add(frontDot);

    const envRenderTarget = pmremGenerator.fromScene(envScene, 0.04);
    scene.environment = envRenderTarget.texture;

    // Direct Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.25);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 4.5);
    keyLight.position.set(3, 7, 6);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 6.2);
    rimLight.position.set(-5, 6, -5);
    scene.add(rimLight);

    const fillLight = new THREE.DirectionalLight(0x94a3b8, 1.5);
    fillLight.position.set(-3, -0.5, 4.5);
    scene.add(fillLight);

    // ── 3. Exact Photorealistic Materials (matching user image) ─────
    // A. Smoked Obsidian Glass Visor (Deep glossy black curved glass)
    const smokedGlassVisorMat = new THREE.MeshPhysicalMaterial({
      color: 0x050608,
      roughness: 0.04,
      metalness: 0.05,
      clearcoat: 1.0,
      clearcoatRoughness: 0.02,
      reflectivity: 0.95,
      ior: 1.52,
      envMapIntensity: 1.4,
    });

    // B. Matte Carbon Helmet Cowl & Face Armor (Ultra-clean satin dark graphite/black)
    const matteArmorShellMat = new THREE.MeshPhysicalMaterial({
      color: 0x181a1f,
      roughness: 0.48,
      metalness: 0.12,
      clearcoat: 0.18,
      clearcoatRoughness: 0.35,
      envMapIntensity: 0.6,
    });

    // C. Deep Obsidian Metallic Trim & Ear Pod Discs
    const earPodMetallicMat = new THREE.MeshStandardMaterial({
      color: 0x1f232b,
      roughness: 0.28,
      metalness: 0.82,
    });

    // D. Cyan Cybernetic Glowing Optical Eyes (The iconic dual horizontal glowing bars!)
    const cyanGlowEyeMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8, // Brilliant sky/cyan electric blue
      depthTest: false,
    });

    const cyanGlowAuraMat = new THREE.MeshBasicMaterial({
      color: 0x0ea5e9,
      transparent: true,
      opacity: 0.70,
      depthTest: false,
    });

    // E. Satin Black Muscular Chest & Shoulder Armor
    const satinBlackChestMat = new THREE.MeshStandardMaterial({
      color: 0x15181e,
      roughness: 0.42,
      metalness: 0.24,
    });

    // F. Dark Titanium Mechanical Joint Actuators & Neck Struts
    const darkTitaniumMat = new THREE.MeshStandardMaterial({
      color: 0x1c212a,
      roughness: 0.30,
      metalness: 0.82,
    });

    // G. Mirror Chrome Pistons
    const chromePistonMat = new THREE.MeshStandardMaterial({
      color: 0xdde4ec,
      roughness: 0.08,
      metalness: 0.96,
    });

    // ── 4. Robot Assembly (Humanoid Bust · Head to Belly) ───────────
    const robotRoot = new THREE.Group();
    scene.add(robotRoot);
    robotRoot.position.set(0, -0.20, 0); // Kept centered so head is right below hero buttons
    robotRoot.scale.set(1.26, 1.26, 1.26);

    // ─── A. MUSCULAR SATIN BLACK TORSO (BODY FOLLOWS CURSOR SUBTLY) ──
    const torsoGroup = new THREE.Group();
    torsoGroup.position.set(0, -0.15, 0);
    robotRoot.add(torsoGroup);

    // Clavicle Arch Bridge (Broad athletic shoulders)
    const clavicleGeo = new RoundedBoxGeometry(2.1, 0.24, 0.62, 8, 0.12);
    const clavicleMesh = new THREE.Mesh(clavicleGeo, satinBlackChestMat);
    clavicleMesh.position.set(0, 0.24, 0.04);
    torsoGroup.add(clavicleMesh);

    // Neck Base Collar on Clavicle
    const neckBaseCollar = new THREE.Mesh(
      new THREE.CylinderGeometry(0.24, 0.28, 0.12, 36),
      darkTitaniumMat
    );
    neckBaseCollar.position.set(0, 0.38, 0.04);
    torsoGroup.add(neckBaseCollar);

    // Lower Neck Struts Anchor
    const neckCol = new THREE.Mesh(
      new THREE.CylinderGeometry(0.14, 0.18, 0.32, 32),
      darkTitaniumMat
    );
    neckCol.position.set(0, 0.52, 0.04);
    torsoGroup.add(neckCol);

    // Athletic V-Taper Chest Body Shell (Continuous taper down to belly)
    const chestGeo = new THREE.CylinderGeometry(1.08, 0.68, 1.58, 40, 1);
    const chestShell = new THREE.Mesh(chestGeo, satinBlackChestMat);
    chestShell.scale.set(1.15, 1.0, 0.64);
    chestShell.position.set(0, -0.46, 0.08);
    chestShell.castShadow = true;
    torsoGroup.add(chestShell);

    // Left Muscular Pectoral Plate
    const leftPecGeo = new RoundedBoxGeometry(0.82, 0.72, 0.22, 8, 0.14);
    const leftPec = new THREE.Mesh(leftPecGeo, satinBlackChestMat);
    leftPec.position.set(-0.44, -0.16, 0.3);
    leftPec.rotation.y = 0.12;
    torsoGroup.add(leftPec);

    // Right Muscular Pectoral Plate
    const rightPecGeo = new RoundedBoxGeometry(0.82, 0.72, 0.22, 8, 0.14);
    const rightPec = new THREE.Mesh(rightPecGeo, satinBlackChestMat);
    rightPec.position.set(0.44, -0.16, 0.3);
    rightPec.rotation.y = -0.12;
    torsoGroup.add(rightPec);

    // Center Sternum Seam Channel
    const sternumGeo = new RoundedBoxGeometry(0.045, 1.25, 0.26, 6, 0.02);
    const sternumMesh = new THREE.Mesh(sternumGeo, darkTitaniumMat);
    sternumMesh.position.set(0, -0.42, 0.32);
    torsoGroup.add(sternumMesh);

    // ─── B. MECHANICAL LUMBAR ACTUATOR (BELLY TERMINATION) ─────────
    const lumbarActuatorGeo = new THREE.CylinderGeometry(0.19, 0.19, 0.94, 36);
    lumbarActuatorGeo.rotateZ(Math.PI / 2);
    const lumbarActuator = new THREE.Mesh(lumbarActuatorGeo, darkTitaniumMat);
    lumbarActuator.position.set(0, -1.32, 0.06);
    torsoGroup.add(lumbarActuator);

    for (const side of [-1, 1]) {
      const ringGeo = new THREE.TorusGeometry(0.22, 0.034, 16, 32);
      ringGeo.rotateY(Math.PI / 2);
      const ringMesh = new THREE.Mesh(ringGeo, darkTitaniumMat);
      ringMesh.position.set(side * 0.40, -1.32, 0.06);
      torsoGroup.add(ringMesh);

      const pistonGeo = new THREE.CylinderGeometry(0.065, 0.065, 0.28, 20);
      const pistonMesh = new THREE.Mesh(pistonGeo, darkTitaniumMat);
      pistonMesh.position.set(side * 0.30, -1.48, 0.06);
      torsoGroup.add(pistonMesh);
    }

    // ─── C. SHOULDERS & ARMS ────────────────────────────────────────
    const createArmAssembly = (side: 1 | -1) => {
      const armGroup = new THREE.Group();
      armGroup.position.set(side * 1.30, 0.16, 0.04);

      // Shoulder Pauldron Armor
      const shoulderGeo = new RoundedBoxGeometry(0.42, 0.72, 0.42, 8, 0.15);
      const shoulderMesh = new THREE.Mesh(shoulderGeo, satinBlackChestMat);
      shoulderMesh.rotation.z = side * 0.10;
      armGroup.add(shoulderMesh);

      // Rotator Core
      const rotatorGeo = new THREE.CylinderGeometry(0.17, 0.17, 0.48, 24);
      rotatorGeo.rotateZ(Math.PI / 2);
      const rotatorMesh = new THREE.Mesh(rotatorGeo, darkTitaniumMat);
      armGroup.add(rotatorMesh);

      // Upper Bicep Armature
      const bicepGeo = new RoundedBoxGeometry(0.34, 0.86, 0.34, 8, 0.09);
      const bicepMesh = new THREE.Mesh(bicepGeo, satinBlackChestMat);
      bicepMesh.position.set(side * 0.06, -0.72, 0.02);
      bicepMesh.rotation.z = -side * 0.04;
      armGroup.add(bicepMesh);

      // Elbow Hinge
      const elbowGroup = new THREE.Group();
      elbowGroup.position.set(side * 0.08, -1.24, 0.04);
      armGroup.add(elbowGroup);

      const elbowPinGeo = new THREE.CylinderGeometry(0.085, 0.085, 0.34, 20);
      elbowPinGeo.rotateZ(Math.PI / 2);
      const elbowPin = new THREE.Mesh(elbowPinGeo, darkTitaniumMat);
      elbowGroup.add(elbowPin);

      // Forearm Armor
      const forearmGeo = new RoundedBoxGeometry(0.30, 0.88, 0.30, 8, 0.08);
      const forearmMesh = new THREE.Mesh(forearmGeo, satinBlackChestMat);
      forearmMesh.position.set(side * 0.04, -0.50, 0.08);
      forearmMesh.rotation.z = -side * 0.14;
      forearmMesh.rotation.x = -0.12;
      elbowGroup.add(forearmMesh);

      // Wrist Node
      const wristNode = new THREE.Mesh(
        new THREE.SphereGeometry(0.11, 16, 16),
        darkTitaniumMat
      );
      wristNode.position.set(side * 0.08, -0.96, 0.12);
      elbowGroup.add(wristNode);

      return armGroup;
    };

    torsoGroup.add(createArmAssembly(1));
    torsoGroup.add(createArmAssembly(-1));

    // ─── D. HIGH-REALISM CYBERNETIC HEAD (EXACT MATCH TO USER PHOTO) ──
    const headMount = new THREE.Group();
    headMount.position.set(0, 0.70, 0.05);
    robotRoot.add(headMount);

    const headPitchRoll = new THREE.Group();
    headMount.add(headPitchRoll);

    // 1. Sleek Streamlined Helmet Skull Cowl (Matte dark anthracite carbon casing)
    const helmetCrownGeo = new THREE.SphereGeometry(0.58, 64, 48);
    const helmetCrown = new THREE.Mesh(helmetCrownGeo, matteArmorShellMat);
    helmetCrown.scale.set(0.84, 1.08, 0.92);
    helmetCrown.position.set(0, 0.36, -0.05);
    headPitchRoll.add(helmetCrown);

    // Forehead Inset Panel Detail (From photo - recessed panel flush at top forehead)
    const foreheadGeo = new RoundedBoxGeometry(0.30, 0.16, 0.04, 6, 0.015);
    const foreheadMesh = new THREE.Mesh(foreheadGeo, matteArmorShellMat);
    foreheadMesh.position.set(0, 0.86, 0.19);
    foreheadMesh.rotation.x = -0.38;
    headPitchRoll.add(foreheadMesh);

    // 2. Continuous Matte Face Bezel Frame (The sculpted rim enclosing the visor)
    const visorBezelGeo = new THREE.TorusGeometry(0.40, 0.04, 20, 64);
    const visorBezel = new THREE.Mesh(visorBezelGeo, matteArmorShellMat);
    visorBezel.scale.set(0.96, 0.80, 0.85);
    visorBezel.position.set(0, 0.38, 0.22);
    visorBezel.rotation.x = 0.04;
    headPitchRoll.add(visorBezel);

    // 3. Ultra-Glossy Smoked Curved Visor (Deep black glass screen)
    const visorGeo = new THREE.SphereGeometry(0.48, 64, 48);
    const visorMesh = new THREE.Mesh(visorGeo, smokedGlassVisorMat);
    visorMesh.scale.set(0.80, 0.68, 0.72);
    visorMesh.position.set(0, 0.38, 0.18);
    visorMesh.rotation.x = 0.04;
    headPitchRoll.add(visorMesh);

    // 4. Iconic Glowing Cyan Slit Eyes (Thin, razor-sharp glowing horizontal bars)
    for (const side of [-1, 1]) {
      const eyeGroup = new THREE.Group();
      eyeGroup.position.set(side * 0.18, 0.38, 0.53);

      // Core razor-thin intense cyan capsule
      const eyeGeo = new THREE.CapsuleGeometry(0.007, 0.13, 16, 16);
      eyeGeo.rotateZ(Math.PI / 2);
      const eyeMesh = new THREE.Mesh(eyeGeo, cyanGlowEyeMat);
      eyeMesh.renderOrder = 999;
      eyeGroup.add(eyeMesh);

      // Soft electric cyan halo glow
      const auraGeo = new THREE.CapsuleGeometry(0.016, 0.14, 16, 16);
      auraGeo.rotateZ(Math.PI / 2);
      const auraMesh = new THREE.Mesh(auraGeo, cyanGlowAuraMat);
      auraMesh.renderOrder = 998;
      eyeGroup.add(auraMesh);

      headPitchRoll.add(eyeGroup);
    }

    // 5. Sleek Tapered Lower Chin / Face Mask (Continuous sleek curve from visor downwards)
    const chinGeo = new THREE.CylinderGeometry(0.36, 0.20, 0.46, 48, 1);
    const chinMesh = new THREE.Mesh(chinGeo, matteArmorShellMat);
    chinMesh.scale.set(1.0, 1.0, 0.74);
    chinMesh.position.set(0, 0.10, 0.16);
    chinMesh.rotation.x = -0.15;
    headPitchRoll.add(chinMesh);

    // Chin rounded tip cap
    const chinCapGeo = new THREE.SphereGeometry(0.20, 36, 24);
    const chinCap = new THREE.Mesh(chinCapGeo, matteArmorShellMat);
    chinCap.scale.set(1.0, 0.72, 0.74);
    chinCap.position.set(0, -0.12, 0.19);
    headPitchRoll.add(chinCap);

    // Chin Vent Slits (Exact matching slots from reference photo)
    const chinVentGeo = new RoundedBoxGeometry(0.12, 0.016, 0.03, 4, 0.005);
    const chinVent = new THREE.Mesh(chinVentGeo, darkTitaniumMat);
    chinVent.position.set(0, -0.04, 0.35);
    headPitchRoll.add(chinVent);

    const chinBevelGeo = new RoundedBoxGeometry(0.06, 0.008, 0.02, 4, 0.003);
    const chinBevel = new THREE.Mesh(chinBevelGeo, darkTitaniumMat);
    chinBevel.position.set(0, -0.10, 0.33);
    headPitchRoll.add(chinBevel);

    // 6. Sleek Ear Pod Housings (Tapered oval ear modules hugging the helmet sides)
    for (const side of [-1, 1]) {
      const earGroup = new THREE.Group();
      earGroup.position.set(side * 0.44, 0.36, -0.02);
      earGroup.rotation.y = side * Math.PI / 2;

      // Outer ear pod oval
      const earOuterGeo = new THREE.CylinderGeometry(0.28, 0.29, 0.07, 36);
      const earOuter = new THREE.Mesh(earOuterGeo, matteArmorShellMat);
      earOuter.scale.set(1.0, 1.0, 1.35); // Oval vertical elongation matching photo
      earOuter.rotation.x = Math.PI / 2;
      earGroup.add(earOuter);

      // Inner beveled dark metallic ring
      const earInnerGeo = new THREE.CylinderGeometry(0.20, 0.22, 0.08, 36);
      const earInner = new THREE.Mesh(earInnerGeo, earPodMetallicMat);
      earInner.scale.set(1.0, 1.0, 1.30);
      earInner.rotation.x = Math.PI / 2;
      earGroup.add(earInner);

      // Center core cap
      const earCoreGeo = new THREE.CylinderGeometry(0.08, 0.09, 0.09, 24);
      const earCore = new THREE.Mesh(earCoreGeo, darkTitaniumMat);
      earCore.rotation.x = Math.PI / 2;
      earGroup.add(earCore);

      headPitchRoll.add(earGroup);
    }

    // 6. Articulated Neck Struts (Connecting head base to collar)
    const neckTopRing = new THREE.Mesh(
      new THREE.CylinderGeometry(0.16, 0.14, 0.12, 32),
      darkTitaniumMat
    );
    neckTopRing.position.set(0, -0.15, 0.04);
    headPitchRoll.add(neckTopRing);

    for (const side of [-1, 1]) {
      const strutGeo = new THREE.CylinderGeometry(0.022, 0.022, 0.32, 16);
      const strut = new THREE.Mesh(strutGeo, chromePistonMat);
      strut.position.set(side * 0.14, -0.20, 0.06);
      strut.rotation.z = side * 0.12;
      headPitchRoll.add(strut);
    }

    // ── 5. Cursor Tracking: HEAD LEADS ACTIVELY, BODY FOLLOWS SUBTLY ─
    let headTargetRotY = 0;
    let headTargetRotX = 0;
    let headCurrentRotY = 0;
    let headCurrentRotX = 0;

    let bodyCurrentRotY = 0;
    let bodyCurrentRotX = 0;

    // Optional drag orbit if user drags with pointer
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let dragOrbitY = 0;
    let dragOrbitX = 0;
    let currentOrbitY = 0;
    let currentOrbitX = 0;

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

        dragOrbitY += deltaX * 0.005;
        dragOrbitX = Math.max(-0.25, Math.min(0.25, dragOrbitX + deltaY * 0.004));
      } else {
        const rect = container.getBoundingClientRect();
        const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const normY = ((e.clientY - rect.top) / rect.height) * 2 - 1;

        // Head moves prominently with the cursor
        headTargetRotY = Math.max(-0.75, Math.min(0.75, normX * 0.65));
        headTargetRotX = Math.max(-0.35, Math.min(0.35, -normY * 0.38));
      }
    };

    const handlePointerUp = (e: PointerEvent) => {
      isDragging = false;
      try {
        container.releasePointerCapture(e.pointerId);
      } catch (_) {}
    };

    const handlePointerLeave = () => {
      if (!isDragging) {
        headTargetRotY = 0;
        headTargetRotX = 0;
      }
    };

    const handleDoubleClick = () => {
      dragOrbitY = 0;
      dragOrbitX = 0;
      headTargetRotY = 0;
      headTargetRotX = 0;
    };

    container.addEventListener("pointerdown", handlePointerDown);
    container.addEventListener("dblclick", handleDoubleClick);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    container.addEventListener("pointerleave", handlePointerLeave);

    // ── 6. Render Loop with Organic Idle Dynamics ──────────────────
    let reqId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Subtle organic breathing of the chest
      const breath = Math.sin(elapsedTime * 1.5) * 0.012;
      torsoGroup.position.y = -0.15 + breath;

      // Lifelike micro head drift
      const headNod = Math.sin(elapsedTime * 0.75) * 0.008;

      // Spring damping interpolation
      headCurrentRotY += (headTargetRotY - headCurrentRotY) * 0.095;
      headCurrentRotX += (headTargetRotX - headCurrentRotX) * 0.095;

      // BODY MOVES WITH CURSOR ALSO, BUT VERY LITTLE (18% of head movement)
      const bodyTargetRotY = headTargetRotY * 0.18;
      const bodyTargetRotX = headTargetRotX * 0.15;
      bodyCurrentRotY += (bodyTargetRotY - bodyCurrentRotY) * 0.06;
      bodyCurrentRotX += (bodyTargetRotX - bodyCurrentRotX) * 0.06;

      currentOrbitY += (dragOrbitY - currentOrbitY) * 0.08;
      currentOrbitX += (dragOrbitX - currentOrbitX) * 0.08;

      // Base scene drag orbit
      robotRoot.rotation.y = currentOrbitY;
      robotRoot.rotation.x = currentOrbitX;

      // Torso body responds subtly to the cursor
      torsoGroup.rotation.y = bodyCurrentRotY;
      torsoGroup.rotation.x = bodyCurrentRotX;

      // HEAD ROTATES MAINLY WITH CURSOR
      headPitchRoll.rotation.y = headCurrentRotY;
      headPitchRoll.rotation.x = headCurrentRotX + headNod;
      headPitchRoll.rotation.z = -headCurrentRotY * 0.10; // Natural head tilt when looking sideways

      renderer.render(scene, camera);
    };

    animate();

    // ── 7. Responsive Resize ────────────────────────────────────────
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 1080;
      const h = container.clientHeight || 820;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(reqId);
      window.removeEventListener("resize", handleResize);
      container.removeEventListener("pointerdown", handlePointerDown);
      container.removeEventListener("dblclick", handleDoubleClick);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      container.removeEventListener("pointerleave", handlePointerLeave);

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
      className={`relative flex w-full max-w-5xl h-[720px] md:h-[800px] lg:h-[860px] cursor-grab active:cursor-grabbing items-center justify-center select-none overflow-visible touch-none ${className}`}
      style={{
        // Soft bottom alpha gradient so the lower belly fades seamlessly into site canvas
        WebkitMaskImage: "linear-gradient(to bottom, black 85%, transparent 100%)",
        maskImage: "linear-gradient(to bottom, black 85%, transparent 100%)",
      }}
    />
  );
}
