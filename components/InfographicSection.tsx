
import React, { useState, useEffect, useRef } from 'react';

const InfographicSection: React.FC = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);
    const observerRef = useRef<IntersectionObserver | null>(null);

    useEffect(() => {
        if (!isExpanded || !contentRef.current) {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
            return;
        }

        const animateCounters = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target as HTMLElement;
                    const target = +el.getAttribute('data-target')!;
                    const decimalPlaces = +el.getAttribute('data-decimal')! || 0;
                    const duration = 2000;
                    let start = 0;
                    const stepTime = 20;
                    const steps = duration / stepTime;
                    const increment = target / steps;

                    const timer = setInterval(() => {
                        start += increment;
                        if (start >= target) {
                            el.innerText = target.toFixed(decimalPlaces);
                            clearInterval(timer);
                        } else {
                            el.innerText = start.toFixed(decimalPlaces);
                        }
                    }, stepTime);

                    observer.unobserve(el);
                }
            });
        };

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (entry.target.classList.contains('stat-number')) {
                        animateCounters([entry], obs);
                    } else {
                        entry.target.classList.add('visible');
                        obs.unobserve(entry.target);
                    }
                }
            });
        }, { root: contentRef.current, threshold: 0.1 });

        observerRef.current = observer;
        const elements = contentRef.current.querySelectorAll('.fade-in-up, .stat-number');
        elements.forEach(el => observer.observe(el));

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [isExpanded]);
    
    // Toggle function for mobile clicks and hover on desktop
    const toggleExpansion = () => {
        setIsExpanded(prev => !prev);
    };

    const handleMouseEnter = () => {
        if (window.innerWidth > 768) { // Only trigger on desktop
            setIsExpanded(true);
        }
    };
    
    const handleMouseLeave = () => {
        if (window.innerWidth > 768) { // Only trigger on desktop
            setIsExpanded(false);
        }
    };


    const styles = `
        .expandable-infographic-section {
            background-color: #FDFBF8;
            transition: all 0.5s ease-in-out;
            position: relative;
            overflow: hidden;
            border-top: 1px solid var(--c-border);
            border-bottom: 1px solid var(--c-border);
        }
        .infographic-teaser {
            height: 250px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            background-size: cover;
            background-position: center;
            position: relative;
            color: white;
            transition: transform 0.5s ease;
            cursor: pointer;
        }
        .expandable-infographic-section:not(.expanded) .infographic-teaser:hover {
            transform: scale(1.02);
        }
        .infographic-teaser::before {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(to top, rgba(61, 53, 46, 0.8) 0%, rgba(61, 53, 46, 0.45) 100%);
            z-index: 1;
        }
        .infographic-teaser > * {
            position: relative;
            z-index: 2;
            text-shadow: 0 2px 8px rgba(0,0,0,0.6);
        }
        .hover-prompt {
            opacity: 0;
            transition: opacity 0.5s ease 0.3s;
            margin-top: 1rem;
            font-family: 'Tenor Sans', sans-serif;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            font-size: 0.875rem;
            padding: 0.5rem 1rem;
            border: 1px solid rgba(255,255,255,0.7);
            border-radius: 9999px;
            backdrop-filter: blur(2px);
        }
        @media (hover: hover) and (pointer: fine) {
            .expandable-infographic-section:not(.expanded) .infographic-teaser:hover .hover-prompt {
                opacity: 1;
            }
        }

        .infographic-content-wrapper {
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            cursor: default;
        }
        .infographic-content-wrapper.expanded {
            max-height: 5000px; /* A large value to accommodate content */
        }

        .infographic-section {
            padding: 4rem 1rem;
            position: relative;
            overflow: hidden;
            font-family: 'Tenor Sans', sans-serif;
            color: #3a3a3a;
        }
        .infographic-section h1, .infographic-section h2, .infographic-section h3 {
            font-family: 'Cormorant Garamond', serif;
            font-weight: 700;
        }
        .section-bg-wrapper {
            position: absolute;
            top: 0; left: 0;
            width: 100%; height: 100%;
            z-index: 0;
            overflow: hidden;
        }
        .section-bg {
            width: 100%; height: 100%;
            background-size: cover;
            background-position: center center;
            background-attachment: fixed;
        }
        .section-overlay {
            position: absolute;
            top: 0; left: 0;
            width: 100%; height: 100%;
            background-color: rgba(253, 251, 248, 0.85);
        }
        .content-container {
            position: relative;
            z-index: 1;
        }
        .stat-number {
            font-family: 'Cormorant Garamond', serif;
            font-size: 4rem;
            line-height: 1;
            color: #904a21;
            font-weight: 700;
        }
        .stat-label {
            font-family: 'Tenor Sans', sans-serif;
            font-size: 1rem;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            color: #80513d; /* Darker Clay for WCAG AA contrast */
            margin-top: 0.5rem;
        }
        .gem-card {
            background-color: transparent;
            perspective: 1000px;
            min-height: 280px;
        }
        .gem-card-inner {
            position: relative; width: 100%; height: 100%;
            text-align: left;
            transition: transform 0.6s;
            transform-style: preserve-3d;
            box-shadow: 0 10px 30px rgba(0,0,0,0.07);
            border-radius: 0.5rem;
        }
        .gem-card:hover .gem-card-inner {
            transform: rotateY(180deg);
        }
        .gem-card-front, .gem-card-back {
            position: absolute;
            width: 100%; height: 100%;
            -webkit-backface-visibility: hidden;
            backface-visibility: hidden;
            background-color: rgba(255, 255, 255, 0.7);
            border: 1px solid #B49B5E;
            border-radius: 0.5rem;
            padding: 1.5rem;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }
        .gem-card-front img {
            height: 120px;
            width: 100%;
            object-fit: cover;
            border-radius: 0.25rem;
            margin-bottom: 1rem;
        }
        .gem-card-back {
            transform: rotateY(180deg);
            background-color: #A97C50;
            color: #FDFBF8;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: left;
            padding: 1rem;
        }
        .fade-in-up {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.8s ease-out, transform 0.8s ease-out;
        }
        .fade-in-up.visible {
            opacity: 1;
            transform: translateY(0);
        }
        .timeline-item {
            position: relative;
            padding-left: 2.5rem;
            padding-bottom: 2rem;
            border-left: 2px solid #B49B5E;
        }
        .timeline-item:last-child {
            border-left: 2px solid transparent;
        }
        .timeline-dot {
            position: absolute;
            left: -0.6rem;
            top: 0;
            height: 1.2rem;
            width: 1.2rem;
            background-color: #904a21;
            border-radius: 50%;
            border: 3px solid #FDFBF8;
        }
        .comparison-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 2rem;
            background-color: rgba(255,255,255,0.6);
            border-radius: 0.5rem;
            overflow:hidden;
        }
        .comparison-table th, .comparison-table td {
            padding: 1rem;
            text-align: left;
            border-bottom: 1px solid rgba(180, 155, 94, 0.2);
        }
        .comparison-table th {
            font-family: 'Cormorant Garamond', serif;
            font-size: 1.5rem;
            color: #904a21;
        }
        .comparison-table .highlight {
            color: #904a21;
            font-weight: bold;
        }
    `;

    return (
        <section 
            className={`expandable-infographic-section ${isExpanded ? 'expanded' : ''}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={toggleExpansion}
            role="button"
            aria-expanded={isExpanded}
            tabIndex={0}
        >
            <style>{styles}</style>
            
            <div className="infographic-teaser" style={{backgroundImage: "url('https://i.postimg.cc/yY0H0PRS/vkgems-info-Stories-in-Stone-Legendary-Gems-background.webp')"}}>
                <h2 className="text-3xl md:text-4xl" style={{fontFamily: "'Cormorant Garamond', serif"}}>An Interactive Guide to the Treasures of Myanmar</h2>
                <div className="hover-prompt">Hover or Click to Explore</div>
            </div>

            <div 
                className={`infographic-content-wrapper ${isExpanded ? 'expanded' : ''}`}
                style={{maxHeight: isExpanded ? (contentRef.current?.scrollHeight || 0) : 0}}
            >
                <div ref={contentRef}>
                    <header className="text-center py-16 px-4 infographic-section" style={{paddingTop: '4rem', paddingBottom: '4rem'}}>
                        <h1 className="text-5xl md:text-7xl font-bold text-[#904a21] mb-4">The Treasures of Myanmar</h1>
                        <p className="text-xl max-w-3xl mx-auto text-gray-600">A journey into the ancient origins and geological wonders of Burmese Amber and the world's most coveted gemstones.</p>
                    </header>
                    <main>
                        {/* Part 1: Burmese Amber */}
                        <section id="amber" className="infographic-section">
                            <div className="section-bg-wrapper">
                                <div className="section-bg" style={{backgroundImage: "url('https://i.postimg.cc/Z5jXLD50/vkgems-info-amber-forest-backgroound.webp')"}}></div>
                                <div className="section-overlay"></div>
                            </div>
                            <div className="container mx-auto px-4 text-center content-container">
                                <h2 className="text-4xl md:text-5xl mb-4 fade-in-up">Burmese Amber</h2>
                                <h3 className="text-2xl md:text-3xl text-gray-500 mb-12 fade-in-up" style={{transitionDelay: '100ms'}}>A 100-Million-Year-Old Time Capsule</h3>
                                
                                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 text-center mb-16">
                                    <div className="fade-in-up" style={{transitionDelay: '200ms'}}>
                                        <div className="stat-number" data-target="99">0</div>
                                        <div className="stat-label">Million Years Old</div>
                                        <p className="mt-4 text-gray-600">Formed in the Cretaceous period, offering a direct link to the age of dinosaurs.</p>
                                    </div>
                                    <div className="fade-in-up" style={{transitionDelay: '300ms'}}>
                                        <div className="stat-number" data-target="1000">0</div>
                                        <div className="stat-label">Extinct Species</div>
                                        <p className="mt-4 text-gray-600">The most diverse range of prehistoric life found in any amber on Earth.</p>
                                    </div>
                                    <div className="fade-in-up" style={{transitionDelay: '400ms'}}>
                                        <div className="stat-number" data-target="2.8" data-decimal="1">0</div>
                                        <div className="stat-label">Mohs Hardness</div>
                                        <p className="mt-4 text-gray-600">Significantly harder and more durable than most other types of amber.</p>
                                    </div>
                                    <div className="fade-in-up" style={{transitionDelay: '500ms'}}>
                                        <div className="stat-number" data-target="15">0</div>
                                        <div className="stat-label">China's Amber Market %</div>
                                        <p className="mt-4 text-gray-600">Represents a significant portion of the high-end amber market in Asia.</p>
                                    </div>
                                </div>

                                <div className="max-w-4xl mx-auto fade-in-up" style={{transitionDelay: '600ms'}}>
                                    <h3 className="text-3xl mb-6">Inclusions: A Prehistoric Zoo</h3>
                                     <div className="flex flex-wrap justify-center items-center gap-4 text-lg">
                                        <span className="bg-amber-100 text-amber-800 px-4 py-2 rounded-full">Insects & Arachnids</span>
                                        <span className="bg-red-100 text-red-800 px-4 py-2 rounded-full flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-fire mr-2" viewBox="0 0 16 16">
                                                <path d="M8 16c3.314 0 6-2 6-5.5 0-1.5-.5-4-2.5-6 .25 1.5-1.25 2-1.25 2C11 4 9 .5 6 0c.357 2 .5 4-2 6-1.25 1-2 2.729-2 4.5C2 14 4.686 16 8 16m0-1c-1.657 0-3-1-3-2.75 0-.75.25-2 1.25-3C6.125 8.249 7 7.5 7 7.5c-.101-.998.434-2.008 1.492-2.008.556 0 1.153.448 1.5.998.386.603.448 1.207.125 1.75h-.002c-.078.166-.178.332-.28.5C9.5 9.5 9 10.5 9 11.25c0 1.5-1.343 2.75-3 2.75"/>
                                            </svg>
                                            Dinosaur Feathers
                                        </span>
                                        <span className="bg-amber-100 text-amber-800 px-4 py-2 rounded-full">Snakes & Lizards</span>
                                        <span className="bg-amber-100 text-amber-800 px-4 py-2 rounded-full">Marine Life</span>
                                        <span className="bg-amber-100 text-amber-800 px-4 py-2 rounded-full">Ancient Flowers</span>
                                    </div>
                                </div>
                            </div>
                        </section>
                        
                        <section id="timeline" className="infographic-section">
                            <div className="section-bg-wrapper">
                                <div className="section-bg" style={{backgroundImage: "url('https://i.postimg.cc/26gsZb8w/vkamber-info-The-Journey-of-Burmite-background.webp')"}}></div>
                                <div className="section-overlay"></div>
                            </div>
                            <div className="container mx-auto px-4 content-container">
                                <h2 className="text-4xl md:text-5xl mb-12 text-center fade-in-up">The Journey of Burmite</h2>
                                <div className="max-w-2xl mx-auto">
                                    <div className="timeline-item fade-in-up" style={{transitionDelay: '200ms'}}>
                                        <div className="timeline-dot"></div>
                                        <h3 className="text-2xl mb-2">~99 Million Years Ago (Cretaceous)</h3>
                                        <p className="text-gray-600">Coniferous trees in a tropical coastal forest in what is now Myanmar produce vast amounts of resin. This resin traps local flora and fauna, from insects to dinosaur feathers.</p>
                                    </div>
                                    <div className="timeline-item fade-in-up" style={{transitionDelay: '400ms'}}>
                                        <div className="timeline-dot"></div>
                                        <h3 className="text-2xl mb-2">1st Century AD</h3>
                                        <p className="text-gray-600">First documented historical records show that Burmite is known and commercially exploited for trade and jewelry.</p>
                                    </div>
                                    <div className="timeline-item fade-in-up" style={{transitionDelay: '600ms'}}>
                                        <div className="timeline-dot"></div>
                                        <h3 className="text-2xl mb-2">Mid-19th Century</h3>
                                        <p className="text-gray-600">Burmese Amber becomes known to Western science, sparking interest in its unique paleontological value.</p>
                                    </div>
                                    <div className="timeline-item fade-in-up" style={{transitionDelay: '800ms'}}>
                                        <div className="timeline-dot"></div>
                                        <h3 className="text-2xl mb-2">Present Day</h3>
                                        <p className="text-gray-600">Recognized as a treasure for both gemology and science, Burmite is highly prized by collectors, jewelers, and researchers worldwide for its beauty and the secrets it holds.</p>
                                    </div>
                                </div>
                            </div>
                        </section>
                        
                        <section id="gemstones" className="infographic-section">
                            <div className="section-bg-wrapper">
                                <div className="section-bg" style={{backgroundImage: "url('https://i.postimg.cc/zGq9K159/vkgems-info-gemstones-mine-background.webp')"}}></div>
                                <div className="section-overlay"></div>
                            </div>
                            <div className="container mx-auto px-4 text-center content-container">
                                <h2 className="text-4xl md:text-5xl mb-4 fade-in-up">Myanmar's Gemstone Legacy</h2>
                                <h3 className="text-2xl md:text-3xl text-gray-500 mb-12 fade-in-up" style={{transitionDelay: '100ms'}}>The Cradle of Jewels</h3>

                                <div className="grid md:grid-cols-3 gap-12 text-center mb-16">
                                    <div className="fade-in-up" style={{transitionDelay: '200ms'}}>
                                        <div className="stat-number" data-target="90">0</div>
                                        <div className="stat-label">% Of World's Rubies</div>
                                        <p className="mt-4 text-gray-600">Historically, the legendary Mogok Valley has been the premier source of the finest rubies.</p>
                                    </div>
                                    <div className="fade-in-up" style={{transitionDelay: '300ms'}}>
                                        <div className="stat-number" data-target="70">0</div>
                                        <div className="stat-label">% Of Quality Jadeite</div>
                                        <p className="mt-4 text-gray-600">Myanmar is the world's powerhouse for high-quality jadeite, including Imperial Jade.</p>
                                    </div>
                                    <div className="fade-in-up" style={{transitionDelay: '400ms'}}>
                                        <div className="stat-number" data-target="30">0</div>
                                        <div className="stat-label">Million USD for a Ruby</div>
                                        <p className="mt-4 text-gray-600">"The Sunrise Ruby," a 25.59-carat Burmese gem, set a world record.</p>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
                                    <div className="gem-card fade-in-up" style={{transitionDelay: '500ms'}}><div className="gem-card-inner"><div className="gem-card-front"><img src="https://i.postimg.cc/vHrJ4mRr/vkgems-info-amber-flipping-card.webp" alt="Burmese Amber"/><div><h3 className="text-2xl mb-2">Burmese Amber</h3><p><strong>Hardness:</strong> 2.5 - 3.0 Mohs</p><p><strong>Defining Trait:</strong> A 99-million-year-old time capsule.</p></div></div><div className="gem-card-back"><div className="text-sm w-full"><h4 className="text-lg font-bold mb-2 text-white" style={{fontFamily: "'Cormorant Garamond', serif"}}>Burmite: A Prehistoric Time Capsule</h4><p className="mb-3 text-white/90 text-xs leading-relaxed">As the world's oldest gem-quality amber, Burmite is a direct portal to the Cretaceous period. Formed nearly 100 million years ago, it offers an unparalleled window into the age of dinosaurs, preserving an entire ecosystem with unmatched scientific and gemological significance.</p><ul className="space-y-1 text-xs text-white/90 list-disc list-inside"><li><strong>Primary Source:</strong> Hukawng Valley, Myanmar</li><li><strong>Key Identifier:</strong> Superior hardness (2.5-3.0 Mohs) and the presence of Cretaceous-era biological inclusions.</li><li><strong>Spiritual Belief:</strong> Believed to hold ancient Earth wisdom, providing grounding, protection, and a connection to deep time.</li><li><strong>Did You Know?:</strong> It is the only amber known to have trapped feathers from non-avian dinosaurs.</li></ul></div></div></div></div>
                                    <div className="gem-card fade-in-up" style={{transitionDelay: '600ms'}}><div className="gem-card-inner"><div className="gem-card-front"><img src="https://i.postimg.cc/QNTGrb0n/vkgems-info-ruby-flipping-card.webp" alt="Ruby"/><div><h3 className="text-2xl mb-2">Ruby</h3><p><strong>Hardness:</strong> 9 Mohs</p><p><strong>Defining Trait:</strong> The legendary "Pigeon's Blood" red.</p></div></div><div className="gem-card-back"><div className="text-sm w-full"><h4 className="text-lg font-bold mb-2 text-white" style={{fontFamily: "'Cormorant Garamond', serif"}}>The Essence of Ruby: A Stone of Kings</h4><p className="mb-3 text-white/90 text-xs leading-relaxed">Sourced from the legendary Mogok Valley, the Burmese ruby is revered as the "King of Gems." Its fiery glow has long been associated with power, passion, and protection, making it the ultimate talisman for royalty and leaders throughout history.</p><ul className="space-y-1 text-xs text-white/90 list-disc list-inside"><li><strong>Primary Source:</strong> Mogok Valley, Myanmar</li><li><strong>Key Identifier:</strong> Unmatched 'Pigeon's Blood' red color with strong natural fluorescence that makes it glow from within.</li><li><strong>Spiritual Belief:</strong> A powerful talisman for vitality, courage, and passion. It is thought to stimulate the heart chakra and bestow invincibility upon its wearer.</li><li><strong>Did You Know?:</strong> In ancient times, Burmese warriors would embed rubies under their skin, believing it made them invincible in battle.</li></ul></div></div></div></div>
                                    <div className="gem-card fade-in-up" style={{transitionDelay: '700ms'}}><div className="gem-card-inner"><div className="gem-card-front"><img src="https://i.postimg.cc/TYC1h47Q/vkgems-info-sapphire-flipping-card-1.webp" alt="Sapphire"/><div><h3 className="text-2xl mb-2">Sapphire</h3><p><strong>Hardness:</strong> 9 Mohs</p><p><strong>Defining Trait:</strong> A rich, intense, and velvety "Burma Blue" color.</p></div></div><div className="gem-card-back"><div className="text-sm w-full"><h4 className="text-lg font-bold mb-2 text-white" style={{fontFamily: "'Cormorant Garamond', serif"}}>Burma Blue: A Glimpse of the Celestial</h4><p className="mb-3 text-white/90 text-xs leading-relaxed">The velvety, royal blue color of a Burmese sapphire is the global benchmark for this celestial gem. Historically linked to divinity and truth, its deep, unchanging hue is a symbol of wisdom, nobility, and divine favor.</p><ul className="space-y-1 text-xs text-white/90 list-disc list-inside"><li><strong>Primary Source:</strong> Mogok, Myanmar</li><li><strong>Key Identifier:</strong> A rich, velvety, pure "Royal Blue" hue that maintains its exceptional color in all forms of lighting.</li><li><strong>Spiritual Belief:</strong> A stone of wisdom, prophecy, and mental clarity. It's believed to calm the mind and connect the wearer to higher spiritual realms.</li><li><strong>Did You Know?:</strong> Fine Burmese sapphires can be more valuable than diamonds, and often have microscopic rutile silk inclusions that give them a soft, unique luster.</li></ul></div></div></div></div>
                                    <div className="gem-card fade-in-up" style={{transitionDelay: '800ms'}}><div className="gem-card-inner"><div className="gem-card-front"><img src="https://i.postimg.cc/1X6Lcm8Z/vkgems-info-jadeite-flipping-card.webp" alt="Jadeite"/><div><h3 className="text-2xl mb-2">Jadeite</h3><p><strong>Hardness:</strong> 6.5 - 7 Mohs</p><p><strong>Defining Trait:</strong> The vibrant, translucent green known as "Imperial Jade."</p></div></div><div className="gem-card-back"><div className="text-sm w-full"><h4 className="text-lg font-bold mb-2 text-white" style={{fontFamily: "'Cormorant Garamond', serif"}}>Imperial Jadeite: The Stone of Heaven</h4><p className="mb-3 text-white/90 text-xs leading-relaxed">Jadeite holds supreme cultural importance in Asia, where the prized "Imperial Green" was reserved for emperors. It is more than a gem; it's a spiritual conduit, believed to bridge the physical and metaphysical worlds with its protective and healing energy.</p><ul className="space-y-1 text-xs text-white/90 list-disc list-inside"><li><strong>Primary Source:</strong> Hpakant, Myanmar</li><li><strong>Key Identifier:</strong> A vibrant, semi-translucent emerald-green color with a fine, smooth texture and a characteristic "oily" luster.</li><li><strong>Spiritual Belief:</strong> Embodies virtues of wisdom, courage, and justice, acting as a powerful protector against evil and a bringer of good health and fortune.</li><li><strong>Did You Know?:</strong> Jadeite is significantly rarer and harder than Nephrite, the other type of jade. Top-grade Imperial Jadeite can be one of the most expensive gems on earth per carat.</li></ul></div></div></div></div>
                                    <div className="gem-card fade-in-up" style={{transitionDelay: '900ms'}}><div className="gem-card-inner"><div className="gem-card-front"><img src="https://i.postimg.cc/R0p5vpk2/vkgems-info-spinel-flipping-card.webp" alt="Spinel"/><div><h3 className="text-2xl mb-2">Spinel</h3><p><strong>Hardness:</strong> 8 Mohs</p><p><strong>Defining Trait:</strong> A fiery array of colors, especially vibrant red and pink.</p></div></div><div className="gem-card-back"><div className="text-sm w-full"><h4 className="text-lg font-bold mb-2 text-white" style={{fontFamily: "'Cormorant Garamond', serif"}}>Spinel: The Great Impostor of Royalty</h4><p className="mb-3 text-white/90 text-xs leading-relaxed">For centuries, spinel was famously mistaken for ruby, gracing some of the world's most famous crown jewels. Today, its exceptional brilliance and fiery range of vibrant colors are celebrated in their own right, making it a collector's favorite.</p><ul className="space-y-1 text-xs text-white/90 list-disc list-inside"><li><strong>Primary Source:</strong> Mogok & Pein Pyit, Myanmar</li><li><strong>Key Identifier:</strong> Exceptional brilliance and fire that often surpasses ruby, available in a vast range of vivid colors from red to cobalt blue.</li><li><strong>Spiritual Belief:</strong> A stone of revitalization and hope. It is believed to reduce stress, replenish energy levels, and inspire new beginnings and perseverance.</li><li><strong>Did You Know?:</strong> The UK's 170-carat "Black Prince's Ruby," set in the Imperial State Crown, is actually one of the world's largest uncut red spinels.</li></ul></div></div></div></div>
                                    <div className="gem-card fade-in-up" style={{transitionDelay: '1000ms'}}><div className="gem-card-inner"><div className="gem-card-front"><img src="https://i.postimg.cc/NMyhF7YF/vkgems-info-peridot-flipping-card.webp" alt="Peridot"/><div><h3 className="text-2xl mb-2">Peridot</h3><p><strong>Hardness:</strong> 6.5 - 7 Mohs</p><p><strong>Defining Trait:</strong> A distinctive and brilliant olive or "bottle-green" hue.</p></div></div><div className="gem-card-back"><div className="text-sm w-full"><h4 className="text-lg font-bold mb-2 text-white" style={{fontFamily: "'Cormorant Garamond', serif"}}>Peridot: Gem of the Sun</h4><p className="mb-3 text-white/90 text-xs leading-relaxed">Revered by ancient Egyptians as the "gem of the sun," peridot is famed for its unique olive-green glow that never changes, even in artificial light. Its vibrant energy has been treasured for over 3,500 years as a symbol of light and renewal.</p><ul className="space-y-1 text-xs text-white/90 list-disc list-inside"><li><strong>Primary Source:</strong> Pyaung Gaung, Myanmar</li><li><strong>Key Identifier:</strong> Its signature olive-green color is idiochromatic, meaning the color comes from the mineral's basic chemical structure itself.</li><li><strong>Spiritual Belief:</strong> A stone of compassion, it's believed to balance emotions, cleanse the mind of jealousy, and protect against nightmares.</li><li><strong>Did You Know?:</strong> Many historians believe that Cleopatra's famous "emeralds" were actually fine peridots, a testament to its ancient allure.</li></ul></div></div></div></div>
                                </div>
                            </div>
                        </section>

                        <section id="stories" className="infographic-section">
                            <div className="section-bg-wrapper">
                                <div className="section-bg" style={{backgroundImage: "url('https://i.postimg.cc/yY0H0PRS/vkgems-info-Stories-in-Stone-Legendary-Gems-background.webp')"}}></div>
                                <div className="section-overlay"></div>
                            </div>
                            <div className="container mx-auto px-4 content-container">
                                <h2 className="text-4xl md:text-5xl mb-12 text-center fade-in-up">Stories in Stone: Legendary Gems</h2>
                                <div className="grid md:grid-cols-2 gap-12 items-center">
                                    <div className="text-left fade-in-up" style={{transitionDelay: '200ms'}}>
                                        <h3 className="text-3xl mb-4">The Sunrise Ruby</h3>
                                        <p className="text-lg text-gray-600 mb-4">The most expensive ruby ever sold, this 25.59-carat "pigeon's blood" ruby from Mogok fetched over $30 million USD at auction. Its exceptional purity, color, and rarity make it a global icon of Burmese gemstone quality.</p>
                                        <p className="text-gray-600">Its sale cemented the status of Burmese rubies as the most valuable colored gemstones in the world, surpassing even many diamonds in per-carat price.</p>
                                    </div>
                                    <div className="fade-in-up" style={{transitionDelay: '400ms'}}>
                                        <img src="https://i.postimg.cc/8zHg0ztp/vkgems-info-sunrise-ruby.webp" alt="The Sunrise Ruby" className="rounded-lg shadow-lg w-full h-auto"/>
                                    </div>
                                </div>
                                <div className="grid md:grid-cols-2 gap-12 items-center mt-16">
                                     <div className="fade-in-up md:order-2" style={{transitionDelay: '200ms'}}>
                                        <img src="https://i.postimg.cc/05Tv63zs/vkgems-info-Emperial-Jade.webp" alt="Imperial Jade" className="rounded-lg shadow-lg w-full h-auto"/>
                                    </div>
                                    <div className="text-left fade-in-up md:order-1" style={{transitionDelay: '400ms'}}>
                                        <h3 className="text-3xl mb-4">The Spirit of Imperial Jade</h3>
                                        <p className="text-lg text-gray-600 mb-4">For millennia, Jadeite has been more than a gem in Asian cultures; it is a spiritual conduit. The finest "Imperial Jade" from Hpakant, with its vibrant emerald green color and oily luster, was reserved exclusively for the Emperor of China.</p>
                                        <p className="text-gray-600">It is believed to possess the power to protect the wearer from harm, bring good fortune, and connect the physical world to the spiritual realm.</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section id="comparison-table" className="infographic-section">
                            <div className="section-bg-wrapper">
                                <div className="section-bg" style={{backgroundImage: "url('https://i.postimg.cc/yN8C4CbF/vkamber-info-Myanmar-vs-The-World-A-Gemstone-Showdown-background.webp')"}}></div>
                                <div className="section-overlay"></div>
                            </div>
                            <div className="container mx-auto px-4 content-container">
                                <h2 className="text-4xl md:text-5xl mb-12 text-center fade-in-up">Myanmar vs. The World: A Gemstone Showdown</h2>
                                <div className="overflow-x-auto fade-in-up" style={{transitionDelay: '200ms'}}>
                                    <table className="comparison-table">
                                        <thead>
                                            <tr>
                                                <th>Feature</th>
                                                <th>Burmese (Myanmar) Ruby</th>
                                                <th>African (Mozambique) Ruby</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td><strong>Color</strong></td>
                                                <td className="highlight">"Pigeon's Blood" - a pure, vivid red with strong red fluorescence.</td>
                                                <td>Can be beautiful, but often has a slight orange or purplish secondary tone.</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Clarity</strong></td>
                                                <td>Often contains fine, silk-like rutile inclusions that give it a soft, velvety glow.</td>
                                                <td>Typically has higher clarity with fewer large inclusions than Burmese rubies.</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Fluorescence</strong></td>
                                                <td className="highlight">Strong to intense red fluorescence under UV light, making it glow even in daylight.</td>
                                                <td>Lower to medium fluorescence due to higher iron content.</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Rarity & Value</strong></td>
                                                <td>Extremely rare, especially in larger sizes. The global benchmark for value.</td>
                                                <td>More readily available, making it a more accessible but generally less valuable alternative.</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </section>

                         <section id="map" className="infographic-section">
                            <div className="section-bg-wrapper">
                                 <div className="section-bg" style={{backgroundImage: "url('https://i.postimg.cc/66fs33xd/vkamber-info-Geographic-Origin-background.webp')"}}></div>
                                <div className="section-overlay"></div>
                            </div>
                            <div className="container mx-auto px-4 content-container">
                                <h2 className="text-4xl md:text-5xl mb-12 text-center fade-in-up">Geographic Origin</h2>
                                <div className="grid md:grid-cols-2 gap-8 items-center">
                                    <div className="fade-in-up" style={{transitionDelay: '200ms'}}>
                                        <img src="https://i.postimg.cc/Gmr1KyPg/vkgems-info-Geographic-Origin-background.webp" alt="Map of Myanmar Gemstone Mines" className="rounded-lg shadow-lg w-full h-auto max-w-sm mx-auto"/>
                                    </div>
                                    <div className="text-left fade-in-up" style={{transitionDelay: '400ms'}}>
                                        <h3 className="text-3xl mb-4">The Land of Jewels</h3>
                                        <p className="text-lg text-gray-600 mb-4">Myanmar's unique geological history, born from the collision of tectonic plates, created the perfect conditions for these rare treasures to form. The mountainous regions in the north are particularly rich.</p>
                                        <ul className="space-y-2">
                                            <li><strong className="text-[#904a21]">Hukawng Valley:</strong> The world's primary source of Cretaceous-era Burmese Amber.</li>
                                            <li><strong className="text-[#904a21]">Mogok Stone Tract:</strong> A legendary valley so rich in gems it's often called "The Valley of Rubies." It also produces world-class Sapphires and Spinels.</li>
                                            <li><strong className="text-[#904a21]">Hpakant:</strong> The epicenter of high-quality Jadeite mining, producing the coveted Imperial Jade.</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section id="comparison" className="infographic-section">
                            <div className="container mx-auto px-4 text-center content-container">
                                 <h2 className="text-4xl md:text-5xl mb-12 fade-in-up">Organic vs. Mineral: A Tale of Two Treasures</h2>
                                 <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 text-left">
                                    <div className="bg-amber-50 p-8 rounded-lg border border-amber-200 fade-in-up" style={{transitionDelay: '200ms'}}>
                                        <h3 className="text-3xl mb-4">Burmese Amber</h3>
                                        <ul className="space-y-4 text-lg">
                                            <li className="flex items-start"><span className="text-amber-500 mr-3 mt-1">&#10003;</span> <strong>Origin:</strong> Organic (Fossilized Tree Resin)</li>
                                            <li className="flex items-start"><span className="text-amber-500 mr-3 mt-1">&#10003;</span> <strong>Age:</strong> ~99 Million Years</li>
                                            <li className="flex items-start"><span className="text-amber-500 mr-3 mt-1">&#10003;</span> <strong>Hardness:</strong> Soft (2.5 - 3 Mohs)</li>
                                            <li className="flex items-start"><span className="text-amber-500 mr-3 mt-1">&#10003;</span> <strong>Key Feature:</strong> Contains prehistoric life (inclusions)</li>
                                        </ul>
                                    </div>
                                    <div className="bg-blue-50 p-8 rounded-lg border border-blue-200 fade-in-up" style={{transitionDelay: '400ms'}}>
                                        <h3 className="text-3xl mb-4">Myanmar Gemstones</h3>
                                         <ul className="space-y-4 text-lg">
                                            <li className="flex items-start"><span className="text-blue-500 mr-3 mt-1">&#10003;</span> <strong>Origin:</strong> Inorganic (Crystalline Minerals)</li>
                                            <li className="flex items-start"><span className="text-blue-500 mr-3 mt-1">&#10003;</span> <strong>Age:</strong> Formed deep in Earth's history</li>
                                            <li className="flex items-start"><span className="text-blue-500 mr-3 mt-1">&#10003;</span> <strong>Hardness:</strong> Very Hard (8 - 9 Mohs)</li>
                                            <li className="flex items-start"><span className="text-blue-500 mr-3 mt-1">&#10003;</span> <strong>Key Feature:</strong> Valued for color, clarity, and brilliance</li>
                                        </ul>
                                    </div>
                                 </div>
                            </div>
                        </section>
                    </main>
                </div>
            </div>
        </section>
    );
};

export default InfographicSection;