import React, { useState, useMemo } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import SEO from '../components/SEO';
import { BACKGROUND_IMAGES } from '../constants';
import SectionDivider from '../components/SectionDivider';

// The list of terms and their corresponding translation keys.
const GLOSSARY_TERMS = [
  { termKey: 'term_burmite', defKey: 'def_burmite' },
  { termKey: 'term_chakra', defKey: 'def_chakra' },
  { termKey: 'term_e_e_a_t', defKey: 'def_e_e_a_t' },
  { termKey: 'term_ethically_sourced', defKey: 'def_ethically_sourced' },
  { termKey: 'term_fossil_resin', defKey: 'def_fossil_resin' },
  { termKey: 'term_gia', defKey: 'def_gia' },
  { termKey: 'term_git', defKey: 'def_git' },
  { termKey: 'term_heirloom_quality', defKey: 'def_heirloom_quality' },
  { termKey: 'term_inclusion', defKey: 'def_inclusion' },
  { termKey: 'term_mala', defKey: 'def_mala' },
  { termKey: 'term_metaphysical_properties', defKey: 'def_metaphysical_properties' },
  { termKey: 'term_mohs_hardness', defKey: 'def_mohs_hardness' },
  { termKey: 'term_mogok', defKey: 'def_mogok' },
  { termKey: 'term_pigeon_blood', defKey: 'def_pigeon_blood' },
  { termKey: 'term_topical_authority', defKey: 'def_topical_authority' },
];

const GlossaryPage: React.FC = () => {
    const { t } = useLanguage();
    const [searchTerm, setSearchTerm] = useState('');

    const translatedTerms = useMemo(() => {
        return GLOSSARY_TERMS.map(({ termKey, defKey }) => ({
            term: t(`glossary_${termKey}` as any),
            definition: t(`glossary_${defKey}` as any),
        })).sort((a, b) => a.term.localeCompare(b.term, undefined, { sensitivity: 'base' }));
    }, [t]);

    const filteredTerms = useMemo(() => {
        if (!searchTerm) return translatedTerms;
        const lowercasedFilter = searchTerm.toLowerCase();
        return translatedTerms.filter(item =>
            item.term.toLowerCase().includes(lowercasedFilter) ||
            item.definition.toLowerCase().includes(lowercasedFilter)
        );
    }, [searchTerm, translatedTerms]);
    
    const groupedTerms = useMemo(() => {
        return filteredTerms.reduce((acc, item) => {
            const firstLetter = item.term.charAt(0).toUpperCase();
            if (!acc[firstLetter]) {
                acc[firstLetter] = [];
            }
            acc[firstLetter].push(item);
            return acc;
        }, {} as Record<string, typeof filteredTerms>);
    }, [filteredTerms]);

    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');

    return (
        <div 
            className="page-container-with-bg py-16 md:py-24"
            style={{ backgroundImage: `url('${BACKGROUND_IMAGES[8]}')` }}
        >
            <SEO 
                titleKey="seo_glossary_title"
                descriptionKey="seo_glossary_desc"
                keywordsKey="seo_glossary_keywords"
                imageUrl="https://i.postimg.cc/Twz7P7n1/Vicky-Amber-Gems-background-0017.jpg"
            />
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-8">
                        <h1 className="text-5xl font-bold tracking-tight">{t('glossary_title' as any)}</h1>
                        <p className="mt-4 text-xl text-[var(--c-text-secondary)]">{t('glossary_subtitle' as any)}</p>
                    </div>

                    <div className="sticky top-24 z-20 bg-[var(--c-bg)]/80 backdrop-blur-md p-4 rounded-lg shadow-sm border border-[var(--c-border)] mb-8">
                        <input
                            type="search"
                            placeholder={t('glossary_search_placeholder' as any)}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full p-3 border border-[var(--c-border)] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--c-accent-primary)] bg-[var(--c-surface)]"
                            aria-label="Search glossary terms"
                        />
                    </div>
                    
                     <nav className="flex flex-wrap justify-center gap-1 sm:gap-2 my-8">
                        {alphabet.map(letter => (
                            <a 
                                key={letter}
                                href={`#letter-${letter}`}
                                className="text-sm sm:text-base w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full text-[var(--c-text-secondary)] hover:bg-[var(--c-accent-primary)] hover:text-white transition-colors"
                                onClick={(e) => {
                                    e.preventDefault();
                                    const element = document.getElementById(`letter-${letter}`);
                                    if (element) {
                                        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                    }
                                }}
                            >
                                {letter}
                            </a>
                        ))}
                    </nav>

                    <div className="space-y-10">
                        {Object.keys(groupedTerms).sort().map(letter => (
                            <div key={letter} id={`letter-${letter}`}>
                                <h2 className="text-4xl font-bold text-[var(--c-accent-primary)] border-b-2 border-[var(--c-accent-primary)]/30 pb-2 mb-4">
                                    {letter}
                                </h2>
                                <dl className="space-y-6">
                                    {groupedTerms[letter].map((item, index) => (
                                        <div key={index} className="bg-[var(--c-surface)] p-6 rounded-lg shadow-sm border border-[var(--c-border)]">
                                            <dt className="text-2xl font-semibold text-[var(--c-heading)]">{item.term}</dt>
                                            <dd className="mt-2 text-base text-[var(--c-text-primary)]/90" dangerouslySetInnerHTML={{ __html: item.definition }}></dd>
                                        </div>
                                    ))}
                                </dl>
                            </div>
                        ))}
                         {filteredTerms.length === 0 && searchTerm && (
                            <div className="text-center py-16 text-[var(--c-text-secondary)]">
                                <p className="text-xl">No terms found for "{searchTerm}".</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GlossaryPage;
