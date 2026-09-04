import React, { useMemo } from 'react';
import { RotateCcw } from 'lucide-react';
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

const CROP_VARIETIES: Record<string, VarietyMeta[]> = {
  'Wheat': [
    { value: 'Faisalabad-2008 / Inqilab', name: 'Faisalabad-2008 / Inqilab', category: 'High Rust Resistance', durationDays: '120-130', grainType: 'Amber Semi-Hard' },
    { value: 'Galaxy-2013', name: 'Galaxy-2013', category: 'High Tillering', durationDays: '125-135', grainType: 'Bold White' },
    { value: 'Akbar-2019', name: 'Akbar-2019', category: 'High Yield Climate Resilient', durationDays: '115-125', grainType: 'White Hard' },
    { value: 'Dilkash-2020', name: 'Dilkash-2020', category: 'Heat Tolerant', durationDays: '120-128', grainType: 'Medium Hard' },
    { value: 'Ufaq-2022', name: 'Ufaq-2022', category: 'Early Maturing', durationDays: '110-118', grainType: 'Dense Grain' },
  ],
  'Gram': [
    { value: 'Bittal-98', name: 'Bittal-98', category: 'Desi Gram', durationDays: '140-150', grainType: 'Brown Angular' },
    { value: 'Punjab-2008', name: 'Punjab-2008', category: 'Wilt Resistant', durationDays: '135-145', grainType: 'Medium Desi' },
    { value: 'Noor-2009', name: 'Noor-2009', category: 'Kabuli High Yield', durationDays: '140-150', grainType: 'Bold White Kabuli' },
    { value: 'Bhakkar-2011', name: 'Bhakkar-2011', category: 'Drought Tolerant', durationDays: '130-140', grainType: 'Desi Brown' },
    { value: 'NIAB-CH-2016', name: 'NIAB-CH-2016', category: 'Blight Resistant', durationDays: '135-142', grainType: 'Semi-Kabuli' },
  ],
  'Maize (Autumn)': [
    { value: 'Pioneer 30Y87', name: 'Pioneer 30Y87', category: 'Commercial Hybrid', durationDays: '100-110', grainType: 'Yellow Dent' },
    { value: 'DK-6789 Hybrid', name: 'DK-6789 Hybrid', category: 'High Kernel Weight', durationDays: '105-115', grainType: 'Flint-Dent' },
    { value: 'Monsanto 8441', name: 'Monsanto 8441', category: 'Heat Resilient Hybrid', durationDays: '95-105', grainType: 'Deep Orange' },
    { value: 'Sultan White', name: 'Sultan White', category: 'Open Pollinated', durationDays: '90-100', grainType: 'White Flint' },
  ],
  'Rapeseed & Mustard': [
    { value: 'Khanpur Raya', name: 'Khanpur Raya', category: 'High Oil Raya', durationDays: '130-140', grainType: 'Bold Brown Seed' },
    { value: 'Super Canola', name: 'Super Canola', category: 'Low Erucic Acid', durationDays: '120-130', grainType: 'High Oleic Canola' },
    { value: 'Rohi Sarson', name: 'Rohi Sarson', category: 'Drought Tolerant Mustard', durationDays: '110-120', grainType: 'Small Dark Seed' },
    { value: 'Faisal Canola', name: 'Faisal Canola', category: 'High Biomass Canola', durationDays: '125-135', grainType: 'Medium Seed' },
  ],
  'Jowar': [
    { value: 'JS-2002', name: 'JS-2002', category: 'Sweet Stem Sorghum', durationDays: '95-105', grainType: 'High Sucrose Forage' },
    { value: 'Hegari Jowar', name: 'Hegari Jowar', category: 'Dual Purpose Grain/Fodder', durationDays: '90-100', grainType: 'White Chalky Grain' },
    { value: 'JS-263', name: 'JS-263', category: 'High Dry Matter', durationDays: '100-110', grainType: 'Cream White' },
  ],
  'Sugarcane': [
    { value: 'CPF-249 High Sucrose', name: 'CPF-249 High Sucrose', category: 'High Sugar Recovery', durationDays: '330-360', grainType: 'Dense Thick Stalk' },
    { value: 'HSF-240 Standard', name: 'HSF-240 Standard', category: 'Frost Tolerant Commercial', durationDays: '340-360', grainType: 'High Cane Yield' },
    { value: 'CPF-252 Early', name: 'CPF-252 Early', category: 'Early Maturing Sucrose', durationDays: '300-330', grainType: 'Medium Heavy Cane' },
  ],
};

interface FertilizerMeta {
  n: number;
  p: number;
  k: number;
  formula: string;
}

