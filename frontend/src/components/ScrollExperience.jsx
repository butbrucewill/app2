import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import * as THREE from "three";

export const scrollState = { p: 0 };
const mouse = { x: 0, y: 0 };

function Rig() {
  const look = useMemo(() => new THREE.Vector3(0, 0.6, 0), []);
  useFrame(({ camera }) => {
    camera.position.x += (mouse.x * 0.6 - camera.position.x) * 0.04;
    camera.position.y += (1.5 - mouse.y * 0.35 - camera.position.y) * 0.04;
    camera.position.z += (12.5 - camera.position.z) * 0.04;
    camera.lookAt(look);
  });
  return null;
}

function ForestCandle({ c }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    ref.current.position.y =
      c.y + Math.sin(scrollState.p * Math.PI * 3 + c.phase) * 1.4 + Math.sin(t * 0.4 + c.phase) * 0.1;
  });
  const color = c.up ? "#22c55e" : "#ef4444";
  return (
    <group ref={ref} position={[c.x, c.y, c.z]} rotation={[0, c.rot, 0]}>
      <mesh position={[0, c.h / 2, 0]}>
        <boxGeometry args={[0.3, c.h, 0.3]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} metalness={0.6} roughness={0.3} transparent opacity={0.92} />
      </mesh>
      <mesh position={[0, c.h / 2, 0]}>
        <boxGeometry args={[0.05, c.h + c.wick, 0.05]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.7} />
      </mesh>
    </group>
  );
}

function CandleForest() {
  const g = useRef();
  const candles = useMemo(
    () =>
      Array.from({ length: 54 }, (_, i) => ({
        x: (Math.random() - 0.5) * 20,
        y: -2.5 + Math.random() * 1.5,
        z: -8 + Math.random() * 10,
        h: 0.6 + Math.random() * 2.6,
        wick: 0.3 + Math.random() * 0.8,
        rot: Math.random() * Math.PI,
        phase: i * 0.55,
        up: Math.random() > 0.42,
      })),
    []
  );
  useFrame(() => {
    g.current.rotation.y = scrollState.p * 0.2;
  });
  return (
    <group ref={g}>
      {candles.map((c, i) => (
        <ForestCandle key={i} c={c} />
      ))}
    </group>
  );
}



export default function ScrollExperience() {
  useEffect(() => {
    const onMove = (e) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none" data-testid="scroll-experience" aria-hidden="true">
      <Canvas camera={{ position: [0, 1.5, 12.5], fov: 45 }} dpr={[1, 1.75]}>
        <color attach="background" args={["#04060D"]} />
        <fog attach="fog" args={["#04060D", 12, 34]} />
        <ambientLight intensity={0.55} />
        <directionalLight position={[5, 10, 6]} intensity={1.1} />
        <pointLight position={[-6, 4, -4]} intensity={14} color="#3D9BFF" />
        <pointLight position={[7, 2, -2]} intensity={9} color="#0070F0" />
        <Stars radius={50} depth={30} count={1600} factor={2.4} saturation={0} fade speed={0.5} />
        <Rig />
        <CandleForest />
      </Canvas>
    </div>
  );
}
