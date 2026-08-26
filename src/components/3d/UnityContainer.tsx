import React, { useEffect } from 'react';
import { Unity, useUnityContext } from 'react-unity-webgl';
import { RefreshCw, CheckCircle2, Loader2 } from 'lucide-react';
import { useToast } from '../common/Toast';

interface UnityContainerProps {
  growthScale: number;
}

export const UnityContainer: React.FC<UnityContainerProps> = ({ growthScale }) => {
  const { showToast } = useToast();

  const { unityProvider, sendMessage, isLoaded, loadingProgression } = useUnityContext({
    loaderUrl: '/unitybuild/Build.loader.js',
    dataUrl: '/unitybuild/Build.data',
    frameworkUrl: '/unitybuild/Build.framework.js',
    codeUrl: '/unitybuild/Build.wasm',
  });

  // Automatically update Unity object whenever growthScale changes and scene is loaded
  useEffect(() => {
    if (isLoaded) {
      try {
        sendMessage('SimulationController', 'ReceiveGrowthScale', growthScale);
      } catch (err) {
        console.error('Failed to send growth scale to Unity:', err);
      }
    }
  }, [growthScale, isLoaded, sendMessage]);

  const handleManualSync = () => {
    if (!isLoaded) {
      showToast({
        title: 'Unity Engine Initializing',
        description: 'Please wait for the WebGL runtime to finish loading.',
        type: 'info',
      });
      return;
    }
    sendMessage('SimulationController', 'ReceiveGrowthScale', growthScale);
    showToast({
      title: 'Sync Sent to Unity',
      description: `Growth Scale ${(growthScale * 100).toFixed(0)}% dispatched to SimulationController`,
      type: 'success',
    });
  };

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

  return (
    <div className="relative w-full h-full min-h-[560px] overflow-hidden bg-[#14140F] flex flex-col items-center justify-center">
      {/* 1. Scope-Reticle Overlay: Corner brackets */}
      <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-[#C98A3D] pointer-events-none z-20 select-none" />
      <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-[#C98A3D] pointer-events-none z-20 select-none" />
      <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-[#C98A3D] pointer-events-none z-20 select-none" />
      <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-[#C98A3D] pointer-events-none z-20 select-none" />

      {/* 2. Top Bar Controls */}
      <div className="absolute top-4 left-6 right-6 z-10 flex items-center justify-between font-mono">
        <div className="text-[#8C897C] flex items-center gap-2.5 select-none">
          <span className="uppercase text-xs sm:text-sm tracking-wider text-[#EDE8DD] font-semibold flex items-center gap-1.5">
            {isLoaded ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-[#4A6741]" />
                UNITY WEBGL: CONNECTED
              </>
            ) : (
              <>
                <Loader2 className="w-4 h-4 text-[#C98A3D] animate-spin" />
                UNITY WEBGL: LOADING
              </>
            )}
          </span>
          <span className="text-[#C98A3D] text-xs sm:text-sm font-semibold">
            {(growthScale * 100).toFixed(0)}% SCALE
          </span>
        </div>

        <div className="flex items-center border border-[#3A3830] bg-[#14140F]/90 divide-x divide-[#3A3830]">
          <button
            type="button"
            onClick={handleManualSync}
            className="px-3 py-1.5 text-xs sm:text-sm text-[#8C897C] hover:text-[#EDE8DD] transition-colors cursor-pointer flex items-center gap-1.5"
            title="Dispatch growth scale to Unity"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${!isLoaded ? 'opacity-50' : ''}`} />
            <span>Sync Unity</span>
          </button>
        </div>
      </div>

      {/* 3. Loading Overlay if Unity is still compiling/loading assets */}
      {!isLoaded && (
        <div className="absolute inset-0 z-15 bg-[#14140F]/95 flex flex-col items-center justify-center p-6 text-center">
          <Loader2 className="w-10 h-10 text-[#C98A3D] animate-spin mb-4" />
          <h3 className="text-sm font-mono uppercase tracking-wider text-[#EDE8DD] mb-2 font-semibold">
            Loading Unity WebGL Engine...
          </h3>
          <p className="text-xs font-mono text-[#8C897C] mb-4">
            Compiling WebAssembly binaries & loading 3D assets
          </p>

          <div className="w-64 bg-[#1F1E17] border border-[#3A3830] h-2.5 rounded-none overflow-hidden">
            <div
              className="bg-[#C98A3D] h-full transition-all duration-300"
              style={{ width: `${Math.round(loadingProgression * 100)}%` }}
            />
          </div>
          <span className="text-xs font-mono text-[#C98A3D] mt-2 font-bold">
            {Math.round(loadingProgression * 100)}%
          </span>
        </div>
      )}

      {/* 4. Unity WebGL Canvas - Locked inside absolute bounds */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden bg-[#14140F]">
        <Unity
          unityProvider={unityProvider}
          tabIndex={-1}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            outline: 'none',
          }}
        />
      </div>

      {/* 5. Bottom Edge Instrument Readout Tags */}
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
            <span className="text-[#8C897C] uppercase mr-1.5">TARGET:</span>
            <span className="text-[#4A6741] font-semibold">SimulationController.ReceiveGrowthScale</span>
          </div>
        </div>

        <div className="text-[#8C897C] text-xs font-mono">
          <span>WEBGL 2.0 &bull; WASM RUNTIME</span>
        </div>
      </div>
    </div>
  );
};
