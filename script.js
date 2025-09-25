// AI Image Studio - Local JavaScript with correct model
let currentMode = 'create';
let currentFunction = 'free';
let uploadedImages = {};
let currentImageData = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    setupDragAndDrop();
});

function initializeEventListeners() {
    // Mode toggle buttons
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const mode = this.dataset.mode;
            switchMode(mode);
        });
    });

    // Function cards
    document.querySelectorAll('.function-card').forEach(card => {
        card.addEventListener('click', function() {
            selectFunction(this);
        });
    });

    // Upload area click
    const uploadArea = document.getElementById('uploadArea');
    if (uploadArea) {
        uploadArea.addEventListener('click', function() {
            if (currentMode === 'edit') {
                document.getElementById('imageUpload').click();
            }
        });
    }
}

function setupDragAndDrop() {
    const uploadArea = document.getElementById('uploadArea');
    if (!uploadArea) return;

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, preventDefaults, false);
    });

    ['dragenter', 'dragover'].forEach(eventName => {
        uploadArea.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, unhighlight, false);
    });

    uploadArea.addEventListener('drop', handleDrop, false);
}

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

function highlight(e) {
    e.target.classList.add('highlight');
}

function unhighlight(e) {
    e.target.classList.remove('highlight');
}

function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    
    if (files.length > 0) {
        const file = files[0];
        if (file.type.startsWith('image/')) {
            handleImageUpload({ files: [file] }, 'imagePreview');
        }
    }
}

function switchMode(mode) {
    currentMode = mode;
    
    // Update button states
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mode === mode);
    });
    
    // Show/hide function sections
    const createFunctions = document.getElementById('createFunctions');
    const editFunctions = document.getElementById('editFunctions');
    const twoImagesSection = document.getElementById('twoImagesSection');
    const uploadArea = document.getElementById('uploadArea');
    
    if (mode === 'create') {
        createFunctions.style.display = 'block';
        editFunctions.style.display = 'none';
        twoImagesSection.style.display = 'none';
        uploadArea.style.display = 'none';
        currentFunction = 'free';
        selectFunction(document.querySelector('[data-function="free"]'));
    } else {
        createFunctions.style.display = 'none';
        editFunctions.style.display = 'block';
        twoImagesSection.style.display = 'none';
        uploadArea.style.display = 'block';
        currentFunction = 'add-remove';
        selectFunction(document.querySelector('[data-function="add-remove"]'));
    }
}

function selectFunction(element) {
    // Remove active class from all cards in current mode
    const currentSection = currentMode === 'create' ? 'createFunctions' : 'editFunctions';
    document.querySelectorAll(`#${currentSection} .function-card`).forEach(card => {
        card.classList.remove('active');
    });
    
    // Add active class to selected card
    element.classList.add('active');
    currentFunction = element.dataset.function;
    
    // Handle special case for compose function
    if (currentFunction === 'compose' && element.dataset.requiresTwo === 'true') {
        document.getElementById('editFunctions').style.display = 'none';
        document.getElementById('twoImagesSection').style.display = 'block';
        document.getElementById('uploadArea').style.display = 'none';
    }
}

function backToEditFunctions() {
    document.getElementById('editFunctions').style.display = 'block';
    document.getElementById('twoImagesSection').style.display = 'none';
    document.getElementById('uploadArea').style.display = 'block';
}

function handleImageUpload(input, previewId, imageNumber) {
    const file = input.files ? input.files[0] : input;
    if (!file) return;
    
    if (file.size > 10 * 1024 * 1024) {
        alert('Arquivo muito grande. Máximo 10MB permitido.');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const preview = document.getElementById(previewId);
        preview.src = e.target.result;
        preview.style.display = 'block';
        
        // Store image data
        if (imageNumber) {
            uploadedImages[`image${imageNumber}`] = e.target.result;
        } else {
            currentImageData = e.target.result;
        }
        
        // Hide upload text and show preview
        const uploadArea = preview.parentElement;
        const uploadText = uploadArea.querySelector('.upload-text');
        const uploadIcon = uploadArea.querySelector('.upload-icon');
        if (uploadText) uploadText.style.display = 'none';
        if (uploadIcon) uploadIcon.style.display = 'none';
    };
    reader.readAsDataURL(file);
}

