"use client";

import { Float } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group, Mesh } from "three";

function Shapes() {
  const group = useRef<Group | null>(null);
  const head = useRef<Mesh | null>(null);
  const body = useRef<Mesh | null>(null);
  const armLeft = useRef<Mesh | null>(null);
  const armRight = useRef<Mesh | null>(null);
  const visor = useRef<Mesh | null>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (group.current) {
      group.current.rotation.y = time * 0.25;
      group.current.rotation.x = Math.sin(time * 0.35) * 0.08;
      group.current.position.y = Math.sin(time * 0.9) * 0.05;
    }

    if (armLeft.current) {
      armLeft.current.rotation.z = Math.sin(time * 1.4) * 0.35;
    }

    if (armRight.current) {
      armRight.current.rotation.z = -Math.sin(time * 1.4) * 0.35;
    }

    if (visor.current) {
      visor.current.position.z = 0.52 + Math.sin(time * 2) * 0.03;
    }
  });

  return (
    <group ref={group}>
      <Float speed={1.4} rotationIntensity={0.2} floatIntensity={0.6}>
        <mesh ref={head} position={[0, 0.9, 0]}>
          <boxGeometry args={[1, 0.9, 1]} />
          <meshStandardMaterial
            color="#e34c5c"
            metalness={0.35}
            roughness={0.25}
            emissive="#b0102e"
            emissiveIntensity={0.22}
          />
        </mesh>

        <mesh ref={visor} position={[0, 0.9, 0.52]}>
          <boxGeometry args={[0.78, 0.35, 0.08]} />
          <meshStandardMaterial
            color="#2ad4ff"
            emissive="#5be8ff"
            emissiveIntensity={0.4}
            roughness={0.12}
          />
        </mesh>
      </Float>

      <Float speed={1.2} rotationIntensity={0.14} floatIntensity={0.5}>
        <mesh ref={body} position={[0, 0, 0]}>
          <boxGeometry args={[1.35, 1.4, 1.1]} />
          <meshStandardMaterial
            color="#ff6b6b"
            metalness={0.32}
            roughness={0.22}
            emissive="#ff3b57"
            emissiveIntensity={0.22}
          />
        </mesh>

        <mesh ref={armLeft} position={[-1.05, 0.15, 0]}>
          <boxGeometry args={[0.35, 0.9, 0.35]} />
          <meshStandardMaterial color="#ffd166" metalness={0.2} roughness={0.35} />
        </mesh>

        <mesh ref={armRight} position={[1.05, 0.15, 0]}>
          <boxGeometry args={[0.35, 0.9, 0.35]} />
          <meshStandardMaterial color="#ffd166" metalness={0.2} roughness={0.35} />
        </mesh>

        <mesh position={[0, -0.95, 0]}>
          <boxGeometry args={[0.9, 0.28, 0.9]} />
          <meshStandardMaterial color="#2f1a24" metalness={0.25} roughness={0.4} />
        </mesh>
      </Float>

      <mesh position={[0, -1.95, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[2.2, 60]} />
        <meshBasicMaterial color="#7f142c" transparent opacity={0.26} />
      </mesh>
    </group>
  );
}

export function HeroScene3D() {
  return (
    <div className="h-full w-full rounded-[32px]">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 5.8], fov: 42 }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={1.05} />
        <directionalLight position={[4, 3, 5]} intensity={1.4} color="#fff4ef" />
        <pointLight position={[-4, -1, 3]} intensity={1.1} color="#ff8a75" />
        <pointLight position={[3, 2, -2]} intensity={0.7} color="#ffc299" />
        <Shapes />
      </Canvas>
    </div>
  );
}
