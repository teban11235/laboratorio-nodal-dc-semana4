import React, { useState } from 'react';
import { CheckCircle2, AlertCircle, RotateCcw, HelpCircle } from 'lucide-react';

interface Module6Props {
  presentationMode: boolean;
}

interface PracticeChallenge {
  id: string;
  category: string;
  title: string;
  scenario: string;
  formulaContext: string;
  question: string;
  options: { id: string; text: string; isCorrect: boolean; feedback: string }[];
}

const CHALLENGES: PracticeChallenge[] = [
  {
    id: 'c1',
    category: 'Criterio de Signos en LCK',
    title: 'Reto 1: Detector de error de signo en un nodo con fuente de corriente',
    scenario:
      'En un nodo v₁ están conectados: un resistor de 4 Ω a tierra, un resistor de 6 Ω hacia el nodo v₂, y una fuente de corriente de 3 A que ENTRA al nodo v₁.',
    formulaContext: 'Un estudiante aplica el criterio "Corrientes que salen del nodo = 0" y escribe:',
    question: 'v₁/4 + (v₁ − v₂)/6 + 3 = 0. ¿Es correcta esta ecuación?',
    options: [
      {
        id: 'a',
        text: 'No, porque como los 3 A entran al nodo, bajo el criterio "corrientes que salen = 0" debe llevar signo negativo: v₁/4 + (v₁ − v₂)/6 − 3 = 0.',
        isCorrect: true,
        feedback:
          'Exacto. Si asumimos positivas las corrientes que SALEN del nodo (v₁/4 y (v₁−v₂)/6), toda fuente que ENTRA al nodo debe incorporarse con signo negativo (−3) o colocarse al otro lado del igual (+3).',
      },
      {
        id: 'b',
        text: 'Sí, todas las fuentes de corriente siempre se suman con signo positivo sin importar su flecha.',
        isCorrect: false,
        feedback:
          'Incorrecto. Es fundamental mantener un solo criterio ("corrientes que salen" o "corrientes que entran") e incorporar las fuentes con el signo coherente a su dirección.',
      },
      {
        id: 'c',
        text: 'No, porque el término compartido debería escribirse (v₂ − v₁)/6 para una corriente que sale de v₁.',
        isCorrect: false,
        feedback:
          'Para la corriente que sale de v₁ hacia v₂, v₁ actúa como el potencial de partida, por lo que (v₁ − v₂)/6 sí está bien escrito.',
      },
    ],
  },
  {
    id: 'c2',
    category: 'Caso A vs. Caso B',
    title: 'Reto 2: Fuente de tensión conectada al nodo de referencia',
    scenario:
      'En un circuito con 4 nodos (1 de referencia y 3 no referenciados: v₁, v₂, v₃), se conecta una fuente de tensión ideal de 12 V entre el nodo 1 y tierra, con el terminal NEGATIVO (−) en el nodo 1 y el POSITIVO (+) en tierra.',
    formulaContext: 'De acuerdo con el Caso A (fuente de tensión entre nodo de referencia y nodo de no referencia):',
    question: '¿Cómo se trata el nodo 1 en el sistema de ecuaciones nodales?',
    options: [
      {
        id: 'a',
        text: 'Se forma un supernodo entre el nodo 1 y tierra y se escribe LCK sumando todas las ramas conectadas a tierra.',
        isCorrect: false,
        feedback:
          'No es necesario formar un supernodo cuando uno de los extremos de la fuente es el nodo de referencia (0 V).',
      },
      {
        id: 'b',
        text: 'El voltaje del nodo 1 queda fijado directamente en v₁ = −12 V y no es necesario aplicar LCK en ese nodo.',
        isCorrect: true,
        feedback:
          'Correcto. Como el terminal (−) está en el nodo 1 y el (+) en referencia (0 V), v₁ − 0 = −12 V, reduciendo en 1 el número de incógnitas del sistema.',
      },
      {
        id: 'c',
        text: 'Se aplica la Ley de Ohm directamente a la fuente dividiendo 12 V entre 0 Ω.',
        isCorrect: false,
        feedback:
          'Nunca se puede aplicar la Ley de Ohm (i = v/R) a una fuente ideal de tensión porque su resistencia interna es cero y su corriente depende del resto del circuito.',
      },
    ],
  },
  {
    id: 'c3',
    category: 'Supernodo y Restricción LTK',
    title: 'Reto 3: Ecuación de restricción y ramas en paralelo en un Supernodo',
    scenario:
      'Entre el nodo v_a y el nodo v_b (ninguno es tierra) hay una fuente de tensión de 8 V con su terminal (+) en v_b y su terminal (−) en v_a, además de un resistor de 20 Ω conectado en paralelo entre v_a y v_b.',
    formulaContext: 'Al plantear las ecuaciones del supernodo formado por v_a y v_b:',
    question: '¿Cuál es la ecuación de restricción correcta y qué ocurre con el resistor de 20 Ω?',
    options: [
      {
        id: 'a',
        text: 'Restricción: v_b − v_a = 8 V; y el resistor de 20 Ω no aparece en la LCK global del supernodo porque su corriente sale de un nodo del supernodo y entra al otro.',
        isCorrect: true,
        feedback:
          'Excelente. El nodo con el signo (+) menos el nodo con el signo (−) es igual a V_fuente (v_b − v_a = 8 V), y cualquier rama puramente interna entre v_a y v_b se cancela en la LCK del supernodo.',
      },
      {
        id: 'b',
        text: 'Restricción: v_a − v_b = 8 V; y el resistor de 20 Ω se suma dos veces en la LCK del supernodo.',
        isCorrect: false,
        feedback:
          'Revisa la polaridad: el terminal (+) está en v_b, por lo que v_b es mayor que v_a en 8 V (v_b − v_a = 8 V).',
      },
      {
        id: 'c',
        text: 'El supernodo tiene una única tensión propia v_sn = 8 V, por lo que v_a = 8 V y v_b = 8 V.',
        isCorrect: false,
        feedback:
          'El supernodo no tiene una tensión única propia, por lo que el análisis se realiza siempre a partir de las tensiones individuales de los nodos que lo integran.',
      },
    ],
  },
  {
    id: 'c4',
    category: 'Resolución Numérica',
    title: 'Reto 4: Verificación de coherencia en un sistema con supernodo',
    scenario:
      'En un ejercicio de supernodo obtienes la ecuación LCK simplificada 2v₁ + v₂ = −20 y la ecuación de restricción de la fuente v₂ − v₁ = 2.',
    formulaContext: 'Sustituyendo v₂ = v₁ + 2 en la primera ecuación:',
    question: '¿Cuáles son los valores exactos de las tensiones nodales v₁ y v₂?',
    options: [
      {
        id: 'a',
        text: 'v₁ = −22/3 V (≈ −7.33 V)  y  v₂ = −16/3 V (≈ −5.33 V)',
        isCorrect: true,
        feedback:
          'Correcto: 2v₁ + (v₁ + 2) = −20 ⇒ 3v₁ = −22 ⇒ v₁ = −7.33 V, y v₂ = −7.33 + 2 = −5.33 V. Ambos satisfacen 2(−7.33) + (−5.33) = −20.',
      },
      {
        id: 'b',
        text: 'v₁ = −6 V  y  v₂ = −8 V',
        isCorrect: false,
        feedback:
          'Si v₁ = −6 V y v₂ = −8 V, entonces v₂ − v₁ = −8 − (−6) = −2 V, lo que contradice la ecuación de restricción v₂ − v₁ = +2 V.',
      },
      {
        id: 'c',
        text: 'v₁ = +7.33 V  y  v₂ = +9.33 V',
        isCorrect: false,
        feedback:
          'Con valores positivos, 2v₁ + v₂ daría +24 V en lugar de −20 V. Es fundamental conservar el signo negativo del término independiente.',
      },
    ],
  },
];

