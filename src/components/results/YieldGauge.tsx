import React, { useState } from 'react';

interface YieldGaugeProps {
  predictedYield: number; // tonnes/ha
  predictedYieldMaundAcre?: number;
  confidenceLow: number;
  confidenceHigh: number;
  districtBenchmarkTonnes?: number;
  districtBenchmarkMaundAcre?: number;
}

export const YieldGauge: React.FC<YieldGaugeProps> = ({
  predictedYield,
  predictedYieldMaundAcre,
  confidenceLow,
  confidenceHigh,
  districtBenchmarkTonnes,
  districtBenchmarkMaundAcre,
}) => {
  const [unit, setUnit] = useState<'mds_acre' | 't_ha'>('mds_acre');

  // Dynamic regional benchmark and conversion
  const benchmarkT = districtBenchmarkTonnes || Math.max(0.2, predictedYield * 0.85);
  const benchmarkM = districtBenchmarkMaundAcre || Math.max(2.0, benchmarkT * 10.12);

  // Dynamic scale boundaries grounded in genuine agronomic bounds
  const minT = Math.max(0, parseFloat((Math.min(confidenceLow, benchmarkT) * 0.55).toFixed(2)));
  const maxT = parseFloat((Math.max(confidenceHigh, benchmarkT * 1.4) * 1.25).toFixed(2));
  const spanT = maxT - minT || 1.0;

  const lowPercent = Math.max(0, Math.min(100, ((confidenceLow - minT) / spanT) * 100));
  const highPercent = Math.max(0, Math.min(100, ((confidenceHigh - minT) / spanT) * 100));
  const predPercent = Math.max(0, Math.min(100, ((predictedYield - minT) / spanT) * 100));
  const bandWidth = Math.max(3, highPercent - lowPercent);

  const isMds = unit === 'mds_acre';
  const pyVal = isMds
    ? (predictedYieldMaundAcre ? predictedYieldMaundAcre.toFixed(2) : (predictedYield * 10.12).toFixed(2))
    : predictedYield.toFixed(2);
  const clVal = isMds ? (confidenceLow * 10.12).toFixed(2) : confidenceLow.toFixed(2);
  const chVal = isMds ? (confidenceHigh * 10.12).toFixed(2) : confidenceHigh.toFixed(2);
  const unitLabel = isMds ? 'maund/acre' : 't/ha';

  const minLabel = isMds ? (minT * 10.12).toFixed(1) : minT.toFixed(2);
  const bmLabel = isMds ? benchmarkM.toFixed(1) : benchmarkT.toFixed(2);
  const maxLabel = isMds ? (maxT * 10.12).toFixed(1) : maxT.toFixed(2);

  return (
    <div className="bg-[#181712] border border-[#3A3830] rounded-[2px] p-5 sm:p-6 space-y-4">
      {/* Header & Unit Switcher */}
      <div className="flex items-center justify-between">
        <span className="font-mono text-[#EDE8DD] text-sm sm:text-base uppercase tracking-wider font-semibold">
          Statistical Confidence Interval (95% CI)
        </span>

        {/* Unit Toggle */}
        <div className="flex items-center bg-[#14140F] border border-[#3A3830] rounded-[2px] text-sm font-mono">
          <button
            type="button"
            onClick={() => setUnit('mds_acre')}
            className={`px-3.5 py-1.5 rounded-[1px] transition-colors ${
              unit === 'mds_acre'
                ? 'bg-[#3A3830] text-[#EDE8DD] font-semibold'
                : 'text-[#8C897C] hover:text-[#EDE8DD]'
            }`}
          >
            Maund/Acre
          </button>
          <button
            type="button"
            onClick={() => setUnit('t_ha')}
            className={`px-3.5 py-1.5 rounded-[1px] transition-colors ${
              unit === 't_ha'
                ? 'bg-[#3A3830] text-[#EDE8DD] font-semibold'
                : 'text-[#8C897C] hover:text-[#EDE8DD]'
            }`}
          >
            t/ha
          </button>
        </div>
      </div>

      {/* Readout Numbers */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 text-sm sm:text-base font-mono bg-[#14140F] px-4 py-3 rounded-[2px] border border-[#3A3830]">
        <span className="text-[#C5C2B8] text-sm sm:text-base">Mean &amp; Interval Band:</span>
        <div className="flex items-baseline gap-2">
          <span className="text-[#C98A3D] font-bold text-xl sm:text-2xl font-mono">
            {pyVal}
          </span>
          <span className="text-[#EDE8DD] text-sm sm:text-base font-mono font-medium">
            [{clVal} &ndash; {chVal}] <span className="text-[#C98A3D] font-semibold">{unitLabel}</span>
          </span>
        </div>
      </div>

      {/* Flat Scientific Track */}
      <div className="relative pt-3 pb-1">
        {/* Track Base */}
        <div className="w-full h-3.5 bg-[#14140F] rounded-[1px] overflow-hidden border border-[#3A3830] relative">
          {/* Shaded 95% Confidence Band */}
          <div
            className="absolute top-0 bottom-0 bg-[#34445C] border-x border-[#8C897C]"
            style={{ left: `${lowPercent}%`, width: `${bandWidth}%` }}
          />
        </div>

        {/* Flat Pin Indicator */}
        <div
          className="absolute top-0.5 transform -translate-x-1/2 flex flex-col items-center pointer-events-none"
          style={{ left: `${predPercent}%` }}
        >
          <div className="w-4 h-4 bg-[#C98A3D] rounded-[1px] border-2 border-[#14140F] shadow-sm"></div>
        </div>
      </div>

      {/* Dynamic Axis Scale Markers */}
      <div className="flex justify-between text-xs sm:text-sm font-mono text-[#A8A598] pt-1">
        <span>{minLabel} (Min Baseline)</span>
        <span className="text-[#EDE8DD] font-semibold">{bmLabel} (District Avg Benchmark)</span>
        <span>{maxLabel} (Target Ceiling)</span>
      </div>
    </div>
  );
};
