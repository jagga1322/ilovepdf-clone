// Mobile menu functionality
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const nav = document.getElementById('nav');
    
    if (mobileMenuBtn && nav) {
        mobileMenuBtn.addEventListener('click', function() {
            nav.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
        });
        
        // Close mobile menu when clicking on a nav link
        const navLinks = nav.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                nav.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!nav.contains(event.target) && !mobileMenuBtn.contains(event.target)) {
                nav.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
            }
        });
    }
});

// File upload validation function (for tool pages)
function validateFileUpload(input, allowedTypes = ['.pdf']) {
    const files = input.files;
    const errorContainer = document.getElementById('error-message');
    
    if (!files || files.length === 0) {
        showError('Please select at least one file.', errorContainer);
        return false;
    }
    
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileName = file.name.toLowerCase();
        const fileExtension = '.' + fileName.split('.').pop();
        
        if (!allowedTypes.includes(fileExtension)) {
            showError(`Invalid file type. Please select files with the following extensions: ${allowedTypes.join(', ')}`, errorContainer);
            return false;
        }
        
        // Check file size (limit to 50MB)
        const maxSize = 50 * 1024 * 1024; // 50MB in bytes
        if (file.size > maxSize) {
            showError(`File "${file.name}" is too large. Maximum file size is 50MB.`, errorContainer);
            return false;
        }
    }
    
    clearError(errorContainer);
    return true;
}

// Show error message
function showError(message, container) {
    if (container) {
        container.textContent = message;
        container.style.display = 'block';
        container.className = 'error-message';
    } else {
        alert(message);
    }
}

// Clear error message
function clearError(container) {
    if (container) {
        container.textContent = '';
        container.style.display = 'none';
    }
}

// Simulate PDF processing
function simulateProcessing(toolName, files) {
    return new Promise((resolve, reject) => {
        try {
            const processingTime = Math.random() * 3000 + 2000; // 2-5 seconds
            
            setTimeout(() => {
                const success = Math.random() > 0.1; // 90% success rate
                
                if (success) {
                    resolve({
                        success: true,
                        message: `${toolName} completed successfully!`,
                        processedFiles: files.length,
                        downloadUrl: '#' // In a real app, this would be the actual download URL
                    });
                } else {
                    reject(new Error(`Failed to process files with ${toolName}. Please try again.`));
                }
            }, processingTime);
        } catch (error) {
            reject(error);
        }
    });
}

// Handle file processing for tool pages
async function processFiles(toolName, fileInput, allowedTypes = ['.pdf']) {
    const loadingContainer = document.getElementById('loading-message');
    const resultContainer = document.getElementById('result-message');
    const errorContainer = document.getElementById('error-message');
    
    try {
        // Validate files
        if (!validateFileUpload(fileInput, allowedTypes)) {
            return;
        }
        
        const files = Array.from(fileInput.files);
        
        // Show loading state
        if (loadingContainer) {
            loadingContainer.textContent = `Processing ${files.length} file(s) with ${toolName}...`;
            loadingContainer.style.display = 'block';
            loadingContainer.className = 'loading-message';
        }
        
        // Clear previous results
        clearError(errorContainer);
        if (resultContainer) {
            resultContainer.style.display = 'none';
        }
        
        // Simulate processing
        const result = await simulateProcessing(toolName, files);
        
        // Hide loading state
        if (loadingContainer) {
            loadingContainer.style.display = 'none';
        }
        
        // Show success result
        if (resultContainer) {
            resultContainer.innerHTML = `
                <div class="success-message">
                    <h3>✓ ${result.message}</h3>
                    <p>Processed ${result.processedFiles} file(s) successfully.</p>
                    <a href="${result.downloadUrl}" class="download-btn" onclick="alert('In a real application, this would download your processed file.'); return false;">Download Result</a>
                </div>
            `;
            resultContainer.style.display = 'block';
        }
        
    } catch (error) {
        // Hide loading state
        if (loadingContainer) {
            loadingContainer.style.display = 'none';
        }
        
        // Show error
        showError(error.message, errorContainer);
        console.error('Processing error:', error);
    }
}

// Drag and drop functionality
function initializeDragAndDrop(dropZone, fileInput) {
    if (!dropZone || !fileInput) return;
    
    // Prevent default drag behaviors
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });
    
    // Highlight drop zone when item is dragged over it
    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, highlight, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, unhighlight, false);
    });
    
    // Handle dropped files
    dropZone.addEventListener('drop', handleDrop, false);
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    function highlight(e) {
        dropZone.classList.add('drag-over');
    }
    
    function unhighlight(e) {
        dropZone.classList.remove('drag-over');
    }
    
    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        
        fileInput.files = files;
        
        // Trigger change event
        const event = new Event('change', { bubbles: true });
        fileInput.dispatchEvent(event);
    }
}

// Smooth scrolling for anchor links
document.addEventListener('DOMContentLoaded', function() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#') {
                e.preventDefault();
                return;
            }
            
            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Language selector functionality
document.addEventListener('DOMContentLoaded', function() {
    const languageSelect = document.getElementById('language-select');
    
    if (languageSelect) {
        languageSelect.addEventListener('change', function() {
            const selectedLanguage = this.value;
            // In a real application, this would change the language
            console.log('Language changed to:', selectedLanguage);
            alert(`Language changed to: ${this.options[this.selectedIndex].text}`);
        });
    }
});

// Utility function to format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Add loading animation
function showLoadingAnimation(container) {
    if (container) {
        container.innerHTML = `
            <div class="loading-spinner">
                <div class="spinner"></div>
                <p>Processing your files...</p>
            </div>
        `;
    }
}

// Initialize tooltips (if needed)
function initializeTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            const tooltipText = this.getAttribute('data-tooltip');
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = tooltipText;
            document.body.appendChild(tooltip);
            
            const rect = this.getBoundingClientRect();
            tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
            tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
        });
        
        element.addEventListener('mouseleave', function() {
            const tooltip = document.querySelector('.tooltip');
            if (tooltip) {
                tooltip.remove();
            }
        });
    });
}

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeTooltips();
    
    // Add smooth transitions to cards
    const cards = document.querySelectorAll('.tool-card, .solution-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});

// Export functions for use in tool pages
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateFileUpload,
        processFiles,
        simulateProcessing,
        initializeDragAndDrop,
        formatFileSize
    };
}