export const Module6PracticeQuiz: React.FC<Module6Props> = ({ presentationMode }) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [showGlossary, setShowGlossary] = useState<boolean>(false);

  const totalCorrect = CHALLENGES.filter((c) => {
    const picked = selectedAnswers[c.id];
    const opt = c.options.find((o) => o.id === picked);
    return opt?.isCorrect;
  }).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-medium text-slate-500">
              Afianzamiento Práctico y Verificación de Resultados
            </div>
            <h2 className={`font-display font-bold text-slate-900 mt-0.5 ${presentationMode ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'}`}>
              06. Retos de Práctica, Diagnóstico de Signos y Glosario Activo
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="font-mono text-xs font-semibold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg tabular-nums">
              Aciertos: {totalCorrect} / {CHALLENGES.length}
            </div>
            <button
              onClick={() => setShowGlossary((v) => !v)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap ${
                showGlossary
                  ? 'bg-sky-50 border-sky-400 text-sky-900'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5 text-sky-600" />
              {showGlossary ? 'Ocultar Glosario Clave' : 'Ver Glosario Clave'}
            </button>
            <button
              onClick={() => setSelectedAnswers({})}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors whitespace-nowrap"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reiniciar Retos
            </button>
          </div>
        </div>

        {/* Collapsible Glossary */}
        {showGlossary && (
          <div className="mt-4 pt-4 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="font-display font-bold text-xs text-slate-900">Nodo y Referencia (0 V)</div>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Punto de conexión de dos o más elementos. Al nodo elegido como tierra se le asigna 0 V y respecto a él se miden las N − 1 tensiones nodales.
              </p>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="font-display font-bold text-xs text-slate-900">Convención en Resistores</div>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                En un resistor la corriente fluye de mayor a menor potencial: <span className="font-mono">i = (v_mayor − v_menor)/R</span>.
              </p>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="font-display font-bold text-xs text-slate-900">Supernodo (Caso B)</div>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Región que encierra una fuente de tensión entre dos nodos no referenciados para aplicar LCK como una sola entidad generalizada.
              </p>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="font-display font-bold text-xs text-slate-900">Restricción LTK</div>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Ecuación adicional indispensable impuesta por la fuente de tensión dentro del supernodo: <span className="font-mono">v_a − v_b = V_fuente</span>.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Challenges Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {CHALLENGES.map((ch) => {
          const pickedId = selectedAnswers[ch.id];
          const pickedOpt = ch.options.find((o) => o.id === pickedId);

          return (
            <div
              key={ch.id}
              className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="text-xs font-medium text-sky-700">{ch.category}</div>
                <h3 className="font-display font-bold text-slate-900 text-base">{ch.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{ch.scenario}</p>

                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-1">
                  <div className="text-xs text-slate-500">{ch.formulaContext}</div>
                  <div className="font-mono text-xs sm:text-sm font-semibold text-slate-900">
                    {ch.question}
                  </div>
                </div>

                <div className="space-y-2 pt-1">
                  {ch.options.map((opt) => {
                    const isSelected = pickedId === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => setSelectedAnswers((prev) => ({ ...prev, [ch.id]: opt.id }))}
                        className={`w-full text-left p-3 rounded-lg border text-xs sm:text-sm transition-colors ${
                          isSelected
                            ? opt.isCorrect
                              ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-medium'
                              : 'bg-red-50 border-red-400 text-red-950 font-medium'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span className="font-mono font-bold mr-2 uppercase">{opt.id})</span>
                        {opt.text}
                      </button>
                    );
                  })}
                </div>
              </div>

              {pickedOpt && (
                <div
                  className={`p-3.5 rounded-lg border text-xs leading-relaxed flex items-start gap-2 ${
                    pickedOpt.isCorrect
                      ? 'bg-emerald-50/90 border-emerald-300 text-emerald-900'
                      : 'bg-red-50/90 border-red-300 text-red-900'
                  }`}
                >
                  {pickedOpt.isCorrect ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  )}
                  <span>{pickedOpt.feedback}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
