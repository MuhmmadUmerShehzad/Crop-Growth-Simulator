import React, { useState } from 'react';

interface YieldGaugeProps {
  predictedYield: number;
  confidenceLow: number;
  confidenceHigh: number;
}

export const YieldGauge: React.FC<YieldGaugeProps> = ({
  predictedYield,
  confidenceLow,
  confidenceHigh,
}) => {
  const [unit, setUnit] = useState<'t_ha' | 'mds_acre'>('t_ha');

  // Conversion: 1 tonne/ha ≈ 10.78 Maunds/Acre
  const unitMultiplier = unit === 't_ha' ? 1.0 : 10.78;
  const unitLabel = unit === 't_ha' ? 't/ha' : 'Mds/Ac';

  const pyVal = (predictedYield * unitMultiplier).toFixed(2);
  const clVal = (confidenceLow * unitMultiplier).toFixed(2);
  const chVal = (confidenceHigh * unitMultiplier).toFixed(2);

  // Range track computation (2.0 to 7.0 tonnes/ha)
  const minBoundary = 2.0;
  const maxBoundary = 7.0;
  const rangeSpan = maxBoundary - minBoundary;

  const lowPercent = Math.max(0, Math.min(100, ((confidenceLow - minBoundary) / rangeSpan) * 100));
  const highPercent = Math.max(0, Math.min(100, ((confidenceHigh - minBoundary) / rangeSpan) * 100));
  const predPercent = Math.max(0, Math.min(100, ((predictedYield - minBoundary) / rangeSpan) * 100));
  const bandWidth = Math.max(2, highPercent - lowPercent);

  return (
    <div className="bg-[#181712] border border-[#3A3830] rounded-[2px] p-4 sm:p-5 space-y-3.5">
      {/* Header & Unit Switcher */}
      <div className="flex items-center justify-between">
        <span className="font-mono text-[#8C897C] text-xs sm:text-sm uppercase tracking-wider font-medium">
          Statistical Confidence Interval (95% CI)
        </span>

        {/* Unit Toggle */}
        <div className="flex items-center bg-[#14140F] border border-[#3A3830] rounded-[2px] text-xs font-mono">
          <button
            type="button"
            onClick={() => setUnit('t_ha')}
            className={`px-2.5 py-1 rounded-[1px] transition-colors ${
              unit === 't_ha'
                ? 'bg-[#3A3830] text-[#EDE8DD] font-semibold'
                : 'text-[#8C897C] hover:text-[#EDE8DD]'
            }`}
          >
            t/ha
          </button>
          <button
            type="button"
            onClick={() => setUnit('mds_acre')}
            className={`px-2.5 py-1 rounded-[1px] transition-colors ${
              unit === 'mds_acre'
                ? 'bg-[#3A3830] text-[#EDE8DD] font-semibold'
                : 'text-[#8C897C] hover:text-[#EDE8DD]'
            }`}
          >
            Mds/Ac
          </button>
        </div>
      </div>

      {/* Readout Numbers */}
      <div className="flex items-baseline justify-between text-xs sm:text-sm font-mono bg-[#14140F] px-3.5 py-2.5 rounded-[2px] border border-[#3A3830]">
        <span className="text-[#8C897C] text-xs sm:text-sm">Mean &amp; Interval Band:</span>
        <span className="text-[#C98A3D] font-semibold text-base sm:text-lg">
          {pyVal} <span className="text-[#8C897C] text-xs sm:text-sm font-normal">[{clVal} &ndash; {chVal}] {unitLabel}</span>
        </span>
      </div>

      {/* Flat Scientific Track */}
      <div className="relative pt-2 pb-1">
        {/* Track Base */}
        <div className="w-full h-2.5 bg-[#14140F] rounded-[1px] overflow-hidden border border-[#3A3830] relative">
          {/* Shaded 95% Confidence Band */}
          <div
            className="absolute top-0 bottom-0 bg-[#34445C] border-x border-[#8C897C]"
            style={{ left: `${lowPercent}%`, width: `${bandWidth}%` }}
          />
        </div>

        {/* Flat Pin Indicator */}
        <div
          className="absolute top-0 transform -translate-x-1/2 flex flex-col items-center pointer-events-none"
          style={{ left: `${predPercent}%` }}
        >
          <div className="w-3 h-3 bg-[#C98A3D] rounded-[1px] border border-[#14140F]"></div>
        </div>
      </div>

      {/* Axis Scale Markers */}
      <div className="flex justify-between text-xs font-mono text-[#8C897C] pt-1">
        <span>{(2.0 * unitMultiplier).toFixed(1)} (Min)</span>
        <span>{(3.6 * unitMultiplier).toFixed(1)} (Regional Avg)</span>
        <span>{(7.0 * unitMultiplier).toFixed(1)} (Peak Yield)</span>
      </div>
    </div>
  );
};
