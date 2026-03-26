import { useEffect, useState, useCallback } from "react";
import ArticlesTable from "./ArticlesTable";
import ArticlesFilters from "./ArticlesFilters";
import Pagination from "../common/Pagination";
import ArticleFormModal from "./ArticleFormModal";
import { API_BASE_URL } from "../../config";

export default function ArticlesPage({ token }) {
  const [articles, setArticles] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({
    search: "",
  });
  const [editingArticle, setEditingArticle] = useState(null);

  const limit = 15;

  const fetchArticles = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        page,
        limit,
        search: filters.search || ""
      });

      const res = await fetch(`${API_BASE_URL}/articulos?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Error cargando artículos");
      }

      const data = await res.json();

      setArticles(Array.isArray(data.items) ? data.items : []);
      setTotal(Number(data.total) || 0);
    } catch (err) {
      console.error(err);
      setArticles([]);
      setTotal(0);
    }
  }, [page, filters, token]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  return (
    <div className="card mt-0 p-3">
      

      <ArticlesFilters
        filters={filters}
        onChange={(f) => {
          setPage(1);
          setFilters(f);
        }}
        onCreate={() => setEditingArticle({})}
        token={token}
      />

      <ArticlesTable
        articles={articles}
        token={token}
        onUpdated={fetchArticles}
        onEdit={(article) => setEditingArticle(article)}
      />

      <Pagination
        page={page}
        total={total}
        limit={limit}
        onPageChange={setPage}
      />

      {editingArticle !== null && (
        <ArticleFormModal
          article={editingArticle.id ? editingArticle : null}
          token={token}
          onClose={() => setEditingArticle(null)}
          onSaved={() => {
            fetchArticles();
            setEditingArticle(null);
          }}
        />
      )}
    </div>
  );
}
