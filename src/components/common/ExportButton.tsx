import React, { useState, useRef, useEffect } from 'react';
import { Download, FileSpreadsheet, FileCode, ChevronDown } from 'lucide-react';
import { exportToCSV, exportToJSON } from '../../utils/exportUtils';

interface ExportButtonProps {
  data: any[];
  filename: string;
  label?: string;
  headers?: { key: string; label: string }[];
}

export const ExportButton: React.FC<ExportButtonProps> = ({
  data,
  filename,
  label = 'Export',
  headers,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleExportCSV = () => {
    exportToCSV(data, filename, headers as any);
    setIsOpen(false);
  };

  const handleExportJSON = () => {
    exportToJSON(data, filename);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn-secondary py-1.5 px-3 text-xs flex items-center gap-1.5"
      >
        <Download className="w-3.5 h-3.5 text-brand-purple" />
        <span>{label}</span>
        <ChevronDown className="w-3 h-3 text-slate-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-44 bg-dark-850 border border-dark-700 rounded-lg shadow-xl py-1 z-30 animate-in fade-in zoom-in-95 duration-150">
          <button
            onClick={handleExportCSV}
            className="w-full text-left px-3.5 py-2 text-xs text-slate-200 hover:bg-dark-750 hover:text-white flex items-center gap-2"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Export as CSV (.csv)</span>
          </button>
          <button
            onClick={handleExportJSON}
            className="w-full text-left px-3.5 py-2 text-xs text-slate-200 hover:bg-dark-750 hover:text-white flex items-center gap-2"
          >
            <FileCode className="w-4 h-4 text-cyan-400" />
            <span>Export as JSON (.json)</span>
          </button>
        </div>
      )}
    </div>
  );
};
