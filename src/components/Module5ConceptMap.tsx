import React, { useState } from 'react';
import { CheckCircle2, RotateCcw, Eye, Network } from 'lucide-react';

interface Module5Props {
  presentationMode: boolean;
}

interface BranchItem {
  id: string;
  stepNum: string;
  title: string;
  connector: string;
  children: string[];
  formula?: string;
}

const CONCEPT_BRANCHES: BranchItem[] = [
  {
    id: 'ref',
    stepNum: '01',
    title: 'Elegir nodo de referencia',
    connector: 'inicia definiendo',
    children: [
      'Marcar el nodo con símbolo de tierra (v = 0 V)',
      'Todas las demás tensiones se miden respecto a este nodo',
    ],
    formula: 'v_ref = 0 V  ⇒  Quedan (N − 1) incógnitas',
  },
  {
    id: 'assign',
    stepNum: '02',
    title: 'Asignar tensiones de nodo',
    connector: 'identifica variables',
    children: [
      'Rotular cada nodo de no referencia con una variable: v₁, v₂, ..., vₙ₋₁',
      'Ser consistente en la polaridad (+ en el nodo respecto a tierra)',
    ],
    formula: 'Variables primarias: v₁, v₂, ..., v_(N−1)',
  },
  {
    id: 'kcl',
    stepNum: '03',
    title: 'Aplicar LCK en cada nodo de no referencia',
    connector: 'formula corrientes con',
    children: [
      'Escoger una convención de signos consistente (ej. corrientes que salen = 0)',
      'Expresar cada corriente de rama resistiva mediante la Ley de Ohm',
    ],
    formula: 'i = (v_mayor − v_menor) / R',
  },
  {
    id: 'supernode',
    stepNum: '04',
    title: 'Presencia de fuentes de tensión (Caso A y Supernodo)',
    connector: 'si hay fuentes de voltaje',
    children: [
      'Caso A (a tierra): fija directamente la tensión del nodo (v_k = ±V_fuente)',
      'Caso B (entre dos nodos): encerrar en un Supernodo (LCK global + restricción LTK)',
    ],
    formula: 'v_a − v_b = V_fuente  (Restricción LTK)',
  },
  {
    id: 'system',
    stepNum: '05',
    title: 'Escribir y resolver el sistema de ecuaciones',
    connector: 'conduce al sistema',
    children: [
      'Reordenar términos agrupando coeficientes de v₁, v₂, ... (forma matricial opcional)',
      'Obtener valores de v_k y calcular corrientes de rama y potencias',
    ],
    formula: 'G · v = i  ⇒  Solución de tensiones nodales',
  },
  {
    id: 'importance',
    stepNum: '06',
    title: 'Importancia y verificación de coherencia',
    connector: 'permite validar',
    children: [
      'Método sistemático ideal para resolución algebraica o software de análisis',
      'Sustituir las tensiones halladas en las ecuaciones originales para comprobar LCK',
    ],
    formula: 'Circuito → Nodos → Ecuaciones Nodales → Solución',
  },
];

interface ChainSlot {
  id: string;
  chainTitle: string;
  prompt: string;
  expected: string;
  explanation: string;
}

