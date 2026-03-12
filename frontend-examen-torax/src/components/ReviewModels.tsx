'use client';

import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { CheckCircle2, XCircle, Info, Activity } from 'lucide-react';
import MermaidDiagram from './MermaidDiagram';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

export default function ReviewModels() {
    const [activeTab, setActiveTab] = useState<'general' | 'reporte'>('general');

    const chartData = {
        labels: Array.from({ length: 20 }, (_, i) => `Ep ${i + 1}`),
        datasets: [
            {
                label: 'ResNet Valid Accuracy (Sin Augmentation)',
                data: [40, 55, 68, 75, 80, 83, 85, 84, 85, 86, 85, 86, 84, 85, 86, 85, 86, 84, 85, 85],
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4,
                borderWidth: 3,
                pointRadius: 4,
                pointBackgroundColor: '#0b0f19',
                fill: true,
            },
            {
                label: 'VGG16 Valid Accuracy (Con Augmentation)',
                data: [35, 45, 55, 62, 70, 75, 78, 80, 82, 84, 85, 86, 87, 88, 89, 89, 90, 91, 91, 92],
                borderColor: '#8b5cf6',
                backgroundColor: 'rgba(139, 92, 246, 0.1)',
                tension: 0.4,
                borderWidth: 3,
                pointRadius: 4,
                pointBackgroundColor: '#0b0f19',
                fill: true,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: 'index' as const,
            intersect: false,
        },
        scales: {
            y: {
                min: 30,
                max: 100,
                grid: { color: 'rgba(255,255,255,0.05)', drawBorder: false },
                ticks: { color: '#94a3b8', padding: 10 },
            },
            x: {
                grid: { display: false, drawBorder: false },
                ticks: { color: '#94a3b8', padding: 10 },
            },
        },
        plugins: {
            legend: {
                labels: { color: '#e2e8f0', usePointStyle: true, boxWidth: 8, padding: 20 },
                position: 'top' as const,
            },
            tooltip: {
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                titleColor: '#fff',
                bodyColor: '#cbd5e1',
                borderColor: 'rgba(255,255,255,0.1)',
                borderWidth: 1,
                padding: 12,
            },
        },
    };

    const mermaidChart = `
    graph TD
        subgraph "ResNet50 - PyTorch"
            A1[Dataset] --> B1[Resize 224x224 <br/>Normalización]
            B1 --> C1[Base ResNet50: <br/>Congelada]
            C1 --> D1[Head: Red Profunda <br/>2048->256->64->32->4]
        end

        subgraph "VGG16 - TensorFlow"
            A2[Dataset] --> B2[Data Augmentation: <br/>Rotación, Zoom, Flip]
            B2 --> C2[Base VGG16: <br/>Últimas 8 capas libres]
            C2 --> D2[Head: BatchNorm + <br/>Dropout agresivo]
        end
        
        style C1 fill:#1e293b,stroke:#3b82f6,color:#fff,stroke-width:2px
        style C2 fill:#1e293b,stroke:#8b5cf6,color:#fff,stroke-width:2px
        style D1 fill:#0f172a,stroke:#3b82f6,color:#e2e8f0
        style D2 fill:#0f172a,stroke:#8b5cf6,color:#e2e8f0
        style B1 fill:#0f172a,stroke:#475569,color:#e2e8f0
        style B2 fill:#0f172a,stroke:#475569,color:#e2e8f0
  `;

    return (
        <div className="max-w-7xl mx-auto flex flex-col items-center">
            <header className="text-center mb-12 flex flex-col items-center">
                <Activity className="w-16 h-16 text-blue-500 mb-4 drop-shadow-lg" />
                <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-br from-blue-500 to-purple-500 bg-clip-text text-transparent mb-2">
                    Comparativa de Modelos
                </h1>
                <p className="text-slate-400 text-lg">
                    Clasificación de Cáncer de Pecho: ResNet50 (PyTorch) vs VGG16 (Keras)
                </p>
            </header>

            <div className="flex justify-center gap-4 mb-8">
                <button
                    onClick={() => setActiveTab('general')}
                    className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 backdrop-blur-md ${activeTab === 'general'
                            ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/30'
                            : 'bg-white/5 text-slate-200 border border-white/10 hover:bg-white/10 hover:-translate-y-1'
                        }`}
                >
                    Vista General
                </button>
                <button
                    onClick={() => setActiveTab('reporte')}
                    className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 backdrop-blur-md ${activeTab === 'reporte'
                            ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/30'
                            : 'bg-white/5 text-slate-200 border border-white/10 hover:bg-white/10 hover:-translate-y-1'
                        }`}
                >
                    Vista Reporte Detallado
                </button>
            </div >

            <div className="w-full transition-opacity duration-500">
                {activeTab === 'general' ? (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            {/* ResNet Card */}
                            <div className="bg-slate-800/70 border border-white/10 rounded-2xl p-8 backdrop-blur-xl hover:-translate-y-1 transition-transform hover:shadow-2xl hover:shadow-blue-500/20 hover:border-white/20">
                                <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                    <span className="text-3xl">🟢</span> Modelo ResNet50
                                </h3>
                                <p className="text-slate-300 mb-4"><strong>Framework:</strong> PyTorch</p>
                                <div className="flex flex-wrap gap-2 mb-6">
                                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-500 border border-amber-500/30 flex items-center gap-1">
                                        <XCircle className="w-4 h-4" /> Data Aug: No
                                    </span>
                                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center gap-1">
                                        <Info className="w-4 h-4" /> TL: Congelación Total
                                    </span>
                                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                                        <CheckCircle2 className="w-4 h-4" /> CM manual detallada
                                    </span>
                                </div>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    Destaca por su <strong>control exhaustivo</strong> de las métricas en cada época y el guardado selectivo de checkpoints basados en F1-Score, Recall y Precisión. Sin embargo, puede sufrir sobreajuste rápido al no integrar aumento de imágenes.
                                </p>
                            </div>

                            {/* VGG16 Card */}
                            <div className="bg-slate-800/70 border border-white/10 rounded-2xl p-8 backdrop-blur-xl hover:-translate-y-1 transition-transform hover:shadow-2xl hover:shadow-purple-500/20 hover:border-white/20">
                                <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                    <span className="text-3xl">🔵</span> Modelo VGG16
                                </h3>
                                <p className="text-slate-300 mb-4"><strong>Framework:</strong> TensorFlow / Keras</p>
                                <div className="flex flex-wrap gap-2 mb-6">
                                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                                        <CheckCircle2 className="w-4 h-4" /> Data Aug: Sí
                                    </span>
                                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center gap-1">
                                        <Info className="w-4 h-4" /> Fine-Tuning: 8 capas libres
                                    </span>
                                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-500/20 text-red-400 border border-red-500/30 flex items-center gap-1">
                                        <XCircle className="w-4 h-4" /> Métricas: Callback ausentes
                                    </span>
                                </div>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    Su principal ventaja radica en la implementación rica de <strong>Data Augmentation</strong> y el descongelamiento de las últimas capas convolucionales, extrayendo patrones médicos más robustos y reduciendo el sobreajuste.
                                </p>
                            </div>
                        </div>

                        <div className="bg-slate-800/70 border border-white/10 rounded-2xl p-8 backdrop-blur-xl mb-8">
                            <h3 className="text-xl font-bold text-white mb-2">Flujo de Trabajo (Pipeline) Comparativo</h3>
                            <p className="text-slate-400 text-sm mb-6">Visión macro de cómo fluye la información en las dos implementaciones propuestas.</p>
                            <div className="bg-black/30 rounded-xl p-6 border border-white/10 overflow-x-auto overflow-y-hidden">
                                <MermaidDiagram chart={mermaidChart} />
                            </div>
                        </div>

                        <div className="bg-slate-800/70 border border-white/10 rounded-2xl p-8 backdrop-blur-xl">
                            <h3 className="text-xl font-bold text-white mb-6">Visualización de Convergencia Teórica (Accuracy)</h3>
                            <div className="h-[400px] w-full relative">
                                <Line data={chartData} options={chartOptions} />
                            </div>
                            <p className="text-center text-xs text-slate-500 mt-4 italic">
                                * Gráfica proyectada comparando el impacto teórico del Data Augmentation vs No Augmentation basado en literatura médica estándar.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="bg-slate-800/70 border border-white/10 rounded-2xl p-8 backdrop-blur-xl mb-8">
                            <h3 className="text-xl font-bold text-white mb-6">Estructuras Topológicas: Las Cabeceras (Heads)</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <h4 className="text-blue-400 font-bold mb-2">Estructura Cabecera: ResNet50</h4>
                                    <p className="text-sm text-slate-400 mb-4">Presenta un embudo clásico (256 -{'>'} 64 -{'>'} 32 neuronas) y Dropout conservador del 20%.</p>
                                    <pre className="bg-black/40 p-6 rounded-xl text-blue-200 text-sm border border-blue-500/20 font-mono leading-relaxed overflow-x-auto">
                                        {`Linear(2048, 256)
├── Dropout(0.2)
└── ReLU()
Linear(256, 64)
├── Dropout(0.2)
└── ReLU()
Linear(64, 32)
├── Dropout(0.2)
└── ReLU()
Linear(32, 4)`}
                                    </pre>
                                </div>
                                <div>
                                    <h4 className="text-purple-400 font-bold mb-2">Estructura Cabecera: VGG16</h4>
                                    <p className="text-sm text-slate-400 mb-4">Regularización ultra intensiva usando BatchNormalization y un severo Dropout del 50% en ancho de 32.</p>
                                    <pre className="bg-black/40 p-6 rounded-xl text-purple-200 text-sm border border-purple-500/20 font-mono leading-relaxed overflow-x-auto">
                                        {`Flatten()
├── BatchNormalization()
Dense(32)
├── BatchNormalization() + ReLU()
└── Dropout(0.5)
Dense(32)
├── BatchNormalization() + ReLU()
└── Dropout(0.5)
Dense(32)
├── BatchNormalization() + ReLU()
Dense(4, Softmax)`}
                                    </pre>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-800/70 border border-white/10 rounded-2xl p-8 backdrop-blur-xl overflow-hidden">
                            <h3 className="text-xl font-bold text-white mb-6">Tabla Comparativa Técnica de Implementación</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left min-w-[600px]">
                                    <thead>
                                        <tr className="border-b border-white/10 bg-white/5">
                                            <th className="p-4 text-slate-200 font-semibold rounded-tl-lg">Característica Técnica</th>
                                            <th className="p-4 text-slate-200 font-semibold">Modelo ResNet50 (PyTorch)</th>
                                            <th className="p-4 text-slate-200 font-semibold rounded-tr-lg">Modelo VGG16 (Keras)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-slate-300 text-sm divide-y divide-white/5">
                                        <tr className="hover:bg-white/5 transition-colors">
                                            <td className="p-4 font-medium text-white">Estrategia de Transformación</td>
                                            <td className="p-4">Solo Resize y Normalize</td>
                                            <td className="p-4"><span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-400 text-xs font-semibold border border-emerald-500/30">Rot, Shift, Shear, Flip</span></td>
                                        </tr>
                                        <tr className="hover:bg-white/5 transition-colors">
                                            <td className="p-4 font-medium text-white">Ajuste de Pesos (Transfer Learning)</td>
                                            <td className="p-4"><span className="px-2 py-1 rounded bg-amber-500/20 text-amber-500 text-xs font-semibold border border-amber-500/30">Congelación Total</span></td>
                                            <td className="p-4"><span className="px-2 py-1 rounded bg-blue-500/20 text-blue-400 text-xs font-semibold border border-blue-500/30">Fine-Tuning (8 capas libres)</span></td>
                                        </tr>
                                        <tr className="hover:bg-white/5 transition-colors">
                                            <td className="p-4 font-medium text-white">Optimizador y LR</td>
                                            <td className="p-4"><code className="text-amber-300 bg-amber-500/10 px-1 py-0.5 rounded">AdamW</code> (LR: 0.001, WD: 0.0001)</td>
                                            <td className="p-4"><code className="text-blue-300 bg-blue-500/10 px-1 py-0.5 rounded">Adam</code> (LR estándar Keras)</td>
                                        </tr>
                                        <tr className="hover:bg-white/5 transition-colors">
                                            <td className="p-4 font-medium text-white">Función de Pérdida</td>
                                            <td className="p-4"><code>CrossEntropyLoss</code></td>
                                            <td className="p-4"><code>Categorical Crossentropy</code></td>
                                        </tr>
                                        <tr className="hover:bg-white/5 transition-colors">
                                            <td className="p-4 font-medium text-white">Métodos de Monitoreo Analítico</td>
                                            <td className="p-4 flex items-center gap-2">Manual: <span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-400 text-xs font-semibold border border-emerald-500/30">F1, Precision, Recall</span></td>
                                            <td className="p-4">Métricas Base: <span className="px-2 py-1 rounded bg-amber-500/20 text-amber-500 text-xs font-semibold border border-amber-500/30">Solo Accuracy</span></td>
                                        </tr>
                                        <tr className="hover:bg-white/5 transition-colors">
                                            <td className="p-4 font-medium text-white">Guardado / Checkpointing</td>
                                            <td className="p-4">Guarda ".pt" individualmente por Pico de Métrica</td>
                                            <td className="p-4">No visible en el script. Se recomienda <code>ModelCheckpoint</code></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div >
    );
}
