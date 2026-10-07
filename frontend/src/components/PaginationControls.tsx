interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  loading: boolean;
  onPageChange: (page: number) => void;
}

export function PaginationControls({
  currentPage,
  totalPages,
  loading,
  onPageChange,
}: PaginationControlsProps) {
  return (
    <div className="d-flex justify-content-between align-items-center p-3">
      <button
        className="btn btn-outline-secondary"
        disabled={currentPage === 0 || loading}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Anterior
      </button>
      <span aria-live="polite">
        Página {totalPages === 0 ? 0 : currentPage + 1} de {totalPages}
      </span>
      <button
        className="btn btn-outline-secondary"
        disabled={totalPages === 0 || currentPage + 1 >= totalPages || loading}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Próxima
      </button>
    </div>
  );
}
