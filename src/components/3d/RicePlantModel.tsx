import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// ============================================================================
// TEAMMATE 3D MODEL INTEGRATION (1-LINE SWAP):
// 1. Put your teammate's exported Blender file in: /public/models/rice_plant.glb
// 2. Set USE_EXTERNAL_GLB to true below.
// ============================================================================
export const USE_EXTERNAL_GLB = false;
export const GLB_MODEL_PATH = '/models/rice_plant.glb';

interface RicePlantModelProps {
  growthScale: number; // 0.0 to 1.0 (from API prediction)
  wireframe?: boolean;
}

/**
 * GLTF Model Loader Component (used when USE_EXTERNAL_GLB is true)
 */
const ExternalGlbModel: React.FC<{ growthScale: number; wireframe?: boolean }> = ({ growthScale }) => {
  const { scene } = useGLTF(GLB_MODEL_PATH);
  const modelRef = useRef<THREE.Group>(null);
  const currentScaleRef = useRef(growthScale);
  const { invalidate } = useThree();

  useFrame((_, delta) => {
    if (!modelRef.current) return;
    const diff = growthScale - currentScaleRef.current;
    if (Math.abs(diff) > 0.002) {
      currentScaleRef.current += diff * Math.min(delta * 4, 1);
      const s = currentScaleRef.current;
      modelRef.current.scale.set(s, s, s);
      invalidate(); // Re-render frame in demand mode
    }
  });

  return (
    <primitive
      ref={modelRef}
      object={scene.clone()}
      position={[0, -0.85, 0]}
      scale={[growthScale, growthScale, growthScale]}
    />
  );
};

/**
 * High-Fidelity Procedural Morphing Plant Stand-in
 * Transitioning from natural Paddy Green (#4A6741) to Wheat Gold (#C98A3D)
 */