const CONCEPT_SLOTS: ChainSlot[] = [
  {
    id: 'slot1',
    chainTitle: 'Relación 1: Del punto de conexión al potencial nodal',
    prompt: 'Nodo  →  [ ? ]  →  Tensión de nodo',
    expected: 'Nodo de referencia (0 V)',
    explanation:
      'Para definir cualquier tensión de nodo es indispensable elegir primero el nodo de referencia o tierra (0 V) respecto al cual se miden las demás tensiones.',
  },
  {
    id: 'slot2',
    chainTitle: 'Relación 2: De las tensiones a las ecuaciones del sistema',
    prompt: 'Tensión de nodo  →  Corrientes de rama (Ley de Ohm)  →  [ ? ]  →  Ecuaciones nodales',
    expected: 'Ley de Corrientes de Kirchhoff (LCK)',
    explanation:
      'Una vez expresadas las corrientes de rama como (v_k − v_m)/R con la Ley de Ohm, se aplica la LCK en cada nodo para obtener las ecuaciones nodales.',
  },
  {
    id: 'slot3',
    chainTitle: 'Relación 3: Fuentes de tensión entre dos nodos no referenciados',
    prompt: 'Fuente de voltaje entre 2 nodos  →  Supernodo (LCK global)  →  [ ? ]',
    expected: 'Ecuación de restricción (LTK: v_a − v_b = V)',
    explanation:
      'Como la corriente dentro de la fuente de tensión es desconocida, la LCK en el supernodo debe complementarse con la ecuación de restricción de voltajes (LTK).',
  },
  {
    id: 'slot4',
    chainTitle: 'Relación 4: Flujo completo del método nodal en DC',
    prompt: 'Circuito  →  Nodos (N − 1 incógnitas)  →  Ecuaciones nodales  →  [ ? ]',
    expected: 'Solución y verificación de tensiones/corrientes',
    explanation:
      'El proceso completo culmina al resolver el sistema simultáneo y verificar la coherencia sustituyendo los valores en las ecuaciones planteadas.',
  },
];

const OPTIONS_BANK = [
  'Nodo de referencia (0 V)',
  'Ley de Corrientes de Kirchhoff (LCK)',
  'Ecuación de restricción (LTK: v_a − v_b = V)',
  'Solución y verificación de tensiones/corrientes',
];

