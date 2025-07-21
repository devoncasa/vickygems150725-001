import { GoogleGenAI } from "@google/genai";
import { GEM_DATA } from './gem-data.js';

document.addEventListener('DOMContentLoaded', () => {
    // --- Element Selectors ---
    const loginView = document.getElementById('login-view');
    const dashboardView = document.getElementById('dashboard-view');
    const loginForm = document.getElementById('login-form');
    const passwordInput = document.getElementById('password');
    const loginError = document.getElementById('login-error');
    const gemForm = document.getElementById('gem-form');
    
    const gemCategorySelect = document.getElementById('gem-category');
    const gemTypeSelect = document.getElementById('gem-type');
    const dynamicAttributesDiv = document.getElementById('dynamic-attributes');
    const gemColorSelect = document.getElementById('gem-color');
    const gemCutSelect = document.getElementById('gem-cut');
    const gemCutOtherInput = document.getElementById('gem-cut-other');
    const gemOriginSelect = document.getElementById('gem-origin');
    
    const imageInput = document.getElementById('gem-images');
    const imagePreviewContainer = document.getElementById('image-preview');
    const imageError = document.getElementById('image-error');
    
    const generateDescBtn = document.getElementById('generate-desc-btn');
    const aiStatus = document.getElementById('ai-status');
    const gemDescriptionTextarea = document.getElementById('gem-description');
    const submitGemBtn = document.getElementById('submit-gem-btn');

    let uploadedFiles = [];

    // --- Authentication ---
    const checkAuth = () => {
        if (sessionStorage.getItem('vlg-admin-auth') === 'true') {
            loginView.classList.add('is-hidden');
            dashboardView.classList.remove('is-hidden');
            initDashboard();
        }
    };

    const handleLogin = (e) => {
        e.preventDefault();
        if (passwordInput.value === '0007') {
            sessionStorage.setItem('vlg-admin-auth', 'true');
            checkAuth();
        } else {
            loginError.classList.remove('is-hidden');
            passwordInput.classList.add('is-danger');
        }
    };

    // --- Dashboard Logic ---
    function initDashboard() {
        gemCategorySelect.addEventListener('change', updateGemstoneOptions);
        gemTypeSelect.addEventListener('change', updateAttributeFields);
        gemCutSelect.addEventListener('change', handleCutSelection);
        imageInput.addEventListener('change', handleImageUpload);
        generateDescBtn.addEventListener('click', generateDescription);
        gemForm.addEventListener('submit', handleFormSubmit);

        // Listener to check form validity on any input
        gemForm.addEventListener('input', checkFormValidity);
    }
    
    function updateGemstoneOptions() {
        const category = gemCategorySelect.value;
        gemTypeSelect.innerHTML = '<option value="">-- Select a Gemstone --</option>';
        gemTypeSelect.disabled = true;
        dynamicAttributesDiv.classList.add('is-hidden');

        if (category && GEM_DATA[category]) {
            const gemstones = Object.keys(GEM_DATA[category]);
            gemstones.forEach(gem => {
                const option = document.createElement('option');
                option.value = gem;
                option.textContent = gem;
                gemTypeSelect.appendChild(option);
            });
            gemTypeSelect.disabled = false;
        }
        checkFormValidity();
    }

    function populateMultiSelect(selectElement, options) {
        selectElement.innerHTML = '';
        if (options && options.length > 0) {
            options.forEach(opt => {
                const option = document.createElement('option');
                option.value = opt;
                option.textContent = opt;
                selectElement.appendChild(option);
            });
        }
    }

    function updateAttributeFields() {
        const category = gemCategorySelect.value;
        const gemstone = gemTypeSelect.value;

        if (category && gemstone && GEM_DATA[category][gemstone]) {
            const data = GEM_DATA[category][gemstone];
            populateMultiSelect(gemColorSelect, data.colors);
            
            let allCuts = [...(GEM_DATA.cuts.standard || [])];
            if (data.cuts) {
                allCuts = [...allCuts, ...data.cuts];
            }
            allCuts.push('Other'); // Add "Other" option
            populateMultiSelect(gemCutSelect, [...new Set(allCuts)].sort());

            populateMultiSelect(gemOriginSelect, data.origins || GEM_DATA.origins.standard);

            dynamicAttributesDiv.classList.remove('is-hidden');
        } else {
            dynamicAttributesDiv.classList.add('is-hidden');
        }
        checkFormValidity();
    }

    function handleCutSelection() {
        const selectedOptions = Array.from(gemCutSelect.selectedOptions).map(opt => opt.value);
        if (selectedOptions.includes('Other')) {
            gemCutOtherInput.classList.remove('is-hidden');
        } else {
            gemCutOtherInput.classList.add('is-hidden');
            gemCutOtherInput.value = '';
        }
    }
    
    function handleImageUpload(e) {
        const files = Array.from(e.target.files);
        
        if (files.length + uploadedFiles.length > 5) {
            imageError.classList.remove('is-hidden');
            return;
        }
        imageError.classList.add('is-hidden');

        uploadedFiles.push(...files);
        renderImagePreviews();
        checkFormValidity();
    }

    function renderImagePreviews() {
        imagePreviewContainer.innerHTML = '';
        uploadedFiles.forEach((file, index) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const previewItem = document.createElement('div');
                previewItem.className = 'image-preview-item';
                
                const img = document.createElement('img');
                img.src = e.target.result;
                
                const removeBtn = document.createElement('button');
                removeBtn.className = 'delete is-small';
                removeBtn.style.position = 'absolute';
                removeBtn.style.top = '5px';
                removeBtn.style.right = '5px';
                removeBtn.onclick = () => {
                    uploadedFiles.splice(index, 1);
                    renderImagePreviews();
                    checkFormValidity();
                };

                previewItem.appendChild(img);
                previewItem.appendChild(removeBtn);
                imagePreviewContainer.appendChild(previewItem);
            };
            reader.readAsDataURL(file);
        });
    }

    function checkFormValidity() {
        const requiredInputs = Array.from(gemForm.querySelectorAll('input[required], select[required]'));
        const isBasicDataValid = requiredInputs.every(input => input.value.trim() !== '');
        const hasImages = uploadedFiles.length > 0;
        
        generateDescBtn.disabled = !(isBasicDataValid && hasImages);
        submitGemBtn.disabled = !(isBasicDataValid && hasImages && gemDescriptionTextarea.value.trim() !== '');
    }

    async function generateDescription() {
        if (!process.env.API_KEY) {
            alert("Error: API_KEY is not configured. AI features are disabled.");
            return;
        }

        generateDescBtn.disabled = true;
        generateDescBtn.innerHTML = '<span class="loader"></span> Generating...';
        gemDescriptionTextarea.value = '';
        gemDescriptionTextarea.readOnly = true;
        aiStatus.classList.remove('is-hidden');

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            const formData = new FormData(gemForm);
            const gemData = {
                type: formData.get('gem-type'),
                category: formData.get('gem-category') === 'precious' ? 'Precious Gemstone' : 'Semi-Precious Gemstone',
                colors: Array.from(gemColorSelect.selectedOptions).map(opt => opt.value).join(', '),
                cuts: Array.from(gemCutSelect.selectedOptions).map(opt => opt.value).filter(c => c !== 'Other').join(', '),
                otherCut: formData.get('gem-cut-other'),
                origins: Array.from(gemOriginSelect.selectedOptions).map(opt => opt.value).join(', '),
                dimension: formData.get('gem-dimension'),
                weight: `${formData.get('gem-weight')} ${formData.get('gem-weight-unit')}`,
                price: `THB ${parseInt(formData.get('gem-price')).toLocaleString()}`,
            };
            
            let cutString = gemData.cuts;
            if (gemData.otherCut) {
                cutString += (cutString ? ', ' : '') + gemData.otherCut;
            }

            const prompt = `
                Act as an expert gemologist and luxury copywriter for "VickyLuxGems".
                Your task is to write a smart, compelling, and SEO-optimized product description for a new gemstone.
                Weave the following details into an elegant, persuasive narrative designed to convince a high-end customer to buy.
                Focus on the stone's beauty, rarity, history, and emotional resonance.

                **Gemstone Details:**
                - Category: ${gemData.category}
                - Type: ${gemData.type}
                - Color(s): ${gemData.colors}
                - Cut/Shape(s): ${cutString}
                - Origin(s): ${gemData.origins}
                - Dimensions: ${gemData.dimension}
                - Weight: ${gemData.weight}
                - Price: ${gemData.price}

                Please provide only the product description text, without any introductory or concluding remarks.
            `;
            
            const response = await ai.models.generateContent({
              model: 'gemini-2.5-flash',
              contents: prompt,
            });

            gemDescriptionTextarea.value = response.text.trim();
            gemDescriptionTextarea.readOnly = false; // Allow admin to edit
            checkFormValidity();

        } catch (error) {
            console.error("Gemini API Error:", error);
            gemDescriptionTextarea.value = "Error generating description. Please check the console for details and try again.";
        } finally {
            generateDescBtn.disabled = false;
            generateDescBtn.innerHTML = 'Generate Description with AI';
            aiStatus.classList.add('is-hidden');
        }
    }
    
    function handleFormSubmit(e) {
        e.preventDefault();
        
        const getSelectedValues = (select) => Array.from(select.selectedOptions).map(opt => opt.value);

        const finalData = {
            category: gemCategorySelect.value,
            type: gemTypeSelect.value,
            colors: getSelectedValues(gemColorSelect),
            cuts: getSelectedValues(gemCutSelect),
            otherCut: gemCutOtherInput.value,
            origins: getSelectedValues(gemOriginSelect),
            dimension: document.getElementById('gem-dimension').value,
            weight: document.getElementById('gem-weight').value,
            weightUnit: document.getElementById('gem-weight-unit').value,
            price: document.getElementById('gem-price').value,
            description: gemDescriptionTextarea.value,
            images: uploadedFiles.map(f => f.name), // Simulating by just getting names
        };

        console.log("--- New Gemstone Submitted ---");
        console.log(JSON.stringify(finalData, null, 2));

        alert("Gemstone submitted successfully! Check the browser console to see the data object. The form will now reset.");
        
        // Reset form
        gemForm.reset();
        uploadedFiles = [];
        renderImagePreviews();
        updateGemstoneOptions(); // This will reset dependent dropdowns
        gemDescriptionTextarea.value = '';
        gemDescriptionTextarea.readOnly = true;
        checkFormValidity();
    }

    // --- Initial Load ---
    checkAuth();
    if(loginForm) {
       loginForm.addEventListener('submit', handleLogin);
    }
});
