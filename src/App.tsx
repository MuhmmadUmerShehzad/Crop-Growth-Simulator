import { useState, useEffect, useCallback } from 'react';
import { Header } from './components/common/Header';
import { SimulatorForm } from './components/form/SimulatorForm';
import { ResultsDashboard } from './components/results/ResultsDashboard';
import { CanvasContainer } from './components/3d/CanvasContainer';
import { UnityContainer } from './components/3d/UnityContainer';
import { PredictionInputs, PredictionResponse } from './types/prediction';
import { getYieldPrediction } from './api/predictService';
import { ToastProvider, useToast } from './components/common/Toast';

const DEFAULT_INPUTS: PredictionInputs = {
  crop_type: 'Rice',
  crop_variety: 'Super Basmati',
  district: 'Gujranwala',
  fertilizer_type: 'NPK 15-15-15 Balanced',
  planting_date: '2026-06-15',
};

function SimulatorApp() {
  const { showToast } = useToast();
  const [inputs, setInputs] = useState<PredictionInputs>(DEFAULT_INPUTS);
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [growthScale, setGrowthScale] = useState<number>(0.75);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [engineMode, setEngineMode] = useState<'unity' | 'three'>('unity');

  // Trigger prediction request
  const handleSimulate = useCallback(async (customInputs?: PredictionInputs, isInitial = false) => {
    const payload = customInputs || inputs;
    setIsLoading(true);
    setError(null);

    if (!isInitial) {
      showToast({
        title: 'Processing request...',
        description: 'Simulating growth & forecasting yield',
        type: 'loading',
        duration: 2200,
      });
    }

    try {
      const response = await getYieldPrediction(payload);
      setPrediction(response);
      
      if (typeof response.growth_scale === 'number') {
        setGrowthScale(response.growth_scale);
      }

      if (!isInitial) {
        showToast({
          title: 'Simulation complete',
          description: `Projected yield: ${response.predicted_yield.toFixed(2)} t/ha (${response.percent_increase >= 0 ? '+' : ''}${response.percent_increase.toFixed(1)}%)`,
          type: 'success',
          duration: 4000,
        });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An unexpected calculation error occurred.';
      setError(msg);
      showToast({
        title: 'Simulation error',
        description: msg,
        type: 'info',
        duration: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  }, [inputs, showToast]);

  // Export specimen report
  const handleExportReport = () => {
    if (!prediction) return;
    const report = {
      specimen_id: `SPECIMEN-LOG-${Date.now()}`,
      timestamp: new Date().toISOString(),
      inputs,
      forecast: prediction,
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `yield_log_${inputs.crop_variety.replace(/\s+/g, '_')}_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    showToast({
      title: 'Report exported',
      description: `Downloaded JSON survey log for ${inputs.crop_variety}`,
      type: 'success',
      duration: 3500,
    });
  };

  // Initial calculation on mount
  useEffect(() => {
    handleSimulate(DEFAULT_INPUTS, true);
  }, []);

  return (
    <div className="min-h-screen bg-[#14140F] text-[#EDE8DD] flex flex-col font-sans">
      {/* Top Header */}
      <Header onExportReport={prediction ? handleExportReport : undefined} />

      {/* Main Single Continuous Bordered Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="border border-[#3A3830] bg-[#1F1E17] rounded-[2px] overflow-hidden grid grid-cols-1 lg:grid-cols-12 shadow-none">
          {/* Left Panel: Inputs & Analytical Results */}
          <div className="lg:col-span-7 border-b lg:border-b-0 lg:border-r border-[#3A3830] divide-y divide-[#3A3830] flex flex-col">
            {/* 1. Input Form */}
            <SimulatorForm
              inputs={inputs}
              onChange={setInputs}
              onSubmit={() => handleSimulate()}
              isLoading={isLoading}
            />

            {/* 2. Results Dashboard */}
            <ResultsDashboard
              prediction={prediction}
              isLoading={isLoading}
              error={error}
              onRetry={() => handleSimulate()}
            />
          </div>

          {/* Right Panel: 3D Plant Growth Viewport */}
          <div className="lg:col-span-5 bg-[#14140F] flex flex-col min-h-0 relative">
            {/* Mode Switcher Tabs */}
            <div className="border-b border-[#3A3830] bg-[#1F1E17] px-4 py-2 flex items-center justify-between font-mono text-xs z-20">
              <span className="text-[#8C897C] font-semibold uppercase tracking-wider">3D Engine:</span>
              <div className="flex border border-[#3A3830] divide-x divide-[#3A3830]">
                <button
                  type="button"
                  onClick={() => setEngineMode('unity')}
                  className={`px-3 py-1 transition-colors cursor-pointer ${
                    engineMode === 'unity'
                      ? 'bg-[#C98A3D] text-[#14140F] font-bold'
                      : 'text-[#8C897C] hover:text-[#EDE8DD]'
                  }`}
                >
                  Unity WebGL (Live)
                </button>
                <button
                  type="button"
                  onClick={() => setEngineMode('three')}
                  className={`px-3 py-1 transition-colors cursor-pointer ${
                    engineMode === 'three'
                      ? 'bg-[#C98A3D] text-[#14140F] font-bold'
                      : 'text-[#8C897C] hover:text-[#EDE8DD]'
                  }`}
                >
                  Three.js Fallback
                </button>
              </div>
            </div>

            <div className="flex-1 flex flex-col min-h-0 relative">
              {engineMode === 'unity' ? (
                <UnityContainer growthScale={growthScale} />
              ) : (
                <CanvasContainer growthScale={growthScale} />
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer Log Note */}
      <footer className="w-full border-t border-[#3A3830] bg-[#14140F] py-4 px-4 text-xs sm:text-sm font-mono text-[#8C897C]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Rice Yield Growth Simulator &bull; Specimen Survey Console</span>
          <span className="text-[#C98A3D]">Continuous Station Frame</span>
        </div>
      </footer>
    </div>
  );
}

export function App() {
  return (
    <ToastProvider>
      <SimulatorApp />
    </ToastProvider>
  );
}

export default App;
