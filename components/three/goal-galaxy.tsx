"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float, Line } from "@react-three/drei";
import * as THREE from "three";

// --- Theme Colors: Sunset Aurora ---
const COLORS = {
  core: "#ff7b72",
  manager: "#ff9d76",
  employee: "#ffc2a6",
  line: "#ffffff",
  lineActive: "#ff7b72",
};

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

interface NodeData {
  id: string;
  position: THREE.Vector3;
  type: "core" | "manager" | "employee";
  parentPos?: THREE.Vector3;
}

const GraphSystem = () => {
  const groupRef = useRef<THREE.Group>(null);

  // Generate hierarchical graph data once
  const { nodes, edges } = useMemo(() => {
    const n: NodeData[] = [];
    const e: { start: THREE.Vector3; end: THREE.Vector3; active: boolean }[] = [];

    // Core Node (Global KPI)
    const corePos = new THREE.Vector3(0, 0, 0);
    n.push({ id: "core", position: corePos, type: "core" });

    // Manager Nodes (Departments)
    const numManagers = 4;
    const managerRadius = 4;
    
    for (let i = 0; i < numManagers; i++) {
      const angle = (i / numManagers) * Math.PI * 2;
      // Add slight vertical variation
      const yOffset = Math.sin(angle * 2) * 1.5;
      const mPos = new THREE.Vector3(
        Math.cos(angle) * managerRadius,
        yOffset,
        Math.sin(angle) * managerRadius
      );
      
      n.push({ id: `mgr-${i}`, position: mPos, type: "manager", parentPos: corePos });
      e.push({ start: corePos, end: mPos, active: true });

      // Employee Nodes (Individual Goals)
      const numEmployees = 3 + Math.floor(seededRandom(i + 1) * 3); // 3 to 5 employees per manager
      const empRadius = 1.8;

      for (let j = 0; j < numEmployees; j++) {
        const empAngle = (j / numEmployees) * Math.PI * 2 + (seededRandom(i * 17 + j + 2) * 0.5);
        const empYOffset = (seededRandom(i * 31 + j + 3) - 0.5) * 2;
        
        const localPos = new THREE.Vector3(
          Math.cos(empAngle) * empRadius,
          empYOffset,
          Math.sin(empAngle) * empRadius
        );
        
        const ePos = mPos.clone().add(localPos);
        
        n.push({ id: `emp-${i}-${j}`, position: ePos, type: "employee", parentPos: mPos });
        
        // Randomly make some paths "active" to simulate progress
        const isActive = seededRandom(i * 43 + j + 4) > 0.4;
        e.push({ start: mPos, end: ePos, active: isActive });
      }
    }

    return { nodes: n, edges: e };
  }, []);

  // Slowly rotate the entire galaxy
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.02) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Draw Edges */}
      {edges.map((edge, idx) => (
        <Line
          key={`edge-${idx}`}
          points={[edge.start, edge.end]}
          color={edge.active ? COLORS.lineActive : COLORS.line}
          lineWidth={edge.active ? 1.5 : 1}
          transparent
          opacity={edge.active ? 0.8 : 0.3}
        />
      ))}

      {/* Draw Nodes */}
      {nodes.map((node) => {
        if (node.type === "core") {
          return (
            <Float key={node.id} speed={2} rotationIntensity={0.5} floatIntensity={1}>
              <mesh position={node.position}>
                <sphereGeometry args={[1.2, 64, 64]} />
                <meshPhysicalMaterial
                  color={COLORS.core}
                  transmission={0.9}
                  opacity={1}
                  metalness={0.1}
                  roughness={0.1}
                  ior={1.5}
                  thickness={2}
                  transparent
                />
              </mesh>
              {/* Internal Core Glow */}
              <mesh position={node.position}>
                <sphereGeometry args={[0.5, 32, 32]} />
                <meshBasicMaterial color={COLORS.core} />
              </mesh>
            </Float>
          );
        }

        if (node.type === "manager") {
          return (
            <Float key={node.id} speed={3} rotationIntensity={1} floatIntensity={2}>
              <mesh position={node.position}>
                <sphereGeometry args={[0.5, 32, 32]} />
                <meshPhysicalMaterial
                  color={COLORS.manager}
                  transmission={0.8}
                  opacity={1}
                  metalness={0.1}
                  roughness={0.2}
                  ior={1.5}
                  thickness={1}
                  transparent
                />
              </mesh>
            </Float>
          );
        }

        return (
          <Float key={node.id} speed={4} rotationIntensity={2} floatIntensity={2}>
            <mesh position={node.position}>
              <sphereGeometry args={[0.15, 16, 16]} />
              <meshBasicMaterial color={COLORS.employee} />
            </mesh>
          </Float>
        );
      })}
    </group>
  );
};

export const GoalGalaxy = () => {
  return (
    <div className="w-full h-full absolute inset-0 cursor-grab active:cursor-grabbing">
      <Canvas
        camera={{ position: [0, 2, 12], fov: 45 }}
        gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping }}
        dpr={[1, 2]}
      >
        
        <ambientLight intensity={0.8} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={3} color={COLORS.core} />
        <pointLight position={[-10, -10, -10]} intensity={2} color={COLORS.manager} />
        <pointLight position={[0, 0, 0]} intensity={1} color={COLORS.core} />

        <GraphSystem />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableDamping
          dampingFactor={0.05}
          autoRotate
          autoRotateSpeed={0.5}
          maxPolarAngle={Math.PI / 1.5}
          minPolarAngle={Math.PI / 3}
        />
      </Canvas>
    </div>
  );
};
