export interface PredictionInputs {
  crop_type: string;            // Crop name selected from Punjab dataset (e.g. "Rice", "Wheat", "Cotton")
  crop_variety: string;         // Crop variety / cultivar (e.g. "Super Basmati", "IRRI-6")
  district: string;             // Filtered district / place where crop is grown
  fertilizer_type: string;      // Nutrient formulation protocol
  planting_date: string;        // Sowing date ISO string
  // Live Railway FastAPI schema parameters
  farm_area?: number;
  soil_moisture?: number;
  rainfall?: number;
  humidity?: number;
  temperature?: number;
  nitrogen?: number;
  fertilizer_amount?: number;
}

export interface LiveSimulationResponse {
  input_received?: Record<string, unknown>;
  simulation?: {
    predicted_yield_tonnes_per_ha?: number;
  };
  advice?: string;
}

export interface PredictionResponse {
  predicted_yield: number;      // tonnes/ha (e.g. 4.5)
  percent_increase: number;     // percentage yield increase vs baseline (e.g. 12.4%)
  confidence_low: number;       // tonnes/ha (e.g. 4.1)
  confidence_high: number;      // tonnes/ha (e.g. 4.9)
  growth_scale: number;         // 0.0 to 1.0, drives the 3D morph target / scale
  top_drivers: string[];        // 2-3 short strings
  advice?: string;              // Direct advisory string from ML backend
}

export interface GrowthStageInfo {
  stage: string;
  dayRange: string;
  description: string;
}
