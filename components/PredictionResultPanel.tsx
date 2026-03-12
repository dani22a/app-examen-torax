"use client";

import type { PredictAllResult, PredictionResult } from "@/types/evaluation";

const CLASS_LABELS: Record<string, string> = {
  adenocarcinoma: "Adenocarcinoma",
  "large.cell.carcinoma": "Carcinoma de células grandes",
  normal: "Normal",
  "squamous.cell.carcinoma": "Carcinoma de células escamosas",
};

function formatClass(key: string): string {
  return CLASS_LABELS[key] ?? key;
}

function SingleModelResult({ result }: { result: PredictionResult }) {
  const isNormal = result.clase_predicha === "normal";
  const confianzaPct = (result.confianza * 100).toFixed(1);

  return (
    <div className="rounded-[22px] border border-slate-200 bg-white/80 p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500">
          {result.modelo.toUpperCase()}
        </span>
        <span
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
            isNormal
              ? "bg-green-100 text-green-800"
              : "bg-amber-100 text-amber-800"
          }`}
        >
          {formatClass(result.clase_predicha)}
        </span>
      </div>
      <p className="text-2xl font-bold text-slate-800 mb-3">
        {confianzaPct}% confianza
      </p>
      <div className="space-y-2">
        {Object.entries(result.todas_predicciones)
          .sort(([, a], [, b]) => b - a)
          .map(([clase, prob]) => (
            <div key={clase} className="flex items-center gap-2">
              <span className="text-xs text-slate-600 w-40 truncate">
                {formatClass(clase)}
              </span>
              <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-brand-500 transition-all"
                  style={{ width: `${prob * 100}%` }}
                />
              </div>
              <span className="text-xs font-medium text-slate-700 w-10 text-right">
                {(prob * 100).toFixed(0)}%
              </span>
            </div>
          ))}
      </div>
    </div>
  );
}

interface PredictionResultPanelProps {
  result: PredictAllResult | PredictionResult;
  title?: string;
  className?: string;
}

export default function PredictionResultPanel({
  result,
  title = "Resultado de clasificación",
  className = "",
}: PredictionResultPanelProps) {
  const isPredictAll = "resumen_comparativo" in result;
  const predictAllResult = result as PredictAllResult;

  return (
    <div
      className={`app-shell-panel max-h-[calc(100vh-6rem)] space-y-4 overflow-y-auto rounded-[26px] p-4 sm:p-5 xl:sticky xl:top-6 xl:self-start ${className}`}
    >
      <h3 className="text-base font-semibold text-slate-900 sm:text-lg">
        {title}
      </h3>

      {isPredictAll && predictAllResult.resumen_comparativo && (
        <div
          className={`p-4 rounded-[24px] border text-center ${
            predictAllResult.resumen_comparativo.consenso
              ? "bg-brand-50 border-brand-200"
              : "bg-amber-50 border-amber-200"
          }`}
        >
          <p
            className={`text-lg font-bold ${
              predictAllResult.resumen_comparativo.consenso
                ? "text-brand-700"
                : "text-amber-700"
            }`}
          >
            {predictAllResult.resumen_comparativo.consenso
              ? "Consenso entre modelos"
              : "Sin consenso entre modelos"}
          </p>
          <p className="mt-1 text-sm text-slate-600">
            Clase:{" "}
            {formatClass(predictAllResult.resumen_comparativo.clase_consenso)} ·{" "}
            Modelo más confiado:{" "}
            {predictAllResult.resumen_comparativo.modelo_mas_confiado.toUpperCase()}{" "}
            (
            {(predictAllResult.resumen_comparativo.confianza_maxima * 100).toFixed(
              1
            )}
            %)
          </p>
        </div>
      )}

      {isPredictAll && predictAllResult.resultados ? (
        <div className="space-y-4">
          {predictAllResult.resultados.vgg16 && (
            <SingleModelResult result={predictAllResult.resultados.vgg16} />
          )}
          {predictAllResult.resultados.resnet && (
            <SingleModelResult result={predictAllResult.resultados.resnet} />
          )}
        </div>
      ) : (
        <SingleModelResult result={result as PredictionResult} />
      )}
    </div>
  );
}
