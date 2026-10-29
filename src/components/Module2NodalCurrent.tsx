import React, { useState } from 'react';
import { RotateCcw, ChevronLeft, ChevronRight, ArrowLeftRight, CheckCircle2 } from 'lucide-react';
import { NodalCurrentParams, SignConvention } from '../types/circuit';
import { DEFAULT_NODAL_CURRENT, solveNodalCurrent, formatNum } from '../utils/circuitSolver';

interface Module2Props {
  presentationMode: boolean;
  signConvention: SignConvention;
  onChangeSignConvention: (sc: SignConvention) => void;
}

const STEPS = [
  {
    step: 1,
    title: 'Paso 1: Elegir referencia (v = 0) y rotular nodos (v₁, v₂)',
    summary:
      'El circuito tiene N = 3 nodos principales. Se selecciona el nodo inferior como tierra (0 V) y quedan N − 1 = 2 tensiones desconocidas: v₁ y v₂.',
  },
  {
    step: 2,
    title: 'Paso 2: Aplicar LCK + Ley de Ohm en el Nodo 1',
    summary:
      'Expresamos cada corriente de rama resistiva como (v_nodo − v_vecino)/R y sumamos las fuentes de corriente conectadas al Nodo 1 manteniendo un solo criterio de signos.',
  },
  {
    step: 3,
    title: 'Paso 3: Aplicar LCK + Ley de Ohm en el Nodo 2',
    summary:
      'Repetimos el mismo criterio en el Nodo 2. Observa que la rama compartida R₂ ahora se escribe desde la perspectiva de v₂: (v₂ − v₁) / R₂.',
  },
  {
    step: 4,
    title: 'Paso 4: Sistema simultáneo 2×2 y comprobación de LCK',
    summary:
      'Agrupamos términos en forma matricial G · v = I, obtenemos los voltajes v₁ y v₂ y comprobamos que la suma de corrientes en cada nodo se cumple con exactitud.',
  },
];

