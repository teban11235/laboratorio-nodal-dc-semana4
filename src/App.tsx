import React, { useState } from 'react';
import { Monitor, ChevronLeft, ChevronRight } from 'lucide-react';
import { ModuleId, SignConvention } from './types/circuit';
import { Module1Fundamentals } from './components/Module1Fundamentals';
import { Module2NodalCurrent } from './components/Module2NodalCurrent';
import { Module3SupernodeFig24 } from './components/Module3SupernodeFig24';
import { Module4GuidedSupernode } from './components/Module4GuidedSupernode';
import { Module5ConceptMap } from './components/Module5ConceptMap';
import { Module6PracticeQuiz } from './components/Module6PracticeQuiz';
import { PdfReferenceModal } from './components/PdfReferenceModal';

interface StationMeta {
  id: ModuleId;
  num: string;
  shortLabel: string;
  title: string;
  subtitle: string;
}

const STATIONS: StationMeta[] = [
  {
    id: 'fundamentals',
    num: '01',
    shortLabel: 'Fundamentos',
    title: 'Nodo, Referencia y Convención de Corriente',
    subtitle: 'Conceptos base',
  },
  {
    id: 'nodal-current',
    num: '02',
    shortLabel: 'Nodal con Corrientes',
    title: 'Procedimiento de Análisis Nodal',
    subtitle: 'Sin fuentes de tensión',
  },
  {
    id: 'supernode-fig24',
    num: '03',
    shortLabel: 'Caso A y Supernodo',
    title: 'Fuentes de Tensión: Caso A y Caso B',
    subtitle: 'Teoría del Supernodo',
  },
  {
    id: 'supernode-guided',
    num: '04',
    shortLabel: 'Taller de Supernodo',
    title: 'Resolución Guiada con Supernodo',
    subtitle: 'Práctica algebraica',
  },
  {
    id: 'concept-map',
    num: '05',
    shortLabel: 'Mapa Conceptual',
    title: 'Síntesis y Relaciones Conceptuales',
    subtitle: 'Estructura del método',
  },
  {
    id: 'practice-quiz',
    num: '06',
    shortLabel: 'Retos y Práctica',
    title: 'Diagnóstico de Signos y Ejercicios',
    subtitle: 'Autoevaluación',
  },
];

export default function App() {
  const [activeModule, setActiveModule] = useState<ModuleId>('supernode-fig24');
  const [presentationMode, setPresentationMode] = useState<boolean>(false);
  const [signConvention, setSignConvention] = useState<SignConvention>('leaving-zero');
  const [isPdfOpen, setIsPdfOpen] = useState<boolean>(false);

  const currentIdx = STATIONS.findIndex((s) => s.id === activeModule);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Top Bar Contract: 3 exact zones separated by gap-8 */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-xs border-b border-slate-200 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            setActiveModule('fundamentals');
          }}
          className="font-display text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0"
        >
          Laboratorio Nodal DC
        </a>

        {/* Zone 2: 5 concise single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            onClick={() => setActiveModule('fundamentals')}
            className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
              activeModule === 'fundamentals' ? 'text-slate-900 underline underline-offset-4' : ''
            }`}
          >
            Fundamentos
          </button>
          <button
            onClick={() => setActiveModule('nodal-current')}
            className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
              activeModule === 'nodal-current' ? 'text-slate-900 underline underline-offset-4' : ''
            }`}
          >
            Método Nodal
          </button>
          <button
            onClick={() => setActiveModule('supernode-fig24')}
            className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
              activeModule === 'supernode-fig24' ? 'text-slate-900 underline underline-offset-4' : ''
            }`}
          >
            Supernodo
          </button>
          <button
            onClick={() => setActiveModule('supernode-guided')}
            className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
              activeModule === 'supernode-guided' ? 'text-slate-900 underline underline-offset-4' : ''
            }`}
          >
            Taller Guiado
          </button>
          <button
            onClick={() => setActiveModule('concept-map')}
            className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
              activeModule === 'concept-map' || activeModule === 'practice-quiz'
                ? 'text-slate-900 underline underline-offset-4'
                : ''
            }`}
          >
            Mapa y Práctica
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center shrink-0">
          <button
            onClick={() => setIsPdfOpen(true)}
            className="px-4 py-2 text-xs font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
          >
            Ver Guía PDF
          </button>
        </div>
      </header>

      {/* Main Workspace Container (1440px max-w) */}
      <main id="top" className="flex-1 w-full max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Course Metadata & Classroom Toolbar */}
        <section className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <span>Circuitos Eléctricos</span>
                <span aria-hidden="true">·</span>
                <span>Corriente Continua (DC)</span>
                <span aria-hidden="true">·</span>
                <span>Recurso Interactivo de Clase</span>
              </div>
              <h1 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
                Análisis Nodal y Supernodos en Corriente Continua (DC)
              </h1>
            </div>

            {/* Classroom Presentation Mode & Quick Station Stepper */}
            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                onClick={() => setPresentationMode((v) => !v)}
                className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 ${
                  presentationMode
                    ? 'bg-sky-700 text-white border-sky-700'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                {presentationMode ? 'Modo Proyección Activo' : 'Activar Modo Proyección'}
              </button>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    const prev = Math.max(0, currentIdx - 1);
                    setActiveModule(STATIONS[prev].id);
                  }}
                  disabled={currentIdx === 0}
                  className="p-2 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40"
                  title="Módulo anterior"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    const next = Math.min(STATIONS.length - 1, currentIdx + 1);
                    setActiveModule(STATIONS[next].id);
                  }}
                  disabled={currentIdx === STATIONS.length - 1}
                  className="p-2 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40"
                  title="Módulo siguiente"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* 6 Interactive Modules Station Selector Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-2 border-t border-slate-100">
            {STATIONS.map((station) => {
              const isActive = activeModule === station.id;
              return (
                <button
                  key={station.id}
                  onClick={() => setActiveModule(station.id)}
                  className={`text-left p-2.5 rounded-lg border transition-colors ${
                    isActive
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className={isActive ? 'text-sky-300 font-semibold' : 'text-sky-700 font-semibold'}>
                      Módulo {station.num}
                    </span>
                    <span className={isActive ? 'text-slate-300' : 'text-slate-400'}>{station.subtitle}</span>
                  </div>
                  <div className="font-display font-semibold text-xs mt-0.5 line-clamp-1">
                    {station.shortLabel}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Active Interactive Station */}
        <section className="pb-8">
          {activeModule === 'fundamentals' && (
            <Module1Fundamentals presentationMode={presentationMode} />
          )}
          {activeModule === 'nodal-current' && (
            <Module2NodalCurrent
              presentationMode={presentationMode}
              signConvention={signConvention}
              onChangeSignConvention={setSignConvention}
            />
          )}
          {activeModule === 'supernode-fig24' && (
            <Module3SupernodeFig24
              presentationMode={presentationMode}
              signConvention={signConvention}
              onChangeSignConvention={setSignConvention}
            />
          )}
          {activeModule === 'supernode-guided' && (
            <Module4GuidedSupernode presentationMode={presentationMode} />
          )}
          {activeModule === 'concept-map' && (
            <Module5ConceptMap presentationMode={presentationMode} />
          )}
          {activeModule === 'practice-quiz' && (
            <Module6PracticeQuiz presentationMode={presentationMode} />
          )}
        </section>
      </main>

      {/* PDF Slide-Over Reference Modal */}
      <PdfReferenceModal isOpen={isPdfOpen} onClose={() => setIsPdfOpen(false)} />
    </div>
  );
}
