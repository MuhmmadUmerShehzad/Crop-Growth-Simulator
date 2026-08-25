import React, { useMemo } from 'react';
import { PredictionInputs } from '../../types/prediction';
import { useToast } from '../common/Toast';
import {
  ALL_CROPS,
  CROP_DISTRICT_MAP,
  CROP_METADATA,
  CROP_DISTRICT_AVG_YIELD,
  DISTRICT_CLIMATE,
} from '../../data/punjabCropData';

interface SimulatorFormProps {
  inputs: PredictionInputs;
  onChange: (inputs: PredictionInputs) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

interface VarietyMeta {
  value: string;
  name: string;
  category: string;
  durationDays: string;
  grainType: string;
}

const RICE_VARIETIES: VarietyMeta[] = [
  { value: 'Super Basmati', name: 'Super Basmati', category: 'Fine Aromatic', durationDays: '115-120', grainType: 'Extra Long Fine' },
  { value: 'Basmati-515', name: 'Basmati-515', category: 'Export Grade', durationDays: '110-115', grainType: 'High Head Recovery' },
  { value: 'IRRI-6', name: 'IRRI-6', category: 'Coarse Hybrid', durationDays: '125-130', grainType: 'High Biomass' },
  { value: 'KS-282', name: 'KS-282', category: 'Stress Tolerant', durationDays: '120-125', grainType: 'High Nitrogen Response' },
  { value: 'PK-386', name: 'PK-386', category: 'Commercial Non-Basmati', durationDays: '105-110', grainType: 'Medium Slender' },
];

interface FertilizerMeta {
  n: number;
  p: number;
  k: number;
  formula: string;
}

const FERTILIZER_DATA: Record<string, FertilizerMeta> = {
  'NPK 15-15-15 Balanced': { n: 33, p: 33, k: 34, formula: 'Balanced NPK (15-15-15)' },
  'Urea + DAP Standard': { n: 60, p: 35, k: 5, formula: 'High Nitrogen (Urea+DAP)' },
  'SOP Enhanced Potash': { n: 25, p: 25, k: 50, formula: 'Potash Heavy (SOP)' },
  'Zinc Fortified Urea Blend': { n: 55, p: 25, k: 20, formula: 'Zinc Fortified Blend' },
};

const PRESETS = [
  {
    label: 'Rice / Super Basmati',
    inputs: {
      crop_type: 'Rice',
      crop_variety: 'Super Basmati',
      district: 'Gujranwala',
      fertilizer_type: 'NPK 15-15-15 Balanced',
      planting_date: '2026-06-15',
    },
  },
  {
    label: 'Wheat / Inqilab',
    inputs: {
      crop_type: 'Wheat',
      crop_variety: 'Faisalabad-2008 / Inqilab',
      district: 'Faisalabad',
      fertilizer_type: 'Urea + DAP Standard',
      planting_date: '2026-11-10',
    },
  },
  {
    label: 'Cotton / Bt Hybrid',
    inputs: {
      crop_type: 'Cotton',
      crop_variety: 'Bt Hybrid Specimen',
      district: 'Multan',
      fertilizer_type: 'Zinc Fortified Urea Blend',
      planting_date: '2026-05-15',
    },
  },
];

export const SimulatorForm: React.FC<SimulatorFormProps> = ({
  inputs,
  onChange,
  onSubmit,
  isLoading,
}) => {
  const { showToast } = useToast();

  const selectedCrop = inputs.crop_type || 'Rice';

  // Filter districts strictly to places where this crop is grown in the Punjab CSV dataset
  const availableDistricts = useMemo(() => {
    return CROP_DISTRICT_MAP[selectedCrop] || CROP_DISTRICT_MAP['Rice'] || [];
  }, [selectedCrop]);

  // Handle Crop change with dynamic district validation
  const handleCropChange = (newCrop: string) => {
    const validDistricts = CROP_DISTRICT_MAP[newCrop] || [];
    let updatedDistrict = inputs.district;

    // If current district is not valid for the new crop, switch to the first valid district
    if (!validDistricts.includes(inputs.district) && validDistricts.length > 0) {
      updatedDistrict = validDistricts[0];
    }

    const defaultVariety = newCrop === 'Rice' ? 'Super Basmati' : `${newCrop} Standard Cultivar`;

    onChange({
      ...inputs,
      crop_type: newCrop,
      crop_variety: defaultVariety,
      district: updatedDistrict,
    });

    showToast({
      title: `Crop selected: ${newCrop}`,
      description: `${validDistricts.length} verified cultivation districts in Punjab`,
      type: 'info',
      duration: 3000,
    });
  };

  const handleChange = (field: keyof PredictionInputs, value: string) => {
    onChange({ ...inputs, [field]: value });
  };

  const applyPreset = (presetInputs: PredictionInputs, label: string) => {
    onChange(presetInputs);
    showToast({
      title: 'Preset applied',
      description: `${label} (${presetInputs.district} district)`,
      type: 'success',
      duration: 3000,
    });
  };

  const handleReset = () => {
    onChange({
      crop_type: 'Rice',
      crop_variety: 'Super Basmati',
      district: 'Gujranwala',
      fertilizer_type: 'NPK 15-15-15 Balanced',
      planting_date: '2026-06-15',
    });
    showToast({
      title: 'Parameters reset',
      description: 'Restored baseline field ledger values',
      type: 'info',
      duration: 2500,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  const currentClimate = DISTRICT_CLIMATE[inputs.district] || DISTRICT_CLIMATE['Gujranwala'];
  const currentFertilizer = FERTILIZER_DATA[inputs.fertilizer_type] || FERTILIZER_DATA['NPK 15-15-15 Balanced'];
  const cropMeta = CROP_METADATA[selectedCrop] || CROP_METADATA['Rice'];
  const historicalBaseline = CROP_DISTRICT_AVG_YIELD[`${selectedCrop}:::${inputs.district}`] || cropMeta?.avgYieldTonnes || 3.6;

  return (
    <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-6">
      {/* Form Top Metadata & Presets */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3.5 pb-4 border-b border-[#3A3830]">
        <div>
          <h2 className="text-sm sm:text-base font-mono font-semibold text-[#EDE8DD] uppercase tracking-wider">
            [Field Ledger &bull; Specimen Entry]
          </h2>
          <p className="text-xs sm:text-sm text-[#8C897C] font-sans mt-1">
            Ground-truth crop survey &bull; 50 Punjab crops dynamically linked to verified districts.
          </p>
        </div>

        {/* Presets & Reset */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-mono text-[#8C897C] uppercase mr-1">Presets:</span>
          {PRESETS.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => applyPreset(p.inputs, p.label)}
              className="text-xs sm:text-sm font-mono px-3 py-1 rounded-[2px] bg-[#181712] hover:bg-[#26251D] border border-[#3A3830] text-[#EDE8DD] hover:text-[#C98A3D] transition-colors cursor-pointer"
            >
              {p.label}
            </button>
          ))}
          <button
            type="button"
            onClick={handleReset}
            disabled={isLoading}
            className="text-xs sm:text-sm font-mono px-3 py-1 rounded-[2px] bg-[#181712] hover:bg-[#26251D] border border-[#3A3830] text-[#8C897C] hover:text-[#EDE8DD] transition-colors cursor-pointer ml-1"
            title="Reset to Baseline"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Ledger Input Rows */}
      <div className="space-y-0">
        {/* Row 01: Crop Selection (from Punjab CSV Ground Truth) */}
        <div className="py-4 border-b border-[#3A3830] space-y-2">
          <div className="flex items-center justify-between">
            <div className="font-mono text-xs uppercase tracking-wider text-[#C98A3D] font-semibold">
              sample 01 &mdash; crop name
            </div>
            <span className="text-xs font-mono text-[#8C897C]">
              {cropMeta?.season} Season &bull; {cropMeta?.avgYieldTonnes} t/ha avg
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-sm sm:text-base font-sans text-[#EDE8DD]">
              <span>Crop selection</span>
              <span className="text-[#8C897C] text-xs sm:text-sm ml-2.5">
                ({availableDistricts.length} cultivation districts in Punjab)
              </span>
            </div>

            <div className="flex items-center gap-2 sm:max-w-xs w-full sm:w-auto">
              <select
                value={selectedCrop}
                onChange={(e) => handleCropChange(e.target.value)}
                disabled={isLoading}
                className="w-full sm:w-72 bg-[#181712] border border-[#3A3830] text-[#EDE8DD] rounded-[2px] px-3 py-2 text-xs sm:text-sm font-mono focus:outline-none focus:border-[#4A6741] transition-colors cursor-pointer text-right sm:text-left"
              >
                {ALL_CROPS.map((cropName) => {
                  const meta = CROP_METADATA[cropName];
                  const distCount = CROP_DISTRICT_MAP[cropName]?.length || 0;
                  return (
                    <option key={cropName} value={cropName} className="bg-[#181712] text-[#EDE8DD] font-mono">
                      {cropName} &bull; {meta?.season || 'Kharif'} ({distCount} districts)
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          {/* Sub-variety row if Rice is selected */}
          {selectedCrop === 'Rice' && (
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#14140F]/60 p-2.5 rounded-[2px] border border-[#3A3830]">
              <div className="text-xs sm:text-sm font-sans text-[#8C897C]">
                <span>Rice variety / cultivar</span>
              </div>
              <select
                value={inputs.crop_variety}
                onChange={(e) => handleChange('crop_variety', e.target.value)}
                disabled={isLoading}
                className="w-full sm:w-64 bg-[#181712] border border-[#3A3830] text-[#EDE8DD] rounded-[2px] px-2.5 py-1.5 text-xs font-mono focus:outline-none focus:border-[#4A6741] transition-colors cursor-pointer"
              >
                {RICE_VARIETIES.map((v) => (
                  <option key={v.value} value={v.value} className="bg-[#181712] text-[#EDE8DD] font-mono">
                    {v.name} &bull; {v.durationDays}d ({v.category})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Row 02: Location / District (Filtered to places where selected crop is grown) */}
        <div className="py-4 border-b border-[#3A3830] space-y-2">
          <div className="flex items-center justify-between">
            <div className="font-mono text-xs uppercase tracking-wider text-[#C98A3D] font-semibold">
              sample 02 &mdash; district location (filtered)
            </div>
            <span className="text-xs font-mono text-[#4A6741]">
              [FILTERED FOR {selectedCrop.toUpperCase()}]
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-sm sm:text-base font-sans text-[#EDE8DD]">
              <span>District place</span>
              <span className="text-[#8C897C] text-xs sm:text-sm ml-2.5">
                ({currentClimate.soil} &bull; {historicalBaseline} t/ha benchmark)
              </span>
            </div>

            <div className="flex items-center gap-2 sm:max-w-xs w-full sm:w-auto">
              <select
                value={inputs.district}
                onChange={(e) => handleChange('district', e.target.value)}
                disabled={isLoading}
                className="w-full sm:w-72 bg-[#181712] border border-[#3A3830] text-[#EDE8DD] rounded-[2px] px-3 py-2 text-xs sm:text-sm font-mono focus:outline-none focus:border-[#4A6741] transition-colors cursor-pointer text-right sm:text-left"
              >
                {availableDistricts.map((d) => {
                  const climate = DISTRICT_CLIMATE[d];
                  const y = CROP_DISTRICT_AVG_YIELD[`${selectedCrop}:::${d}`] || historicalBaseline;
                  return (
                    <option key={d} value={d} className="bg-[#181712] text-[#EDE8DD] font-mono">
                      {d} &bull; {climate?.tempC || 32}&deg;C ({y} t/ha)
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
        </div>

        {/* Row 03: Fertilizer Formulation */}
        <div className="py-4 border-b border-[#3A3830] space-y-2">
          <div className="font-mono text-xs uppercase tracking-wider text-[#C98A3D] font-semibold">
            sample 03 &mdash; fertilizer regime
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-sm sm:text-base font-sans text-[#EDE8DD]">
              <span>Fertilizer protocol</span>
              <span className="text-[#8C897C] text-xs sm:text-sm ml-2.5 font-mono tabular-nums">
                [N:<span className="font-mono">{currentFertilizer.n}</span> P:<span className="font-mono">{currentFertilizer.p}</span> K:<span className="font-mono">{currentFertilizer.k}</span>]
              </span>
            </div>

            <div className="flex items-center gap-2 sm:max-w-xs w-full sm:w-auto">
              <select
                value={inputs.fertilizer_type}
                onChange={(e) => handleChange('fertilizer_type', e.target.value)}
                disabled={isLoading}
                className="w-full sm:w-72 bg-[#181712] border border-[#3A3830] text-[#EDE8DD] rounded-[2px] px-3 py-2 text-xs sm:text-sm font-mono focus:outline-none focus:border-[#4A6741] transition-colors cursor-pointer text-right sm:text-left"
              >
                {Object.keys(FERTILIZER_DATA).map((f) => (
                  <option key={f} value={f} className="bg-[#181712] text-[#EDE8DD] font-mono">
                    {FERTILIZER_DATA[f].formula}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Grayscale Thin N-P-K Ratio Bar */}
          <div className="pt-1.5 space-y-1.5">
            <div className="w-full h-1.5 bg-[#14140F] rounded-[1px] flex overflow-hidden border border-[#3A3830]">
              <div style={{ width: `${currentFertilizer.n}%` }} className="bg-[#EDE8DD]" title={`Nitrogen: ${currentFertilizer.n}%`} />
              <div style={{ width: `${currentFertilizer.p}%` }} className="bg-[#8C897C]" title={`Phosphorus: ${currentFertilizer.p}%`} />
              <div style={{ width: `${currentFertilizer.k}%` }} className="bg-[#4A6741]" title={`Potassium: ${currentFertilizer.k}%`} />
            </div>
            <div className="flex justify-between text-xs font-mono text-[#8C897C]">
              <span>N: {currentFertilizer.n}%</span>
              <span>P: {currentFertilizer.p}%</span>
              <span>K: {currentFertilizer.k}%</span>
            </div>
          </div>
        </div>

        {/* Row 04: Sowing Date (Last row: no divider after it) */}
        <div className="py-4 space-y-2">
          <div className="font-mono text-xs uppercase tracking-wider text-[#C98A3D] font-semibold">
            sample 04 &mdash; sowing date
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-sm sm:text-base font-sans text-[#EDE8DD]">
              <span>Planting calendar</span>
              <span className="text-[#8C897C] text-xs sm:text-sm ml-2.5 font-mono">
                {cropMeta?.season || 'Kharif'} Window
              </span>
            </div>

            <div className="flex items-center gap-2 sm:max-w-xs w-full sm:w-auto">
              <input
                type="date"
                value={inputs.planting_date}
                onChange={(e) => handleChange('planting_date', e.target.value)}
                disabled={isLoading}
                className="w-full sm:w-72 bg-[#181712] border border-[#3A3830] text-[#EDE8DD] rounded-[2px] px-3 py-2 text-xs sm:text-sm font-mono focus:outline-none focus:border-[#4A6741] transition-colors text-right"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Primary Submit Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#4A6741] hover:bg-[#3D5536] text-[#EDE8DD] font-sans text-sm sm:text-base font-medium py-3.5 px-4 rounded-[2px] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-center"
        >
          {isLoading ? (
            <span>Simulating growth &amp; forecasting yield...</span>
          ) : (
            <span>Simulate growth &amp; forecast yield</span>
          )}
        </button>
      </div>
    </form>
  );
};
