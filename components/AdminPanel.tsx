import React, { useState, useEffect, useMemo } from 'react';
import { GoogleGenAI } from '@google/genai';
import { GEM_DATA } from '../data/gem-data';
import { CloseIcon } from './IconComponents';
import { useAppContext } from '../context/AppContext';
import { Product, Material } from '../types';
import ProductCard from './ProductCard';

interface AdminPanelProps {
    isOpen: boolean;
    onClose: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose }) => {
    const { products, addProduct, deleteProduct } = useAppContext();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState<'add' | 'manage'>('add');
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

    const initialFormData = {
        gemCategory: '', gemType: '', gemColors: [] as string[], gemCuts: [] as string[], gemCutOther: '',
        gemOrigins: [] as string[], gemDimension: '', gemWeight: '', gemWeightUnit: 'carats',
        gemPrice: '', gemDescription: '', gemName: ''
    };
    const [formData, setFormData] = useState(initialFormData);

    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);
    
    // New states for Save & Preview workflow
    const [stagedProducts, setStagedProducts] = useState<Product[]>([]);
    const [showExitConfirm, setShowExitConfirm] = useState(false);
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const [lastAddedProducts, setLastAddedProducts] = useState<Product[]>([]);

    useEffect(() => {
        if (isOpen && sessionStorage.getItem('vlg-admin-auth') === 'true') {
            setIsLoggedIn(true);
        } else if (!isOpen) {
            // Reset all state on close
            setIsLoggedIn(false);
            setPassword('');
            setError('');
            resetAllState();
        }
    }, [isOpen]);
    
    const resetAllState = () => {
        resetForm();
        setStagedProducts([]);
        setLastAddedProducts([]);
        setActiveTab('add');
        setConfirmDeleteId(null);
        setShowExitConfirm(false);
        setShowPreviewModal(false);
    };

    useEffect(() => {
        const newPreviews = uploadedFiles.map(file => URL.createObjectURL(file));
        setImagePreviews(newPreviews);
        return () => newPreviews.forEach(url => URL.revokeObjectURL(url));
    }, [uploadedFiles]);
    
    const resetForm = () => {
        setFormData(initialFormData);
        setUploadedFiles([]);
        setImagePreviews([]);
        setIsGenerating(false);
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === '0007') {
            setIsLoggedIn(true);
            setError('');
            sessionStorage.setItem('vlg-admin-auth', 'true');
        } else {
            setError('Incorrect password. Please try again.');
            setPassword('');
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleMultiSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name } = e.target;
        const selected = Array.from(e.target.selectedOptions, option => option.value);
        setFormData(prev => ({ ...prev, [name]: selected }));
    };

    const handleNumericInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (/^\d*\.?\d*$/.test(value)) {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newCategory = e.target.value;
        setFormData(prev => ({
            ...prev, gemCategory: newCategory, gemType: newCategory === "Burmese Amber" ? "Burmese Amber" : '',
            gemColors: [], gemCuts: [], gemOrigins: [], gemName: ''
        }));
    };

    const availableGemTypes = useMemo(() => {
        if (!formData.gemCategory) return [];
        return Object.keys(GEM_DATA.categories[formData.gemCategory] || {});
    }, [formData.gemCategory]);

    const gemData = useMemo(() => {
        if (!formData.gemCategory || !formData.gemType) return null;
        return GEM_DATA.categories[formData.gemCategory]?.[formData.gemType] || null;
    }, [formData.gemCategory, formData.gemType]);

    const availableCuts = useMemo(() => {
        if (!gemData) return [];
        const allCuts = [...GEM_DATA.cuts.standard, ...(gemData.cuts || [])];
        allCuts.push('Other');
        return [...new Set(allCuts)].sort();
    }, [gemData]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length + uploadedFiles.length > 5) {
            alert('You can only upload a maximum of 5 images.'); return;
        }
        setUploadedFiles(prev => [...prev, ...files]);
    };

    const removeImage = (index: number) => setUploadedFiles(prev => prev.filter((_, i) => i !== index));

    const canGenerateDescription = useMemo(() => (
        formData.gemCategory && formData.gemType && formData.gemName && formData.gemWeight && formData.gemPrice && uploadedFiles.length > 0
    ), [formData, uploadedFiles.length]);

    const canStageProduct = useMemo(() => (
        canGenerateDescription && formData.gemDescription.trim() !== ''
    ), [canGenerateDescription, formData.gemDescription]);

    const generateDescription = async () => {
        if (!canGenerateDescription || isGenerating) return;
        if (!process.env.API_KEY) {
            alert("Error: API_KEY is not configured. AI features are disabled."); return;
        }
        setIsGenerating(true); setFormData(prev => ({...prev, gemDescription: ''}));
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            let cutString = formData.gemCuts.filter(c => c !== 'Other').join(', ');
            if (formData.gemCutOther) { cutString += (cutString ? ', ' : '') + formData.gemCutOther; }

            const prompt = `Act as an expert gemologist and luxury copywriter for "VickyLuxGems". Write a compelling, SEO-optimized product description for the following gemstone. Weave the details into an elegant narrative focusing on beauty, rarity, history, and emotional resonance.
                - Name: ${formData.gemName}
                - Type: ${formData.gemType}
                - Color(s): ${formData.gemColors.join(', ')}
                - Cut/Shape(s): ${cutString}
                - Origin(s): ${formData.gemOrigins.join(', ')}
                - Dimensions: ${formData.gemDimension} mm
                - Weight: ${formData.gemWeight} ${formData.gemWeightUnit}
                - Price: THB ${parseInt(formData.gemPrice).toLocaleString()}
                Provide only the product description text.`;
            
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
            setFormData(prev => ({...prev, gemDescription: response.text.trim()}));
        } catch (error) {
            console.error("Gemini API Error:", error);
            setFormData(prev => ({...prev, gemDescription: "Error generating description."}));
        } finally {
            setIsGenerating(false);
        }
    };
    
    const createProductFromState = (): Product => {
        const weightInGrams = formData.gemWeightUnit === 'carats' ? Number(formData.gemWeight) * 0.2 : Number(formData.gemWeight);
        return {
            id: `prod_${Date.now()}_${Math.random()}`,
            sku: `VLG-CUST-${Date.now()}`,
            name: formData.gemName,
            category: formData.gemType.toLowerCase().replace(/\s/g, '-'),
            material: formData.gemType as Material,
            price: Number(formData.gemPrice),
            isNewArrival: true,
            story: formData.gemDescription,
            energyProperties: [],
            media: {
                mainImageUrl: imagePreviews[0] || 'https://placehold.co/600x600/EAE0D5/534B42?text=New+Gem',
                gallery: imagePreviews.slice(1),
            },
            specifications: {
                totalWeight_grams: weightInGrams,
                origin: formData.gemOrigins.join(', '),
                clarityLevel: "High Grade",
                finish: formData.gemCuts.join(', '),
            },
            certification: { isCertified: true, authority: 'In-house' },
            inventory: { stock: 1, isAvailable: true },
        };
    };

    const handleAddAnother = () => {
        const newProduct = createProductFromState();
        setStagedProducts(prev => [...prev, newProduct]);
        resetForm();
    };

    const handleSaveAndPreview = () => {
        stagedProducts.forEach(p => addProduct(p));
        setLastAddedProducts([...stagedProducts]);
        setStagedProducts([]);
        setShowPreviewModal(true);
    };

    const handleAttemptExit = () => {
        if (stagedProducts.length > 0) {
            setShowExitConfirm(true);
        } else {
            onClose();
        }
    };

    const handleConfirmExit = () => {
        setShowExitConfirm(false);
        onClose();
    };

    const handleDelete = (productId: string) => {
        deleteProduct(productId);
        setConfirmDeleteId(null);
    };

    if (!isOpen) return null;

    const renderLogin = () => (
        <div className="admin-modal-content admin-login-view" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-body">
                <img src="https://i.postimg.cc/Prt96m87/VKGems_logo_small_web.webp" alt="Vicky LuxGems Logo" className="mx-auto mb-6 w-32 h-32"/>
                <h1 className="text-3xl font-bold text-center mb-6 font-serif text-[var(--c-heading)]">Admin Access</h1>
                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="admin-form-field">
                        <label className="admin-form-field label" htmlFor="password">Password</label>
                        <input className={`admin-input ${error ? 'border-red-500' : ''}`} type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
                    </div>
                    {error && <p className="text-red-600 text-sm -mt-4">{error}</p>}
                    <button type="submit" className="admin-button-primary w-full">Login</button>
                </form>
            </div>
        </div>
    );
    
    const renderAddForm = () => (
         <form onSubmit={(e) => e.preventDefault()} className="space-y-10">
            <section className="admin-form-section">
                <h2 className="font-serif">1. Gemstone Classification</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <div className="admin-form-field"><label htmlFor="gemCategory">Category</label><select id="gemCategory" name="gemCategory" value={formData.gemCategory} onChange={handleCategoryChange} required className="admin-select"><option value="" disabled>-- Select a Category --</option>{Object.keys(GEM_DATA.categories).map(cat => <option key={cat} value={cat}>{cat}</option>)}</select></div>
                    {formData.gemCategory && formData.gemCategory !== "Burmese Amber" && <div className="admin-form-field"><label htmlFor="gemType">Gemstone Type</label><select id="gemType" name="gemType" value={formData.gemType} onChange={handleInputChange} required className="admin-select" disabled={!formData.gemCategory}><option value="" disabled>-- Select a Gemstone --</option>{availableGemTypes.map(type => <option key={type} value={type}>{type}</option>)}</select></div>}
                    <div className="admin-form-field md:col-span-2"><label htmlFor="gemName">Product Name</label><input id="gemName" name="gemName" type="text" value={formData.gemName} onChange={handleInputChange} placeholder="e.g., Majestic Mogok Ruby" required className="admin-input" /></div>
                </div>
            </section>
            {gemData && <>
                <section className="admin-form-section"><h2 className="font-serif">2. Gemological Attributes</h2><div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6"><div className="admin-form-field"><label htmlFor="gemColors">Color(s)</label><select id="gemColors" name="gemColors" multiple value={formData.gemColors} onChange={handleMultiSelectChange} className="admin-select admin-multi-select">{gemData.colors.map(c => <option key={c} value={c}>{c}</option>)}</select></div><div className="admin-form-field"><label htmlFor="gemOrigins">Origin(s)</label><select id="gemOrigins" name="gemOrigins" multiple value={formData.gemOrigins} onChange={handleMultiSelectChange} className="admin-select admin-multi-select">{(gemData.origins || GEM_DATA.origins.standard).map(o => <option key={o} value={o}>{o}</option>)}</select></div><div className="admin-form-field md:col-span-2"><label htmlFor="gemCuts">Cut/Shape(s)</label><select id="gemCuts" name="gemCuts" multiple value={formData.gemCuts} onChange={handleMultiSelectChange} className="admin-select admin-multi-select">{availableCuts.map(c => <option key={c} value={c}>{c}</option>)}</select>{formData.gemCuts.includes('Other') && <input className="admin-input mt-4" type="text" name="gemCutOther" value={formData.gemCutOther} onChange={handleInputChange} placeholder="Specify other cut/shape" />}</div></div></section>
                <section className="admin-form-section"><h2 className="font-serif">3. Core Data & Media</h2><div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6"><div className="admin-form-field"><label htmlFor="gemDimension">Dimension (mm)</label><input id="gemDimension" name="gemDimension" type="text" value={formData.gemDimension} onChange={handleInputChange} placeholder="e.g., 10x8x5" required className="admin-input" /></div><div className="admin-form-field"><label htmlFor="gemPrice">Price (THB)</label><input id="gemPrice" name="gemPrice" type="text" value={formData.gemPrice} onChange={handleNumericInput} placeholder="e.g., 50000" required className="admin-input" /></div><div className="admin-form-field"><label htmlFor="gemWeight">Weight</label><div className="flex gap-2"><input id="gemWeight" name="gemWeight" type="text" value={formData.gemWeight} onChange={handleNumericInput} placeholder="e.g., 5.25" required className="admin-input w-2/3" /><select name="gemWeightUnit" value={formData.gemWeightUnit} onChange={handleInputChange} className="admin-select w-1/3"><option value="carats">carats</option><option value="grams">grams</option></select></div></div><div className="admin-form-field md:col-span-2"><label>Images (Max 5)</label><label htmlFor="gem-images-input" className="admin-input text-center cursor-pointer hover:border-[var(--c-accent-primary-hover)]">{uploadedFiles.length > 0 ? `${uploadedFiles.length}/5 files selected` : 'Choose files...'}</label><input id="gem-images-input" type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" /><div className="flex flex-wrap gap-4 mt-4">{imagePreviews.map((src, index) => <div key={index} className="relative w-24 h-24 rounded-lg overflow-hidden border-2 border-[var(--c-border)]"><img src={src} alt={`preview ${index}`} className="w-full h-full object-cover" /><button type="button" onClick={() => removeImage(index)} className="absolute top-1 right-1 w-5 h-5 bg-black/50 text-white rounded-full flex items-center justify-center text-xs font-bold leading-none">&times;</button></div>)}</div></div></div></section>
                <section className="admin-form-section"><h2 className="font-serif">4. AI-Powered Description</h2><div className="admin-form-field"><button type="button" onClick={generateDescription} disabled={!canGenerateDescription || isGenerating} className="admin-button-primary w-full flex items-center justify-center">{isGenerating && <span className="loader mr-3"></span>}{isGenerating ? 'Generating...' : 'Generate Description with AI'}</button></div><div className="admin-form-field"><textarea className="admin-textarea" name="gemDescription" rows={10} value={formData.gemDescription} onChange={handleInputChange} placeholder="AI-generated description will appear here..." ></textarea></div></section>
                
                {stagedProducts.length > 0 && (
                    <div className="admin-staged-info">
                        {stagedProducts.length} product(s) staged and ready to be saved.
                    </div>
                )}
                
                <div className="admin-button-group">
                    <button type="button" onClick={handleAddAnother} disabled={!canStageProduct} className="admin-button-primary">Add Another Product</button>
                    <button type="button" onClick={handleSaveAndPreview} disabled={stagedProducts.length === 0} className="admin-button-primary">Save & Preview ({stagedProducts.length})</button>
                    <button type="button" onClick={handleAttemptExit} className="admin-button-primary admin-button-secondary">Exit</button>
                </div>
            </>}
        </form>
    );

    const renderManageTab = () => (
        <div>
            <h2 className="admin-form-section font-serif">Manage Existing Inventory</h2>
            <div className="admin-inventory-list">
                {products.map(product => (
                    <div key={product.id} className="admin-inventory-item">
                        <img src={product.media.mainImageUrl} alt={product.name} className="admin-inventory-item-img" />
                        <span className="admin-inventory-item-name">{product.name}</span>
                        <button onClick={() => setConfirmDeleteId(product.id)} className="admin-delete-btn">Delete</button>
                    </div>
                ))}
            </div>
        </div>
    );
    
    const productToDelete = products.find(p => p.id === confirmDeleteId);
    
    const renderPreviewModal = () => (
        <div className="admin-modal-overlay" onClick={() => setShowPreviewModal(false)}>
            <div className="admin-modal-content admin-preview-modal" onClick={e => e.stopPropagation()}>
                <button className="admin-modal-close-btn" onClick={() => setShowPreviewModal(false)}><CloseIcon className="h-6 w-6" /></button>
                <div className="admin-preview-modal-body">
                    <h2 className="text-3xl font-bold font-serif text-center mb-2 text-green-700">Success!</h2>
                    <p className="text-center text-lg text-[var(--c-text-secondary)] mb-8">{lastAddedProducts.length} product(s) have been added to the shop.</p>
                    <div className="admin-preview-grid">
                        {lastAddedProducts.map(p => <ProductCard key={p.id} product={p} onAddToCart={() => {}} />)}
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <>
            <div className="admin-modal-overlay" onClick={handleAttemptExit}>
                {!isLoggedIn ? renderLogin() : (
                    <div className="admin-modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="admin-modal-close-btn" onClick={handleAttemptExit} aria-label="Close Admin Panel"><CloseIcon className="h-6 w-6" /></button>
                        <div className="admin-modal-body">
                            <h1 className="text-4xl font-bold font-serif text-[var(--c-heading)] mb-2">Admin Panel</h1>
                            <p className="text-lg text-[var(--c-text-secondary)] mb-8">Inventory & Content Management</p>
                            
                            <div className="flex admin-tabs">
                                <button className={`admin-tab ${activeTab === 'add' ? 'active' : ''}`} onClick={() => setActiveTab('add')}>Add New Gemstone</button>
                                <button className={`admin-tab ${activeTab === 'manage' ? 'active' : ''}`} onClick={() => setActiveTab('manage')}>Manage Inventory</button>
                            </div>

                            {activeTab === 'add' ? renderAddForm() : renderManageTab()}
                        </div>
                        {confirmDeleteId && productToDelete && (
                            <div className="admin-confirm-modal">
                                <div className="admin-confirm-modal-content">
                                    <h3 className="text-xl font-bold mb-2 text-[var(--c-heading)]">Confirm Deletion</h3>
                                    <p className="mb-6 text-[var(--c-text-secondary)]">Are you sure you want to permanently delete "{productToDelete.name}"?</p>
                                    <div className="flex justify-center gap-4">
                                        <button onClick={() => setConfirmDeleteId(null)} className="px-6 py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300">Cancel</button>
                                        <button onClick={() => handleDelete(confirmDeleteId)} className="admin-delete-btn px-6 py-2">Confirm Delete</button>
                                    </div>
                                </div>
                            </div>
                        )}
                        {showExitConfirm && (
                            <div className="admin-confirm-modal">
                                <div className="admin-confirm-modal-content">
                                    <h3 className="text-xl font-bold mb-2 text-[var(--c-heading)]">Unsaved Changes</h3>
                                    <p className="mb-6 text-[var(--c-text-secondary)]">You have {stagedProducts.length} unsaved product(s). Are you sure you want to exit? Your changes will be lost.</p>
                                    <div className="flex justify-center gap-4">
                                        <button onClick={() => setShowExitConfirm(false)} className="px-6 py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300">Cancel</button>
                                        <button onClick={handleConfirmExit} className="admin-delete-btn px-6 py-2">Yes, Exit</button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
            {showPreviewModal && renderPreviewModal()}
        </>
    );
};

export default AdminPanel;