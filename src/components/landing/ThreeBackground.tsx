import { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import * as THREE from 'three';
import { useIsMobile } from '@/hooks/use-mobile';

function Block({ position, scale }: { position: [number, number, number]; scale: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const initialY = position[1];
  const randomOffset = useMemo(() => Math.random() * Math.PI * 2, []);
  const randomSpeed = useMemo(() => 0.3 + Math.random() * 0.4, []);

  useFrame((state) => {
    if (meshRef.current) {
      // Breathing animation
      meshRef.current.position.y = initialY + Math.sin(state.clock.elapsedTime * randomSpeed + randomOffset) * 0.15;
    }
  });

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <boxGeometry args={[1, 0.3, 1]} />
      <meshStandardMaterial
        color="#1a1a1a"
        metalness={0.8}
        roughness={0.2}
        emissive="#0a0a0a"
        emissiveIntensity={0.1}
      />
    </mesh>
  );
}

function BlockGrid({ count }: { count: number }) {
  const blocks = useMemo(() => {
    const items: { position: [number, number, number]; scale: [number, number, number] }[] = [];
    const gridSize = Math.ceil(Math.sqrt(count));
    const spacing = 1.2;
    const offset = (gridSize * spacing) / 2;

    for (let i = 0; i < count; i++) {
      const row = Math.floor(i / gridSize);
      const col = i % gridSize;
      
      // Tatami-style alternating pattern
      const isAlternate = (row + col) % 2 === 0;
      const scaleX = isAlternate ? 2 : 1;
      const scaleZ = isAlternate ? 1 : 2;
      
      items.push({
        position: [
          col * spacing - offset + (isAlternate ? 0.5 : 0),
          0,
          row * spacing - offset + (isAlternate ? 0 : 0.5)
        ],
        scale: [scaleX * 0.45, 1, scaleZ * 0.45]
      });
    }
    return items;
  }, [count]);

  return (
    <group>
      {blocks.map((block, i) => (
        <Block key={i} position={block.position} scale={block.scale} />
      ))}
    </group>
  );
}

function Scene({ blockCount }: { blockCount: number }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.03;
    }
  });

  return (
    <>
      {/* Ambient light for base illumination */}
      <ambientLight intensity={0.1} />
      
      {/* Pink/Magenta spotlight */}
      <spotLight
        position={[-5, 8, -5]}
        angle={0.6}
        penumbra={1}
        intensity={60}
        color="#ff00ff"
        castShadow
      />
      
      {/* Cyan/Blue spotlight */}
      <spotLight
        position={[5, 8, 5]}
        angle={0.6}
        penumbra={1}
        intensity={40}
        color="#00ffff"
        castShadow
      />
      
      {/* Purple accent light */}
      <pointLight position={[0, 5, 0]} intensity={20} color="#a855f7" />

      <group ref={groupRef}>
        <BlockGrid count={blockCount} />
      </group>
    </>
  );
}

export default function ThreeBackground() {
  const isMobile = useIsMobile();
  const blockCount = isMobile ? 36 : 64;

  return (
    <div className="fixed inset-0 -z-10">
      {/* Vignette overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#020202] via-transparent to-[#020202] z-10 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#020202] via-transparent to-[#020202] z-10 pointer-events-none opacity-50" />
      
      <Canvas
        camera={{ position: [0, 8, 8], fov: 45 }}
        dpr={isMobile ? 1 : Math.min(window.devicePixelRatio, 1.5)}
        gl={{ antialias: true, alpha: true }}
        style={{ background: '#020202' }}
      >
        <Suspense fallback={null}>
          <Scene blockCount={blockCount} />
          <Environment preset="night" />
        </Suspense>
      </Canvas>
    </div>
  );
}
