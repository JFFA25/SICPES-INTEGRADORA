interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

const getPageNumbers = (currentPage: number, totalPages: number): (number | "...")[] => {
  const pages: (number | "...")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else if (currentPage <= 4) {
    for (let i = 1; i <= 5; i++) pages.push(i);
    pages.push("...");
    pages.push(totalPages);
  } else if (currentPage >= totalPages - 3) {
    pages.push(1);
    pages.push("...");
    for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    pages.push("...");
    for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
    pages.push("...");
    pages.push(totalPages);
  }
  return pages;
};

// Componente de paginación compartido - antes esta lógica (~60 líneas) estaba
// duplicada casi idéntica en AdminReservation.tsx y AdminPayments.tsx.
const Pagination = ({ currentPage, totalPages, totalItems, itemsPerPage, onPageChange }: PaginationProps) => {
  if (totalPages <= 1) return null;

  const indexOfFirstItem = (currentPage - 1) * itemsPerPage;
  const indexOfLastItem = currentPage * itemsPerPage;

  return (
    <div className="flex items-center justify-between border-t border-gray-100 bg-white pt-6 mt-2">
      <div className="flex flex-1 items-center justify-between">
        <p className="text-sm text-gray-700">
          Mostrando <span className="font-semibold">{indexOfFirstItem + 1}</span> a{" "}
          <span className="font-semibold">{Math.min(indexOfLastItem, totalItems)}</span> de{" "}
          <span className="font-semibold">{totalItems}</span> resultados
        </p>

        <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 disabled:opacity-50"
          >
            <span className="sr-only">Anterior</span>
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
            </svg>
          </button>
          {getPageNumbers(currentPage, totalPages).map((number, index) => (
            <button
              key={index}
              onClick={() => typeof number === "number" && onPageChange(number)}
              disabled={number === "..."}
              className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold focus:z-20 ${
                currentPage === number
                  ? "z-10 bg-blue-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                  : number === "..."
                    ? "text-gray-500 ring-1 ring-inset ring-gray-300 bg-gray-50 cursor-default"
                    : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              }`}
            >
              {number}
            </button>
          ))}
          <button
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 disabled:opacity-50"
          >
            <span className="sr-only">Siguiente</span>
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
            </svg>
          </button>
        </nav>
      </div>
    </div>
  );
};

export default Pagination;
