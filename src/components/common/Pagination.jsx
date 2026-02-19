export default function Pagination({ page, total, limit, onPageChange }) {
  const totalPages = Math.ceil(total / limit);

  if (totalPages <= 1) return null;

  return (
    <nav>
      <ul className="pagination">
        {Array.from({ length: totalPages }).map((_, i) => (
          <li
            key={i}
            className={`page-item ${page === i + 1 ? "active" : ""}`}
          >
            <button
              className="page-link"
              onClick={() => onPageChange(i + 1)}
            >
              {i + 1}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