const FERTILIZER_DATA: Record<string, FertilizerMeta> = {
  'Balanced NPK (15-15-15)': { n: 33, p: 33, k: 34, formula: 'Balanced NPK (15-15-15)' },
  'High Nitrogen (Urea + DAP)': { n: 60, p: 35, k: 5, formula: 'High Nitrogen (Urea + DAP)' },
  'Potash Heavy (SOP + Urea)': { n: 25, p: 25, k: 50, formula: 'Potash Heavy (SOP + Urea)' },
  'Zinc Fortified Blend': { n: 55, p: 25, k: 20, formula: 'Zinc Fortified Blend' },
  'No Fertilizer (Control)': { n: 0, p: 0, k: 0, formula: 'No Fertilizer (Control)' },
};

export const SimulatorForm: React.FC<SimulatorFormProps> = ({
  inputs,
  onChange,
  onSubmit,
  isLoading,
}) => {
  const { showToast } = useToast();

  const selectedCrop = inputs.crop_type || 'Wheat';

  // Filter districts strictly to places where this crop is grown in the Punjab CSV dataset
  const availableDistricts = useMemo(() => {
    return CROP_DISTRICT_MAP[selectedCrop] || CROP_DISTRICT_MAP['Wheat'] || [];
  }, [selectedCrop]);

  // Handle Crop change with dynamic district validation
  const handleCropChange = (newCrop: string) => {
    const validDistricts = CROP_DISTRICT_MAP[newCrop] || [];
    let updatedDistrict = inputs.district;

    // If current district is not valid for the new crop, switch to the first valid district
    if (!validDistricts.includes(inputs.district) && validDistricts.length > 0) {
      updatedDistrict = validDistricts[0];
    }

    const defaultVariety = CROP_VARIETIES[newCrop]?.[0]?.value || 'Standard Cultivar';

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

  const handleReset = () => {
    onChange({
      crop_type: 'Wheat',
      crop_variety: 'Faisalabad-2008 / Inqilab',
      district: 'Faisalabad',
      fertilizer_type: 'Balanced NPK (15-15-15)',
      planting_date: '2025-11-15',
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

  const currentClimate = DISTRICT_CLIMATE[inputs.district] || DISTRICT_CLIMATE['Faisalabad'] || DISTRICT_CLIMATE['Gujranwala'];
  const currentFertilizer = FERTILIZER_DATA[inputs.fertilizer_type] || FERTILIZER_DATA['Balanced NPK (15-15-15)'];
  const cropMeta = CROP_METADATA[selectedCrop] || CROP_METADATA['Wheat'];
  const historicalBaseline = CROP_DISTRICT_AVG_YIELD[`${selectedCrop}:::${inputs.district}`] || cropMeta?.avgYieldTonnes || 3.13;

  const currentVarieties = CROP_VARIETIES[selectedCrop] || [
    { value: inputs.crop_variety, name: inputs.crop_variety, category: 'Standard', durationDays: '120', grainType: 'Standard' }
  ];

  return (
    <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-6">
      {/* Form Top Header & Reset */}
      <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#3A3830]">
        <div>
          <h2 className="text-sm sm:text-base font-mono font-semibold text-[#EDE8DD] uppercase tracking-wider">
            [Field Ledger &bull; Specimen Entry]
          </h2>
          <p className="text-xs text-[#8C897C] font-sans mt-0.5">
            Ground-truth Punjab survey &bull; 6 verified model crop baselines
          </p>
        </div>

        <button
          type="button"
          onClick={handleReset}
          disabled={isLoading}
          className="text-xs font-mono px-2.5 py-1 rounded-[2px] bg-[#181712] hover:bg-[#26251D] border border-[#3A3830] hover:border-[#8C897C] text-[#8C897C] hover:text-[#EDE8DD] transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
          title="Reset parameters to baseline"
        >
          <RotateCcw className="w-3 h-3 text-[#8C897C]" />
          <span>Reset</span>
        </button>
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
                      {cropName} &bull; {meta?.season || 'Season'} ({distCount} districts)
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          {/* Cultivar / Variety Row for selected crop */}
          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#14140F]/60 p-2.5 rounded-[2px] border border-[#3A3830]">
            <div className="text-xs sm:text-sm font-sans text-[#8C897C]">
              <span>Cultivar / variety</span>
              <span className="text-[11px] font-mono text-[#8C897C] ml-1.5">(descriptor)</span>
            </div>
            <select
              value={inputs.crop_variety}
              onChange={(e) => handleChange('crop_variety', e.target.value)}
              disabled={isLoading}
              className="w-full sm:w-64 bg-[#181712] border border-[#3A3830] text-[#EDE8DD] rounded-[2px] px-2.5 py-1.5 text-xs font-mono focus:outline-none focus:border-[#4A6741] transition-colors cursor-pointer"
            >
              {currentVarieties.map((v) => (
                <option key={v.value} value={v.value} className="bg-[#181712] text-[#EDE8DD] font-mono">
                  {v.name} &bull; {v.durationDays}d
                </option>
              ))}
            </select>
          </div>
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
