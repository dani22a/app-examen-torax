"use client";

import type { ModelOption } from "@/types/evaluation";

interface ModelSelectorProps {
  value: ModelOption;
  onChange: (value: ModelOption) => void;
  disabled?: boolean;
  availableModels?: string[];
}

const options: { value: ModelOption; label: string; description: string }[] = [
  {
    value: "both",
    label: "Ambos modelos",
    description: "VGG16 + ResNet50 con consenso",
  },
  {
    value: "vgg16",
    label: "VGG16",
    description: "Clasificación con red convolucional VGG16",
  },
  {
    value: "resnet",
    label: "ResNet50",
    description: "Clasificación con ResNet50",
  },
];

export default function ModelSelector({
  value,
  onChange,
  disabled = false,
  availableModels = ["vgg16", "resnet"],
}: ModelSelectorProps) {
  const isOptionAvailable = (opt: ModelOption) => {
    if (opt === "both") return availableModels.length >= 2;
    return availableModels.includes(opt);
  };

  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
        Modelo de clasificación
      </label>
      <div className="space-y-2">
        {options.map((opt) => {
          const available = isOptionAvailable(opt.value);
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => available && onChange(opt.value)}
              disabled={disabled || !available}
              className={`
                w-full rounded-xl border px-3.5 py-2.5 text-left text-sm transition-all
                ${value === opt.value
                  ? "border-brand-500 bg-brand-50 ring-2 ring-brand-500/30"
                  : "border-slate-200 bg-white/90 hover:border-brand-200 hover:bg-brand-50/50"
                }
                ${!available ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                ${disabled ? "opacity-60 cursor-not-allowed" : ""}
              `}
            >
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="font-semibold text-slate-800">{opt.label}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{opt.description}</p>
                </div>
                {value === opt.value && (
                  <span className="h-2.5 w-2.5 rounded-full bg-brand-500 shrink-0" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
