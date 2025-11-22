import React, { useState } from 'react';

interface TagFormProps {
    initialData?: {
        code: string;
        name: Record<string, string>;
    };
    onSubmit: (data: { code: string; name: Record<string, string> }) => void;
    locale: string;
}

const TagForm: React.FC<TagFormProps> = ({ initialData, onSubmit, locale }) => {
    const [code, setCode] = useState(initialData?.code || '');
    const [names, setNames] = useState<Record<string, string>>(initialData?.name || { en: '', ru: '', kk: '' });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ code, name: names });
    };

    const handleNameChange = (lang: string, value: string) => {
        setNames((prev) => ({ ...prev, [lang]: value }));
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-5 space-y-6">
                {/* Code Field */}
                <div>
                    <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
                        Tag Code
                    </label>
                    <input
                        type="text"
                        id="code"
                        name="code"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        required
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors duration-150"
                        placeholder="e.g., technology, news, tutorial"
                    />
                    <p className="mt-1 text-xs text-gray-500">Unique identifier for this tag (lowercase, no spaces)</p>
                </div>

                {/* Names Section */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                        Tag Names (Localized)
                    </label>
                    <div className="space-y-4">
                        {[
                            { lang: 'en', label: 'English', flag: '🇬🇧' },
                            { lang: 'ru', label: 'Russian', flag: '🇷🇺' },
                            { lang: 'kk', label: 'Kazakh', flag: '🇰🇿' }
                        ].map(({ lang, label, flag }) => (
                            <div key={lang} className="grid grid-cols-12 gap-3 items-center">
                                <div className="col-span-3 flex items-center gap-2">
                                    <span className="text-lg">{flag}</span>
                                    <label htmlFor={`name-${lang}`} className="text-sm font-medium text-gray-700">
                                        {label}
                                    </label>
                                </div>
                                <div className="col-span-9">
                                    <input
                                        type="text"
                                        id={`name-${lang}`}
                                        name={`name-${lang}`}
                                        value={names[lang] || ''}
                                        onChange={(e) => handleNameChange(lang, e.target.value)}
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors duration-150"
                                        placeholder={`Tag name in ${label}`}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Form Actions */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
                <button
                    type="button"
                    onClick={() => window.history.back()}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-150"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-150"
                >
                    Save Tag
                </button>
            </div>
        </form>
    );
};

export default TagForm;