const ProceduralRicePlant: React.FC<{ growthScale: number; wireframe?: boolean }> = ({ growthScale, wireframe = false }) => {
  const rootGroupRef = useRef<THREE.Group>(null);
  const panicleRef = useRef<THREE.Group>(null);
  const currentScaleRef = useRef(growthScale);
  const { invalidate } = useThree();

  // Smooth lerping to target growthScale
  useFrame((_, delta) => {
    if (!rootGroupRef.current) return;

    const diff = growthScale - currentScaleRef.current;
    if (Math.abs(diff) > 0.001) {
      currentScaleRef.current += diff * Math.min(delta * 3.5, 1);
      const s = currentScaleRef.current;

      // Scale height and radial fullness
      rootGroupRef.current.scale.set(
        0.6 + s * 0.75, // X width
        0.4 + s * 1.1,  // Y height
        0.6 + s * 0.75  // Z width
      );

      // Tilt panicle head as grains become heavier
      if (panicleRef.current) {
        panicleRef.current.rotation.x = 0.2 + s * 0.55;
      }

      invalidate(); // Required for frameloop="demand"
    }
  });

  // Calculate maturation color based on design tokens: #4A6741 (Paddy Green) -> #C98A3D (Wheat Gold)
  const vegetativeColor = useMemo(() => new THREE.Color('#4A6741'), []);
  const harvestGoldColor = useMemo(() => new THREE.Color('#C98A3D'), []);
  const currentColor = useMemo(() => {
    const color = new THREE.Color();
    const t = Math.max(0, Math.min(1, (growthScale - 0.35) / 0.65));
    return color.lerpColors(vegetativeColor, harvestGoldColor, t);
  }, [growthScale, vegetativeColor, harvestGoldColor]);

  // Multi-tier foliage configuration
  const leaves = useMemo(() => {
    return [
      { angle: 0, y: 0.15, scale: 0.7, bend: 0.6 },
      { angle: 45, y: 0.3, scale: 0.85, bend: 0.52 },
      { angle: 90, y: 0.45, scale: 1.0, bend: 0.46 },
      { angle: 135, y: 0.6, scale: 1.1, bend: 0.42 },
      { angle: 180, y: 0.75, scale: 1.15, bend: 0.38 },
      { angle: 225, y: 0.9, scale: 1.1, bend: 0.34 },
      { angle: 270, y: 1.05, scale: 0.95, bend: 0.28 },
      { angle: 315, y: 1.2, scale: 0.8, bend: 0.22 },
    ];
  }, []);

  return (
    <group ref={rootGroupRef} position={[0, -0.85, 0]}>
      {/* Central Culm (Stalk) */}
      <mesh position={[0, 0.8, 0]} castShadow>
        <cylinderGeometry args={[0.035, 0.065, 1.6, 16]} />
        <meshStandardMaterial
          color={currentColor}
          roughness={0.6}
          metalness={0.0}
          wireframe={wireframe}
        />
      </mesh>

      {/* Tillering side shoots */}
      {[-0.08, 0.08, 0.04].map((xOffset, idx) => (
        <mesh key={idx} position={[xOffset, 0.5, idx * 0.03]} rotation={[0, (idx * Math.PI) / 3, xOffset * 1.5]} castShadow>
          <cylinderGeometry args={[0.02, 0.04, 1.0, 10]} />
          <meshStandardMaterial
            color={currentColor}
            roughness={0.65}
            wireframe={wireframe}
          />
        </mesh>
      ))}

      {/* Tiered Foliage Leaf Blades */}
      {leaves.map((leaf, idx) => {
        const rad = (leaf.angle * Math.PI) / 180;
        return (
          <group key={idx} position={[0, leaf.y, 0]} rotation={[0, rad, 0]}>
            <mesh position={[0.26 * leaf.scale, 0.35 * leaf.scale, 0]} rotation={[0, 0, -leaf.bend]} castShadow>
              <coneGeometry args={[0.075 * leaf.scale, 1.15 * leaf.scale, 5]} />
              <meshStandardMaterial
                color={currentColor}
                roughness={0.5}
                side={THREE.DoubleSide}
                wireframe={wireframe}
              />
            </mesh>
          </group>
        );
      })}

      {/* Flag Leaf */}
      <group position={[0, 1.35, 0]} rotation={[0, Math.PI / 4, 0]}>
        <mesh position={[0.2, 0.3, 0]} rotation={[0, 0, -0.2]} castShadow>
          <coneGeometry args={[0.06, 0.9, 4]} />
          <meshStandardMaterial color={currentColor} roughness={0.5} wireframe={wireframe} />
        </mesh>
      </group>

      {/* Panicle Head */}
      <group ref={panicleRef} position={[0, 1.6, 0.05]} rotation={[0.3, 0, 0]}>
        {/* Main grain spine */}
        <mesh castShadow>
          <capsuleGeometry args={[0.065, 0.55 * Math.max(0.2, growthScale), 8, 16]} />
          <meshStandardMaterial
            color={growthScale > 0.6 ? '#C98A3D' : '#4A6741'}
            roughness={0.45}
            metalness={0.05}
            wireframe={wireframe}
          />
        </mesh>

        {/* Grainlets / Seeds */}
        {[-0.07, 0.07, -0.04, 0.04].map((offset, i) => (
          <mesh key={i} position={[offset, 0.06 + i * 0.08, 0.04]} rotation={[0.2, 0, offset * 2]} castShadow>
            <sphereGeometry args={[0.038, 8, 8]} />
            <meshStandardMaterial
              color={growthScale > 0.6 ? '#D49B4B' : '#4A6741'}
              roughness={0.4}
              wireframe={wireframe}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
};

export const RicePlantModel: React.FC<RicePlantModelProps> = ({ growthScale, wireframe }) => {
  if (USE_EXTERNAL_GLB) {
    return <ExternalGlbModel growthScale={growthScale} wireframe={wireframe} />;
  }
  return <ProceduralRicePlant growthScale={growthScale} wireframe={wireframe} />;
};
