import React, { useState } from 'react';
import { RotateCcw, CheckCircle2, AlertTriangle, HelpCircle } from 'lucide-react';
import { GuidedSupernodeParams } from '../types/circuit';
import { DEFAULT_GUIDED_SUPERNODE, solveGuidedSupernode, formatNum } from '../utils/circuitSolver';

interface Module4Props {
  presentationMode: boolean;
}

export const Module4GuidedSupernode: React.FC<Module4Props> = ({ presentationMode }) => {
  const [params, setParams] = useState<GuidedSupernodeParams>(DEFAULT_GUIDED_SUPERNODE);
  const [showParallelExplanation, setShowParallelExplanation] = useState<boolean>(false);

  // Interactive Student Sign Builder for the Guided Example
  const [signI2, setSignI2] = useState<'+' | '-'>('+'); // 7A leaving -> should be '+'
  const [signI1, setSignI1] = useState<'+' | '-'>('-'); // 2A entering -> should be '-'
  const [includeR3InKCL, setIncludeR3InKCL] = useState<boolean>(false);
  const [kvlOrder, setKvlOrder] = useState<'v2-v1' | 'v1-v2'>('v2-v1');

  const sol = solveGuidedSupernode(params);

  const expectedSignI2 = params.i2Direction === 'leaving' ? '+' : '-';
  const expectedSignI1 = params.i1Direction === 'leaving' ? '+' : '-';
  const expectedKvlOrder = params.vsnPolarity === 'pos-node2' ? 'v2-v1' : 'v1-v2';

  const isKclCorrect = signI2 === expectedSignI2 && signI1 === expectedSignI1 && !includeR3InKCL;
  const isKvlCorrect = kvlOrder === expectedKvlOrder;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="text-xs font-medium text-slate-500">
              Ejemplo Guiado de Análisis de Nodos con Supernodo
            </div>
            <h2 className={`font-display font-bold text-slate-900 mt-0.5 ${presentationMode ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'}`}>
              04. Taller Práctico: Resolución de Supernodo (2 A, 7 A, 2 V y 2 Ω, 4 Ω, 10 Ω)
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowParallelExplanation((v) => !v)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 ${
                showParallelExplanation
                  ? 'bg-amber-50 border-amber-400 text-amber-900'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
              ¿Qué pasa con el resistor de {params.r3} Ω?
            </button>
            <button
              onClick={() => {
                setParams(DEFAULT_GUIDED_SUPERNODE);
                setSignI2('+');
                setSignI1('-');
                setIncludeR3InKCL(false);
                setKvlOrder('v2-v1');
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Restaurar valores
            </button>
          </div>
        </div>

        {/* Highlighted Pedagogical Insight on the 10 Ohm Parallel Resistor */}
        {showParallelExplanation ? (
          <div className="mt-4 bg-amber-50/90 border border-amber-300 rounded-lg p-4 space-y-2">
            <div className="text-xs font-bold text-amber-950">
              Propiedad clave del Supernodo: ¿Por qué el resistor R₃ = {params.r3} Ω en paralelo entre v₁ y v₂ no aparece en la ecuación LCK?
            </div>
            <p className="text-xs sm:text-sm text-amber-900 leading-relaxed">
              Como el resistor de <span className="font-mono font-semibold">{params.r3} Ω</span> está conectado directamente entre los nodos 1 y 2 (ambos incluidos dentro del supernodo), cualquier corriente que sale del nodo 1 por esa rama (<span className="font-mono">(v₁ − v₂)/{params.r3}</span>) entra inmediatamente al nodo 2 (<span className="font-mono">(v₂ − v₁)/{params.r3}</span>). Al sumar todas las corrientes del supernodo:
              <span className="font-mono font-semibold block mt-1">
                (v₁ − v₂)/{params.r3} + (v₂ − v₁)/{params.r3} = 0
              </span>
              Por lo tanto, las ramas conectadas en paralelo dentro de un mismo supernodo no cruzan su frontera exterior y no alteran la ecuación global de LCK (aunque por R₃ sí circula una corriente interna de <span className="font-mono font-semibold">{formatNum(Math.abs(sol.iR3From1To2))} A</span>).
            </p>
          </div>
        ) : (
          <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-600">
            <span>
              <strong>Meta del ejercicio:</strong> Verificar que la LCK del supernodo es <span className="font-mono font-semibold text-slate-900">v₁/2 + v₂/4 + 7 − 2 = 0</span> (equivalente a <span className="font-mono font-semibold text-slate-900">2v₁ + v₂ = −20</span>) y la restricción de la fuente es <span className="font-mono font-semibold text-slate-900">v₂ − v₁ = 2</span>.
            </span>
          </div>
        )}
      </div>

      {/* Main Two-Zone Sandbox */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Zone: Interactive SVG Schematic (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-5 py-3.5 border-b border-slate-200">
            <h3 className="font-display font-semibold text-slate-900 text-base">
              Esquema del Circuito con Supernodo y Fuentes de Corriente
            </h3>
            <p className="text-xs text-slate-500">
              El supernodo encierra la fuente de {params.vsn} V (y el resistor en paralelo de {params.r3} Ω). Haz clic en cualquier fuente para invertir su orientación.
            </p>
          </div>

          <div className="p-4 sm:p-6 bg-technical-grid">
            <svg
              viewBox="0 0 740 410"
              className="w-full h-auto bg-white/95 border border-slate-200 rounded-lg shadow-2xs"
              role="img"
              aria-label="Circuito con fuentes de 2A y 7A, resistores de 2, 4 y 10 ohmios y fuente de 2V en el supernodo"
            >
              {/* Supernode Dashed Boundary enclosing Node 1, Node 2, 2V source, and parallel 10 Ohm resistor */}
              <rect
                x="195"
                y="42"
                width="350"
                height="168"
                rx="32"
                fill="rgba(254, 243, 199, 0.42)"
                stroke="#d97706"
                strokeWidth="2.5"
                strokeDasharray="8 5"
              />
              <text x="370" y="30" textAnchor="middle" className="font-display text-xs font-bold fill-amber-900">
                Frontera del Supernodo (LCK: v₁/{params.r1} + v₂/{params.r2} {sol.i2Leaving >= 0 ? `+ ${params.i2}` : `− ${params.i2}`} {sol.i1Leaving >= 0 ? `+ ${params.i1}` : `− ${params.i1}`} = 0)
              </text>

              {/* Top Parallel Branch inside Supernode: Resistor R3 = 10 Ohm (y = 78) */}
              <line x1="245" y1="165" x2="245" y2="78" stroke="#0f172a" strokeWidth="2.5" />
              <line x1="245" y1="78" x2="315" y2="78" stroke="#0f172a" strokeWidth="2.5" />
              <polyline
                points="315,78 325,65 340,91 355,65 370,91 385,65 400,91 415,65 425,78"
                fill="none"
                stroke={showParallelExplanation ? '#d97706' : '#475569'}
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
              <line x1="425" y1="78" x2="495" y2="78" stroke="#0f172a" strokeWidth="2.5" />
              <line x1="495" y1="78" x2="495" y2="165" stroke="#0f172a" strokeWidth="2.5" />
              <text x="370" y="58" textAnchor="middle" className="font-mono text-xs font-semibold fill-slate-700">
                R₃ = {params.r3} Ω (Interna al supernodo)
              </text>

              {/* Middle Supernode Branch: 2V Voltage Source between Node 1 (245,165) and Node 2 (495,165) */}
              <g
                className="cursor-pointer"
                onClick={() =>
                  setParams((p) => ({
                    ...p,
                    vsnPolarity: p.vsnPolarity === 'pos-node2' ? 'pos-node1' : 'pos-node2',
                  }))
                }
              >
                <line x1="245" y1="165" x2="338" y2="165" stroke="#0f172a" strokeWidth="2.5" />
                <line x1="402" y1="165" x2="495" y2="165" stroke="#0f172a" strokeWidth="2.5" />
                <circle cx="370" cy="165" r="32" fill="#ffffff" stroke="#d97706" strokeWidth="2.5" />
                <text x="353" y="170" textAnchor="middle" className="font-mono text-base font-bold fill-amber-800">
                  {params.vsnPolarity === 'pos-node2' ? '−' : '+'}
                </text>
                <text x="387" y="170" textAnchor="middle" className="font-mono text-base font-bold fill-amber-800">
                  {params.vsnPolarity === 'pos-node2' ? '+' : '−'}
                </text>
                <text x="370" y="126" textAnchor="middle" className="font-mono text-xs font-bold fill-amber-900">
                  {params.vsn} V (Restricción: {params.vsnPolarity === 'pos-node2' ? `v₂ − v₁ = ${params.vsn}` : `v₁ − v₂ = ${params.vsn}`})
                </text>
              </g>

              {/* Left Outer Branch: Current Source I1 = 2 A (x = 105) */}
              <g
                className="cursor-pointer"
                onClick={() =>
                  setParams((p) => ({
                    ...p,
                    i1Direction: p.i1Direction === 'entering' ? 'leaving' : 'entering',
                  }))
                }
              >
                <line x1="105" y1="165" x2="245" y2="165" stroke="#0f172a" strokeWidth="2.5" />
                <line x1="105" y1="165" x2="105" y2="225" stroke="#0f172a" strokeWidth="2.5" />
                <line x1="105" y1="285" x2="105" y2="345" stroke="#0f172a" strokeWidth="2.5" />
                <circle cx="105" cy="255" r="30" fill="#ffffff" stroke="#0284c7" strokeWidth="2.5" />
                {params.i1Direction === 'entering' ? (
                  <g>
                    <line x1="105" y1="272" x2="105" y2="238" stroke="#0284c7" strokeWidth="2.5" />
                    <polyline points="98,246 105,236 112,246" fill="none" stroke="#0284c7" strokeWidth="2.5" />
                  </g>
                ) : (
                  <g>
                    <line x1="105" y1="238" x2="105" y2="272" stroke="#0284c7" strokeWidth="2.5" />
                    <polyline points="98,264 105,274 112,264" fill="none" stroke="#0284c7" strokeWidth="2.5" />
                  </g>
                )}
                <text x="64" y="252" textAnchor="end" className="font-mono text-xs font-bold fill-sky-800">
                  {params.i1} A
                </text>
                <text x="64" y="268" textAnchor="end" className="font-sans text-[11px] fill-slate-500">
                  ({params.i1Direction === 'entering' ? 'Entra: −' + params.i1 : 'Sale: +' + params.i1})
                </text>
              </g>

              {/* Left Inner Branch: Resistor R1 = 2 Ohm from Node 1 (245,165) to Ground (245,345) */}
              <line x1="245" y1="165" x2="245" y2="215" stroke="#0f172a" strokeWidth="2.5" />
              <polyline
                points="245,215 231,225 259,240 231,255 259,270 231,285 259,300 245,310"
                fill="none"
                stroke="#0f172a"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
              <line x1="245" y1="310" x2="245" y2="345" stroke="#0f172a" strokeWidth="2.5" />
              <line
                x1="245"
                y1="180"
                x2="245"
                y2="335"
                stroke="#059669"
                strokeWidth="3"
                className={sol.iR1 >= 0 ? 'animate-current-forward' : 'animate-current-reverse'}
              />
              <text x="270" y="258" className="font-mono text-xs font-bold fill-slate-900">
                R₁ = {params.r1} Ω
              </text>
              <text x="270" y="276" className="font-mono text-[11px] font-semibold fill-emerald-700">
                v₁/{params.r1} = {formatNum(sol.iR1)} A
              </text>

              {/* Right Inner Branch: Resistor R2 = 4 Ohm from Node 2 (495,165) to Ground (495,345) */}
              <line x1="495" y1="165" x2="495" y2="215" stroke="#0f172a" strokeWidth="2.5" />
              <polyline
                points="495,215 481,225 509,240 481,255 509,270 481,285 509,300 495,310"
                fill="none"
                stroke="#0f172a"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
              <line x1="495" y1="310" x2="495" y2="345" stroke="#0f172a" strokeWidth="2.5" />
              <line
                x1="495"
                y1="180"
                x2="495"
                y2="335"
                stroke="#059669"
                strokeWidth="3"
                className={sol.iR2 >= 0 ? 'animate-current-forward' : 'animate-current-reverse'}
              />
              <text x="470" y="258" textAnchor="end" className="font-mono text-xs font-bold fill-slate-900">
                R₂ = {params.r2} Ω
              </text>
              <text x="470" y="276" textAnchor="end" className="font-mono text-[11px] font-semibold fill-emerald-700">
                v₂/{params.r2} = {formatNum(sol.iR2)} A
              </text>

              {/* Right Outer Branch: Current Source I2 = 7 A (x = 635) */}
              <g
                className="cursor-pointer"
                onClick={() =>
                  setParams((p) => ({
                    ...p,
                    i2Direction: p.i2Direction === 'entering' ? 'leaving' : 'entering',
                  }))
                }
              >
                <line x1="495" y1="165" x2="635" y2="165" stroke="#0f172a" strokeWidth="2.5" />
                <line x1="635" y1="165" x2="635" y2="225" stroke="#0f172a" strokeWidth="2.5" />
                <line x1="635" y1="285" x2="635" y2="345" stroke="#0f172a" strokeWidth="2.5" />
                <circle cx="635" cy="255" r="30" fill="#ffffff" stroke="#0284c7" strokeWidth="2.5" />
                {params.i2Direction === 'entering' ? (
                  <g>
                    <line x1="635" y1="272" x2="635" y2="238" stroke="#0284c7" strokeWidth="2.5" />
                    <polyline points="628,246 635,236 642,246" fill="none" stroke="#0284c7" strokeWidth="2.5" />
                  </g>
                ) : (
                  <g>
                    <line x1="635" y1="238" x2="635" y2="272" stroke="#0284c7" strokeWidth="2.5" />
                    <polyline points="628,264 635,274 642,264" fill="none" stroke="#0284c7" strokeWidth="2.5" />
                  </g>
                )}
                <text x="674" y="252" className="font-mono text-xs font-bold fill-sky-800">
                  {params.i2} A
                </text>
                <text x="674" y="268" className="font-sans text-[11px] fill-slate-500">
                  ({params.i2Direction === 'leaving' ? 'Sale: +' + params.i2 : 'Entra: −' + params.i2})
                </text>
              </g>

              {/* Ground Bus & Symbol */}
              <line x1="105" y1="345" x2="635" y2="345" stroke="#0f172a" strokeWidth="2.5" />
              <circle cx="370" cy="345" r="4.5" fill="#0f172a" />
              <line x1="370" y1="345" x2="370" y2="366" stroke="#0f172a" strokeWidth="2.5" />
              <line x1="352" y1="366" x2="388" y2="366" stroke="#0f172a" strokeWidth="2.5" />
              <line x1="359" y1="373" x2="381" y2="373" stroke="#0f172a" strokeWidth="2.5" />
              <line x1="365" y1="380" x2="375" y2="380" stroke="#0f172a" strokeWidth="2.5" />

              {/* Node 1 & Node 2 Badges */}
              <circle cx="245" cy="165" r="7" fill="#d97706" stroke="#ffffff" strokeWidth="2" />
              <rect x="140" y="118" width="95" height="32" rx="6" fill="#0f172a" />
              <text x="187" y="138" textAnchor="middle" className="font-mono text-xs font-bold fill-amber-300">
                v₁ = {formatNum(sol.v1)} V
              </text>

              <circle cx="495" cy="165" r="7" fill="#d97706" stroke="#ffffff" strokeWidth="2" />
              <rect x="505" y="118" width="95" height="32" rx="6" fill="#0f172a" />
              <text x="552" y="138" textAnchor="middle" className="font-mono text-xs font-bold fill-amber-300">
                v₂ = {formatNum(sol.v2)} V
              </text>
            </svg>
          </div>
        </div>

        {/* Right Zone: Interactive Equation Builder & Guided Solution (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Interactive Sign & Equation Verifier Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-semibold text-slate-900 text-base">
                Constructor y Verificador de Ecuaciones
              </h3>
              <span className="text-xs font-mono text-slate-500">Criterio: Σ i_salen = 0</span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Selecciona los signos correctos para plantear la ecuación de LCK del supernodo y la restricción de la fuente de tensión:
            </p>

            {/* Step A: Build Supernode KCL */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 space-y-3">
              <div className="text-xs font-semibold text-slate-800">
                1. Ecuación LCK en el Supernodo:
              </div>

              <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs sm:text-sm font-semibold">
                <span className="px-2 py-1 bg-white border border-slate-200 rounded">
                  v₁/{params.r1}
                </span>
                <span>+</span>
                <span className="px-2 py-1 bg-white border border-slate-200 rounded">
                  v₂/{params.r2}
                </span>

                {/* Sign Toggle for I2 (7A) */}
                <button
                  onClick={() => setSignI2((s) => (s === '+' ? '-' : '+'))}
                  className={`px-2.5 py-1 rounded border font-bold transition-colors ${
                    signI2 === expectedSignI2
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                      : 'bg-red-50 border-red-400 text-red-700'
                  }`}
                  title="Haz clic para cambiar el signo de la fuente de 7 A"
                >
                  {signI2} {params.i2}
                </button>

                {/* Sign Toggle for I1 (2A) */}
                <button
                  onClick={() => setSignI1((s) => (s === '+' ? '-' : '+'))}
                  className={`px-2.5 py-1 rounded border font-bold transition-colors ${
                    signI1 === expectedSignI1
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                      : 'bg-red-50 border-red-400 text-red-700'
                  }`}
                  title="Haz clic para cambiar el signo de la fuente de 2 A"
                >
                  {signI1} {params.i1}
                </button>

                {includeR3InKCL && (
                  <span className="px-2 py-1 bg-red-50 border border-red-300 text-red-700 rounded">
                    + (v₁−v₂)/{params.r3}
                  </span>
                )}

                <span>= 0</span>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="inline-flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeR3InKCL}
                    onChange={(e) => setIncludeR3InKCL(e.target.checked)}
                    className="rounded accent-amber-600"
                  />
                  ¿Incluir un solo término para R₃ = {params.r3} Ω? (Error común)
                </label>
              </div>

              {isKclCorrect ? (
                <div className="flex items-start gap-2 text-xs text-emerald-800 bg-emerald-50/80 border border-emerald-200 rounded p-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>¡Planteamiento LCK correcto!</strong> Equivalente a{' '}
                    <span className="font-mono font-bold">
                      {sol.coeffV1}v₁ + {sol.coeffV2}v₂ = {formatNum(sol.rhsScaled)}
                    </span>
                    .
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-2 text-xs text-red-800 bg-red-50/80 border border-red-200 rounded p-2.5">
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    {includeR3InKCL
                      ? `Recuerda que R₃ = ${params.r3} Ω está dentro del supernodo: sale de v₁ y entra a v₂, por lo que sus corrientes se cancelan entre sí.`
                      : 'Revisa los signos de las fuentes: con el criterio "corrientes que salen = 0", una fuente que SALE lleva (+) y una que ENTRA lleva (−).'}
                  </div>
                </div>
              )}
            </div>

            {/* Step B: Build Supernode Restriction Equation (LTK) */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 space-y-2.5">
              <div className="text-xs font-semibold text-slate-800">
                2. Ecuación de Restricción de la Fuente (LTK):
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setKvlOrder('v2-v1')}
                  className={`flex-1 py-1.5 px-3 rounded border font-mono text-xs font-semibold transition-colors ${
                    kvlOrder === 'v2-v1'
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  v₂ − v₁ = {params.vsn}
                </button>
                <button
                  onClick={() => setKvlOrder('v1-v2')}
                  className={`flex-1 py-1.5 px-3 rounded border font-mono text-xs font-semibold transition-colors ${
                    kvlOrder === 'v1-v2'
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  v₁ − v₂ = {params.vsn}
                </button>
              </div>
              {isKvlCorrect ? (
                <div className="text-xs text-emerald-700 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>
                    Correcto: el terminal (+) está en {params.vsnPolarity === 'pos-node2' ? 'v₂' : 'v₁'}.
                  </span>
                </div>
              ) : (
                <div className="text-xs text-red-700 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>
                    Cuidado con la polaridad: recuerda que v_(terminal +) − v_(terminal −) = V_fuente.
                  </span>
                </div>
              )}
            </div>

            {/* Step C: Final Resolution */}
            <div className="bg-slate-900 text-white rounded-lg p-4 space-y-2">
              <div className="text-xs text-slate-300 flex items-center justify-between">
                <span>Solución Algebraica Exacta:</span>
                <span className="font-mono text-amber-300">
                  v₂ = v₁ {sol.deltaV21 >= 0 ? `+ ${sol.deltaV21}` : `− ${Math.abs(sol.deltaV21)}`}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-1 font-mono tabular-nums">
                <div className="bg-slate-800 px-3 py-2 rounded border border-slate-700">
                  <div className="text-[11px] text-slate-400">Nodo 1 (v₁)</div>
                  <div className="text-base font-bold text-amber-300">
                    v₁ = {formatNum(sol.v1)} V
                  </div>
                </div>
                <div className="bg-slate-800 px-3 py-2 rounded border border-slate-700">
                  <div className="text-[11px] text-slate-400">Nodo 2 (v₂)</div>
                  <div className="text-base font-bold text-amber-300">
                    v₂ = {formatNum(sol.v2)} V
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sliders */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
            <h3 className="font-display font-semibold text-slate-900 text-sm">
              Experimentar con los Valores del Circuito
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-slate-700">Fuente I₁ (Nodo 1):</span>
                  <span className="font-mono font-semibold text-sky-700 tabular-nums">{params.i1} A</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="12"
                  step="1"
                  value={params.i1}
                  onChange={(e) => setParams((p) => ({ ...p, i1: Number(e.target.value) }))}
                  className="w-full accent-sky-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-slate-700">Fuente I₂ (Nodo 2):</span>
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
                  <span className="text-slate-700">Fuente Supernodo:</span>
                  <span className="font-mono font-semibold text-amber-700 tabular-nums">{params.vsn} V</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="12"
                  step="1"
                  value={params.vsn}
                  onChange={(e) => setParams((p) => ({ ...p, vsn: Number(e.target.value) }))}
                  className="w-full accent-amber-600 cursor-pointer"
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
                  max="10"
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
                  max="10"
                  step="1"
                  value={params.r2}
                  onChange={(e) => setParams((p) => ({ ...p, r2: Number(e.target.value) }))}
                  className="w-full accent-slate-800 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-slate-700">Resistor Paralelo R₃:</span>
                  <span className="font-mono font-semibold text-slate-900 tabular-nums">{params.r3} Ω</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="20"
                  step="2"
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
