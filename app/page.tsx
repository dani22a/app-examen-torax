import LungCancerClassifierForm from "@/components/LungCancerClassifierForm";
import { Activity } from "@/components/ui-icons";

export default function HomePage() {
  return (
    <div className="min-h-screen w-full lung-page-grid">
      <div className="mx-auto w-full max-w-[1680px] space-y-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-6">
        <section className="app-shell-panel overflow-hidden rounded-[32px] bg-linear-to-r from-brand-950 via-brand-900 to-brand-700 px-6 py-8 text-white md:px-8 md:py-10">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-100/80">
            Clasificación de cáncer de pulmón
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
            Diagnóstico asistido por IA en CT-Scan
          </h1>
          <p className="mt-4 text-sm leading-7 text-brand-100/85 md:text-base">
            Utiliza dos modelos de deep learning (VGG16 y ResNet50) para clasificar
            imágenes de tomografía computarizada en cuatro categorías:
            adenocarcinoma, carcinoma de células grandes, tejido normal y carcinoma
            de células escamosas.
          </p>
          <div className="mt-6 flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 backdrop-blur-sm">
            <Activity size={20} className="text-brand-200" />
            <span className="text-sm text-brand-100/90">
              Modelos disponibles: VGG16 · ResNet50
            </span>
          </div>
        </section>

        <LungCancerClassifierForm />
      </div>
    </div>
  );
}
