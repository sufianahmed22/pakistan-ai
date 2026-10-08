import AsyncState from '../ui/AsyncState';
import Pagination from './Pagination';

// Generic server-paginated admin table. `columns`: [{ key, label, render? }]
export default function DataTable({ columns, rows, loading, error, onRetry, page, totalPages, onPageChange, emptyProps, rowActions }) {
  const isEmpty = !loading && !error && (!rows || rows.length === 0);
  return (
    <div>
      <AsyncState loading={loading} error={error} isEmpty={isEmpty} onRetry={onRetry} emptyProps={emptyProps}>
        <div className="overflow-x-auto rounded-2xl border border-charcoal-100">
          <table className="min-w-full divide-y divide-charcoal-100 text-sm">
            <thead className="bg-charcoal-50">
              <tr>
                {columns.map((c) => (
                  <th key={c.key} className="px-4 py-3 text-left font-semibold text-charcoal-600 whitespace-nowrap">
                    {c.label}
                  </th>
                ))}
                {rowActions && <th className="px-4 py-3 text-right font-semibold text-charcoal-600">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal-100 bg-white">
              {rows?.map((row) => (
                <tr key={row._id || row.id} className="hover:bg-charcoal-50/60">
                  {columns.map((c) => (
                    <td key={c.key} className="px-4 py-3 align-top text-charcoal-700">
                      {c.render ? c.render(row) : row[c.key] ?? '—'}
                    </td>
                  ))}
                  {rowActions && <td className="px-4 py-3 text-right whitespace-nowrap">{rowActions(row)}</td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AsyncState>
      {!isEmpty && !loading && !error && <Pagination page={page} totalPages={totalPages} onChange={onPageChange} />}
    </div>
  );
}