export const Module2NodalCurrent: React.FC<Module2Props> = ({
  presentationMode,
  signConvention,
  onChangeSignConvention,
}) => {
  const [params, setParams] = useState<NodalCurrentParams>(DEFAULT_NODAL_CURRENT);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [highlightedBranch, setHighlightedBranch] = useState<string | null>(null);

  const sol = solveNodalCurrent(params);

  const isFocusNode1 = currentStep === 2 || highlightedBranch === 'node1';
  const isFocusNode2 = currentStep === 3 || highlightedBranch === 'node2';

  return (
    <div className="space-y-6">
      {/* Header & Step Progress Strip */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="text-xs font-medium text-slate-500">
              Análisis Nodal con Fuentes de Corriente y Resistores
            </div>
            <h2 className={`font-display font-bold text-slate-900 mt-0.5 ${presentationMode ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'}`}>
              02. Procedimiento General de Análisis Nodal (Sin Fuentes de Tensión)
            </h2>
          </div>

          {/* Criterio de Signos Switcher */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500 whitespace-nowrap">Criterio LCK:</span>
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
              <button
                onClick={() => onChangeSignConvention('leaving-zero')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                  signConvention === 'leaving-zero'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Σ i_salen = 0
              </button>
              <button
                onClick={() => onChangeSignConvention('entering-equals-leaving')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                  signConvention === 'entering-equals-leaving'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Σ i_entran = Σ i_salen
              </button>
            </div>
          </div>
        </div>

        {/* 4-Step Interactive Controller */}
        <div className="pt-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 flex-1">
            {STEPS.map((s) => (
              <button
                key={s.step}
                onClick={() => setCurrentStep(s.step)}
                className={`text-left p-2.5 rounded-lg border transition-colors ${
                  currentStep === s.step
                    ? 'bg-sky-50/80 border-sky-600 text-slate-900'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <div className="text-xs font-mono font-semibold text-sky-700">
                  Paso 0{s.step}
                </div>
                <div className="text-xs font-medium text-slate-900 line-clamp-1 mt-0.5">
                  {s.title.replace(/^Paso \d: /, '')}
                </div>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
              disabled={currentStep === 1}
              className="inline-flex items-center gap-1 px-3 py-2 text-xs font-medium rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 whitespace-nowrap"
            >
              <ChevronLeft className="w-4 h-4" />
              Anterior
            </button>
            <button
              onClick={() => setCurrentStep((prev) => Math.min(4, prev + 1))}
              disabled={currentStep === 4}
              className="inline-flex items-center gap-1 px-3 py-2 text-xs font-medium rounded-lg bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-40 whitespace-nowrap"
            >
              Siguiente Paso
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Two-Zone Sandbox */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Zone: Interactive SVG Circuit (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-5 py-3.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-display font-semibold text-slate-900 text-base">
                Esquema Interactivo: Circuito con Dos Fuentes de Corriente y Tres Resistores
              </h3>
              <p className="text-xs text-slate-500">
                Pasa el cursor sobre las ecuaciones a la derecha o haz clic en las fuentes para invertir su sentido
              </p>
            </div>
            <button
              onClick={() => setParams(DEFAULT_NODAL_CURRENT)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Restaurar valores
            </button>
          </div>

          <div className="p-4 sm:p-6 bg-technical-grid">
            <svg
              viewBox="0 0 720 380"
              className="w-full h-auto bg-white/95 border border-slate-200 rounded-lg shadow-2xs"
              role="img"
              aria-label="Circuito de análisis nodal con fuentes de corriente I1 e I2 y resistores R1, R2 y R3"
            >
              {/* Highlight Halos for Step 2 (Node 1) and Step 3 (Node 2) */}
              {isFocusNode1 && (
                <rect
                  x="70"
                  y="55"
                  width="235"
                  height="65"
                  rx="12"
                  fill="#e0f2fe"
                  stroke="#0284c7"
                  strokeWidth="2"
                  strokeDasharray="6 4"
                />
              )}
              {isFocusNode2 && (
                <rect
                  x="415"
                  y="55"
                  width="235"
                  height="65"
                  rx="12"
                  fill="#e0f2fe"
                  stroke="#0284c7"
                  strokeWidth="2"
                  strokeDasharray="6 4"
                />
              )}

              {/* Top Wires for Node 1 (x: 110..270, y: 90) and Node 2 (x: 450..610, y: 90) */}
              <line x1="110" y1="90" x2="295" y2="90" stroke="#0f172a" strokeWidth="2.5" />
              <line x1="425" y1="90" x2="610" y2="90" stroke="#0f172a" strokeWidth="2.5" />

              {/* Resistor R2 between Node 1 and Node 2 (x: 295..425, y: 90) */}
              <g
                className="cursor-pointer"
                onMouseEnter={() => setHighlightedBranch('R2')}
                onMouseLeave={() => setHighlightedBranch(null)}
              >
                <rect
                  x="290"
                  y="62"
                  width="140"
                  height="56"
                  rx="8"
                  fill={highlightedBranch === 'R2' ? '#fef3c7' : 'transparent'}
                />
                <polyline
                  points="295,90 307,74 325,106 343,74 360,106 377,74 395,106 413,74 425,90"
                  fill="none"
                  stroke={highlightedBranch === 'R2' ? '#d97706' : '#0f172a'}
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                />
                {Math.abs(sol.iR2) > 0.01 && (
                  <line
                    x1="280"
                    y1="90"
                    x2="440"
                    y2="90"
                    stroke="#059669"
                    strokeWidth="3.5"
                    className={sol.iR2 >= 0 ? 'animate-current-forward' : 'animate-current-reverse'}
                  />
                )}
                <text x="360" y="60" textAnchor="middle" className="font-mono text-xs font-semibold fill-slate-900">
                  R₂ = {params.r2} Ω
                </text>
                <text x="360" y="132" textAnchor="middle" className="font-mono text-[11px] font-semibold fill-emerald-700">
                  i_R2 = {formatNum(sol.iR2)} A (1→2)
                </text>
              </g>

              {/* Left Outer Branch: Current Source I1 (x: 110, y: 90..300) */}
              <g
                className="cursor-pointer"
                onClick={() =>
                  setParams((p) => ({
                    ...p,
                    i1Direction: p.i1Direction === 'entering' ? 'leaving' : 'entering',
                  }))
                }
                onMouseEnter={() => setHighlightedBranch('I1')}
                onMouseLeave={() => setHighlightedBranch(null)}
              >
                <line x1="110" y1="90" x2="110" y2="165" stroke="#0f172a" strokeWidth="2.5" />
                <line x1="110" y1="225" x2="110" y2="300" stroke="#0f172a" strokeWidth="2.5" />
                <circle
                  cx="110"
                  cy="195"
                  r="30"
                  fill={highlightedBranch === 'I1' ? '#e0f2fe' : '#ffffff'}
                  stroke="#0284c7"
                  strokeWidth="2.5"
                />
                {params.i1Direction === 'entering' ? (
                  <g>
                    <line x1="110" y1="212" x2="110" y2="178" stroke="#0284c7" strokeWidth="2.5" />
                    <polyline points="103,186 110,176 117,186" fill="none" stroke="#0284c7" strokeWidth="2.5" />
                  </g>
                ) : (
                  <g>
                    <line x1="110" y1="178" x2="110" y2="212" stroke="#0284c7" strokeWidth="2.5" />
                    <polyline points="103,204 110,214 117,204" fill="none" stroke="#0284c7" strokeWidth="2.5" />
                  </g>
                )}
                <text x="64" y="192" textAnchor="end" className="font-mono text-xs font-bold fill-sky-800">
                  I₁ = {params.i1} A
                </text>
                <text x="64" y="208" textAnchor="end" className="font-sans text-[11px] fill-slate-500">
                  ({params.i1Direction === 'entering' ? 'Entra a v₁' : 'Sale de v₁'})
                </text>
              </g>

              {/* Inner Left Vertical Branch: Resistor R1 (x: 245, y: 90..300) */}
              <g
                className="cursor-pointer"
                onMouseEnter={() => setHighlightedBranch('R1')}
                onMouseLeave={() => setHighlightedBranch(null)}
              >
                <line x1="245" y1="90" x2="245" y2="145" stroke="#0f172a" strokeWidth="2.5" />
                <polyline
                  points="245,145 231,155 259,171 231,187 259,203 231,219 259,235 245,245"
                  fill="none"
                  stroke={highlightedBranch === 'R1' ? '#d97706' : '#0f172a'}
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                />
                <line x1="245" y1="245" x2="245" y2="300" stroke="#0f172a" strokeWidth="2.5" />
                {Math.abs(sol.iR1) > 0.01 && (
                  <line
                    x1="245"
                    y1="105"
                    x2="245"
                    y2="285"
                    stroke="#059669"
                    strokeWidth="3.5"
                    className={sol.iR1 >= 0 ? 'animate-current-forward' : 'animate-current-reverse'}
                  />
                )}
                <text x="272" y="192" className="font-mono text-xs font-semibold fill-slate-900">
                  R₁ = {params.r1} Ω
                </text>
                <text x="272" y="210" className="font-mono text-[11px] font-semibold fill-emerald-700">
                  i_R1 = {formatNum(sol.iR1)} A ↓
                </text>
              </g>

              {/* Inner Right Vertical Branch: Resistor R3 (x: 475, y: 90..300) */}
              <g
                className="cursor-pointer"
                onMouseEnter={() => setHighlightedBranch('R3')}
                onMouseLeave={() => setHighlightedBranch(null)}
              >
                <line x1="475" y1="90" x2="475" y2="145" stroke="#0f172a" strokeWidth="2.5" />
                <polyline
                  points="475,145 461,155 489,171 461,187 489,203 461,219 489,235 475,245"
                  fill="none"
                  stroke={highlightedBranch === 'R3' ? '#d97706' : '#0f172a'}
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                />
                <line x1="475" y1="245" x2="475" y2="300" stroke="#0f172a" strokeWidth="2.5" />
                {Math.abs(sol.iR3) > 0.01 && (
                  <line
                    x1="475"
                    y1="105"
                    x2="475"
                    y2="285"
                    stroke="#059669"
                    strokeWidth="3.5"
                    className={sol.iR3 >= 0 ? 'animate-current-forward' : 'animate-current-reverse'}
                  />
                )}
                <text x="448" y="192" textAnchor="end" className="font-mono text-xs font-semibold fill-slate-900">
                  R₃ = {params.r3} Ω
                </text>
                <text x="448" y="210" textAnchor="end" className="font-mono text-[11px] font-semibold fill-emerald-700">
                  i_R3 = {formatNum(sol.iR3)} A ↓
                </text>
              </g>

              {/* Right Outer Branch: Current Source I2 (x: 610, y: 90..300) */}
              <g
                className="cursor-pointer"
                onClick={() =>
                  setParams((p) => ({
                    ...p,
                    i2Direction: p.i2Direction === 'entering' ? 'leaving' : 'entering',
                  }))
                }
                onMouseEnter={() => setHighlightedBranch('I2')}
                onMouseLeave={() => setHighlightedBranch(null)}
              >
                <line x1="610" y1="90" x2="610" y2="165" stroke="#0f172a" strokeWidth="2.5" />
                <line x1="610" y1="225" x2="610" y2="300" stroke="#0f172a" strokeWidth="2.5" />
                <circle
                  cx="610"
                  cy="195"
                  r="30"
                  fill={highlightedBranch === 'I2' ? '#e0f2fe' : '#ffffff'}
                  stroke="#0284c7"
                  strokeWidth="2.5"
                />
                {params.i2Direction === 'entering' ? (
                  <g>
                    <line x1="610" y1="212" x2="610" y2="178" stroke="#0284c7" strokeWidth="2.5" />
                    <polyline points="603,186 610,176 617,186" fill="none" stroke="#0284c7" strokeWidth="2.5" />
                  </g>
                ) : (
                  <g>
                    <line x1="610" y1="178" x2="610" y2="212" stroke="#0284c7" strokeWidth="2.5" />
                    <polyline points="603,204 610,214 617,204" fill="none" stroke="#0284c7" strokeWidth="2.5" />
                  </g>
                )}
                <text x="652" y="192" className="font-mono text-xs font-bold fill-sky-800">
                  I₂ = {params.i2} A
                </text>
                <text x="652" y="208" className="font-sans text-[11px] fill-slate-500">
                  ({params.i2Direction === 'entering' ? 'Entra a v₂' : 'Sale de v₂'})
                </text>
              </g>

              {/* Bottom Reference Bus & Ground Symbol */}
              <line x1="110" y1="300" x2="610" y2="300" stroke="#0f172a" strokeWidth="2.5" />
              <circle cx="360" cy="300" r="5" fill="#0f172a" />
              <line x1="360" y1="300" x2="360" y2="324" stroke="#0f172a" strokeWidth="2.5" />
              <line x1="340" y1="324" x2="380" y2="324" stroke="#0f172a" strokeWidth="2.5" />
              <line x1="347" y1="332" x2="373" y2="332" stroke="#0f172a" strokeWidth="2.5" />
              <line x1="354" y1="340" x2="366" y2="340" stroke="#0f172a" strokeWidth="2.5" />
              <text x="360" y="360" textAnchor="middle" className="font-mono text-xs font-semibold fill-slate-700">
                Nodo de Referencia (v = 0 V)
              </text>

              {/* Node 1 Badge */}
              <circle cx="245" cy="90" r="7" fill="#0284c7" stroke="#ffffff" strokeWidth="2" />
              <rect x="135" y="16" width="165" height="36" rx="6" fill="#0f172a" />
              <text x="217" y="39" textAnchor="middle" className="font-mono text-xs font-bold fill-white">
                Nodo 1: v₁ = {formatNum(sol.v1)} V
              </text>

              {/* Node 2 Badge */}
              <circle cx="475" cy="90" r="7" fill="#0284c7" stroke="#ffffff" strokeWidth="2" />
              <rect x="420" y="16" width="165" height="36" rx="6" fill="#0f172a" />
              <text x="502" y="39" textAnchor="middle" className="font-mono text-xs font-bold fill-white">
                Nodo 2: v₂ = {formatNum(sol.v2)} V
              </text>
            </svg>

            {/* Quick Direction Toggle Buttons under schematic */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 bg-white border border-slate-200 rounded-lg p-3">
              <span className="text-xs text-slate-600">
                Haz clic para probar qué ocurre en las ecuaciones al invertir el sentido de las fuentes:
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    setParams((p) => ({
                      ...p,
                      i1Direction: p.i1Direction === 'entering' ? 'leaving' : 'entering',
                    }))
                  }
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-md transition-colors whitespace-nowrap"
                >
                  <ArrowLeftRight className="w-3.5 h-3.5 text-sky-700" />
                  Invertir I₁ ({params.i1Direction === 'entering' ? 'Entra' : 'Sale'})
                </button>
                <button
                  onClick={() =>
                    setParams((p) => ({
                      ...p,
                      i2Direction: p.i2Direction === 'entering' ? 'leaving' : 'entering',
                    }))
                  }
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-md transition-colors whitespace-nowrap"
                >
                  <ArrowLeftRight className="w-3.5 h-3.5 text-sky-700" />
                  Invertir I₂ ({params.i2Direction === 'entering' ? 'Entra' : 'Sale'})
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Zone: Step-by-Step Equations & Sliders (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Active Step Walkthrough Box */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <div className="text-xs font-mono font-semibold text-sky-700">
                DESGLOSE ALGEBRAICO EN TIEMPO REAL
              </div>
              <h3 className="font-display font-bold text-slate-900 text-base mt-0.5">
                {STEPS[currentStep - 1].title}
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {STEPS[currentStep - 1].summary}
              </p>
            </div>

            {/* Node 1 Equation Card */}
            <div
              onMouseEnter={() => setHighlightedBranch('node1')}
              onMouseLeave={() => setHighlightedBranch(null)}
              className={`p-3.5 rounded-lg border transition-colors ${
                currentStep === 2 ? 'bg-sky-50/70 border-sky-500' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-semibold text-slate-800 mb-1.5">
                <span>LCK en el Nodo 1 (v₁):</span>
                <span className="font-mono text-sky-700">
                  {signConvention === 'leaving-zero' ? 'Σ i_salen = 0' : 'Σ i_entran = Σ i_salen'}
                </span>
              </div>
              <div className="font-mono text-xs sm:text-sm text-slate-900 font-semibold tabular-nums">
                {signConvention === 'leaving-zero' ? (
                  <>
                    (v₁ − 0)/{params.r1} + (v₁ − v₂)/{params.r2}{' '}
                    <span className="text-sky-700">
                      {params.i1Direction === 'leaving' ? `+ ${params.i1}` : `− ${params.i1}`}
                    </span>{' '}
                    = 0
                  </>
                ) : (
                  <>
                    <span className="text-sky-700">
                      {params.i1Direction === 'entering' ? `${params.i1}` : `−${params.i1}`}
                    </span>{' '}
                    = v₁/{params.r1} + (v₁ − v₂)/{params.r2}
                  </>
                )}
              </div>
              <div className="text-[11px] font-mono text-slate-500 mt-1 tabular-nums">
                Forma agrupada: ({formatNum(sol.g11, 3)})·v₁ − ({formatNum(-sol.g12, 3)})·v₂ = {formatNum(sol.I1NetEntering)}
              </div>
            </div>

            {/* Node 2 Equation Card */}
            <div
              onMouseEnter={() => setHighlightedBranch('node2')}
              onMouseLeave={() => setHighlightedBranch(null)}
              className={`p-3.5 rounded-lg border transition-colors ${
                currentStep === 3 ? 'bg-sky-50/70 border-sky-500' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-semibold text-slate-800 mb-1.5">
                <span>LCK en el Nodo 2 (v₂):</span>
                <span className="font-mono text-sky-700">
                  {signConvention === 'leaving-zero' ? 'Σ i_salen = 0' : 'Σ i_entran = Σ i_salen'}
                </span>
              </div>
              <div className="font-mono text-xs sm:text-sm text-slate-900 font-semibold tabular-nums">
                {signConvention === 'leaving-zero' ? (
                  <>
                    (v₂ − v₁)/{params.r2} + (v₂ − 0)/{params.r3}{' '}
                    <span className="text-sky-700">
                      {params.i2Direction === 'leaving' ? `+ ${params.i2}` : `− ${params.i2}`}
                    </span>{' '}
                    = 0
                  </>
                ) : (
                  <>
                    <span className="text-sky-700">
                      {params.i2Direction === 'entering' ? `${params.i2}` : `−${params.i2}`}
                    </span>{' '}
                    = (v₂ − v₁)/{params.r2} + v₂/{params.r3}
                  </>
                )}
              </div>
              <div className="text-[11px] font-mono text-slate-500 mt-1 tabular-nums">
                Forma agrupada: −({formatNum(-sol.g21, 3)})·v₁ + ({formatNum(sol.g22, 3)})·v₂ = {formatNum(sol.I2NetEntering)}
              </div>
            </div>

            {/* Solution & Verification Box */}
            <div className="bg-slate-900 text-white rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span>Solución del Sistema Simultáneo:</span>
                <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  LCK Verificada
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-1 font-mono tabular-nums">
                <div className="bg-slate-800/90 px-3 py-2 rounded border border-slate-700">
                  <div className="text-[11px] text-slate-400">Tensión Nodo 1</div>
                  <div className="text-base font-bold text-sky-300">v₁ = {formatNum(sol.v1)} V</div>
                </div>
                <div className="bg-slate-800/90 px-3 py-2 rounded border border-slate-700">
                  <div className="text-[11px] text-slate-400">Tensión Nodo 2</div>
                  <div className="text-base font-bold text-sky-300">v₂ = {formatNum(sol.v2)} V</div>
                </div>
              </div>
            </div>
          </div>

          {/* Sliders Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3.5">
            <h3 className="font-display font-semibold text-slate-900 text-sm">
              Valores del Circuito en Vivo
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-slate-700">Fuente I₁:</span>
                  <span className="font-mono font-semibold text-sky-700 tabular-nums">{params.i1} A</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="15"
                  step="1"
                  value={params.i1}
                  onChange={(e) => setParams((p) => ({ ...p, i1: Number(e.target.value) }))}
                  className="w-full accent-sky-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-slate-700">Fuente I₂:</span>
                  <span className="font-mono font-semibold text-sky-700 tabular-nums">{params.i2} A</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="15"
                  step="1"
                  value={params.i2}
                  onChange={(e) => setParams((p) => ({ ...p, i2: Number(e.target.value) }))}
                  className="w-full accent-sky-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-slate-700">Resistor R₁:</span>
                  <span className="font-mono font-semibold text-slate-900 tabular-nums">{params.r1} Ω</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="12"
                  step="1"
                  value={params.r1}
                  onChange={(e) => setParams((p) => ({ ...p, r1: Number(e.target.value) }))}
                  className="w-full accent-slate-800 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-slate-700">Resistor R₂:</span>
                  <span className="font-mono font-semibold text-slate-900 tabular-nums">{params.r2} Ω</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="12"
                  step="1"
                  value={params.r2}
                  onChange={(e) => setParams((p) => ({ ...p, r2: Number(e.target.value) }))}
                  className="w-full accent-slate-800 cursor-pointer"
                />
              </div>

              <div className="sm:col-span-2">
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-slate-700">Resistor R₃:</span>
                  <span className="font-mono font-semibold text-slate-900 tabular-nums">{params.r3} Ω</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="12"
                  step="1"
                  value={params.r3}
                  onChange={(e) => setParams((p) => ({ ...p, r3: Number(e.target.value) }))}
                  className="w-full accent-slate-800 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