export const Module5ConceptMap: React.FC<Module5Props> = ({ presentationMode }) => {
  const [mode, setMode] = useState<'explore' | 'builder'>('explore');
  const [selectedBranchId, setSelectedBranchId] = useState<string>('kcl');
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const selectedBranch = CONCEPT_BRANCHES.find((b) => b.id === selectedBranchId) || CONCEPT_BRANCHES[0];

  const correctCount = CONCEPT_SLOTS.filter((s) => answers[s.id] === s.expected).length;

  return (
    <div className="space-y-6">
      {/* Header & Mode Switcher */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-medium text-slate-500">
              Síntesis Visual y Jerarquía de Conceptos
            </div>
            <h2 className={`font-display font-bold text-slate-900 mt-0.5 ${presentationMode ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'}`}>
              05. Mapa Conceptual Interactivo: Análisis Nodal y Supernodos
            </h2>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg">
            <button
              onClick={() => setMode('explore')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                mode === 'explore'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Explorar Mapa Conceptual
            </button>
            <button
              onClick={() => setMode('builder')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                mode === 'builder'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Construir Relaciones ({correctCount}/4)
            </button>
          </div>
        </div>
      </div>

      {mode === 'explore' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Interactive Concept Map Tree (7 cols) */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-display font-semibold text-slate-900 text-base">
                  Estructura del Procedimiento para Análisis Nodal en DC
                </h3>
                <p className="text-xs text-slate-500">
                  Selecciona cualquier rama del mapa para inspeccionar sus subconceptos y fórmulas asociadas
                </p>
              </div>
            </div>

            {/* Central Trunk + 6 Interactive Nodes */}
            <div className="space-y-3">
              <div className="bg-slate-900 text-white rounded-lg px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Network className="w-4 h-4 text-sky-400 shrink-0" />
                  <span className="font-display font-bold text-sm sm:text-base">
                    Análisis de Circuitos en DC con el Método de Nodos
                  </span>
                </div>
                <span className="font-mono text-xs text-sky-300">Nodo Central</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {CONCEPT_BRANCHES.map((branch) => {
                  const isSelected = branch.id === selectedBranchId;
                  return (
                    <button
                      key={branch.id}
                      onClick={() => setSelectedBranchId(branch.id)}
                      className={`text-left p-3.5 rounded-lg border transition-colors ${
                        isSelected
                          ? 'bg-sky-50/80 border-sky-600'
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="font-semibold text-sky-700">
                          {branch.stepNum} · {branch.connector}
                        </span>
                      </div>
                      <div className="font-display font-semibold text-slate-900 text-sm mt-1">
                        {branch.title}
                      </div>
                      <ul className="mt-2 space-y-1 text-xs text-slate-600">
                        {branch.children.map((c, idx) => (
                          <li key={idx} className="line-clamp-1">
                            • {c}
                          </li>
                        ))}
                      </ul>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Detailed Inspector of Selected Node (5 cols) */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 space-y-4">
            <div className="text-xs font-mono font-semibold text-sky-700">
              DETALLE DE LA RAMA {selectedBranch.stepNum}
            </div>
            <h3 className="font-display font-bold text-slate-900 text-lg">
              {selectedBranch.title}
            </h3>

            <div className="space-y-2.5">
              {selectedBranch.children.map((child, i) => (
                <div
                  key={i}
                  className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-800 leading-relaxed"
                >
                  {child}
                </div>
              ))}
            </div>

            {selectedBranch.formula && (
              <div className="bg-slate-900 text-white rounded-lg p-4">
                <div className="text-[11px] text-slate-400">Expresión / Síntesis Matemática:</div>
                <div className="font-mono text-sm font-bold text-sky-300 mt-1">
                  {selectedBranch.formula}
                </div>
              </div>
            )}

            <div className="pt-2 border-t border-slate-100 text-xs text-slate-500 leading-relaxed">
              <strong>Secuencia completa del método:</strong> Circuito → Nodos → Ecuaciones nodales (LCK + LTK en supernodos) → Solución y comprobación.
            </div>
          </div>
        </div>
      ) : (
        /* Interactive Concept Link Builder */
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
            <div>
              <h3 className="font-display font-semibold text-slate-900 text-base">
                Conecta los Conceptos Fundamentales
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Completa las cuatro secuencias jerárquicas que conectan el análisis nodal y los supernodos:
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const full: Record<string, string> = {};
                  CONCEPT_SLOTS.forEach((s) => {
                    full[s.id] = s.expected;
                  });
                  setAnswers(full);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-300 rounded-lg transition-colors whitespace-nowrap"
              >
                <Eye className="w-3.5 h-3.5" />
                Completar para proyectar
              </button>
              <button
                onClick={() => setAnswers({})}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors whitespace-nowrap"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reiniciar
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CONCEPT_SLOTS.map((slot) => {
              const chosen = answers[slot.id] || '';
              const isCorrect = chosen === slot.expected;
              return (
                <div
                  key={slot.id}
                  className={`p-4 rounded-xl border space-y-3 ${
                    !chosen
                      ? 'bg-slate-50 border-slate-200'
                      : isCorrect
                      ? 'bg-emerald-50/60 border-emerald-400'
                      : 'bg-red-50/60 border-red-300'
                  }`}
                >
                  <div className="text-xs font-semibold text-slate-800">{slot.chainTitle}</div>
                  <div className="font-mono text-xs sm:text-sm font-semibold text-slate-900 bg-white border border-slate-200 rounded-lg p-3">
                    {slot.prompt.replace('[ ? ]', chosen ? `[ ${chosen} ]` : '[ Selecciona abajo ]')}
                  </div>

                  <div className="grid grid-cols-1 gap-1.5">
                    {OPTIONS_BANK.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setAnswers((prev) => ({ ...prev, [slot.id]: opt }))}
                        className={`text-left px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${
                          chosen === opt
                            ? isCorrect
                              ? 'bg-emerald-700 text-white border-emerald-700'
                              : 'bg-red-700 text-white border-red-700'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>

                  {chosen && (
                    <div className="text-xs text-slate-700 pt-1 flex items-start gap-1.5">
                      <CheckCircle2
                        className={`w-4 h-4 shrink-0 mt-0.5 ${
                          isCorrect ? 'text-emerald-600' : 'text-red-600'
                        }`}
                      />
                      <span>
                        {isCorrect
                          ? slot.explanation
                          : 'Revisa qué eslabón conecta directamente los dos conceptos de esta secuencia.'}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
