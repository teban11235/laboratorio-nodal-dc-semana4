import React from 'react';
import { X, FileText, BookOpen } from 'lucide-react';

interface PdfModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PdfReferenceModal: React.FC<PdfModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const pdfUrl = `${import.meta.env.BASE_URL}assets/aistudio/Semana_4_4bb4eef3.pdf`;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-xs">
      <div className="w-full max-w-4xl bg-white h-full shadow-2xl border-l border-slate-200 flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-sky-700" />
            <div>
              <h2 className="font-display font-bold text-slate-900 text-base">
                Documento de Referencia — Análisis Nodal y Supernodos en DC
              </h2>
              <p className="text-xs text-slate-500">
                Material de apoyo para la clase
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Cerrar visor PDF"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Embedded PDF Viewer */}
        <div className="flex-1 bg-slate-100 p-4 overflow-hidden flex flex-col">
          <div className="text-xs text-slate-600 mb-2 flex items-center justify-between">
            <span>Vista completa del documento</span>
            <a
              href={pdfUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-sky-700 font-medium hover:underline"
            >
              <FileText className="w-3.5 h-3.5" />
              Abrir PDF en pestaña completa
            </a>
          </div>
          <iframe
            src={pdfUrl}
            title="Documento de Referencia PDF"
            className="w-full flex-1 rounded-lg border border-slate-300 bg-white"
          />
        </div>
      </div>
    </div>
  );
};
