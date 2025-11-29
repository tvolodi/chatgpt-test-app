import Link from 'next/link';
import { CalendarDaysIcon, TagIcon, FolderIcon } from '@heroicons/react/24/outline';

interface SearchResultItemProps {
    id: string;
    title: string;
    excerpt: string;
    slug: string;
    category_id?: string;
    published_at: string;
    tags: string[];
}

export function SearchResultItem({
    title,
    excerpt,
    slug,
    category_id,
    published_at,
    tags
}: SearchResultItemProps) {
    const publishDate = new Date(published_at).toLocaleDateString();

    return (
        <article className="bg-walnut-50 rounded-retro shadow-retro border-2 border-walnut-500 p-6 hover:shadow-retro-hover transition-shadow">
            <Link href={`/articles/${slug}`} className="block group">
                <h3
                    className="text-xl font-retro text-walnut-800 mb-2 group-hover:text-walnut-600 transition-colors"
                    dangerouslySetInnerHTML={{ __html: title }}
                />
                <p
                    className="text-walnut-600 font-retro-sans mb-4 line-clamp-3"
                    dangerouslySetInnerHTML={{ __html: excerpt }}
                />
            </Link>

            <div className="flex flex-wrap items-center gap-4 text-sm text-walnut-500 font-retro-sans">
                {category_id && (
                    <div className="flex items-center gap-1">
                        <FolderIcon className="h-4 w-4" />
                        <span>Category {category_id}</span>
                    </div>
                )}

                <div className="flex items-center gap-1">
                    <CalendarDaysIcon className="h-4 w-4" />
                    <span>{publishDate}</span>
                </div>

                {tags.length > 0 && (
                    <div className="flex items-center gap-1">
                        <TagIcon className="h-4 w-4" />
                        <div className="flex flex-wrap gap-1">
                            {tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="bg-walnut-200 text-walnut-700 px-2 py-0.5 rounded-retro text-xs font-retro-sans uppercase tracking-wide"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </article>
    );
}