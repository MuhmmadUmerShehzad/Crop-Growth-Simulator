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
      <div className="bg-[#181712] border border-[#3A3830] rounded-[2px] p-6 sm:p-7 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
          <div className="space-y-2">
            <span className="text-sm sm:text-base font-mono uppercase tracking-wider text-[#C5C2B8] font-semibold">
              Projected Yield Delta (vs. District Benchmark)
            </span>
            <div className="flex flex-col sm:flex-row sm:items-baseline gap-3 sm:gap-5">
              <span className={`text-6xl sm:text-7xl font-bold font-mono tracking-tight ${isPositive ? 'text-[#4A6741]' : 'text-[#D46B50]'}`}>
                {isPositive ? `+${(prediction.yield_vs_benchmark_pct ?? prediction.percent_increase).toFixed(1)}%` : `${(prediction.yield_vs_benchmark_pct ?? prediction.percent_increase).toFixed(1)}%`}
              </span>
              <span className="text-base sm:text-lg font-mono text-[#C5C2B8]">
                vs. Benchmark (<span className="font-mono text-[#EDE8DD] font-semibold">{prediction.district_benchmark_maund_acre?.toFixed(1) || (prediction.district_benchmark_t_ha ? (prediction.district_benchmark_t_ha * 10.12).toFixed(1) : '35.8')}</span> maund/acre)
              </span>
            </div>
          </div>

          <div className="text-left sm:text-right font-mono">
            <span className="text-[#C5C2B8] block text-sm sm:text-base">Phenology Growth</span>
            <span className="text-[#C98A3D] font-bold text-xl sm:text-2xl">
              {(prediction.growth_scale * 100).toFixed(0)}% SCALE
            </span>
          </div>
        </div>

        {/* Readout Columns with increased font sizes */}
        <div className="pt-5 border-t border-[#3A3830] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 font-mono">
          {/* Predicted Yield */}
          <div className="bg-[#14140F] p-3.5 rounded-[2px] border border-[#3A3830] flex flex-col justify-between space-y-1.5">
            <span className="text-[#C5C2B8] block text-xs sm:text-sm font-medium uppercase tracking-wide">
              Predicted Yield
            </span>
            <div>
              <div className="text-2xl sm:text-3xl font-bold font-mono text-[#EDE8DD] leading-none">
                {prediction.predicted_yield_maund_acre ? prediction.predicted_yield_maund_acre.toFixed(2) : (prediction.predicted_yield * 10.12).toFixed(2)}
              </div>
              <div className="text-xs text-[#C98A3D] font-mono font-semibold mt-1">maund/acre</div>
            </div>
            <div className="text-xs sm:text-sm text-[#A8A598] font-mono pt-1.5 border-t border-[#26251D]">
              {prediction.predicted_yield.toFixed(2)} t/ha
            </div>
          </div>

          {/* Fertilizer Protocol Effect */}
          <div className="bg-[#14140F] p-3.5 rounded-[2px] border border-[#3A3830] flex flex-col justify-between space-y-1.5">
            <span className="text-[#C5C2B8] block text-xs sm:text-sm font-medium uppercase tracking-wide">
              Fertilizer Effect
            </span>
            <div>
              <div className="text-2xl sm:text-3xl font-bold font-mono text-[#4A6741] leading-none">
                {prediction.fertilizer_effect_maund_acre !== undefined ? `${prediction.fertilizer_effect_maund_acre >= 0 ? '+' : ''}${prediction.fertilizer_effect_maund_acre.toFixed(2)}` : '+3.34'}
              </div>
              <div className="text-xs text-[#A8A598] font-mono font-semibold mt-1">maund/acre</div>
            </div>
            <div className="text-xs sm:text-sm text-[#A8A598] font-mono pt-1.5 border-t border-[#26251D]">
              {prediction.fertilizer_effect_t_ha !== undefined ? `${prediction.fertilizer_effect_t_ha >= 0 ? '+' : ''}${prediction.fertilizer_effect_t_ha.toFixed(2)} t/ha` : '+0.33 t/ha'}
            </div>
          </div>

          {/* District Benchmark */}
          <div className="bg-[#14140F] p-3.5 rounded-[2px] border border-[#3A3830] flex flex-col justify-between space-y-1.5">
            <span className="text-[#C5C2B8] block text-xs sm:text-sm font-medium uppercase tracking-wide">
              District Benchmark
            </span>
            <div>
              <div className="text-2xl sm:text-3xl font-bold font-mono text-[#EDE8DD] leading-none">
                {prediction.district_benchmark_maund_acre?.toFixed(2) || '35.75'}
              </div>
              <div className="text-xs text-[#A8A598] font-mono font-semibold mt-1">maund/acre</div>
            </div>
            <div className="text-xs sm:text-sm text-[#A8A598] font-mono pt-1.5 border-t border-[#26251D]">
              {prediction.district_benchmark_t_ha?.toFixed(2) || '3.53'} t/ha
            </div>
          </div>

          {/* Baseline Yield */}
          <div className="bg-[#14140F] p-3.5 rounded-[2px] border border-[#3A3830] flex flex-col justify-between space-y-1.5">
            <span className="text-[#C5C2B8] block text-xs sm:text-sm font-medium uppercase tracking-wide">
              Baseline Yield
            </span>
            <div>
              <div className="text-2xl sm:text-3xl font-bold font-mono text-[#EDE8DD] leading-none">
                {prediction.baseline_yield_maund_acre?.toFixed(2) || '37.23'}
              </div>
              <div className="text-xs text-[#A8A598] font-mono font-semibold mt-1">maund/acre</div>
            </div>
            <div className="text-xs sm:text-sm text-[#A8A598] font-mono pt-1.5 border-t border-[#26251D]">
              {prediction.baseline_yield_t_ha?.toFixed(2) || '3.68'} t/ha
            </div>
          </div>
        </div>

        {/* Protocol & Execution Mode Banner */}
        {(prediction.fertilizer_description || prediction.execution_mode) && (
          <div className="bg-[#14140F] border border-[#3A3830] p-4 rounded-[2px] text-sm sm:text-base font-mono flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            {prediction.fertilizer_description && (
              <div>
                <span className="text-[#C5C2B8] font-medium">REGIMEN: </span>
                <span className="text-[#EDE8DD] font-semibold">{prediction.fertilizer_description}</span>
              </div>
            )}
            {prediction.execution_mode && (
              <span className="text-[#C98A3D] border border-[#3A3830] px-3 py-1 rounded-[2px] bg-[#181712] font-semibold text-xs sm:text-sm">
                {prediction.execution_mode}
              </span>
            )}
          </div>
        )}

        {/* Ground-Truth Soil Profile Card */}
        {prediction.soil_profile && (
          <div className="bg-[#14140F] border border-[#3A3830] p-4 rounded-[2px] font-mono space-y-2.5">
            <span className="text-[#C5C2B8] uppercase tracking-wider block font-semibold text-xs sm:text-sm">
              Ground-Truth In-Situ Soil Profile &bull; Geospatial Telemetry
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm sm:text-base text-[#EDE8DD]">
              <div className="bg-[#181712] p-2 rounded-[2px] border border-[#3A3830]">
                <span className="text-[#A8A598] text-xs block">Soil pH</span>
                <span className="text-[#C98A3D] font-bold text-base sm:text-lg">{prediction.soil_profile.soil_pH}</span>
              </div>
              <div className="bg-[#181712] p-2 rounded-[2px] border border-[#3A3830]">
                <span className="text-[#A8A598] text-xs block">Clay Fraction</span>
                <span className="text-[#C98A3D] font-bold text-base sm:text-lg">{prediction.soil_profile.clay_pct}%</span>
              </div>
              <div className="bg-[#181712] p-2 rounded-[2px] border border-[#3A3830]">
                <span className="text-[#A8A598] text-xs block">Sand Fraction</span>
                <span className="text-[#C98A3D] font-bold text-base sm:text-lg">{prediction.soil_profile.sand_pct}%</span>
              </div>
              <div className="bg-[#181712] p-2 rounded-[2px] border border-[#3A3830]">
                <span className="text-[#A8A598] text-xs block">Water Content</span>
                <span className="text-[#C98A3D] font-bold text-base sm:text-lg">{prediction.soil_profile.soil_water_content_pct}%</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Backend Agronomic Advisory Callout (Only if genuine advice returned by backend) */}
      {prediction.advice && (
        <div className="bg-[#181712] border border-[#3A3830] rounded-[2px] p-5 space-y-2 font-mono">
          <div className="flex items-center justify-between text-xs sm:text-sm text-[#C98A3D] uppercase tracking-wider font-semibold">
            <span>[Agronomic Advisory &bull; Railway AI]</span>
            <span className="text-[#4A6741]">ACTIVE</span>
          </div>
          <p className="text-sm sm:text-base text-[#EDE8DD] font-sans leading-relaxed">
            {prediction.advice}
          </p>
        </div>
      )}

      {/* Confidence Gauge Component with dynamic crop boundaries */}
      <YieldGauge
        predictedYield={prediction.predicted_yield}
        predictedYieldMaundAcre={prediction.predicted_yield_maund_acre}
        confidenceLow={prediction.confidence_low}
        confidenceHigh={prediction.confidence_high}
        districtBenchmarkTonnes={prediction.district_benchmark_t_ha}
        districtBenchmarkMaundAcre={prediction.district_benchmark_maund_acre}
      />

      {/* Key Drivers List with Defensible Context Badges */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-mono font-semibold uppercase tracking-wider text-[#EDE8DD]">
            Agronomic Factor Attribution &bull; Model Drivers
          </h3>
          <span className="text-xs sm:text-sm font-mono text-[#8C897C]">[ML Telemetry Log]</span>
        </div>

        <div className="space-y-2.5 font-mono">
          {prediction.top_drivers.map((driver, index) => {
            const isFertilizer = driver.toLowerCase().includes('fertilizer');
            const isBenchmark = driver.toLowerCase().includes('benchmark');
            const isSoil = driver.toLowerCase().includes('soil');
            const badgeLabel = isFertilizer ? '+NUTRITION' : isBenchmark ? 'REGIONAL' : isSoil ? 'IN SITU' : 'INSIGHT';
            const badgeColor = isFertilizer ? 'text-[#4A6741] border-[#4A6741]/40' : isBenchmark ? 'text-[#C98A3D] border-[#C98A3D]/40' : 'text-[#8C897C] border-[#3A3830]';

            return (
              <div
                key={index}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#181712] border border-[#3A3830] rounded-[2px] px-4 py-3.5"
              >
                <div className="flex items-baseline gap-3.5">
                  <span className="text-[#C98A3D] font-mono text-sm sm:text-base select-none font-bold">
                    0{index + 1}.
                  </span>
                  <span className="text-[#EDE8DD] font-sans text-sm sm:text-base leading-relaxed">
                    {driver}
                  </span>
                </div>

                <span className={`text-xs font-mono border px-2.5 py-1 rounded-[2px] bg-[#14140F] whitespace-nowrap font-medium self-start sm:self-auto ${badgeColor}`}>
                  {badgeLabel}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
