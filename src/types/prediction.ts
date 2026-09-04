export interface PredictionInputs {
  crop_type: string;            // Crop name (e.g. "Wheat", "Gram", "Maize (Autumn)", "Rapeseed & Mustard", "Jowar", "Sugarcane")
  crop_variety: string;         // Cultivar / variety label
  district: string;             // Punjab district name
  fertilizer_type: string;      // Fertilizer protocol (e.g. "Balanced NPK (15-15-15)")
  planting_date: string;        // Sowing date string
  farm_area?: number;
  soil_moisture?: number;
  rainfall?: number;
  humidity?: number;
  temperature?: number;
  nitrogen?: number;
  fertilizer_amount?: number;
}

export interface LiveSimulationResponse {
  status?: string;
  crop?: string;
  district?: string;
  year?: number;
  sowing_date?: string;
  season_group?: string;
  cultivar?: string;
  fertilizer_protocol?: string;
  fertilizer_description?: string;
  nutrients_applied_kg_ha?: {
    N: number;
    P2O5: number;
    K2O: number;
    S: number;
    Zn: number;
  };
  execution_mode?: string;
  ndvi_used?: number;
  soil_profile?: {
    clay_pct: number;
    sand_pct: number;
    soil_organic_carbon_g_kg: number;
    soil_pH: number;
    soil_water_content_pct: number;
  };
  baseline_yield_t_ha?: number;
  baseline_yield_maund_acre?: number;
  fertilizer_effect_t_ha?: number;
  fertilizer_effect_maund_acre?: number;
  predicted_yield_t_ha?: number;
  predicted_yield_maund_acre?: number;
  district_benchmark_t_ha?: number;
  district_benchmark_maund_acre?: number;
  yield_vs_benchmark_pct?: number;
  advice?: string;
  recommendations?: string[];
  limiting_factors?: string[];
}

export interface PredictionResponse {
  predicted_yield: number;                   // tonnes/ha (e.g. 4.01)
  predicted_yield_maund_acre: number;        // primary float for spawn/phenology function (e.g. 40.57)
  baseline_yield_maund_acre: number;         // maund/acre baseline
  fertilizer_effect_maund_acre: number;      // maund/acre fertilizer delta
  district_benchmark_maund_acre: number;     // maund/acre regional benchmark
  yield_vs_benchmark_pct: number;            // delta % vs benchmark
  percent_increase: number;                  // compatibility alias for delta %
  confidence_low: number;                    // 95% CI lower bound
  confidence_high: number;                   // 95% CI upper bound
  growth_scale: number;                      // 0.0 to 1.0, drives the 3D plant growth / model selection
  top_drivers: string[];                     // attribution insights
  baseline_yield_t_ha?: number;
  fertilizer_effect_t_ha?: number;
  district_benchmark_t_ha?: number;
  fertilizer_description?: string;
  execution_mode?: string;
  nutrients_applied_kg_ha?: {
    N: number;
    P2O5: number;
    K2O: number;
    S: number;
    Zn: number;
  };
  soil_profile?: {
    clay_pct: number;
    sand_pct: number;
    soil_organic_carbon_g_kg: number;
    soil_pH: number;
    soil_water_content_pct: number;
  };
  advice?: string;
}

export interface GrowthStageInfo {
  stage: string;
  dayRange: string;
  description: string;
}

