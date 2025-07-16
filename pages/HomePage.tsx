

import React, { useState, useEffect, useMemo } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { PRODUCTS, BLOG_POSTS, BACKGROUND_IMAGES } from '../constants';
import ProductCard from '../components/ProductCard';
import SectionDivider from '../components/SectionDivider';
import useScrollAnimation from '../hooks/useScrollAnimation';
import CallToActionSection from '../components/CallToActionSection';
import SEO from '../components/SEO';
import { useLanguage } from '../i18n/LanguageContext';
import { Product } from '../types';
import JsonLd from '../components/JsonLd';
import AmberSpectrumSection from '../components/AmberSpectrumSection';
import { useUserPreferences } from '../hooks/useUserPreferences';
import InfographicSection from '../components/InfographicSection';

const AnimatedSection: React.FC<{children: React.ReactNode, className?: string}> = ({ children, className }) => {
    const { ref, isVisible } = useScrollAnimation();
    return (
        <section ref={ref} className={`transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`}>
            {children}
        </section>
    );
};

interface OutletContextType {
  setCartCount: React.Dispatch<React.SetStateAction<number>>;
}

const HomePage: React.FC = () => {
    const { setCartCount } = useOutletContext<OutletContextType>();
    const { lang, t } = useLanguage();
    const { preferredEnergy, trackProductView } = useUserPreferences();
    
    const newArrivals = useMemo(() => {
        const allNewArrivals = PRODUCTS.filter(p => p.isNewArrival).slice(0, 4);
        if (!preferredEnergy) {
            return allNewArrivals;
        }
        return allNewArrivals.sort((a, b) => {
            const aHasPreference = a.energyProperties.includes(preferredEnergy);
            const bHasPreference = b.energyProperties.includes(preferredEnergy);
            if (aHasPreference && !bHasPreference) return -1;
            if (!aHasPreference && bHasPreference) return 1;
            return 0;
        });
    }, [preferredEnergy]);

    const blogSnippets = BLOG_POSTS.slice(0, 3);

    const handleAddToCart = (product: Product) => {
        setCartCount(prev => prev + 1);
        trackProductView(product); // Track preference on add to cart
    };
    
    const getTranslatedPath = (path = '#') => `/${lang}${path === '/' ? '' : path}`;

    const websiteUrl = window.location.origin;
    const organizationSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Vicky Amber & Gems",
        "url": websiteUrl,
        "logo": "https://i.postimg.cc/Qd8yW639/vkambergems-logo-small.png",
        "contactPoint": [
            {
                "@type": "ContactPoint",
                "telephone": "+66-63-195-9922",
                "contactType": "Customer Service",
                "areaServed": "TH",
                "availableLanguage": ["en", "th"]
            },
            {
                "@type": "ContactPoint",
                "telephone": "+66-81-851-9922",
                "contactType": "Sales",
                "areaServed": "TH",
                "availableLanguage": ["en", "th"]
            }
        ],
        "department": [
           {
             "@type": "ContactPoint",
             "telephone": "+66-63-195-9922",
             "contactType": "Customer Service",
             "contactOption": "TollFree",
             "areaServed": "TH",
             "availableLanguage": "en"
           },
            {
             "@type": "ContactPoint",
             "telephone": "+66-81-851-9922",
             "contactType": "Sales",
             "contactOption": "TollFree",
             "areaServed": "TH",
             "availableLanguage": "en"
           }
        ],
        "sameAs": [
            "https://facebook.com/vkmmamber",
            "https://instagram.com/vkmmamber",
            "https://twitter.com/vkmmamber",
            "https://pinterest.com/vkmmamber",
            "https://youtube.com/@vkmmamber",
            "https://linkedin.com/company/vkmmamber",
            "https://tiktok.com/@vkmmamber"
        ]
    };
    const websiteSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "url": websiteUrl,
        "name": "Vicky Amber & Gems",
        "description": t('home_meta_description'),
        "inLanguage": lang,
        "potentialAction": {
            "@type": "SearchAction",
            "target": `${websiteUrl}/#/${lang}/collection?q={search_term_string}`,
            "query-input": "required name=search_term_string"
        }
    };
     const homePageSchema = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "url": `${websiteUrl}/#/${lang}`,
        "name": t('home_meta_title'),
        "description": t('home_meta_description'),
        "isPartOf": {
            "@id": `${websiteUrl}/#website`
        }
    };


    return (
        <div 
            className="overflow-x-hidden page-container-with-bg"
            style={{ backgroundImage: `url('${BACKGROUND_IMAGES[25]}')` }}
        >
            <SEO 
                titleKey="home_meta_title" 
                descriptionKey="home_meta_description" 
                keywordsKey="home_meta_keywords"
                imageUrl="https://i.postimg.cc/Qd5xfTmD/hero-section-background-vicky-0013.jpg"
            />
            <JsonLd data={organizationSchema} />
            <JsonLd data={websiteSchema} />
            <JsonLd data={homePageSchema} />


            {/* Hero Section */}
            <section className="hero-section">
                <div className="relative z-10 flex flex-col items-center text-center p-4">
                    <div className="p-8 rounded-xl shadow-lg" style={{backgroundColor: 'rgba(253, 251, 248, 0.75)'}}>
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-[var(--c-heading)]">{t('home_hero_title')}</h1>
                        <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto text-[var(--c-text-primary)]">{t('home_hero_subtitle')}</p>
                        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link to={getTranslatedPath('/collection')} className="btn-primary text-white font-bold py-3 px-8 rounded-lg shadow-lg text-lg">
                                {t('home_hero_cta')}
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
            
            <div style={{ backgroundColor: 'rgba(180, 149, 94, 0.1)' }}>
                <AnimatedSection className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-4xl font-bold">{t('home_famed_mines_title')}</h2>
                        <p className="mt-4 text-lg text-[var(--c-text-primary)] opacity-90">{t('home_famed_mines_subtitle')}</p>
                    </div>
                    <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="text-center p-4">
                            <h3 className="text-2xl font-semibold">{t('home_gem_jade')}</h3>
                            <p className="text-sm mt-2 text-[var(--c-text-secondary)]">{t('home_gem_jade_desc')}</p>
                        </div>
                        <div className="text-center p-4">
                            <h3 className="text-2xl font-semibold">{t('home_gem_rubies')}</h3>
                            <p className="text-sm mt-2 text-[var(--c-text-secondary)]">{t('home_gem_rubies_desc')}</p>
                        </div>
                        <div className="text-center p-4">
                            <h3 className="text-2xl font-semibold">{t('home_gem_sapphires')}</h3>
                            <p className="text-sm mt-2 text-[var(--c-text-secondary)]">{t('home_gem_sapphires_desc')}</p>
                        </div>
                        <div className="text-center p-4">
                            <h3 className="text-2xl font-semibold">{t('home_gem_amber')}</h3>
                            <p className="text-sm mt-2 text-[var(--c-text-secondary)]">{t('home_gem_amber_desc')}</p>
                        </div>
                    </div>
                </AnimatedSection>
            </div>
            
            <div id="infographic-section">
                <InfographicSection />
            </div>

            <div style={{ backgroundColor: 'rgba(204, 112, 75, 0.1)' }}>
                <AnimatedSection className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24">
                    <h2 className="text-4xl font-bold text-center">{t('home_new_arrivals_title')}</h2>
                    <SectionDivider />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {newArrivals.map(product => (
                            <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
                        ))}
                    </div>
                </AnimatedSection>
            </div>
            
            <div style={{ backgroundColor: 'rgba(108, 120, 108, 0.1)' }}>
                <AnimatedSection className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24">
                    <div className="max-w-4xl mx-auto bg-[var(--c-surface)] p-8 rounded-lg shadow-lg border border-[var(--c-border)] text-center">
                        <h2 className="text-3xl font-bold">{t('home_confidence_title')}</h2>
                        <p className="mt-4 text-lg text-[var(--c-text-primary)] opacity-90">{t('home_confidence_subtitle')}</p>
                        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                            <div>
                                <span className="text-4xl">🔬</span>
                                <h3 className="mt-2 text-xl font-semibold">{t('home_confidence_auth_title')}</h3>
                                <p className="text-sm text-[var(--c-text-secondary)] mt-1">{t('home_confidence_auth_desc')}</p>
                            </div>
                            <div>
                                <span className="text-4xl">🌍</span>
                                <h3 className="mt-2 text-xl font-semibold">{t('home_confidence_sourcing_title')}</h3>
                                <p className="text-sm text-[var(--c-text-secondary)] mt-1">{t('home_confidence_sourcing_desc')}</p>
                            </div>
                            <div>
                                <span className="text-4xl">🌱</span>
                                <h3 className="mt-2 text-xl font-semibold">{t('home_confidence_sustain_title')}</h3>
                                <p className="text-sm text-[var(--c-text-secondary)] mt-1">{t('home_confidence_sustain_desc')}</p>
                            </div>
                        </div>
                        <Link to={getTranslatedPath('/our-guarantee')} className="mt-8 inline-block btn-primary text-white font-bold py-3 px-8 rounded-lg shadow-lg">
                            {t('home_confidence_cta')}
                        </Link>
                    </div>
                </AnimatedSection>
            </div>
            
            <div style={{ backgroundColor: 'rgba(154, 74, 33, 0.1)' }}>
                <AnimatedSection>
                    <AmberSpectrumSection />
                </AnimatedSection>
            </div>

            <div style={{ backgroundColor: 'rgba(245, 239, 230, 0.1)' }}>
                <AnimatedSection className="py-20 md:py-24">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-4xl font-bold text-center">{t('home_blog_title')}</h2>
                        <SectionDivider />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {blogSnippets.map((post) => (
                                <Link 
                                    to={getTranslatedPath(`/blog/${post.id}`)}
                                    key={post.id} 
                                    className="group block bg-[var(--c-surface)] rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-[var(--c-border)]"
                                >
                                    <div className="aspect-w-16 aspect-h-9 overflow-hidden bg-[var(--c-surface-alt)] flex items-center justify-center">
                                        <img src={post.featuredImage} alt={post.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                    </div>
                                    <div className="p-6">
                                        <span className={`text-sm font-bold uppercase tracking-widest ${post.category === 'Science' ? 'text-[var(--c-accent-secondary-hover)]' : 'text-[var(--c-accent-primary)]'}`}>{post.category}</span>
                                        <h3 className="text-2xl mt-2 leading-tight group-hover:text-[var(--c-accent-primary)] transition-colors">{post.title}</h3>
                                        <p className="mt-3 text-[var(--c-text-primary)] opacity-90 text-base line-clamp-3">{post.summary}</p>
                                        <p className="mt-4 font-semibold text-sm text-[var(--c-accent-primary)] group-hover:text-[var(--c-heading)]">
                                            {t('Read More')} &rarr;
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                        <div className="text-center mt-12">
                            <Link to={getTranslatedPath('/blog')} className="text-[var(--c-accent-primary)] hover:text-[var(--c-heading)] font-semibold transition-colors group">
                                {t('home_blog_cta')} <span className="transition-transform group-hover:translate-x-1 inline-block">&rarr;</span>
                            </Link>
                        </div>
                    </div>
                </AnimatedSection>
            </div>

            <AnimatedSection>
                <CallToActionSection 
                    title={t('home_cta_title')}
                    subtitle={t('home_cta_subtitle')}
                    buttonText={t('home_cta_button')}
                    buttonLink={getTranslatedPath('/build-your-set')}
                    backgroundImageUrl="https://i.postimg.cc/pXtcbS21/Vicky-Amber-Gems-background-0014.jpg"
                />
            </AnimatedSection>
        </div>
    );
};

export default HomePage;