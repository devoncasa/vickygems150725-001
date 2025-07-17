import React, { useState, useEffect } from 'react';
import { CloseIcon, ExternalLinkIcon } from './IconComponents';

const UnderConstructionBanner: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Use sessionStorage to only show it once per session.
        if (sessionStorage.getItem('constructionBannerDismissed') !== 'true') {
            setIsVisible(true);
        }
    }, []);

    const handleClose = () => {
        const modal = document.querySelector('.construction-modal');
        const overlay = document.querySelector('.construction-overlay');
        
        if (modal) modal.classList.add('fade-out');
        if (overlay) overlay.classList.add('fade-out');

        setTimeout(() => {
            setIsVisible(false);
            sessionStorage.setItem('constructionBannerDismissed', 'true');
        }, 300);
    };

    if (!isVisible) {
        return null;
    }

    const styles = `
        .construction-overlay {
            position: fixed;
            inset: 0;
            background-color: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(5px);
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: fadeIn 0.3s ease-out forwards;
        }
        .construction-modal {
            background-color: var(--c-surface);
            color: var(--c-text-primary);
            padding: 2rem;
            border-radius: 1rem;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            width: 90vw;
            max-width: 500px;
            position: relative;
            border: 1px solid var(--c-border);
            animation: slideUpFadeIn 0.4s ease-out forwards;
            transition: opacity 0.3s, transform 0.3s;
        }
        .construction-overlay.fade-out {
            animation: fadeOut 0.3s ease-out forwards;
        }
        .construction-modal.fade-out {
            animation: slideDownFadeOut 0.3s ease-out forwards;
        }
        .construction-modal h2 {
            font-family: 'Cormorant Garamond', serif;
            font-size: 1.75rem;
            color: var(--c-heading);
            text-align: center;
            margin-bottom: 0.5rem;
        }
        .construction-modal p {
            font-family: 'Tenor Sans', sans-serif;
            text-align: center;
            margin-bottom: 1.5rem;
            color: var(--c-text-secondary);
            line-height: 1.6;
        }
        .construction-links {
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
        }
        .construction-link {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            padding: 0.75rem 1rem;
            border-radius: 0.5rem;
            text-decoration: none;
            font-weight: bold;
            transition: all 0.2s ease;
            font-family: 'Tenor Sans', sans-serif;
        }
        .link-main {
            background-color: var(--c-accent-primary);
            color: white;
        }
        .link-main:hover {
            background-color: var(--c-accent-primary-hover);
            transform: translateY(-2px);
        }
        .link-facebook {
            background-color: #1877F2;
            color: white;
        }
        .link-facebook:hover {
            background-color: #166FE5;
            transform: translateY(-2px);
        }
        .close-btn {
            position: absolute;
            top: 0.75rem;
            right: 0.75rem;
            background: none;
            border: none;
            padding: 0.5rem;
            cursor: pointer;
            color: var(--c-text-secondary);
            border-radius: 50%;
            transition: all 0.2s ease;
        }
        .close-btn:hover {
            color: var(--c-heading);
            background-color: rgba(0,0,0,0.05);
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }
        @keyframes slideUpFadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideDownFadeOut {
            from { opacity: 1; transform: translateY(0); }
            to { opacity: 0; transform: translateY(20px); }
        }
    `;

    return (
        <>
            <style>{styles}</style>
            <div className="construction-overlay" role="dialog" aria-modal="true" aria-labelledby="construction-title">
                <div className="construction-modal">
                    <button onClick={handleClose} className="close-btn" aria-label="Close">
                        <CloseIcon className="w-6 h-6" />
                    </button>
                    <h2 id="construction-title">Site Under Construction</h2>
                    <p>This page is currently under construction. For more information, please visit our main sites:</p>
                    <div className="construction-links">
                        <a href="https://www.vickyamber.com" target="_blank" rel="noopener noreferrer" className="construction-link link-main">
                            Main Website <ExternalLinkIcon className="w-4 h-4" />
                        </a>
                        <a href="https://facebook.com/vkmmamber" target="_blank" rel="noopener noreferrer" className="construction-link link-facebook">
                            Facebook Page <ExternalLinkIcon className="w-4 h-4" />
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UnderConstructionBanner;