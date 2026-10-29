import React, { useState } from 'react';
import { RotateCcw, ArrowLeftRight, Eye, CheckCircle2 } from 'lucide-react';
import { Fig24SupernodeParams, SignConvention } from '../types/circuit';
import { DEFAULT_FIG24_SUPERNODE, solveFig24Supernode, formatNum } from '../utils/circuitSolver';

interface Module3Props {
  presentationMode: boolean;
  signConvention: SignConvention;
  onChangeSignConvention: (sc: SignConvention) => void;
}

export const Module3SupernodeFig24: React.FC<Module3Props> = ({
  presentationMode,
  signConvention,
  onChangeSignConvention,
}) => {
  const [params, setParams] = useState<Fig24SupernodeParams>(DEFAULT_FIG24_SUPERNODE);
  const [activeFocus, setActiveFocus] = useState<'all' | 'caseA' | 'caseB-kcl' | 'caseB-kvl' | 'internal-current'>('all');
  const [showSupernodeBoundary, setShowSupernodeBoundary] = useState<boolean>(true);

  const sol = solveFig24Supernode(params);

  return (
    <div className="space-y-6">
      {/* Top Section Header & Pedagogical Focus Selector */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="text-xs font-medium text-slate-500">
              Presencia de Fuentes de Tensión en el Método de Nodos
            </div>
            <h2 className={`font-display font-bold text-slate-900 mt-0.5 ${presentationMode ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'}`}>
              03. Análisis Nodal con Fuentes de Tensión: Caso A y Supernodo (Caso B)
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-lg">
            {[
              { id: 'all', label: 'Vista Completa' },
              { id: 'caseA', label: 'Caso A (Nodo a Tierra)' },
              { id: 'caseB-kcl', label: 'Caso B: LCK Supernodo' },
              { id: 'caseB-kvl', label: 'Ecuación de Restricción LTK' },
              { id: 'internal-current', label: '¿Corriente en la fuente?' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFocus(tab.id as any)}
                className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                  activeFocus === tab.id
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Contextual Pedagogical Explanation */}
        <div className="pt-4 grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
          <div className="lg:col-span-8">
            {activeFocus === 'all' && (
              <p className={`text-slate-600 leading-relaxed ${presentationMode ? 'text-base' : 'text-sm'}`}>
                Este circuito reúne los dos casos posibles cuando aparecen fuentes de tensión en el análisis nodal: en el <strong>Nodo 1</strong> hay una fuente de {params.vs1} V conectada al nodo de referencia (<strong>Caso A</strong>), mientras que entre los <strong>Nodos 2 y 3</strong> hay una fuente de {params.vsn} V que forma un <strong>Supernodo (Caso B)</strong>.
              </p>
            )}
            {activeFocus === 'caseA' && (
              <p className={`text-slate-600 leading-relaxed ${presentationMode ? 'text-base' : 'text-sm'}`}>
                <strong>Caso A (Fuente entre nodo de referencia y nodo de no referencia):</strong> Cuando una fuente de tensión se conecta entre el nodo de referencia y un nodo <span className="font-mono">k</span>, el voltaje queda fijado directamente (<span className="font-mono">v_k = +V_fuente</span> si el terminal + está en <span className="font-mono">k</span>, o <span className="font-mono">v_k = −V_fuente</span> si el terminal − está en <span className="font-mono">k</span>). <strong>No es necesario aplicar LCK en el nodo 1.</strong>
              </p>
            )}
            {activeFocus === 'caseB-kcl' && (
              <p className={`text-slate-600 leading-relaxed ${presentationMode ? 'text-base' : 'text-sm'}`}>
                <strong>Caso B — LCK en el Supernodo:</strong> Como en una fuente de tensión ideal no se puede aplicar la Ley de Ohm para expresar su corriente, encerramos la fuente de {params.vsn} V y los nodos <span className="font-mono">v₂</span> y <span className="font-mono">v₃</span> en una región punteada y aplicamos LCK a las 4 ramas que cruzan su frontera (<span className="font-mono">i₁ + i₄ = i₂ + i₃</span>).
              </p>
            )}
            {activeFocus === 'caseB-kvl' && (
              <p className={`text-slate-600 leading-relaxed ${presentationMode ? 'text-base' : 'text-sm'}`}>
                <strong>Ecuación de Restricción LTK:</strong> El supernodo no tiene una tensión única propia. Para completar el sistema aplicamos la Ley de Voltajes de Kirchhoff a los nodos unidos por la fuente: <span className="font-mono font-semibold">v_a − v_b = V_fuente</span>, donde <span className="font-mono">v_a</span> es el nodo en el terminal positivo (+) y <span className="font-mono">v_b</span> el nodo en el terminal negativo (−).
              </p>
            )}
            {activeFocus === 'internal-current' && (
              <p className={`text-slate-600 leading-relaxed ${presentationMode ? 'text-base' : 'text-sm'}`}>
                <strong>¿Qué pasa con la corriente dentro de la fuente del supernodo?</strong> Al plantear la ecuación global del supernodo, la corriente interna de la fuente se cancela (sale de un nodo y entra al otro). Pero una vez calculados <span className="font-mono">v₂ = {formatNum(sol.v2)} V</span> y <span className="font-mono">v₃ = {formatNum(sol.v3)} V</span>, podemos hallarla aplicando LCK individual en el nodo 2: <span className="font-mono">i_fuente = i₁ − i₂ = {formatNum(sol.iSource2to3)} A</span>.
              </p>
            )}
          </div>

          <div className="lg:col-span-4 flex flex-wrap items-center justify-end gap-2">
            <button
              onClick={() => setShowSupernodeBoundary((v) => !v)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 ${
                showSupernodeBoundary
                  ? 'bg-amber-50 border-amber-400 text-amber-900'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              {showSupernodeBoundary ? 'Ocultar envolvente Supernodo' : 'Mostrar envolvente Supernodo'}
            </button>
            <button
              onClick={() => setParams(DEFAULT_FIG24_SUPERNODE)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Restaurar valores
            </button>
          </div>
        </div>
      </div>

      {/* Main Two-Zone Sandbox */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Zone: Interactive SVG Circuit (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-5 py-3.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="font-display font-semibold text-slate-900 text-base">
                Circuito Interactivo con un Supernodo
              </h3>
              <p className="text-xs text-slate-500">
                Haz clic sobre cualquiera de las dos fuentes de tensión en el esquema para invertir su polaridad (+ / −)
              </p>
            </div>
          </div>

          <div className="p-4 sm:p-6 bg-technical-grid">
            <svg
              viewBox="0 0 740 430"
              className="w-full h-auto bg-white/95 border border-slate-200 rounded-lg shadow-2xs"
              role="img"
              aria-label="Circuito con fuente de 10V en nodo 1 (Caso A) y supernodo con fuente de 5V entre nodos 2 y 3 (Caso B)"
            >
              {/* Case A Focus Highlight */}
              {activeFocus === 'caseA' && (
                <rect
                  x="62"
                  y="145"
                  width="115"
                  height="225"
                  rx="14"
                  fill="#e0f2fe"
                  stroke="#0284c7"
                  strokeWidth="2"
                  strokeDasharray="6 4"
                />
              )}

              {/* Supernode Dashed Oval Region around v2, 5V source, and v3 */}
              {showSupernodeBoundary && (
                <g>
                  <ellipse
                    cx="465"
                    cy="205"
                    rx="185"
                    ry="54"
                    fill={
                      activeFocus === 'caseB-kcl' || activeFocus === 'caseB-kvl'
                        ? 'rgba(254, 243, 199, 0.75)'
                        : 'rgba(254, 243, 199, 0.38)'
                    }
                    stroke="#d97706"
                    strokeWidth="2.5"
                    strokeDasharray="7 5"
                  />
                  <text x="485" y="114" textAnchor="middle" className="font-display text-xs font-bold fill-amber-900">
                    Supernodo (Caso B)
                  </text>
                  <line x1="485" y1="120" x2="465" y2="150" stroke="#b45309" strokeWidth="1.5" />
                </g>
              )}

              {/* Top Bypass Loop from Node 1 (115, 205) up to y=55, across Resistor 4 Ohm to Node 3 (600, 205) */}
              <line x1="115" y1="205" x2="115" y2="55" stroke="#0f172a" strokeWidth="2.5" />
              <line x1="115" y1="55" x2="310" y2="55" stroke="#0f172a" strokeWidth="2.5" />
              <polyline
                points="310,55 320,41 336,69 352,41 368,69 384,41 400,69 410,55"
                fill="none"
                stroke="#d97706"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
              <line x1="410" y1="55" x2="600" y2="55" stroke="#0f172a" strokeWidth="2.5" />
              <line x1="600" y1="55" x2="600" y2="205" stroke="#0f172a" strokeWidth="2.5" />

              {/* Animated Current i4 along top branch */}
              {Math.abs(sol.i4) > 0.01 && (
                <polyline
                  points="115,190 115,55 600,55 600,190"
                  fill="none"
                  stroke="#e11d48"
                  strokeWidth="3"
                  className={sol.i4 >= 0 ? 'animate-current-forward' : 'animate-current-reverse'}
                />
              )}
              <text x="360" y="32" textAnchor="middle" className="font-mono text-xs font-bold fill-slate-900">
                R₄ = {params.r4} Ω
              </text>
              <text x="615" y="112" className="font-mono text-xs font-bold fill-rose-700">
                i₄ = {formatNum(sol.i4)} A ↓
              </text>

              {/* Resistor R1 (2 Ohm) between v1 (115,205) and v2 (330,205) */}
              <line x1="115" y1="205" x2="180" y2="205" stroke="#0f172a" strokeWidth="2.5" />
              <polyline
                points="180,205 190,191 205,219 220,191 235,219 250,191 265,219 275,205"
                fill="none"
                stroke="#d97706"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
              <line x1="275" y1="205" x2="330" y2="205" stroke="#0f172a" strokeWidth="2.5" />
              {Math.abs(sol.i1) > 0.01 && (
                <line
                  x1="130"
                  y1="205"
                  x2="315"
                  y2="205"
                  stroke="#0284c7"
                  strokeWidth="3.5"
                  className={sol.i1 >= 0 ? 'animate-current-forward' : 'animate-current-reverse'}
                />
              )}
              <text x="228" y="182" textAnchor="middle" className="font-mono text-xs font-bold fill-slate-900">
                R₁ = {params.r1} Ω
              </text>
              <text x="228" y="242" textAnchor="middle" className="font-mono text-xs font-bold fill-sky-700">
                i₁ = {formatNum(sol.i1)} A →
              </text>

              {/* Supernode Voltage Source (5 V) between v2 (330,205) and v3 (600,205) */}
              <g
                className="cursor-pointer"
                onClick={() =>
                  setParams((p) => ({
                    ...p,
                    vsnPolarity: p.vsnPolarity === 'pos-node2' ? 'pos-node3' : 'pos-node2',
                  }))
                }
              >
                <line x1="330" y1="205" x2="433" y2="205" stroke="#0f172a" strokeWidth="2.5" />
                <line x1="497" y1="205" x2="600" y2="205" stroke="#0f172a" strokeWidth="2.5" />
                <circle
                  cx="465"
                  cy="205"
                  r="32"
                  fill="#ffffff"
                  stroke="#4f46e5"
                  strokeWidth="2.5"
                />
                <text
                  x="449"
                  y="210"
                  textAnchor="middle"
                  className="font-mono text-base font-bold fill-indigo-700"
                >
                  {params.vsnPolarity === 'pos-node2' ? '+' : '−'}
                </text>
                <text
                  x="481"
                  y="210"
                  textAnchor="middle"
                  className="font-mono text-base font-bold fill-indigo-700"
                >
                  {params.vsnPolarity === 'pos-node2' ? '−' : '+'}
                </text>
                <text x="465" y="165" textAnchor="middle" className="font-mono text-xs font-bold fill-indigo-900">
                  {params.vsn} V (Clic polaridad)
                </text>

                {activeFocus === 'internal-current' && (
                  <g>
                    <rect x="385" y="242" width="160" height="24" rx="5" fill="#eef2ff" stroke="#818cf8" />
                    <text x="465" y="258" textAnchor="middle" className="font-mono text-[11px] font-bold fill-indigo-800">
                      i_fuente(2→3) = {formatNum(sol.iSource2to3)} A
                    </text>
                  </g>
                )}
              </g>

              {/* Left Branch: Voltage Source Vs1 (10 V) between v1 (115,205) and Ground (115,365) */}
              <g
                className="cursor-pointer"
                onClick={() =>
                  setParams((p) => ({
                    ...p,
                    vs1Polarity: p.vs1Polarity === 'pos-node1' ? 'neg-node1' : 'pos-node1',
                  }))
                }
              >
                <line x1="115" y1="205" x2="115" y2="258" stroke="#0f172a" strokeWidth="2.5" />
                <line x1="115" y1="318" x2="115" y2="365" stroke="#0f172a" strokeWidth="2.5" />
                <circle
                  cx="115"
                  cy="288"
                  r="30"
                  fill="#ffffff"
                  stroke="#4f46e5"
                  strokeWidth="2.5"
                />
                <text x="115" y="278" textAnchor="middle" className="font-mono text-sm font-bold fill-indigo-700">
                  {params.vs1Polarity === 'pos-node1' ? '+' : '−'}
                </text>
                <text x="115" y="305" textAnchor="middle" className="font-mono text-sm font-bold fill-indigo-700">
                  {params.vs1Polarity === 'pos-node1' ? '−' : '+'}
                </text>
                <text x="155" y="286" className="font-mono text-xs font-bold fill-slate-900">
                  {params.vs1} V
                </text>
                <text x="155" y="302" className="font-sans text-[11px] font-medium fill-sky-700">
                  (Caso A)
                </text>
              </g>

              {/* Middle Vertical Branch: Resistor R2 (8 Ohm) from v2 (330,205) to Ground (330,365) */}
              <line x1="330" y1="205" x2="330" y2="255" stroke="#0f172a" strokeWidth="2.5" />
              <polyline
                points="330,255 316,265 344,280 316,295 344,310 316,325 344,340 330,350"
                fill="none"
                stroke="#65a30d"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
              <line x1="330" y1="350" x2="330" y2="365" stroke="#0f172a" strokeWidth="2.5" />
              {Math.abs(sol.i2) > 0.01 && (
                <line
                  x1="330"
                  y1="220"
                  x2="330"
                  y2="355"
                  stroke="#059669"
                  strokeWidth="3"
                  className={sol.i2 >= 0 ? 'animate-current-forward' : 'animate-current-reverse'}
                />
              )}
              <text x="354" y="305" className="font-mono text-xs font-bold fill-slate-900">
                R₂ = {params.r2} Ω
              </text>
              <text x="312" y="295" textAnchor="end" className="font-mono text-xs font-bold fill-emerald-700">
                i₂ = {formatNum(sol.i2)} A ↓
              </text>

              {/* Right Vertical Branch: Resistor R3 (6 Ohm) from v3 (600,205) to Ground (600,365) */}
              <line x1="600" y1="205" x2="600" y2="255" stroke="#0f172a" strokeWidth="2.5" />
              <polyline
                points="600,255 586,265 614,280 586,295 614,310 586,325 614,340 600,350"
                fill="none"
                stroke="#65a30d"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
              <line x1="600" y1="350" x2="600" y2="365" stroke="#0f172a" strokeWidth="2.5" />
              {Math.abs(sol.i3) > 0.01 && (
                <line
                  x1="600"
                  y1="220"
                  x2="600"
                  y2="355"
                  stroke="#059669"
                  strokeWidth="3"
                  className={sol.i3 >= 0 ? 'animate-current-forward' : 'animate-current-reverse'}
                />
              )}
              <text x="624" y="305" className="font-mono text-xs font-bold fill-slate-900">
                R₃ = {params.r3} Ω
              </text>
              <text x="582" y="295" textAnchor="end" className="font-mono text-xs font-bold fill-indigo-700">
                i₃ = {formatNum(sol.i3)} A ↓
              </text>

              {/* Ground Line & Ground Symbol */}
              <line x1="115" y1="365" x2="600" y2="365" stroke="#0f172a" strokeWidth="2.5" />
              <circle cx="330" cy="365" r="4.5" fill="#0f172a" />
              <line x1="330" y1="365" x2="330" y2="386" stroke="#0f172a" strokeWidth="2.5" />
              <line x1="312" y1="386" x2="348" y2="386" stroke="#0f172a" strokeWidth="2.5" />
              <line x1="319" y1="393" x2="341" y2="393" stroke="#0f172a" strokeWidth="2.5" />
              <line x1="325" y1="400" x2="335" y2="400" stroke="#0f172a" strokeWidth="2.5" />

              {/* Node Points & Live Voltage Readouts */}
              {/* Node v1 */}
              <circle cx="115" cy="205" r="6.5" fill="#0284c7" stroke="#ffffff" strokeWidth="2" />
              <rect x="20" y="187" width="84" height="34" rx="6" fill="#0f172a" />
              <text x="62" y="208" textAnchor="middle" className="font-mono text-xs font-bold fill-white">
                v₁ = {formatNum(sol.v1)}V
              </text>

              {/* Node v2 */}
              <circle cx="330" cy="205" r="6.5" fill="#d97706" stroke="#ffffff" strokeWidth="2" />
              <rect x="285" y="148" width="90" height="32" rx="6" fill="#0f172a" />
              <text x="330" y="168" textAnchor="middle" className="font-mono text-xs font-bold fill-amber-300">
                v₂ = {formatNum(sol.v2)}V
              </text>

              {/* Node v3 */}
              <circle cx="600" cy="205" r="6.5" fill="#d97706" stroke="#ffffff" strokeWidth="2" />
              <rect x="612" y="187" width="95" height="34" rx="6" fill="#0f172a" />
              <text x="660" y="208" textAnchor="middle" className="font-mono text-xs font-bold fill-amber-300">
                v₃ = {formatNum(sol.v3)}V
              </text>
            </svg>

            {/* Quick Polarity Invert Controls */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 bg-white border border-slate-200 rounded-lg p-3">
              <span className="text-xs text-slate-600">
                Experimenta invirtiendo la polaridad de la fuente en Caso A o en el Supernodo:
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() =>
                    setParams((p) => ({
                      ...p,
                      vs1Polarity: p.vs1Polarity === 'pos-node1' ? 'neg-node1' : 'pos-node1',
                    }))
                  }
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-md transition-colors whitespace-nowrap"
                >
                  <ArrowLeftRight className="w-3.5 h-3.5 text-sky-700" />
                  Caso A: Polaridad {params.vs1} V ({params.vs1Polarity === 'pos-node1' ? '+ en v₁' : '− en v₁'})
                </button>
                <button
                  onClick={() =>
                    setParams((p) => ({
                      ...p,
                      vsnPolarity: p.vsnPolarity === 'pos-node2' ? 'pos-node3' : 'pos-node2',
                    }))
                  }
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-md transition-colors whitespace-nowrap"
                >
                  <ArrowLeftRight className="w-3.5 h-3.5 text-amber-700" />
                  Supernodo {params.vsn} V ({params.vsnPolarity === 'pos-node2' ? '+ en v₂, − en v₃' : '− en v₂, + en v₃'})
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Zone: Equations & Sliders (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Complete Step-by-Step Equations */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-semibold text-slate-900 text-base">
                Planteamiento de Ecuaciones del Circuito
              </h3>
              <button
                onClick={() =>
                  onChangeSignConvention(
                    signConvention === 'leaving-zero' ? 'entering-equals-leaving' : 'leaving-zero'
                  )
                }
                className="text-xs font-mono text-sky-700 hover:underline whitespace-nowrap"
              >
                {signConvention === 'leaving-zero' ? 'Ver Σ i_entran = Σ i_salen' : 'Ver Σ i_salen = 0'}
              </button>
            </div>

            {/* Equation 1: Caso A */}
            <div
              className={`p-3.5 rounded-lg border ${
                activeFocus === 'caseA' ? 'bg-sky-50 border-sky-500' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="text-xs font-semibold text-slate-800">
                1. Caso A — Fuente de tensión conectada a referencia (Nodo 1):
              </div>
              <div className="font-mono text-sm font-bold text-sky-800 mt-1 tabular-nums">
                v₁ = {params.vs1Polarity === 'pos-node1' ? `+${params.vs1}` : `−${params.vs1}`} V
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                {params.vs1Polarity === 'pos-node1'
                  ? 'Terminal (+) en nodo 1 y (−) en tierra ⇒ v₁ = +V_fuente.'
                  : 'Terminal (−) en nodo 1 y (+) en tierra ⇒ v₁ = −V_fuente.'}
              </div>
            </div>

            {/* Equation 2: Caso B LCK en el Supernodo */}
            <div
              className={`p-3.5 rounded-lg border ${
                activeFocus === 'caseB-kcl' ? 'bg-amber-50 border-amber-500' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="text-xs font-semibold text-slate-800">
                2. Caso B — LCK aplicada a la frontera del Supernodo (v₂, v₃):
              </div>
              {signConvention === 'entering-equals-leaving' ? (
                <div className="space-y-1 mt-1 font-mono text-xs sm:text-sm tabular-nums">
                  <div className="text-slate-600">i₁ + i₄ = i₂ + i₃</div>
                  <div className="font-semibold text-slate-900">
                    ({formatNum(sol.v1)} − v₂)/{params.r1} + ({formatNum(sol.v1)} − v₃)/{params.r4} = v₂/{params.r2} + v₃/{params.r3}
                  </div>
                </div>
              ) : (
                <div className="space-y-1 mt-1 font-mono text-xs sm:text-sm tabular-nums">
                  <div className="text-slate-600">−i₁ + i₂ + i₃ − i₄ = 0</div>
                  <div className="font-semibold text-slate-900">
                    (v₂ − {formatNum(sol.v1)})/{params.r1} + v₂/{params.r2} + (v₃ − {formatNum(sol.v1)})/{params.r4} + v₃/{params.r3} = 0
                  </div>
                </div>
              )}
              <div className="text-[11px] font-mono text-emerald-700 mt-1.5 tabular-nums">
                Comprobación de frontera: Σ i_entran = {formatNum(sol.totalEnteringSupernode)} A | Σ i_salen = {formatNum(sol.totalLeavingSupernode)} A
              </div>
            </div>

            {/* Equation 3: Ecuación de Restricción LTK */}
            <div
              className={`p-3.5 rounded-lg border ${
                activeFocus === 'caseB-kvl' ? 'bg-amber-50 border-amber-500' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="text-xs font-semibold text-slate-800">
                3. Ecuación de Restricción del Supernodo (LTK):
              </div>
              <div className="font-mono text-sm font-bold text-amber-900 mt-1 tabular-nums">
                {params.vsnPolarity === 'pos-node2'
                  ? `v₂ − v₃ = ${params.vsn} V  ⇒  v₂ = v₃ + ${params.vsn}`
                  : `v₃ − v₂ = ${params.vsn} V  ⇒  v₂ = v₃ − ${params.vsn}`}
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                Relaciona los nodos unidos por la fuente mediante v_a − v_b = V_fuente.
              </div>
            </div>

            {/* Final Calculated Node Voltages */}
            <div className="bg-slate-900 text-white rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span>Tensiones Nodales Resueltas:</span>
                <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Sistema Cerrado (LCK + LTK)
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-1 font-mono tabular-nums">
                <div className="bg-slate-800 px-2.5 py-2 rounded border border-slate-700">
                  <div className="text-[10px] text-slate-400">Nodo 1 (Caso A)</div>
                  <div className="text-sm font-bold text-sky-300">v₁ = {formatNum(sol.v1)} V</div>
                </div>
                <div className="bg-slate-800 px-2.5 py-2 rounded border border-slate-700">
                  <div className="text-[10px] text-slate-400">Nodo 2 (Supernodo)</div>
                  <div className="text-sm font-bold text-amber-300">v₂ = {formatNum(sol.v2)} V</div>
                </div>
                <div className="bg-slate-800 px-2.5 py-2 rounded border border-slate-700">
                  <div className="text-[10px] text-slate-400">Nodo 3 (Supernodo)</div>
                  <div className="text-sm font-bold text-amber-300">v₃ = {formatNum(sol.v3)} V</div>
                </div>
              </div>
            </div>
          </div>

          {/* Sliders */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3.5">
            <h3 className="font-display font-semibold text-slate-900 text-sm">
              Modificar Valores del Circuito en Vivo
            </h3>
            <div className="grid grid-cols-2 gap-3.5">
              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-slate-700">Fuente Caso A (V_s1):</span>
                  <span className="font-mono font-semibold text-indigo-700 tabular-nums">{params.vs1} V</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="24"
                  step="1"
                  value={params.vs1}
                  onChange={(e) => setParams((p) => ({ ...p, vs1: Number(e.target.value) }))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-slate-700">Fuente Supernodo:</span>
                  <span className="font-mono font-semibold text-amber-700 tabular-nums">{params.vsn} V</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="20"
                  step="1"
                  value={params.vsn}
                  onChange={(e) => setParams((p) => ({ ...p, vsn: Number(e.target.value) }))}
                  className="w-full accent-amber-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-slate-700">R₁ (entre v₁ y v₂):</span>
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
                  <span className="text-slate-700">R₂ (v₂ a tierra):</span>
                  <span className="font-mono font-semibold text-slate-900 tabular-nums">{params.r2} Ω</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="16"
                  step="1"
                  value={params.r2}
                  onChange={(e) => setParams((p) => ({ ...p, r2: Number(e.target.value) }))}
                  className="w-full accent-slate-800 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-slate-700">R₃ (v₃ a tierra):</span>
                  <span className="font-mono font-semibold text-slate-900 tabular-nums">{params.r3} Ω</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="16"
                  step="1"
                  value={params.r3}
                  onChange={(e) => setParams((p) => ({ ...p, r3: Number(e.target.value) }))}
                  className="w-full accent-slate-800 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-slate-700">R₄ (superior v₁ a v₃):</span>
                  <span className="font-mono font-semibold text-slate-900 tabular-nums">{params.r4} Ω</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="16"
                  step="1"
                  value={params.r4}
                  onChange={(e) => setParams((p) => ({ ...p, r4: Number(e.target.value) }))}
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
