import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Stars } from "@react-three/drei";

const DATA = [
  { o: 42, c: 58, h: 66, l: 36 },
  { o: 58, c: 50, h: 64, l: 44 },
  { o: 50, c: 66, h: 72, l: 47 },
  { o: 66, c: 60, h: 74, l: 55 },
  { o: 60, c: 74, h: 80, l: 57 },
  { o: 74, c: 68, h: 79, l: 62 },
  { o: 68, c: 82, h: 88, l: 64 },
  { o: 82, c: 76, h: 86, l: 70 },
  { o: 76, c: 90, h: 95, l: 73 },
  { o: 90, c: 84, h: 94, l: 79 },
  { o: 84, c: 96, h: 102, l: 81 },
  { o: 96, c: 108, h: 114, l: 92 },
  { o: 108, c: 100, h: 112, l: 96 },
  { o: 100, c: 116, h: 122, l: 98 },
];

const S = 0.034;

function Candle({ d, i }) {
  const ref = useRef();
  const up = d.c >= d.o;
  const x = (i - (DATA.length - 1) / 2) * 0.62;
  const bodyTop = Math.max(d.o, d.c) * S;
  const bodyBot = Math.min(d.o, d.c) * S;
  const bodyH = Math.max(bodyTop - bodyBot, 0.09);
  const wickTop = d.h * S;
  const wickBot = d.l * S;

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const k = Math.min(Math.max((t - 0.5 - i * 0.14) / 1.0, 0), 1);
    const e = 1 - Math.pow(1 - k, 3);
    if (ref.current) ref.current.scale.y = Math.max(e, 0.001);
  });

  return (
    <group position={[x, 0, 0]} ref={ref}>
      <mesh position={[0, (bodyTop + bodyBot) / 2, 0]}>
        <boxGeometry args={[0.34, bodyH, 0.34]} />
        <meshStandardMaterial
          color={up ? "#ececec" : "#232838"}
          emissive={up ? "#ffffff" : "#3a4160"}
          emissiveIntensity={up ? 0.35 : 0.25}
          metalness={0.4}
          roughness={0.3}
        />
      </mesh>
      <mesh position={[0, (wickTop + wickBot) / 2, 0]}>
        <boxGeometry args={[0.05, wickTop - wickBot, 0.05]} />
        <meshStandardMaterial color="#aab2c8" emissive="#aab2c8" emissiveIntensity={0.35} />
      </mesh>
    </group>
  );
}

function Rig({ children }) {
  const ref = useRef();
  useFrame((state, delta) => {
    ref.current.rotation.y += (state.pointer.x * 0.28 - ref.current.rotation.y) * Math.min(delta * 3, 1);
    ref.current.rotation.x += (-state.pointer.y * 0.1 - ref.current.rotation.x) * Math.min(delta * 3, 1);
  });
  return <group ref={ref}>{children}</group>;
}

export default function HeroScene() {
  const candles = useMemo(() => DATA, []);
  return (
    <Canvas camera={{ position: [0, 2.2, 8.5], fov: 42 }} dpr={[1, 1.75]} data-testid="hero-3d-canvas">
      <color attach="background" args={["#0B1021"]} />
      <fog attach="fog" args={["#0B1021", 8, 17]} />
      <ambientLight intensity={0.7} />
      <directionalLight position={[4, 8, 5]} intensity={1.3} />
      <pointLight position={[-6, 3, -4]} intensity={12} color="#8fa2ff" />
      <Stars radius={40} depth={25} count={1400} factor={2.2} saturation={0} fade speed={0.6} />
      <Rig>
        <group position={[1.8, -1.3, 0]} rotation={[0, -0.35, 0]}>
          {candles.map((d, i) => (
            <Float key={i} speed={1.3} rotationIntensity={0.04} floatIntensity={0.3}>
              <Candle d={d} i={i} />
            </Float>
          ))}
          <gridHelper args={[26, 52, "#39406b", "#181d33"]} />
        </group>
      </Rig>
    </Canvas>
  );
}
