import ArticleList from '@/app/components/articles/ArticleList';

export default function ArticlesPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Articles</h1>
            <ArticleList />
        </div>
    );
}
