import React, { useState } from 'react';
import { TableRow } from '../../types';
import { Copy, Check, Info } from 'lucide-react';

interface DataTableProps {
  title?: string;
  subtitle?: string;
  columns?: string[];
  data: TableRow[];
  primaryKeys?: string[];
  foreignKeys?: { attribute: string; target: string }[];
  highlightRowIds?: (string | number)[];
  highlightPredicate?: (row: TableRow) => boolean;
  onRowHover?: (row: TableRow | null) => void;
  onRowClick?: (row: TableRow) => void;
  hoveredRowIndex?: number | null;
  compact?: boolean;
  pageSize?: number;
  showMetrics?: boolean;
  className?: string;
}

export const DataTable: React.FC<DataTableProps> = ({
  title,
  subtitle,
  columns: customColumns,
  data,
  primaryKeys = [],
  foreignKeys = [],
  highlightRowIds = [],
  highlightPredicate,
  onRowHover,
  onRowClick,
  hoveredRowIndex,
  compact = false,
  pageSize = 15,
  showMetrics = true,
  className = '',
}) => {
  const [copied, setCopied] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const columns = customColumns || (data.length > 0 ? Object.keys(data[0]).filter((k) => data[0][k] !== undefined) : []);
  const totalPages = Math.ceil(data.length / pageSize) || 1;
  const paginatedData = data.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleCopy = () => {
    const text = [
      columns.join('\t'),
      ...data.map((row) => columns.map((col) => (row[col] === null ? 'null' : row[col] ?? '')).join('\t')),
    ].join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isPrimaryKey = (col: string) => primaryKeys.includes(col);
  const getForeignKeyInfo = (col: string) => foreignKeys.find((fk) => fk.attribute === col);

  return (
    <div className={`bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col ${className}`}>
      {(title || subtitle) && (
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div>
            {title && (
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-slate-800 text-sm tracking-wide">{title}</span>
                {showMetrics && (
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-medium">
                    |r| = {data.length} tuples · deg = {columns.length}
                  </span>
                )}
              </div>
            )}
            {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
          </div>

          <button
            onClick={handleCopy}
            className="text-xs px-2.5 py-1 text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Copy table to clipboard (TSV)"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-600 font-medium">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      )}

      <div className="overflow-x-auto w-full">
        <table className="w-full text-left border-collapse text-xs md:text-sm font-['Fira_Code',monospace]">
          <thead>
            <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-700 font-semibold">
              <th className="py-2.5 px-3 w-10 text-center text-slate-400 font-mono text-[11px]">#</th>
              {columns.map((col) => {
                const isPK = isPrimaryKey(col);
                const fkInfo = getForeignKeyInfo(col);

                return (
                  <th
                    key={col}
                    className="py-2.5 px-3 text-slate-800 tracking-tight font-medium"
                  >
                    <div className="flex items-center gap-1">
                      <span className={`${isPK ? 'underline decoration-blue-600 decoration-2 font-bold text-blue-950' : ''}`}>
                        {col}
                      </span>
                      {isPK && (
                        <span className="inline-flex items-center px-1 text-[9px] font-sans font-bold bg-blue-100 text-blue-800 rounded">
                          PK
                        </span>
                      )}
                      {fkInfo && (
                        <span
                          className="inline-flex items-center px-1 text-[9px] font-sans font-medium bg-amber-100 text-amber-800 rounded cursor-help"
                          title={`Foreign Key references ${fkInfo.target}`}
                        >
                          FK
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="py-8 text-center text-slate-400 italic">
                  Empty relation (0 tuples)
                </td>
              </tr>
            ) : (
              paginatedData.map((row, idx) => {
                const globalIndex = (currentPage - 1) * pageSize + idx;
                const isHighlighted =
                  highlightRowIds.includes(globalIndex) ||
                  (row.ID !== undefined && highlightRowIds.includes(row.ID)) ||
                  (highlightPredicate ? highlightPredicate(row) : false);

                const isHovered = hoveredRowIndex === globalIndex;

                return (
                  <tr
                    key={idx}
                    onMouseEnter={() => onRowHover && onRowHover(row)}
                    onMouseLeave={() => onRowHover && onRowHover(null)}
                    onClick={() => onRowClick && onRowClick(row)}
                    className={`transition-colors ${
                      isHighlighted
                        ? 'bg-amber-50/90 text-amber-950 font-medium'
                        : isHovered
                        ? 'bg-blue-50/70'
                        : idx % 2 === 0
                        ? 'bg-white hover:bg-slate-50'
                        : 'bg-slate-50/50 hover:bg-slate-50'
                    } ${onRowClick ? 'cursor-pointer' : ''}`}
                  >
                    <td className="py-2 px-3 text-center text-slate-400 text-[11px] select-none font-mono">
                      {globalIndex + 1}
                    </td>
                    {columns.map((col) => {
                      const val = row[col];
                      const isNull = val === null || val === undefined;
                      const isNum = typeof val === 'number';

                      return (
                        <td
                          key={col}
                          className={`py-2 px-3 whitespace-nowrap ${compact ? 'py-1.5' : 'py-2'} ${
                            isNull ? 'text-slate-300 italic' : isNum ? 'text-slate-800' : 'text-slate-700'
                          }`}
                        >
                          {isNull ? (
                            <span className="px-1 py-0.5 rounded bg-slate-100 text-slate-400 font-sans text-xs">null</span>
                          ) : isNum ? (
                            val.toLocaleString()
                          ) : (
                            String(val)
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
          <span>
            Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, data.length)} of {data.length}
          </span>
          <div className="flex gap-1">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-2 py-1 bg-white border border-slate-200 rounded hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Prev
            </button>
            <span className="px-2 py-1 font-medium">
              {currentPage} / {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="px-2 py-1 bg-white border border-slate-200 rounded hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
