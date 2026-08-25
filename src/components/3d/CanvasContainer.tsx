import React, { Suspense, useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows } from '@react-three/drei';
import { RicePlantModel, USE_EXTERNAL_GLB } from './RicePlantModel';
import { RefreshCw } from 'lucide-react';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { useToast } from '../common/Toast';

interface CanvasContainerProps {
  growthScale: number;
}

type CameraPreset = 'iso' | 'front' | 'top';

export const CanvasContainer: React.FC<CanvasContainerProps> = ({ growthScale }) => {
  const { showToast } = useToast();
  const [controlsKey, setControlsKey] = useState(0);
  const [wireframe, setWireframe] = useState(false);
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('iso');
  const controlsRef = useRef<OrbitControlsImpl>(null);

  // Agronomic growth stage data
  const getGrowthStageData = (scale: number) => {
    if (scale < 0.35) {
      return {
        name: 'Tillering Stage',
        phase: 'Vegetative',
        heightCm: (65 + scale * 40).toFixed(0),
        lai: (1.8 + scale * 2.0).toFixed(1),
        canopyCover: `${Math.round(45 + scale * 30)}%`,
      };
    }
    if (scale < 0.65) {
      return {
        name: 'Panicle Initiation',
        phase: 'Reproductive',
        heightCm: (75 + scale * 45).toFixed(0),
        lai: (2.8 + scale * 2.4).toFixed(1),
        canopyCover: `${Math.round(60 + scale * 25)}%`,
      };
    }
    if (scale < 0.85) {
      return {
        name: 'Grain Filling',
        phase: 'Maturation',
        heightCm: (85 + scale * 40).toFixed(0),
        lai: (4.2 + scale * 1.5).toFixed(1),
        canopyCover: `${Math.round(80 + scale * 15)}%`,
      };
    }
    return {
      name: 'Physiological Maturity',
      phase: 'Harvest Ready',
      heightCm: (105 + scale * 25).toFixed(0),
      lai: '5.8',
      canopyCover: '98%',
    };
  };

  const stage = getGrowthStageData(growthScale);

  const setPreset = (preset: CameraPreset) => {
    setCameraPreset(preset);
    if (!controlsRef.current) return;

    if (preset === 'iso') {
      controlsRef.current.object.position.set(0, 1.2, 3.4);
    } else if (preset === 'front') {
      controlsRef.current.object.position.set(0, 0.4, 3.2);
    } else if (preset === 'top') {
      controlsRef.current.object.position.set(0, 3.6, 0.5);
    }
    controlsRef.current.update();

    showToast({
      title: `Camera angle: ${preset.toUpperCase()}`,
      description: `Aligned 3D specimen to ${preset} view`,
      type: 'info',
      duration: 2000,
    });
  };

  return (
    <div className="relative w-full h-full min-h-[560px] overflow-hidden bg-[#14140F] flex flex-col">
      {/* 1. Scope-Reticle Overlay: Four L-shaped corner brackets in --accent-data (#C98A3D) */}
      <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-[#C98A3D] pointer-events-none z-20 select-none" />
      <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-[#C98A3D] pointer-events-none z-20 select-none" />
      <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-[#C98A3D] pointer-events-none z-20 select-none" />
      <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-[#C98A3D] pointer-events-none z-20 select-none" />

      {/* 2. Top Bar Controls: Plain text buttons with hairline dividers */}
      <div className="absolute top-4 left-6 right-6 z-10 flex items-center justify-between font-mono">
        {/* Left plain status text */}
        <div className="text-[#8C897C] flex items-center gap-2.5 select-none">
          <span className="uppercase text-xs sm:text-sm tracking-wider text-[#EDE8DD] font-semibold">
            {USE_EXTERNAL_GLB ? 'SPECIMEN: .GLB ASSET' : 'SPECIMEN: 3D MORPH'}
          </span>
          <span className="text-[#C98A3D] text-xs sm:text-sm font-semibold">{(growthScale * 100).toFixed(0)}% SCALE</span>
        </div>

        {/* Right plain text buttons separated by hairline dividers */}
        <div className="flex items-center border border-[#3A3830] bg-[#14140F]/90 divide-x divide-[#3A3830]">
          <button
            type="button"
            onClick={() => setPreset('iso')}
            className={`px-3 py-1.5 text-xs sm:text-sm transition-colors cursor-pointer ${
              cameraPreset === 'iso'
                ? 'text-[#C98A3D] font-bold underline decoration-[#C98A3D]'
                : 'text-[#8C897C] hover:text-[#EDE8DD]'
            }`}
          >
            Iso
          </button>

          <button
            type="button"
            onClick={() => setPreset('front')}
            className={`px-3 py-1.5 text-xs sm:text-sm transition-colors cursor-pointer ${
              cameraPreset === 'front'
                ? 'text-[#C98A3D] font-bold underline decoration-[#C98A3D]'
                : 'text-[#8C897C] hover:text-[#EDE8DD]'
            }`}
          >
            Front
          </button>

          <button
            type="button"
            onClick={() => setPreset('top')}
            className={`px-3 py-1.5 text-xs sm:text-sm transition-colors cursor-pointer ${
              cameraPreset === 'top'
                ? 'text-[#C98A3D] font-bold underline decoration-[#C98A3D]'
                : 'text-[#8C897C] hover:text-[#EDE8DD]'
            }`}
          >
            Top
          </button>

          <button
            type="button"
            onClick={() => {
              const nextWire = !wireframe;
              setWireframe(nextWire);
              showToast({
                title: nextWire ? 'Wireframe enabled' : 'Shaded mesh enabled',
                type: 'info',
                duration: 2000,
              });
            }}
            className={`px-3 py-1.5 text-xs sm:text-sm transition-colors cursor-pointer ${
              wireframe
                ? 'text-[#C98A3D] font-bold underline decoration-[#C98A3D]'
                : 'text-[#8C897C] hover:text-[#EDE8DD]'
            }`}
          >
            Wire
          </button>

          <button
            type="button"
            onClick={() => {
              setControlsKey((prev) => prev + 1);
              showToast({
                title: 'Camera position reset',
                type: 'info',
                duration: 2000,
              });
            }}
            className="px-2.5 py-1.5 text-[#8C897C] hover:text-[#EDE8DD] transition-colors cursor-pointer"
            title="Reset Camera View"
            aria-label="Reset Camera View"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3. Bottom Edge Instrument Readout Tags: Plain mono text */}
      <div className="absolute bottom-5 left-6 right-6 z-10 flex flex-wrap items-baseline justify-between gap-3.5 pointer-events-none font-mono text-xs sm:text-sm select-none">
        <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1.5">
          <div>
            <span className="text-[#8C897C] uppercase mr-1.5">STAGE:</span>
            <span className="text-[#C98A3D] font-semibold">{stage.name}</span>
          </div>
          <span className="text-[#3A3830] hidden sm:inline">&bull;</span>
          <div>
            <span className="text-[#8C897C] uppercase mr-1.5">HEIGHT:</span>
            <span className="text-[#EDE8DD] font-semibold">{stage.heightCm} cm</span>
          </div>
          <span className="text-[#3A3830] hidden sm:inline">&bull;</span>
          <div>
            <span className="text-[#8C897C] uppercase mr-1.5">LAI:</span>
            <span className="text-[#4A6741] font-semibold">{stage.lai}</span>
          </div>
          <span className="text-[#3A3830] hidden sm:inline">&bull;</span>
          <div>
            <span className="text-[#8C897C] uppercase mr-1.5">CANOPY:</span>
            <span className="text-[#EDE8DD] font-semibold">{stage.canopyCover}</span>
          </div>
        </div>

        <div className="text-[#8C897C] text-xs font-mono">
          <span>DRAG: ROTATE &bull; SCROLL: ZOOM</span>
        </div>
      </div>

      {/* React Three Fiber Canvas with frameloop="demand" */}
      <Canvas
        key={controlsKey}
        frameloop="demand"
        shadows
        camera={{ position: [0, 1.2, 3.4], fov: 45 }}
        className="w-full h-full bg-[#14140F]"
      >
        {/* Natural field lighting */}
        <ambientLight intensity={0.8} color="#EDE8DD" />
        <directionalLight
          position={[5, 8, 4]}
          intensity={1.2}
          color="#FAF6EE"
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-bias={-0.0001}
        />
        <pointLight position={[-3, 2, -2]} intensity={0.2} color="#8C897C" />

        {/* Soil Base Pedestal */}
        <mesh position={[0, -0.9, 0]} receiveShadow>
          <cylinderGeometry args={[1.35, 1.45, 0.12, 36]} />
          <meshStandardMaterial color="#221E19" roughness={0.95} metalness={0.0} />
        </mesh>

        {/* Soil rim hairline marker */}
        <mesh position={[0, -0.895, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.34, 1.35, 36]} />
          <meshBasicMaterial color="#3A3830" />
        </mesh>

        {/* Contact Shadow */}
        <ContactShadows
          position={[0, -0.89, 0]}
          opacity={0.8}
          scale={3.2}
          blur={1.6}
          far={2.0}
        />

        {/* 3D Model Stand-in */}
        <Suspense fallback={null}>
          <RicePlantModel growthScale={growthScale} wireframe={wireframe} />
        </Suspense>

        {/* Orbit Controls */}
        <OrbitControls
          ref={controlsRef}
          enablePan={false}
          minDistance={1.6}
          maxDistance={5.5}
          minPolarAngle={Math.PI / 8}
          maxPolarAngle={Math.PI / 2.02}
          dampingFactor={0.05}
        />
      </Canvas>
    </div>
  );
};
