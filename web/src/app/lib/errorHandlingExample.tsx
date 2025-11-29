// Example: How to use the new typed API error handling

import { useState, useEffect } from 'react';
import { apiFetch, ApiError, HTTP_STATUS } from '../lib/apiClient';
import { getErrorMessage, isApiError } from '../lib/apiTypes';

interface Article {
  id: string;
  title: string;
  body: string;
}

export default function ExampleComponent() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        setError(null);

        // Using the typed apiFetch function
        const data = await apiFetch<{ articles: Article[]; total: number }>('/articles/public');

        setArticles(data.articles);
      } catch (err) {
        // Now we can properly type-check the error
        if (isApiError(err)) {
          // Handle specific API errors
          switch (err.status) {
            case HTTP_STATUS.UNAUTHORIZED:
              setError('Please log in to view articles');
              break;
            case HTTP_STATUS.NOT_FOUND:
              setError('Articles not found');
              break;
            default:
              setError(err.message);
          }
        } else {
          // Handle generic errors
          setError(getErrorMessage(err));
        }

        console.error('Failed to fetch articles:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">Error: {error}</div>;

  return (
    <div>
      {articles.map(article => (
        <div key={article.id}>{article.title}</div>
      ))}
    </div>
  );
}