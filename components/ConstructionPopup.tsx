import React, { useState, useEffect } from 'react';

const translations: { [key: string]: any } = {
    en: {
        title: "⚠️ This Page is Under Construction",
        body: "Our design and graphic elements are still being finalized. However, you’re welcome to explore — some customizable bead sets are already available and may interest you.",
        date: "🗓️ Last Updated: 20 July 2025",
        btn1: "Visit Main Website →",
        btn2: "Go to Facebook Page →",
        btn3: "Continue Browsing →",
        langName: 'English'
    },
    th: {
        title: "⚠️ หน้านี้อยู่ระหว่างการปรับปรุง",
        body: "องค์ประกอบด้านกราฟิกและดีไซน์ยังอยู่ในระหว่างการพัฒนา อย่างไรก็ตาม คุณยังสามารถเข้าชมได้ — ขณะนี้มีเมนูชุดเม็ดประคำบางรายการที่สามารถปรับแต่งพร้อมภาพประกอบได้ ซึ่งคุณอาจสนใจ",
        date: "🗓️ อัปเดตล่าสุด: 20 กรกฎาคม 2025",
        btn1: "เยี่ยมชมเว็บไซต์หลัก →",
        btn2: "ไปที่เพจ Facebook →",
        btn3: "เข้าชมหน้านี้ต่อ",
        langName: 'ภาษาไทย'
    },
    ar: {
        title: "⚠️ هذه الصفحة قيد الإنشاء",
        body: "لا تزال عناصر التصميم والرسومات قيد التطوير. ولكن يمكنك التصفح الآن — هناك بعض أطقم الخرز القابلة للتخصيص والمتاحة حالياً وقد تعجبك.",
        date: "🗓️ آخر تحديث: 20 يوليو 2025",
        btn1: "← زيارة الموقع الرئيسي",
        btn2: "← الانتقال إلى صفحة فيسبوك",
        btn3: "المتابعة في تصفح هذه الصفحة",
        langName: 'العربية'
    },
    zh: {
        title: "⚠️ 页面正在建设中",
        body: "我们的网站设计和图形元素仍在开发中。但您仍可以浏览 — 当前已有部分可定制的珠串上架，您可能会感兴趣。",
        date: "🗓️ 最近更新：2025年7月20日",
        btn1: "访问主网站 →",
        btn2: "前往 Facebook 页面 →",
        btn3: "继续浏览当前页面",
        langName: '中文'
    },
    hi: {
        title: "⚠️ यह पेज अभी निर्माणाधीन है",
        body: "हमारी डिज़ाइन और ग्राफ़िक एलिमेंट्स पर अभी काम चल रहा है। फिर भी आप ब्राउज़ कर सकते हैं — कुछ कस्टमाइज़ करने योग्य मोती सेट उपलब्ध हैं, जो आपको पसंद आ सकते हैं।",
        date: "🗓️ अंतिम अपडेट: 20 जुलाई 2025",
        btn1: "मुख्य वेबसाइट पर जाएँ →",
        btn2: "Facebook पेज देखें →",
        btn3: "ब्राउज़ करना जारी रखें",
        langName: 'हिन्दी'
    }
};

const languages = [
    { code: 'en', flag: '🇬🇧' },
    { code: 'th', flag: '🇹🇭' },
    { code: 'ar', flag: '🇸🇦' },
    { code: 'zh', flag: '🇨🇳' },
    { code: 'hi', flag: '🇮🇳' },
];

const ConstructionPopup: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [lang, setLang] = useState('en');
    const [isFadingOut, setIsFadingOut] = useState(false);
    const [isLangDropdownOpen, setLangDropdownOpen] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (sessionStorage.getItem('popupDismissed-v2') !== 'true') {
                setIsVisible(true);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        setIsFadingOut(true);
        setTimeout(() => {
            setIsVisible(false);
            sessionStorage.setItem('popupDismissed-v2', 'true');
        }, 300);
    };

    const handleLangSelect = (langCode: string) => {
        setLang(langCode);
        setLangDropdownOpen(false);
    };

    if (!isVisible) return null;

    const content = translations[lang];
    const isRtl = lang === 'ar';

    return (
        <div className={`popup-overlay ${isFadingOut ? 'fade-out' : 'fade-in'}`} role="dialog" aria-modal="true" aria-labelledby="popup-title">
            <div className={`popup-modal ${isFadingOut ? 'fade-out' : 'fade-in'}`} dir={isRtl ? 'rtl' : 'ltr'}>
                
                <div className="popup-lang-selector">
                    <button 
                        onClick={() => setLangDropdownOpen(!isLangDropdownOpen)} 
                        className="popup-lang-button"
                        aria-haspopup="true"
                        aria-expanded={isLangDropdownOpen}
                    >
                        <span>{languages.find(l => l.code === lang)?.flag}</span>
                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </button>
                    {isLangDropdownOpen && (
                        <div className="popup-lang-dropdown" role="menu">
                            {languages.map(l => (
                                <button key={l.code} onClick={() => handleLangSelect(l.code)} role="menuitem">
                                    <span>{l.flag}</span> <span>{translations[l.code].langName}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="text-center">
                    <h2 id="popup-title" className="popup-title">{content.title}</h2>
                    <p className="popup-body">{content.body}</p>
                    <p className="popup-date">{content.date}</p>
                </div>

                <div className="popup-buttons">
                    <a href="https://www.vickyamber.com" target="_blank" rel="noopener noreferrer" className="popup-btn popup-btn-secondary">{content.btn1}</a>
                    <a href="https://www.facebook.com/vkmmamber" target="_blank" rel="noopener noreferrer" className="popup-btn popup-btn-secondary">{content.btn2}</a>
                    <button onClick={handleClose} className="popup-btn popup-btn-primary">{content.btn3}</button>
                </div>
            </div>
        </div>
    );
};

export default ConstructionPopup;