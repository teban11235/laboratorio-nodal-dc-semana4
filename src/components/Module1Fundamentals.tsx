import React, { useState } from 'react';
import { RotateCcw, CheckCircle2, Info } from 'lucide-react';
import { FundamentalsParams } from '../types/circuit';
import { DEFAULT_FUNDAMENTALS, solveFundamentals, formatNum } from '../utils/circuitSolver';

interface Module1Props {
  presentationMode: boolean;
}

export const Module1Fundamentals: React.FC<Module1Props> = ({ presentationMode }) => {
  const [params, setParams] = useState<FundamentalsParams>(DEFAULT_FUNDAMENTALS);
  const [selectedConcept, setSelectedConcept] = useState<'nodo' | 'referencia' | 'lck' | 'ohm'>('ohm');
  const [assumedDirection, setAssumedDirection] = useState<'a-to-b' | 'b-to-a'>('a-to-b');

  const sol = solveFundamentals(params);

  const iCalculatedAssumed =
    assumedDirection === 'a-to-b'
      ? (sol.vaRel - sol.vbRel) / params.r1
      : (sol.vbRel - sol.vaRel) / params.r1;

  const isFlowRightAB = sol.iAB >= 0;
  const isFlowRightBC = sol.iBC >= 0;

  return (
    <div className="space-y-6">
      {/* Top Concept Selector Strip */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="text-xs font-medium text-slate-500">
              Conceptos Preliminares y Convención de Corriente
            </div>
            <h2 className={`font-display font-bold text-slate-900 mt-0.5 ${presentationMode ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'}`}>
              01. Fundamentos del Análisis Nodal y Convención en Resistores
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-lg">
            {[
              { id: 'nodo', label: '1. Nodo' },
              { id: 'referencia', label: '2. Nodo de Referencia (0 V)' },
              { id: 'lck', label: '3. Ley de Kirchhoff (LCK)' },
              { id: 'ohm', label: '4. Convención en un Resistor' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedConcept(tab.id as any)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                  selectedConcept === tab.id
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Concept Explanation Banner */}
        <div className="pt-4 grid grid-cols-1 lg:grid-cols-3 gap-4 items-center">
          <div className="lg:col-span-2">
            {selectedConcept === 'nodo' && (
              <div className="space-y-1">
                <div className="text-sm font-semibold text-slate-900">
                  Definición de Nodo
                </div>
                <p className={`text-slate-600 leading-relaxed ${presentationMode ? 'text-base' : 'text-sm'}`}>
                  Un <strong>nodo</strong> es cualquier punto del circuito donde se conectan dos o más elementos de circuito. En el análisis nodal, en lugar de buscar las corrientes de rama como incógnitas primarias, utilizamos las <strong>tensiones de nodo</strong> como variables principales del sistema.
                </p>
              </div>
            )}
            {selectedConcept === 'referencia' && (
              <div className="space-y-1">
                <div className="text-sm font-semibold text-slate-900">
                  Nodo de Referencia o Tierra: v = 0 V
                </div>
                <p className={`text-slate-600 leading-relaxed ${presentationMode ? 'text-base' : 'text-sm'}`}>
                  Para un circuito con <span className="font-mono font-medium">N</span> nodos, se elige <strong>1 nodo de referencia (tierra, 0 V)</strong> y quedan <span className="font-mono font-medium">N - 1</span> tensiones desconocidas medidas respecto de él. Prueba a cambiar el nodo de referencia en el diagrama: verás que los potenciales absolutos cambian, pero la diferencia <span className="font-mono">(v_a - v_b)</span> y la corriente real permanecen idénticas.
                </p>
              </div>
            )}
            {selectedConcept === 'lck' && (
              <div className="space-y-1">
                <div className="text-sm font-semibold text-slate-900">
                  Ley de Corriente de Kirchhoff — LCK
                </div>
                <p className={`text-slate-600 leading-relaxed ${presentationMode ? 'text-base' : 'text-sm'}`}>
                  La suma algebraica de las corrientes que entran a un nodo es igual a la suma de las corrientes que salen de él (<span className="font-mono">Σ i_entran = Σ i_salen</span>, o equivalentemente <span className="font-mono">Σ i_salen = 0</span>). En el Nodo B central puedes verificar en tiempo real este equilibrio de corrientes.
                </p>
              </div>
            )}
            {selectedConcept === 'ohm' && (
              <div className="space-y-1">
                <div className="text-sm font-semibold text-slate-900">
                  Convención Clave de Corriente en un Resistor
                </div>
                <p className={`text-slate-600 leading-relaxed ${presentationMode ? 'text-base' : 'text-sm'}`}>
                  En un resistor, la corriente física fluye siempre desde el <strong>nodo de mayor potencial hacia el nodo de menor potencial</strong>. Al plantear ecuaciones nodales, si asumimos que la corriente sale del nodo <span className="font-mono">k</span> hacia el nodo <span className="font-mono">m</span>, escribimos <span className="font-mono">i = (v_k - v_m) / R</span>.
                </p>
              </div>
            )}
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 flex items-center justify-between gap-4">
            <div>
              <div className="text-xs text-slate-500">Convención en un Resistor</div>
              <div className="font-mono text-base sm:text-lg font-semibold text-slate-900 mt-0.5">
                i = (v_mayor − v_menor) / R
              </div>
            </div>
            <div className="text-right font-mono text-xs text-slate-600 tabular-nums">
              <div>N = 4 nodos</div>
              <div className="text-sky-700 font-semibold">N − 1 = 3 incógnitas</div>
            </div>
          </div>
        </div>
      </div>

      {/* Two-Zone Sandbox Layout: 60% Left Interactive Schematic, 40% Right Control & Math Deck */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Zone: Interactive SVG Canvas (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-5 py-3.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-display font-semibold text-slate-900 text-base">
                Lienzo Experimental: Potenciales de Nodo y Flujo de Corriente
              </h3>
              <p className="text-xs text-slate-500">
                Haz clic en los botones inferiores o ajusta los deslizadores para observar cómo cambia el sentido de la corriente
              </p>
            </div>
            <button
              onClick={() => setParams(DEFAULT_FUNDAMENTALS)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Restaurar valores
            </button>
          </div>

          <div className="p-4 sm:p-6 bg-technical-grid">
            <svg
              viewBox="0 0 720 340"
              className="w-full h-auto bg-white/95 border border-slate-200 rounded-lg shadow-2xs"
              role="img"
              aria-label="Esquema interactivo de tres nodos no referenciados A, B y C conectados por resistores R1 y R2 respecto al nodo de referencia"
            >
              {/* Potential bar visual indicators behind nodes */}
              <g opacity="0.14">
                <rect
                  x="95"
                  y={Math.min(130, 130 - sol.vaRel * 3)}
                  width="30"
                  height={Math.abs(sol.vaRel * 3)}
                  fill={sol.vaRel >= 0 ? '#0284c7' : '#dc2626'}
                  rx="3"
                />
                <rect
                  x="345"
                  y={Math.min(130, 130 - sol.vbRel * 3)}
                  width="30"
                  height={Math.abs(sol.vbRel * 3)}
                  fill={sol.vbRel >= 0 ? '#0284c7' : '#dc2626'}
                  rx="3"
                />
                <rect
                  x="595"
                  y={Math.min(130, 130 - sol.vcRel * 3)}
                  width="30"
                  height={Math.abs(sol.vcRel * 3)}
                  fill={sol.vcRel >= 0 ? '#0284c7' : '#dc2626'}
                  rx="3"
                />
              </g>

              {/* Main Bottom Ground Bus */}
              <line x1="110" y1="265" x2="610" y2="265" stroke="#334155" strokeWidth="2.5" />
              {/* Vertical reference lines from nodes to ground bus (dashed voltage measurement lines) */}
              <line x1="110" y1="130" x2="110" y2="265" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4 4" />
              <line x1="360" y1="130" x2="360" y2="265" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4 4" />
              <line x1="610" y1="130" x2="610" y2="265" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4 4" />

              {/* Ground Symbol at the selected Reference Node */}
              {(() => {
                const gx =
                  params.referenceNode === 'a'
                    ? 110
                    : params.referenceNode === 'b'
                    ? 360
                    : params.referenceNode === 'c'
                    ? 610
                    : 360;
                const gy = params.referenceNode === 'ground' ? 265 : 130;
                const dir = params.referenceNode === 'ground' ? 1 : -1;
                return (
                  <g>
                    <line x1={gx} y1={gy} x2={gx} y2={gy + 22 * dir} stroke="#0f172a" strokeWidth="2.5" />
                    <line x1={gx - 18} y1={gy + 22 * dir} x2={gx + 18} y2={gy + 22 * dir} stroke="#0f172a" strokeWidth="2.5" />
                    <line x1={gx - 11} y1={gy + 29 * dir} x2={gx + 11} y2={gy + 29 * dir} stroke="#0f172a" strokeWidth="2.5" />
                    <line x1={gx - 5} y1={gy + 36 * dir} x2={gx + 5} y2={gy + 36 * dir} stroke="#0f172a" strokeWidth="2.5" />
                    <text
                      x={gx}
                      y={params.referenceNode === 'ground' ? 320 : 75}
                      textAnchor="middle"
                      className="font-mono text-[11px] font-semibold fill-slate-700"
                    >
                      Referencia (0 V)
                    </text>
                  </g>
                );
              })()}

              {/* Branch 1: Node A (110,130) to Node B (360,130) with Resistor R1 */}
              <line x1="110" y1="130" x2="190" y2="130" stroke="#1e293b" strokeWidth="2.5" />
              <polyline
                points="190,130 198,116 212,144 226,116 240,144 254,116 268,144 276,130"
                fill="none"
                stroke="#0f172a"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
              <line x1="276" y1="130" x2="360" y2="130" stroke="#1e293b" strokeWidth="2.5" />

              {/* Animated Current Overlay on Branch AB */}
              {Math.abs(sol.iAB) > 0.01 && (
                <line
                  x1="125"
                  y1="130"
                  x2="345"
                  y2="130"
                  stroke="#059669"
                  strokeWidth="3.5"
                  className={isFlowRightAB ? 'animate-current-forward' : 'animate-current-reverse'}
                />
              )}

              {/* Polarity marks + and - on Resistor R1 according to actual higher potential */}
              <text
                x="182"
                y="112"
                textAnchor="middle"
                className="font-mono text-sm font-bold fill-sky-700"
              >
                {sol.vaRel >= sol.vbRel ? '+' : '−'}
              </text>
              <text
                x="284"
                y="112"
                textAnchor="middle"
                className="font-mono text-sm font-bold fill-sky-700"
              >
                {sol.vaRel >= sol.vbRel ? '−' : '+'}
              </text>

              <text x="233" y="102" textAnchor="middle" className="font-mono text-xs font-semibold fill-slate-800">
                R₁ = {params.r1} Ω
              </text>

              {/* Current arrow and readout for i_AB */}
              <g transform="translate(233, 172)">
                <rect x="-78" y="-15" width="156" height="26" rx="5" fill="#ecfdf5" stroke="#a7f3d0" />
                <text x="0" y="2" textAnchor="middle" className="font-mono text-xs font-semibold fill-emerald-800">
                  {Math.abs(sol.iAB) < 1e-4
                    ? 'i₁ = 0 A (Equilibrio)'
                    : isFlowRightAB
                    ? `i₁ = ${formatNum(Math.abs(sol.iAB))} A (A → B)`
                    : `i₁ = ${formatNum(Math.abs(sol.iAB))} A (B → A)`}
                </text>
              </g>

              {/* Branch 2: Node B (360,130) to Node C (610,130) with Resistor R2 */}
              <line x1="360" y1="130" x2="440" y2="130" stroke="#1e293b" strokeWidth="2.5" />
              <polyline
                points="440,130 448,116 462,144 476,116 490,144 504,116 518,144 526,130"
                fill="none"
                stroke="#0f172a"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
              <line x1="526" y1="130" x2="610" y2="130" stroke="#1e293b" strokeWidth="2.5" />

              {/* Animated Current Overlay on Branch BC */}
              {Math.abs(sol.iBC) > 0.01 && (
                <line
                  x1="375"
                  y1="130"
                  x2="595"
                  y2="130"
                  stroke="#059669"
                  strokeWidth="3.5"
                  className={isFlowRightBC ? 'animate-current-forward' : 'animate-current-reverse'}
                />
              )}

              <text x="483" y="102" textAnchor="middle" className="font-mono text-xs font-semibold fill-slate-800">
                R₂ = {params.r2} Ω
              </text>

              <g transform="translate(483, 172)">
                <rect x="-78" y="-15" width="156" height="26" rx="5" fill="#ecfdf5" stroke="#a7f3d0" />
                <text x="0" y="2" textAnchor="middle" className="font-mono text-xs font-semibold fill-emerald-800">
                  {Math.abs(sol.iBC) < 1e-4
                    ? 'i₂ = 0 A (Equilibrio)'
                    : isFlowRightBC
                    ? `i₂ = ${formatNum(Math.abs(sol.iBC))} A (B → C)`
                    : `i₂ = ${formatNum(Math.abs(sol.iBC))} A (C → B)`}
                </text>
              </g>

              {/* Node A */}
              <g className="cursor-pointer" onClick={() => setParams((p) => ({ ...p, referenceNode: 'a' }))}>
                <circle
                  cx="110"
                  cy="130"
                  r="10"
                  fill={sol.vaRel >= sol.vbRel ? '#0284c7' : '#ffffff'}
                  stroke="#0284c7"
                  strokeWidth="3"
                />
                <rect x="48" y="34" width="124" height="46" rx="6" fill="#f8fafc" stroke="#cbd5e1" />
                <text x="110" y="53" textAnchor="middle" className="font-display text-xs font-bold fill-slate-800">
                  Nodo a {sol.vaRel > sol.vbRel ? '(v_mayor)' : sol.vaRel < sol.vbRel ? '(v_menor)' : ''}
                </text>
                <text x="110" y="71" textAnchor="middle" className="font-mono text-sm font-bold fill-sky-700">
                  v_a = {formatNum(sol.vaRel)} V
                </text>
              </g>

              {/* Node B */}
              <g className="cursor-pointer" onClick={() => setParams((p) => ({ ...p, referenceNode: 'b' }))}>
                <circle
                  cx="360"
                  cy="130"
                  r="10"
                  fill="#0284c7"
                  stroke="#0f172a"
                  strokeWidth="3"
                />
                <rect x="298" y="34" width="124" height="46" rx="6" fill="#f8fafc" stroke="#cbd5e1" />
                <text x="360" y="53" textAnchor="middle" className="font-display text-xs font-bold fill-slate-800">
                  Nodo b (Central)
                </text>
                <text x="360" y="71" textAnchor="middle" className="font-mono text-sm font-bold fill-sky-700">
                  v_b = {formatNum(sol.vbRel)} V
                </text>
              </g>

              {/* Node C */}
              <g className="cursor-pointer" onClick={() => setParams((p) => ({ ...p, referenceNode: 'c' }))}>
                <circle
                  cx="610"
                  cy="130"
                  r="10"
                  fill="#ffffff"
                  stroke="#0284c7"
                  strokeWidth="3"
                />
                <rect x="548" y="34" width="124" height="46" rx="6" fill="#f8fafc" stroke="#cbd5e1" />
                <text x="610" y="53" textAnchor="middle" className="font-display text-xs font-bold fill-slate-800">
                  Nodo c
                </text>
                <text x="610" y="71" textAnchor="middle" className="font-mono text-sm font-bold fill-sky-700">
                  v_c = {formatNum(sol.vcRel)} V
                </text>
              </g>

              {/* Potential Difference Annotation across R1 */}
              <text x="233" y="232" textAnchor="middle" className="font-mono text-xs fill-slate-600">
                Δv_ab = v_a − v_b = ({formatNum(sol.vaRel)}) − ({formatNum(sol.vbRel)}) = {formatNum(sol.vDiffAB)} V
              </text>
            </svg>

            {/* Reference Node Selector Strip below Canvas */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 bg-white border border-slate-200 rounded-lg p-3">
              <div className="text-xs font-medium text-slate-700">
                Seleccionar Nodo de Referencia (Tierra = 0 V):
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  { id: 'ground', label: 'Tierra Inferior (Estándar)' },
                  { id: 'a', label: 'Fijar Nodo a = 0 V' },
                  { id: 'b', label: 'Fijar Nodo b = 0 V' },
                  { id: 'c', label: 'Fijar Nodo c = 0 V' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setParams((p) => ({ ...p, referenceNode: opt.id as any }))}
                    className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                      params.referenceNode === opt.id
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Zone: Parameter Controls & Live Inspector (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Parameter Sliders Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
            <h3 className="font-display font-semibold text-slate-900 text-base">
              Parámetros de Potencial Nodal y Resistencia
            </h3>

            <div className="space-y-3.5">
              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-slate-700">Potencial del Nodo a (v_a):</span>
                  <span className="font-mono font-semibold text-sky-700 tabular-nums">
                    {formatNum(sol.vaRel)} V
                  </span>
                </div>
                <input
                  type="range"
                  min="-15"
                  max="20"
                  step="1"
                  value={params.va}
                  onChange={(e) => setParams((p) => ({ ...p, va: Number(e.target.value) }))}
                  className="w-full accent-sky-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-slate-700">Potencial del Nodo b (v_b):</span>
                  <span className="font-mono font-semibold text-sky-700 tabular-nums">
                    {formatNum(sol.vbRel)} V
                  </span>
                </div>
                <input
                  type="range"
                  min="-15"
                  max="20"
                  step="1"
                  value={params.vb}
                  onChange={(e) => setParams((p) => ({ ...p, vb: Number(e.target.value) }))}
                  className="w-full accent-sky-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-slate-700">Potencial del Nodo c (v_c):</span>
                  <span className="font-mono font-semibold text-sky-700 tabular-nums">
                    {formatNum(sol.vcRel)} V
                  </span>
                </div>
                <input
                  type="range"
                  min="-15"
                  max="20"
                  step="1"
                  value={params.vc}
                  onChange={(e) => setParams((p) => ({ ...p, vc: Number(e.target.value) }))}
                  className="w-full accent-sky-600 cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                <div>
                  <div className="flex justify-between text-xs font-medium mb-1">
                    <span className="text-slate-700">Resistor R₁:</span>
                    <span className="font-mono font-semibold text-slate-900 tabular-nums">
                      {params.r1} Ω
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    step="1"
                    value={params.r1}
                    onChange={(e) => setParams((p) => ({ ...p, r1: Number(e.target.value) }))}
                    className="w-full accent-slate-800 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium mb-1">
                    <span className="text-slate-700">Resistor R₂:</span>
                    <span className="font-mono font-semibold text-slate-900 tabular-nums">
                      {params.r2} Ω
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    step="1"
                    value={params.r2}
                    onChange={(e) => setParams((p) => ({ ...p, r2: Number(e.target.value) }))}
                    className="w-full accent-slate-800 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Verification of Current Convention */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-display font-semibold text-slate-900 text-base">
                Comprobador de Convención de Corriente en R₁
              </h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Al escribir la ecuación de un nodo, a menudo <strong>no sabemos de antemano</strong> qué nodo tiene mayor potencial. ¿Qué pasa si asumimos que la corriente sale de un nodo u otro?
            </p>

            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg">
              <button
                onClick={() => setAssumedDirection('a-to-b')}
                className={`flex-1 py-1.5 px-3 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  assumedDirection === 'a-to-b'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Asumir que sale de a (a → b)
              </button>
              <button
                onClick={() => setAssumedDirection('b-to-a')}
                className={`flex-1 py-1.5 px-3 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  assumedDirection === 'b-to-a'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Asumir que sale de b (b → a)
              </button>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2.5 font-mono text-xs sm:text-sm tabular-nums">
              {assumedDirection === 'a-to-b' ? (
                <>
                  <div className="text-slate-500 text-xs">
                    Expresión saliendo del Nodo a (v_a como v_mayor asumido):
                  </div>
                  <div className="text-slate-900 font-semibold">
                    i_ab = (v_a − v_b) / R₁ = ({formatNum(sol.vaRel)} − ({formatNum(sol.vbRel)})) / {params.r1} ={' '}
                    <span className={iCalculatedAssumed >= 0 ? 'text-emerald-700' : 'text-amber-700'}>
                      {formatNum(iCalculatedAssumed)} A
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-slate-500 text-xs">
                    Expresión saliendo del Nodo b (v_b como v_mayor asumido):
                  </div>
                  <div className="text-slate-900 font-semibold">
                    i_ba = (v_b − v_a) / R₁ = ({formatNum(sol.vbRel)} − ({formatNum(sol.vaRel)})) / {params.r1} ={' '}
                    <span className={iCalculatedAssumed >= 0 ? 'text-emerald-700' : 'text-amber-700'}>
                      {formatNum(iCalculatedAssumed)} A
                    </span>
                  </div>
                </>
              )}

              <div className="pt-2 border-t border-slate-200 font-sans text-xs text-slate-700 flex items-start gap-2">
                {iCalculatedAssumed >= 0 ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>Signo positivo (+):</strong> Confirma que el potencial inicial elegido es efectivamente el mayor y la corriente real fluye en la dirección asumida.
                    </span>
                  </>
                ) : (
                  <>
                    <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>Signo negativo (−):</strong> La magnitud ({formatNum(Math.abs(iCalculatedAssumed))} A) es exacta; el signo menos indica automáticamente que el potencial mayor está en el nodo opuesto. Por eso escribir <span className="font-mono">(v_nodo − v_vecino) / R</span> para corrientes que salen funciona siempre.
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
