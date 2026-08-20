import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, Edges } from "@react-three/drei";
import * as THREE from "three";

export const scrollState = { p: 0 };
const mouse = { x: 0, y: 0 };

const smooth = (a, b, x) => {
  const t = Math.min(Math.max((x - a) / (b - a), 0), 1);
  return t * t * (3 - 2 * t);
};

const KEYS = [
  { p: 0.0, pos: [0, 1.4, 11], tgt: [0, 1.2, 0] },
  { p: 0.16, pos: [0, 2.4, 9], tgt: [0, 0.6, 0] },
  { p: 0.32, pos: [0, 7.5, 6.5], tgt: [0, -3.6, 0] },
  { p: 0.48, pos: [5.5, 0.8, 7], tgt: [0, -1.2, 0] },
  { p: 0.64, pos: [-4, 1.6, 8], tgt: [0, 1.2, 0] },
  { p: 0.8, pos: [0, 1.2, 10], tgt: [0, 1.0, 0] },
  { p: 1.0, pos: [0, 1.0, 17], tgt: [0, 0.3, 0] },
];

function cameraAt(p) {
  let i = 0;
  while (i < KEYS.length - 2 && p > KEYS[i + 1].p) i++;
  const a = KEYS[i];
  const b = KEYS[i + 1];
  const t = smooth(a.p, b.p, p);
  const lerp = (u, v) => u + (v - u) * t;
  return {
    pos: [lerp(a.pos[0], b.pos[0]), lerp(a.pos[1], b.pos[1]), lerp(a.pos[2], b.pos[2])],
    tgt: [lerp(a.tgt[0], b.tgt[0]), lerp(a.tgt[1], b.tgt[1]), lerp(a.tgt[2], b.tgt[2])],
  };
}

function Rig() {
  const look = useMemo(() => new THREE.Vector3(), []);
  useFrame(({ camera }) => {
    const { pos, tgt } = cameraAt(scrollState.p);
    camera.position.x += (pos[0] + mouse.x * 0.7 - camera.position.x) * 0.06;
    camera.position.y += (pos[1] - mouse.y * 0.4 - camera.position.y) * 0.06;
    camera.position.z += (pos[2] - camera.position.z) * 0.06;
    look.set(tgt[0] + mouse.x * 0.5, tgt[1] - mouse.y * 0.3, tgt[2]);
    camera.lookAt(look);
  });
  return null;
}

function ForestCandle({ c }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    ref.current.position.y = c.y + Math.sin(t * 0.6 + c.phase) * 0.18;
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
    g.current.position.y = -8 * smooth(0.12, 0.3, scrollState.p);
    g.current.rotation.y = scrollState.p * 0.6;
  });
  return (
    <group ref={g}>
      {candles.map((c, i) => (
        <ForestCandle key={i} c={c} />
      ))}
    </group>
  );
}

function Terrain() {
  const geom = useMemo(() => new THREE.PlaneGeometry(56, 56, 48, 48), []);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const pos = geom.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      pos.setZ(i, Math.sin(x * 0.45 + t * 0.9) * 0.35 + Math.cos(y * 0.45 + t * 0.6) * 0.35);
    }
    pos.needsUpdate = true;
  });
  return (
    <mesh geometry={geom} rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.6, 0]}>
      <meshBasicMaterial color="#1E3A6E" wireframe transparent opacity={0.55} />
    </mesh>
  );
}

function Pillar({ x, h, glow }) {
  return (
    <group position={[x, -3.6, 0]}>
      <mesh position={[0, h / 2, 0]}>
        <boxGeometry args={[1.15, h, 1.15]} />
        <meshStandardMaterial color="#0a0a0a" emissive="#ffffff" emissiveIntensity={0.12} metalness={0.9} roughness={0.15} />
        <Edges color="#ffffff" />
      </mesh>
      <mesh position={[0, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.3, 0.03, 12, 48]} />
        <meshBasicMaterial color={glow} transparent opacity={0.9} />
      </mesh>
    </group>
  );
}

function Pillars() {
  const g = useRef();
  useFrame(() => {
    const k = smooth(0.34, 0.5, scrollState.p) * (1 - smooth(0.56, 0.7, scrollState.p));
    g.current.scale.set(1, Math.max(k, 0.001), 1);
    g.current.rotation.y += 0.0016;
  });
  return (
    <group ref={g} position={[0, 0, -1.5]}>
      <Pillar x={-2.3} h={2.8} glow="#ffffff" />
      <Pillar x={2.3} h={5.4} glow="#22c55e" />
    </group>
  );
}

function DataRing() {
  const g = useRef();
  const items = useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) => {
        const a = (i / 30) * Math.PI * 2;
        return {
          x: Math.cos(a) * 4.4,
          z: Math.sin(a) * 4.4,
          h: 0.35 + Math.random() * 0.9,
          up: i % 3 !== 0,
          a,
        };
      }),
    []
  );
  useFrame((_, delta) => {
    g.current.rotation.y += delta * 0.18;
    const k = 0.25 + 0.75 * smooth(0.52, 0.66, scrollState.p) * (1 - 0.5 * smooth(0.86, 1, scrollState.p));
    g.current.scale.setScalar(k);
  });
  return (
    <group ref={g} position={[0, 1.1, 0]} rotation={[0.12, 0, 0]}>
      {items.map((it, i) => {
        const color = it.up ? "#22c55e" : "#ef4444";
        return (
          <mesh key={i} position={[it.x, 0, it.z]} rotation={[0, -it.a, 0]}>
            <boxGeometry args={[0.16, it.h, 0.16]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} />
          </mesh>
        );
      })}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[4.4, 0.012, 8, 80]} />
        <meshBasicMaterial color="#2E4E8F" transparent opacity={0.7} />
      </mesh>
    </group>
  );
}

function Finale() {
  const g = useRef();
  useFrame(({ clock }) => {
    const k = smooth(0.8, 0.93, scrollState.p);
    g.current.scale.setScalar(Math.max(k, 0.001));
    g.current.rotation.y = clock.getElapsedTime() * 0.12;
    g.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.15) * 0.15;
  });
  return (
    <group ref={g} position={[0, 0.4, 0]}>
      <mesh>
        <icosahedronGeometry args={[2.6, 1]} />
        <meshBasicMaterial color="#3D9BFF" wireframe transparent opacity={0.35} />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[1.4, 0]} />
        <meshStandardMaterial color="#050505" emissive="#0070F0" emissiveIntensity={0.5} metalness={0.8} roughness={0.2} />
      </mesh>
      <pointLight intensity={8} color="#3D9BFF" distance={10} />
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
      <Canvas camera={{ position: [0, 1.4, 11], fov: 45 }} dpr={[1, 1.75]}>
        <color attach="background" args={["#04060D"]} />
        <fog attach="fog" args={["#04060D", 12, 34]} />
        <ambientLight intensity={0.55} />
        <directionalLight position={[5, 10, 6]} intensity={1.1} />
        <pointLight position={[-6, 4, -4]} intensity={14} color="#3D9BFF" />
        <pointLight position={[7, 2, -2]} intensity={9} color="#0070F0" />
        <Stars radius={50} depth={30} count={1600} factor={2.4} saturation={0} fade speed={0.5} />
        <Rig />
        <CandleForest />
        <Terrain />
        <Pillars />
        <DataRing />
        <Finale />
      </Canvas>
    </div>
  );
}
