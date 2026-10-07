import type { ReactNode } from 'react';

export interface DataTableColumn<T> {
  header: string;
  render: (row: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  rows: T[];
  columns: DataTableColumn<T>[];
  loading: boolean;
  emptyMessage: string;
  rowKey: (row: T) => string | number;
}

export function DataTable<T>({
  rows,
  columns,
  loading,
  emptyMessage,
  rowKey,
}: DataTableProps<T>) {
  if (loading) return <div className="p-4 text-center">Carregando...</div>;
  if (rows.length === 0) return <div className="p-4 text-center text-muted">{emptyMessage}</div>;

  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle mb-0">
        <thead className="table-light">
          <tr>
            {columns.map((column) => (
              <th className={column.className} key={column.header}>{column.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={rowKey(row)}>
              {columns.map((column) => (
                <td className={column.className} key={column.header}>{column.render(row)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
