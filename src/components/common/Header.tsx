import React from 'react';
import { Download } from 'lucide-react';

interface HeaderProps {
  onExportReport?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onExportReport }) => {
  const isMock = import.meta.env.VITE_USE_MOCK !== 'false';

  return (
    <header className="w-full border-b border-[#3A3830] bg-[#14140F]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Square Monogram Mark + App Name + Plain Mono Subtitle */}
        <div className="flex items-center gap-3.5">
          {/* Small square monogram mark */}
          <div className="w-7 h-7 border border-[#3A3830] flex items-center justify-center text-xs font-mono font-medium text-[#EDE8DD] rounded-[2px] bg-transparent select-none">
            CY
          </div>

          <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-3.5">
            <h1 className="text-base sm:text-lg font-slab font-semibold text-[#EDE8DD] tracking-tight leading-none">
              Crop Yield Simulator
            </h1>
            <span className="text-xs font-mono uppercase tracking-wider text-[#8C897C] mt-1 sm:mt-0">
              {isMock ? 'mock data · 700ms latency' : 'fastapi railway backend · live'}
            </span>
          </div>
        </div>

        {/* Right: Plain Outlined Export Button */}
        <div>
          {onExportReport ? (
            <button
              onClick={onExportReport}
              className="flex items-center gap-2 px-3.5 py-2 bg-transparent hover:bg-[#1F1E17] border border-[#3A3830] hover:border-[#8C897C] text-[#EDE8DD] text-sm font-mono rounded-[2px] transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4 text-[#8C897C]" />
              <span>Export report</span>
            </button>
          ) : (
            <div className="px-3.5 py-2 border border-[#3A3830] text-[#8C897C] text-sm font-mono rounded-[2px] opacity-40 select-none">
              Export report
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
