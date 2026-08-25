import React from 'react';
import { PredictionResponse } from '../../types/prediction';
import { YieldGauge } from './YieldGauge';

interface ResultsDashboardProps {
  prediction: PredictionResponse | null;
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({
  prediction,
  isLoading,
  error,
  onRetry,
}) => {
  // 1. Error State
  if (error) {
    return (
      <div className="p-6 sm:p-7 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#3A3830]">
          <span className="font-mono text-sm sm:text-base text-[#EDE8DD] uppercase font-semibold">
            [Inference Error &bull; Log Flag]
          </span>
        </div>
        <p className="text-sm text-[#8C897C] font-mono leading-relaxed">{error}</p>
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-[#181712] hover:bg-[#26251D] text-[#EDE8DD] text-sm font-mono rounded-[2px] border border-[#3A3830] transition-colors cursor-pointer"
        >
          Retry Calculation
        </button>
      </div>
    );
  }

  // 2. Loading State (Flat Skeleton)
  if (isLoading) {
    return (
      <div className="p-6 sm:p-7 space-y-4 font-mono text-sm text-[#8C897C]">
        <div className="flex justify-between items-center pb-3 border-b border-[#3A3830]">
          <span className="font-semibold text-[#EDE8DD]">COMPUTING PHENOLOGY INFERENCE...</span>
          <span className="animate-pulse text-[#C98A3D]">[RUNNING]</span>
        </div>
        <div className="h-24 bg-[#181712] border border-[#3A3830] rounded-[2px] flex items-center justify-center text-sm">
          <span>Processing regression models &bull; please wait</span>
        </div>
        <div className="h-20 bg-[#181712] border border-[#3A3830] rounded-[2px]"></div>
      </div>
    );
  }

  // 3. Initial Empty State
  if (!prediction) {
    return (
      <div className="p-7 text-center space-y-2.5 text-[#8C897C] font-mono text-sm">
        <p className="text-[#EDE8DD] font-semibold text-base uppercase">[No Record Active]</p>
        <p>Configure agronomic field inputs and execute simulation to populate yield log.</p>
      </div>
    );
  }

  // 4. Resolved State
  const isPositive = prediction.percent_increase >= 0;

  return (
    <div className="p-6 sm:p-7 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-[#3A3830]">
        <div>
          <h2 className="text-sm sm:text-base font-mono font-semibold text-[#EDE8DD] uppercase tracking-wider">
            [Inference Forecast &bull; Specimen Metrics]
          </h2>
          <p className="text-xs sm:text-sm text-[#8C897C] font-sans mt-1">
            Model output projection against regional baseline.
          </p>
        </div>
        <span className="text-xs sm:text-sm font-mono text-[#4A6741] border border-[#3A3830] px-3 py-1 rounded-[2px] bg-[#181712] font-medium">
          SYNTHESIZED
        </span>
      </div>

      {/* Primary Headline Record Box */}
      <div className="bg-[#181712] border border-[#3A3830] rounded-[2px] p-5 sm:p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3">
          <div className="space-y-1.5">
            <span className="text-xs sm:text-sm font-mono uppercase tracking-wider text-[#8C897C] font-medium">
              Projected Yield Delta (Headline Stat)
            </span>
            <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4">
              <span className={`text-5xl sm:text-6xl font-bold font-mono tracking-tight ${isPositive ? 'text-[#4A6741]' : 'text-[#8C897C]'}`}>
                {isPositive ? `+${prediction.percent_increase.toFixed(1)}%` : `${prediction.percent_increase.toFixed(1)}%`}
              </span>
              <span className="text-xs sm:text-sm font-mono text-[#8C897C]">
                vs. Regional Baseline (<span className="font-mono text-[#EDE8DD]">3.6</span> t/ha)
              </span>
            </div>
          </div>

          <div className="text-left sm:text-right font-mono">
            <span className="text-[#8C897C] block text-xs sm:text-sm">Morph Scale</span>
            <span className="text-[#C98A3D] font-semibold text-base sm:text-lg">
              {(prediction.growth_scale * 100).toFixed(0)}%
            </span>
          </div>
        </div>

        {/* Readout Columns */}
        <div className="pt-4 border-t border-[#3A3830] grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-sm font-mono">
          <div className="bg-[#14140F] p-3.5 rounded-[2px] border border-[#3A3830]">
            <span className="text-[#8C897C] block text-xs sm:text-sm">Predicted Yield:</span>
            <span className="text-lg sm:text-xl font-semibold text-[#EDE8DD]">
              {prediction.predicted_yield.toFixed(2)}{' '}
              <span className="text-sm text-[#8C897C] font-normal">t/ha</span>
            </span>
          </div>

          <div className="bg-[#14140F] p-3.5 rounded-[2px] border border-[#3A3830]">
            <span className="text-[#8C897C] block text-xs sm:text-sm">95% CI Range:</span>
            <span className="text-lg sm:text-xl font-semibold text-[#C98A3D]">
              {prediction.confidence_low.toFixed(1)} &ndash; {prediction.confidence_high.toFixed(1)}{' '}
              <span className="text-sm text-[#8C897C] font-normal">t/ha</span>
            </span>
          </div>
        </div>
      </div>

      {/* Backend Agronomic Advisory Callout (If returned by API) */}
      {prediction.advice && (
        <div className="bg-[#181712] border border-[#3A3830] rounded-[2px] p-4 space-y-1.5 font-mono">
          <div className="flex items-center justify-between text-xs text-[#C98A3D] uppercase tracking-wider font-semibold">
            <span>[Agronomic Advisory &bull; Railway AI]</span>
            <span className="text-[#4A6741]">ACTIVE</span>
          </div>
          <p className="text-xs sm:text-sm text-[#EDE8DD] font-sans leading-relaxed">
            {prediction.advice}
          </p>
        </div>
      )}

      {/* Confidence Gauge Component */}
      <YieldGauge
        predictedYield={prediction.predicted_yield}
        confidenceLow={prediction.confidence_low}
        confidenceHigh={prediction.confidence_high}
      />

      {/* Key Drivers List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm sm:text-base font-mono font-semibold uppercase tracking-wider text-[#8C897C]">
            Top Yield Factor Drivers
          </h3>
          <span className="text-xs font-mono text-[#8C897C]">[Attribution Log]</span>
        </div>

        <div className="space-y-2 font-mono text-sm">
          {prediction.top_drivers.map((driver, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-3 bg-[#181712] border border-[#3A3830] rounded-[2px] px-3.5 py-2.5"
            >
              <div className="flex items-baseline gap-3">
                <span className="text-[#C98A3D] font-mono text-xs sm:text-sm select-none font-semibold">
                  0{index + 1}.
                </span>
                <span className="text-[#EDE8DD] font-sans text-xs sm:text-sm">{driver}</span>
              </div>

              <span className="text-xs font-mono text-[#4A6741] whitespace-nowrap font-medium">
                +POSITIVE
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
