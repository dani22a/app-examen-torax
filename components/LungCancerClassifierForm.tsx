"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import ImageSelector from "./ImageSelector";
import ModelSelector from "./ModelSelector";
import PredictionResultPanel from "./PredictionResultPanel";
import {
  predictVgg16,
  predictResnet,
  predictAll,
  getModels,
} from "@/lib/api";
import type { ModelOption } from "@/types/evaluation";
import type { PredictionResult, PredictAllResult } from "@/types/evaluation";

type ApiResult = PredictionResult | PredictAllResult;

function isPredictAllResult(
  r: ApiResult
): r is PredictAllResult {
  return "resumen_comparativo" in r;
}

export default function LungCancerClassifierForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedModel, setSelectedModel] = useState<ModelOption>("both");
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [result, setResult] = useState<ApiResult | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    getModels()
      .then((res) => setAvailableModels(res.data.modelos || []))
      .catch(() => setAvailableModels([]));
  }, []);

  useEffect(() => {
    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
    };
  }, [imageUrl]);

  const handleFileChange = (file: File | null) => {
    setSelectedFile(file);
  };

  const handleValidationError = (message: string | null) => {
    if (message) setError(message);
    else setError((prev) => (prev?.includes("JPG") ? null : prev));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setResult(null);
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl);
      setImageUrl(null);
    }

    if (!selectedFile) {
      setError("Debes seleccionar una imagen CT-Scan");
      return;
    }

    setLoading(true);

    try {
      let apiResult;
      if (selectedModel === "vgg16") {
        const res = await predictVgg16(selectedFile);
        apiResult = res.data;
      } else if (selectedModel === "resnet") {
        const res = await predictResnet(selectedFile);
        apiResult = res.data;
      } else {
        const res = await predictAll(selectedFile);
        apiResult = res.data;
      }

      setResult(apiResult);
      setSuccess(true);
      setImageUrl(URL.createObjectURL(selectedFile));
      setSelectedFile(null);

      if (isPredictAllResult(apiResult)) {
        toast.success(
          `Clasificación completada. Consenso: ${apiResult.resumen_comparativo.clase_consenso}`
        );
      } else {
        toast.success(
          `Clasificación completada. Resultado: ${apiResult.clase_predicha}`
        );
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error desconocido";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleNewAnalysis = () => {
    setSuccess(false);
    setResult(null);
    setSelectedFile(null);
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl);
      setImageUrl(null);
    }
  };

  const hasResult = success && result;

  return (
    <div
      className={`grid items-start gap-5 xl:gap-6 ${
        hasResult
          ? "grid-cols-1 xl:grid-cols-[minmax(0,1fr)_minmax(300px,360px)_minmax(320px,400px)]"
          : "grid-cols-1 xl:grid-cols-[minmax(0,1fr)_minmax(300px,380px)]"
      }`}
    >
      <div className="min-w-0 space-y-4">
        <div className="app-shell-panel overflow-hidden rounded-[26px]">
          <ImageSelector
            selectedFile={selectedFile}
            onFileChange={handleFileChange}
            onValidationError={handleValidationError}
            disabled={loading}
            error={error?.includes("JPG") ? error : null}
            imageUrl={imageUrl}
            onNewAnalysis={handleNewAnalysis}
          />
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="app-shell-panel space-y-4 rounded-[26px] p-1.5 xl:sticky xl:top-6 xl:self-start"
      >
        <div className="rounded-[22px] bg-linear-to-r from-brand-950 via-brand-900 to-brand-700 px-4 py-4 text-white">
          <p className="text-[10px] uppercase tracking-[0.26em] text-brand-100/75">
            Clasificación IA
          </p>
          <h2 className="mt-1.5 text-base font-semibold sm:text-lg">
            Cáncer de pulmón en CT-Scan
          </h2>
          <p className="mt-1.5 text-xs leading-5 text-brand-100/80">
            Sube una imagen de tomografía computarizada para clasificar entre
            adenocarcinoma, carcinoma de células grandes, normal o carcinoma de
            células escamosas usando VGG16 y ResNet50.
          </p>
        </div>

        <div className="space-y-3 rounded-[22px] border border-slate-100/80 bg-white/55 p-3.5">
          <ModelSelector
            value={selectedModel}
            onChange={setSelectedModel}
            disabled={loading}
            availableModels={availableModels}
          />
        </div>

        {error && !error.includes("JPG") && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-800">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !selectedFile}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_20px_40px_-25px_rgba(37,99,235,0.9)] transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-brand-600"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Clasificando...
            </>
          ) : (
            "Clasificar imagen"
          )}
        </button>

        {loading && (
          <p className="text-center text-xs text-slate-500">
            Analizando con el modelo seleccionado...
          </p>
        )}
      </form>

      {success && result && (
        <PredictionResultPanel result={result} />
      )}
    </div>
  );
}
