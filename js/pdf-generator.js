/**
 * PDF Generator Tool - JavaScript functionality
 * Part of MultiTool Hub
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const textContent = document.getElementById('text-content');
    const htmlContent = document.getElementById('html-content');
    const htmlPreview = document.getElementById('html-preview');
    const btnPreview = document.getElementById('btn-preview');
    const btnGenerate = document.getElementById('btn-generate');
    const tabText = document.getElementById('tab-text');
    const tabHtml = document.getElementById('tab-html');
    const panelText = document.getElementById('panel-text');
    const panelHtml = document.getElementById('panel-html');
    const pageSize = document.getElementById('page-size');
    const orientation = document.getElementById('orientation');
    const pdfTitle = document.getElementById('pdf-title');
    const fontSize = document.getElementById('font-size');
    
    // Current active tab
    let activeTab = 'text';
    
    // Initialize
    loadSavedContent();
    
    // Event Listeners
    tabText.addEventListener('click', function() {
        switchTab('text');
    });
    
    tabHtml.addEventListener('click', function() {
        switchTab('html');
    });
    
    btnPreview.addEventListener('click', previewHtml);
    btnGenerate.addEventListener('click', generatePdf);
    
    // Auto-save content
    textContent.addEventListener('input', function() {
        saveContent('text', this.value);
    });
    
    htmlContent.addEventListener('input', function() {
        saveContent('html', this.value);
    });
    
    // Functions
    
    /**
     * Switch between tabs
     */
    function switchTab(tab) {
        activeTab = tab;
        
        // Update tab styling
        if (tab === 'text') {
            tabText.classList.add('border-indigo-600', 'text-indigo-600');
            tabText.classList.remove('border-transparent');
            tabHtml.classList.remove('border-indigo-600', 'text-indigo-600');
            tabHtml.classList.add('border-transparent');
            
            // Show/hide panels
            panelText.classList.remove('hidden');
            panelHtml.classList.add('hidden');
        } else {
            tabHtml.classList.add('border-indigo-600', 'text-indigo-600');
            tabHtml.classList.remove('border-transparent');
            tabText.classList.remove('border-indigo-600', 'text-indigo-600');
            tabText.classList.add('border-transparent');
            
            // Show/hide panels
            panelHtml.classList.remove('hidden');
            panelText.classList.add('hidden');
        }
    }
    
    /**
     * Preview HTML content
     */
    function previewHtml() {
        const html = htmlContent.value;
        htmlPreview.innerHTML = html;
    }
    
    /**
     * Generate PDF based on current settings
     */
    function generatePdf() {
        // Get PDF options
        const size = pageSize.value;
        const orient = orientation.value;
        const title = pdfTitle.value || 'Document';
        const fontSizeValue = parseInt(fontSize.value);
        
        // Create PDF document with jsPDF
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({
            orientation: orient,
            unit: 'mm',
            format: size
        });
        
        // Set document properties
        doc.setProperties({
            title: title,
            creator: 'MultiTool Hub PDF Generator',
            subject: 'Generated PDF Document',
            keywords: 'pdf, document, multitool hub'
        });
        
        if (activeTab === 'text') {
            // Text to PDF
            const text = textContent.value;
            if (!text.trim()) {
                alert('Please enter some text to generate a PDF.');
                return;
            }
            
            // Set font size
            doc.setFontSize(fontSizeValue);
            
            // Split text into lines to handle word wrapping
            const pageWidth = doc.internal.pageSize.getWidth();
            const margin = 20; // 20mm margin
            const maxWidth = pageWidth - (margin * 2);
            
            // Add text with line breaks and word wrapping
            const lines = doc.splitTextToSize(text, maxWidth);
            doc.text(lines, margin, margin);
            
            // Save the PDF
            doc.save(`${title}.pdf`);
        } else {
            // HTML to PDF
            const html = htmlContent.value;
            if (!html.trim()) {
                alert('Please enter some HTML content to generate a PDF.');
                return;
            }
            
            // Use html2canvas to convert HTML to canvas
            html2canvas(htmlPreview).then(canvas => {
                const imgData = canvas.toDataURL('image/png');
                
                // Calculate dimensions to fit the page
                const pageWidth = doc.internal.pageSize.getWidth();
                const pageHeight = doc.internal.pageSize.getHeight();
                const margin = 10; // 10mm margin
                
                const imgWidth = pageWidth - (margin * 2);
                const imgHeight = (canvas.height * imgWidth) / canvas.width;
                
                // Add the image to the PDF
                doc.addImage(imgData, 'PNG', margin, margin, imgWidth, imgHeight);
                
                // Save the PDF
                doc.save(`${title}.pdf`);
            }).catch(error => {
                console.error('Error generating PDF:', error);
                alert('An error occurred while generating the PDF. Please try again.');
            });
        }
    }
    
    /**
     * Save content to local storage
     */
    function saveContent(type, content) {
        localStorage.setItem(`multitool_pdf_${type}_content`, content);
    }
    
    /**
     * Load saved content from local storage
     */
    function loadSavedContent() {
        const savedTextContent = localStorage.getItem('multitool_pdf_text_content');
        const savedHtmlContent = localStorage.getItem('multitool_pdf_html_content');
        
        if (savedTextContent) {
            textContent.value = savedTextContent;
        }
        
        if (savedHtmlContent) {
            htmlContent.value = savedHtmlContent;
        }
    }
});