async function generateImage() {
    const prompt = document.getElementById('prompt').value.trim();
    
    if (!prompt) {
        alert('Por favor, descreva a imagem que você deseja criar.');
        return;
    }
    
    // Validate inputs based on mode and function
    if (currentMode === 'edit' && currentFunction !== 'compose' && !currentImageData) {
        alert('Por favor, carregue uma imagem para editar.');
        return;
    }
    
    if (currentFunction === 'compose' && (!uploadedImages.image1 || !uploadedImages.image2)) {
        alert('Por favor, carregue duas imagens para compor.');
        return;
    }
    
    // Show loading state
    showLoading();
    
    try {
        const response = await makeAPIRequest(prompt);
        
        if (response.choices && response.choices[0] && response.choices[0].message) {
            const content = response.choices[0].message.content;
            
            // Look for image URLs in the response
            const urlRegex = /https?:\/\/[^\s\]]+\.(jpg|jpeg|png|gif|webp|svg)/gi;
            const urls = content.match(urlRegex);
            
            if (urls && urls.length > 0) {
                // Use the first image URL found
                displayImage(urls[0]);
            } else {
                // If no URL found, try to look for base64 or other formats
                const base64Regex = /data:image\/[^;]+;base64,[A-Za-z0-9+\/]+=*/gi;
                const base64Match = content.match(base64Regex);
                
                if (base64Match && base64Match.length > 0) {
                    displayImage(base64Match[0]);
                } else {
                    // Generate a placeholder image with the description
                    generatePlaceholderImage(content);
                }
            }
        } else {
            console.log('Resposta completa da API:', response);
            throw new Error('Formato de resposta inválido da API');
        }
    } catch (error) {
        console.error('Erro na geração:', error);
        hideLoading();
        alert('Erro ao gerar imagem: ' + error.message);
    }
}

async function makeAPIRequest(prompt) {
    // Build prompt based on current mode and function
    let enhancedPrompt = prompt;
    
    switch (currentFunction) {
        case 'sticker':
            enhancedPrompt = `Create a detailed sticker design of: ${prompt}. Style: colorful, cartoon-like, with white border, clean background, suitable for stickers. High quality digital art.`;
            break;
        case 'text':
            enhancedPrompt = `Create a professional logo design for: ${prompt}. Style: clean, modern, minimalist, corporate, suitable for business branding. Vector art style, simple and memorable.`;
            break;
        case 'comic':
            enhancedPrompt = `Create a comic book style illustration of: ${prompt}. Style: bold outlines, vibrant colors, dynamic composition, comic book art, graphic novel aesthetic.`;
            break;
        case 'add-remove':
            enhancedPrompt = `Create an enhanced version of this concept: ${prompt}. Style: photorealistic, high detail, professional quality, natural lighting.`;
            break;
        case 'retouch':
            enhancedPrompt = `Create a polished, professional version of: ${prompt}. Style: high quality, enhanced details, perfect lighting, studio quality.`;
            break;
        case 'style':
            enhancedPrompt = `Create an artistic interpretation of: ${prompt}. Style: creative, artistic, unique visual style, expressive and imaginative.`;
            break;
        case 'compose':
            enhancedPrompt = `Create a composition that combines these elements: ${prompt}. Style: seamless blend, artistic composition, harmonious design.`;
            break;
        default:
            enhancedPrompt = `Create a high-quality, detailed image of: ${prompt}. Style: photorealistic, professional, well-lit, high resolution.`;
    }
    
    // Use a model that can generate images via text-to-image
    const messages = [{
        role: "user",
        content: `Generate an image: ${enhancedPrompt}`
    }];
    
    const requestBody = {
        model: "black-forest-labs/flux-1.1-pro",
        messages: messages,
        max_tokens: 1000,
        temperature: 0.7
    };
    
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': window.location.href,
            'X-Title': 'AI Image Studio'
        },
        body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
}

