export interface PredictionResult {
  modelo: string;
  clase_predicha: string;
  confianza: number;
  todas_predicciones: Record<string, number>;
}

export interface PredictAllResult {
  resultados: {
    vgg16?: PredictionResult;
    resnet?: PredictionResult;
  };
  resumen_comparativo: {
    consenso: boolean;
    clase_consenso: string;
    modelo_mas_confiado: string;
    confianza_maxima: number;
  };
}

export type ModelOption = "vgg16" | "resnet" | "both";
