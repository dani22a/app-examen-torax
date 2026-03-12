const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export interface ApiResponse<T> {
  data: T;
  status: string;
  message: string;
}

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

export interface HealthData {
  status: string;
  modelos_disponibles: string[];
}

export interface ModelsData {
  modelos: string[];
}

export interface ClassesData {
  clases: string[];
}

export async function predictVgg16(file: File): Promise<ApiResponse<PredictionResult>> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch(`${API_BASE}/evaluation/predict/vgg16`, {
    method: "POST",
    body: formData,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.detail || "Error en predicción VGG16");
  return json;
}

export async function predictResnet(file: File): Promise<ApiResponse<PredictionResult>> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch(`${API_BASE}/evaluation/predict/resnet`, {
    method: "POST",
    body: formData,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.detail || "Error en predicción ResNet");
  return json;
}

export async function predictAll(file: File): Promise<ApiResponse<PredictAllResult>> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch(`${API_BASE}/evaluation/predict`, {
    method: "POST",
    body: formData,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.detail || "Error en evaluación");
  return json;
}

export async function getHealth(): Promise<ApiResponse<HealthData>> {
  const res = await fetch(`${API_BASE}/health`);
  const json = await res.json();
  if (!res.ok) throw new Error(json.detail || "Error al verificar servicio");
  return json;
}

export async function getModels(): Promise<ApiResponse<ModelsData>> {
  const res = await fetch(`${API_BASE}/evaluation/models`);
  const json = await res.json();
  if (!res.ok) throw new Error(json.detail || "Error al obtener modelos");
  return json;
}

export async function getClasses(): Promise<ApiResponse<ClassesData>> {
  const res = await fetch(`${API_BASE}/evaluation/classes`);
  const json = await res.json();
  if (!res.ok) throw new Error(json.detail || "Error al obtener clases");
  return json;
}
