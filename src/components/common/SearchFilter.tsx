import React from 'react';
import { Search, Filter, X } from 'lucide-react';

interface FilterOption {
  label: string;
  value: string;
}

interface SearchFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
  filterValue?: string;
  onFilterChange?: (value: string) => void;
  filterOptions?: FilterOption[];
  filterLabel?: string;
  extraActions?: React.ReactNode;
}

export const SearchFilter: React.FC<SearchFilterProps> = ({
  searchTerm,
  onSearchChange,
  placeholder = 'Search...',
  filterValue,
  onFilterChange,
  filterOptions,
  filterLabel = 'All Status',
  extraActions,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-5">
      <div className="flex flex-1 items-center gap-3">
        {/* Search bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={placeholder}
            className="gaming-input pl-10 pr-9 w-full text-sm"
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter dropdown */}
        {filterOptions && onFilterChange && (
          <div className="relative">
            <select
              value={filterValue}
              onChange={(e) => onFilterChange(e.target.value)}
              className="gaming-input pr-8 text-xs sm:text-sm bg-dark-850 cursor-pointer appearance-none pl-8"
            >
              <option value="ALL">{filterLabel}</option>
              {filterOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <Filter className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          </div>
        )}
      </div>

      {extraActions && (
        <div className="flex items-center gap-2.5 self-end sm:self-auto">
          {extraActions}
        </div>
      )}
    </div>
  );
};
