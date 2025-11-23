import ArticleEditor from '@/app/components/articles/ArticleEditor';

interface PageProps {
    params: {
        id: string;
    };
}

export default function EditArticlePage({ params }: PageProps) {
    return (
        <div className="container mx-auto px-4 py-8">
            <ArticleEditor articleId={params.id} />
        </div>
    );
}
