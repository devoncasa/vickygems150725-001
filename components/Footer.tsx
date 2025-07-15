import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { PhoneIcon, EmailIcon, WhatsAppIcon } from './IconComponents';

export const Footer: React.FC = () => {
  const { lang, t } = useLanguage();
  const getTranslatedPath = (path: string) => `/${lang}${path}`;

  return (
    <>
      {/* Full site footer, now visible on all screen sizes */}
      <footer className="bg-[var(--c-footer-bg)] text-[var(--c-footer-text)]">
        <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-serif text-[var(--c-heading)]">{t('footer_address_title')}</h3>
              <address className="mt-2 text-sm opacity-80 not-italic">
                {t('footer_address_detail')}
              </address>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[var(--c-heading)]">{t('footer_explore_title')}</h3>
              <ul className="mt-2 space-y-2 text-sm">
                <li><Link to={getTranslatedPath('/collection')} className="hover:text-[var(--c-accent-primary)] transition-colors opacity-80 hover:opacity-100">{t('nav_Shop')}</Link></li>
                 <li><Link to={getTranslatedPath('/blog')} className="hover:text-[var(--c-accent-primary)] transition-colors opacity-80 hover:opacity-100">{t('nav_Blogs')}</Link></li>
                 <li><Link to={getTranslatedPath('/pricing-guide')} className="hover:text-[var(--c-accent-primary)] transition-colors opacity-80 hover:opacity-100">{t('nav_The_Different_Types_of_Amber')}</Link></li>
                 <li><Link to={getTranslatedPath('/amber-colors')} className="hover:text-[var(--c-accent-primary)] transition-colors opacity-80 hover:opacity-100">{t('nav_The_Variety_of_Colors_&_Tones')}</Link></li>
                <li><Link to={getTranslatedPath('/about')} className="hover:text-[var(--c-accent-primary)] transition-colors opacity-80 hover:opacity-100">{t('nav_About_Us_&_Policies')}</Link></li>
                <li><Link to={getTranslatedPath('/faqs')} className="hover:text-[var(--c-accent-primary)] transition-colors opacity-80 hover:opacity-100">{t('nav_FAQs')}</Link></li>
                <li><Link to={getTranslatedPath('/contact')} className="hover:text-[var(--c-accent-primary)] transition-colors opacity-80 hover:opacity-100">{t('nav_Contact_Us')}</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[var(--c-heading)]">{t('footer_contact_title')}</h3>
              <div className="mt-4 space-y-4 text-sm">
                <div className="flex items-start">
                  <PhoneIcon className="w-5 h-5 mt-0.5 text-[var(--c-accent-primary)] flex-shrink-0" />
                  <div className="ms-3">
                    <p className="font-semibold text-[var(--c-text-primary)]">{t('footer_contact_phones_title')}</p>
                    <div className="mt-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <a href="tel:+66631959922" className="text-[var(--c-footer-text)] hover:text-[var(--c-accent-primary)] transition-colors">{t('footer_contact_vicky')}</a>
                        <a href="https://wa.me/66631959922" target="_blank" rel="noopener noreferrer" aria-label="Chat with Vicky on WhatsApp">
                          <WhatsAppIcon className="w-4 h-4 text-green-600 hover:text-green-500 transition-colors" />
                        </a>
                      </div>
                      <a href="tel:+66818519922" className="block text-[var(--c-footer-text)] hover:text-[var(--c-accent-primary)] transition-colors">{t('footer_contact_office')}</a>
                    </div>
                  </div>
                </div>
                <div className="flex items-start">
                  <EmailIcon className="w-5 h-5 mt-0.5 text-[var(--c-accent-primary)] flex-shrink-0" />
                  <div className="ms-3">
                    <p className="font-semibold text-[var(--c-text-primary)]">{t('footer_contact_email_title')}</p>
                    <a href="mailto:info.vkamber@gmail.com?cc=vkamber91@gmail.com" className="block text-[var(--c-footer-text)] hover:text-[var(--c-accent-primary)] transition-colors">
                      {t('footer_contact_email_1')}
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div>
                <h3 className="text-lg font-semibold text-[var(--c-heading)]">{t('footer_follow_us_title')}</h3>
                <div className="flex flex-wrap items-center gap-3 mt-4">
                    <a href="https://facebook.com/vkmmamber" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="opacity-80 hover:opacity-100 transition-opacity">
                        <img src="https://i.postimg.cc/YCMfNbVb/facebook.webp" alt="Facebook" className="w-8 h-8" />
                    </a>
                    <a href="https://instagram.com/vkmmamber" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="opacity-80 hover:opacity-100 transition-opacity">
                        <img src="https://i.postimg.cc/P5ybS1nh/instagram.webp" alt="Instagram" className="w-8 h-8" />
                    </a>
                    <a href="https://twitter.com/vkmmamber" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="opacity-80 hover:opacity-100 transition-opacity">
                        <img src="https://i.postimg.cc/632d6S25/twitter.webp" alt="Twitter" className="w-8 h-8" />
                    </a>
                    <a href="https://pinterest.com/vkmmamber" target="_blank" rel="noopener noreferrer" aria-label="Pinterest" className="opacity-80 hover:opacity-100 transition-opacity">
                        <img src="https://i.postimg.cc/JnfjsqZ3/pinterest.webp" alt="Pinterest" className="w-8 h-8" />
                    </a>
                    <a href="https://youtube.com/@vkmmamber" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="opacity-80 hover:opacity-100 transition-opacity">
                        <img src="https://i.postimg.cc/hG3LBgG5/youtube.webp" alt="YouTube" className="w-8 h-8" />
                    </a>
                    <a href="https://linkedin.com/company/vkmmamber" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="opacity-80 hover:opacity-100 transition-opacity">
                        <img src="https://i.postimg.cc/bNXRrzRX/linkedin.webp" alt="LinkedIn" className="w-8 h-8" />
                    </a>
                    <a href="https://tiktok.com/@vkmmamber" target="_blank" rel="noopener noreferrer" aria-label="Tiktok" className="opacity-80 hover:opacity-100 transition-opacity">
                        <img src="https://i.postimg.cc/cJJR26d3/tiktok.webp" alt="Tiktok" className="w-8 h-8" />
                    </a>
                </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-[var(--c-heading)]/10 text-center">
             <Link to={getTranslatedPath('/')} aria-label="Back to Homepage">
              <img 
                  src="https://i.postimg.cc/Prt96m87/VKGems-logo-small-web.webp" 
                  alt="Vicky Amber & Gems Logo" 
                  className="h-10 w-auto block mx-auto mb-4"
              />
            </Link>
            <p className="text-sm opacity-70">{t('footer_copyright', { year: new Date().getFullYear() })}</p>
          </div>
        </div>
      </footer>
      
      {/* Sticky Mobile Footer Menu */}
      <footer className="md:hidden fixed bottom-0 left-0 right-0 bg-[var(--c-surface)] border-t border-[var(--c-border)] shadow-t-lg z-50">
          <div className="flex justify-around items-center h-16">
              <Link to={getTranslatedPath('/collection')} className="flex flex-col items-center text-[var(--c-text-secondary)] hover:text-[var(--c-accent-primary)] transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                  <span className="text-xs">{t('footer_mobile_shop')}</span>
              </Link>
              <Link to={getTranslatedPath('/build-your-set')} className="flex flex-col items-center text-[var(--c-text-secondary)] hover:text-[var(--c-accent-primary)] transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
                  <span className="text-xs">{t('footer_mobile_preorder')}</span>
              </Link>
              <Link to={getTranslatedPath('/blog')} className="flex flex-col items-center text-[var(--c-text-secondary)] hover:text-[var(--c-accent-primary)] transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                  <span className="text-xs">{t('footer_mobile_blog')}</span>
              </Link>
              <Link to={getTranslatedPath('/contact')} className="flex flex-col items-center text-[var(--c-text-secondary)] hover:text-[var(--c-accent-primary)] transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  <span className="text-xs">{t('footer_mobile_contact')}</span>
              </Link>
          </div>
      </footer>
    </>
  );
};