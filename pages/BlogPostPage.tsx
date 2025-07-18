

import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BLOG_POSTS, BACKGROUND_IMAGES } from '../constants';
import SectionDivider from '../components/SectionDivider';
import JsonLd from '../components/JsonLd';
import SEO from '../components/SEO';
import { useLanguage } from '../i18n/LanguageContext';
import AuthorBio from '../components/AuthorBio';

const GemstoneToolsArticleContent = () => {
    // This is now just a placeholder, as the real content will come from i18n
    return <p>Loading article content...</p>;
};


const BlogPostPage: React.FC = () => {
    const { postId } = useParams<{ postId: string }>();
    const { lang, t } = useLanguage();
    const post = BLOG_POSTS.find(p => p.id === postId);

    if (!post) {
        return (
            <div className="text-center py-20">
                <SEO 
                    titleKey="seo_blog_post_not_found_title" 
                    descriptionKey="seo_blog_post_not_found_desc"
                    keywordsKey="seo_blog_post_not_found_keywords"
                 />
                <h2 className="text-3xl font-semibold">{t('seo_blog_post_not_found_title')}</h2>
                <Link to={`/${lang}/blog`} className="mt-4 inline-block text-[var(--c-accent-primary)] hover:text-[var(--c-heading)]">{t('home_blog_cta')}</Link>
            </div>
        );
    }
    
    const getCategoryStyles = () => {
        switch (post.category) {
            case 'Science':
                return 'text-[var(--c-accent-secondary-hover)]';
            case 'Craftsmanship':
                return 'text-blue-600';
            case 'Soul':
            default:
                return 'text-[var(--c-accent-primary)]';
        }
    };

    const getCategoryLabel = () => {
        switch (post.category) {
            case 'Science':
                return 'Guides & Science';
            case 'Craftsmanship':
                return 'Art & Craftsmanship';
            case 'Soul':
            default:
                return 'Stories & History';
        }
    };

    // Dynamic SEO values
    const seoTitle = `${post.title} | Vicky Lux Gems`;
    const seoDesc = post.summary;
    const seoKeywords = post