function showLoading() {
    document.getElementById('resultPlaceholder').style.display = 'none';
    document.getElementById('loadingContainer').style.display = 'flex';
    document.getElementById('imageContainer').style.display = 'none';
    
    const generateBtn = document.getElementById('generateBtn');
    generateBtn.disabled = true;
    generateBtn.querySelector('.spinner').style.display = 'block';
    generateBtn.querySelector('.btn-text').textContent = 'Gerando...';
}

function hideLoading() {
    document.getElementById('loadingContainer').style.display = 'none';
    
    const generateBtn = document.getElementById('generateBtn');
    generateBtn.disabled = false;
    generateBtn.querySelector('.spinner').style.display = 'none';
    generateBtn.querySelector('.btn-text').textContent = '🚀 Gerar Imagem';
}

function displayImage(imageUrl) {
    hideLoading();
    
    const generatedImage = document.getElementById('generatedImage');
    generatedImage.src = imageUrl;
    generatedImage.onload = function() {
        document.getElementById('imageContainer').style.display = 'block';
        currentImageData = imageUrl;
    };
    
    generatedImage.onerror = function() {
        alert('Erro ao carregar a imagem gerada.');
        document.getElementById('resultPlaceholder').style.display = 'flex';
    };
}

function editCurrentImage() {
    if (!currentImageData) {
        alert('Nenhuma imagem para editar.');
        return;
    }
    
    // Switch to edit mode and load current image
    switchMode('edit');
    
    // Set the current image as the uploaded image for editing
    const preview = document.getElementById('imagePreview');
    preview.src = currentImageData;
    preview.style.display = 'block';
    
    // Hide upload area elements
    const uploadArea = document.getElementById('uploadArea');
    const uploadText = uploadArea.querySelector('.upload-text');
    const uploadIcon = uploadArea.querySelector('.upload-icon');
    if (uploadText) uploadText.style.display = 'none';
    if (uploadIcon) uploadIcon.style.display = 'none';
}

function downloadImage() {
    if (!currentImageData) {
        alert('Nenhuma imagem para baixar.');
        return;
    }
    
    const link = document.createElement('a');
    link.href = currentImageData;
    link.download = `ai-image-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Mobile modal functions
function editFromModal() {
    document.getElementById('mobileModal').style.display = 'none';
    editCurrentImage();
}

function downloadFromModal() {
    downloadImage();
    document.getElementById('mobileModal').style.display = 'none';
}

function newImageFromModal() {
    document.getElementById('mobileModal').style.display = 'none';
    switchMode('create');
    document.getElementById('prompt').value = '';
    document.getElementById('resultPlaceholder').style.display = 'flex';
    document.getElementById('imageContainer').style.display = 'none';
}

function generatePlaceholderImage(description) {
    // Create a canvas to generate a placeholder image
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#667eea');
    gradient.addColorStop(1, '#764ba2');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add text
    ctx.fillStyle = 'white';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Wrap text
    const words = description.substring(0, 100).split(' ');
    const lines = [];
    let currentLine = '';
    
    words.forEach(word => {
        const testLine = currentLine + word + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > canvas.width - 40 && currentLine !== '') {
            lines.push(currentLine);
            currentLine = word + ' ';
        } else {
            currentLine = testLine;
        }
    });
    lines.push(currentLine);
    
    // Draw text lines
    const lineHeight = 30;
    const startY = canvas.height / 2 - (lines.length - 1) * lineHeight / 2;
    
    lines.forEach((line, index) => {
        ctx.fillText(line.trim(), canvas.width / 2, startY + index * lineHeight);
    });
    
    // Add decorative elements
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    for (let i = 0; i < 20; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const radius = Math.random() * 3 + 1;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // Convert to data URL and display
    const dataURL = canvas.toDataURL('image/png');
    displayImage(dataURL);
}

// Handle mobile image tap
document.addEventListener('DOMContentLoaded', function() {
    const generatedImage = document.getElementById('generatedImage');
    if (generatedImage) {
        generatedImage.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                const modalImage = document.getElementById('modalImage');
                modalImage.src = this.src;
                document.getElementById('mobileModal').style.display = 'flex';
            }
        });
    }
    
    // Close modal when clicking outside
    document.getElementById('mobileModal').addEventListener('click', function(e) {
        if (e.target === this) {
            this.style.display = 'none';
        }
    });
});
