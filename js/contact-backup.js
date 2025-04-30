/**
 * Contact Backup Tool - JavaScript functionality
 * Part of MultiTool Hub
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const contactFile = document.getElementById('contact-file');
    const importBtn = document.getElementById('import-btn');
    const exportBtn = document.getElementById('export-btn');
    const loadSampleBtn = document.getElementById('load-sample-data');
    const contactsTable = document.getElementById('contacts-table');
    const contactCount = document.getElementById('contact-count');
    const exportFormat = document.getElementById('export-format');
    const addContactBtn = document.getElementById('add-contact-btn');
    const contactModal = document.getElementById('contact-modal');
    const contactForm = document.getElementById('contact-form');
    const modalTitle = document.getElementById('modal-title');
    const contactName = document.getElementById('contact-name');
    const contactPhone = document.getElementById('contact-phone');
    const contactEmail = document.getElementById('contact-email');
    const cancelBtn = document.getElementById('cancel-btn');
    const importFormatRadios = document.getElementsByName('import-format');
    
    // Contacts State
    let contacts = [];
    let editingIndex = -1;
    
    // Event Listeners
    importBtn.addEventListener('click', importContacts);
    exportBtn.addEventListener('click', exportContacts);
    loadSampleBtn.addEventListener('click', loadSampleData);
    addContactBtn.addEventListener('click', showAddContactModal);
    cancelBtn.addEventListener('click', hideContactModal);
    contactForm.addEventListener('submit', saveContact);
    
    /**
     * Import contacts from file
     */
    function importContacts() {
        const file = contactFile.files[0];
        if (!file) {
            alert('Please select a file to import');
            return;
        }
        
        // Get selected import format
        let importFormat = 'csv';
        for (const radio of importFormatRadios) {
            if (radio.checked) {
                importFormat = radio.value;
                break;
            }
        }
        
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const content = e.target.result;
            
            try {
                if (importFormat === 'csv') {
                    contacts = parseCSV(content);
                } else if (importFormat === 'vcard') {
                    contacts = parseVCard(content);
                }
                
                updateContactsTable();
                exportBtn.disabled = contacts.length === 0;
            } catch (error) {
                console.error('Error parsing file:', error);
                alert('Error parsing file. Please check the format and try again.');
            }
        };
        
        reader.onerror = function() {
            alert('Error reading file');
        };
        
        if (importFormat === 'csv') {
            reader.readAsText(file);
        } else {
            reader.readAsText(file);
        }
    }
    
    /**
     * Parse CSV file content
     */
    function parseCSV(content) {
        const lines = content.split('\n');
        if (lines.length === 0) return [];
        
        // Try to detect header
        const header = lines[0].split(',');
        const nameIndex = findHeaderIndex(header, ['name', 'full name', 'contact']);
        const phoneIndex = findHeaderIndex(header, ['phone', 'telephone', 'mobile', 'cell']);
        const emailIndex = findHeaderIndex(header, ['email', 'e-mail', 'mail']);
        
        const parsedContacts = [];
        
        // Start from index 1 to skip header
        for (let i = 1; i < lines.length; i++) {
            if (!lines[i].trim()) continue;
            
            const values = lines[i].split(',');
            
            if (values.length >= Math.max(nameIndex, phoneIndex, emailIndex) + 1) {
                parsedContacts.push({
                    name: nameIndex >= 0 ? values[nameIndex].trim() : '',
                    phone: phoneIndex >= 0 ? values[phoneIndex].trim() : '',
                    email: emailIndex >= 0 ? values[emailIndex].trim() : ''
                });
            }
        }
        
        return parsedContacts;
    }
    
    /**
     * Find index of a header column by possible names
     */
    function findHeaderIndex(header, possibleNames) {
        for (let i = 0; i < header.length; i++) {
            const columnName = header[i].trim().toLowerCase();
            if (possibleNames.includes(columnName)) {
                return i;
            }
        }
        return -1;
    }
    
    /**
     * Parse vCard file content
     */
    function parseVCard(content) {
        const vcards = content.split('BEGIN:VCARD');
        const parsedContacts = [];
        
        for (let i = 1; i < vcards.length; i++) { // Start from 1 to skip the first empty split
            const vcard = vcards[i];
            
            // Extract name
            const nameMatch = vcard.match(/FN[^:]*:(.*?)(?:\r\n|\n|$)/);
            const name = nameMatch ? nameMatch[1].trim() : '';
            
            // Extract phone
            const phoneMatch = vcard.match(/TEL[^:]*:(.*?)(?:\r\n|\n|$)/);
            const phone = phoneMatch ? phoneMatch[1].trim() : '';
            
            // Extract email
            const emailMatch = vcard.match(/EMAIL[^:]*:(.*?)(?:\r\n|\n|$)/);
            const email = emailMatch ? emailMatch[1].trim() : '';
            
            if (name || phone || email) {
                parsedContacts.push({ name, phone, email });
            }
        }
        
        return parsedContacts;
    }
    
    /**
     * Export contacts to selected format
     */
    function exportContacts() {
        if (contacts.length === 0) {
            alert('No contacts to export');
            return;
        }
        
        const format = exportFormat.value;
        let content = '';
        let filename = 'contacts';
        let mimeType = '';
        
        if (format === 'csv') {
            content = generateCSV();
            filename += '.csv';
            mimeType = 'text/csv';
        } else if (format === 'vcard') {
            content = generateVCard();
            filename += '.vcf';
            mimeType = 'text/vcard';
        } else if (format === 'json') {
            content = JSON.stringify(contacts, null, 2);
            filename += '.json';
            mimeType = 'application/json';
        }
        
        // Create download link
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    
    /**
     * Generate CSV content from contacts
     */
    function generateCSV() {
        let csv = 'Name,Phone,Email\n';
        
        contacts.forEach(contact => {
            // Escape commas in fields
            const name = contact.name.includes(',') ? `"${contact.name}"` : contact.name;
            const phone = contact.phone.includes(',') ? `"${contact.phone}"` : contact.phone;
            const email = contact.email.includes(',') ? `"${contact.email}"` : contact.email;
            
            csv += `${name},${phone},${email}\n`;
        });
        
        return csv;
    }
    
    /**
     * Generate vCard content from contacts
     */
    function generateVCard() {
        let vcard = '';
        
        contacts.forEach(contact => {
            vcard += 'BEGIN:VCARD\n';
            vcard += 'VERSION:3.0\n';
            vcard += `FN:${contact.name}\n`;
            if (contact.phone) vcard += `TEL:${contact.phone}\n`;
            if (contact.email) vcard += `EMAIL:${contact.email}\n`;
            vcard += 'END:VCARD\n\n';
        });
        
        return vcard;
    }
    
    /**
     * Load sample contact data
     */
    function loadSampleData() {
        contacts = [
            { name: 'John Doe', phone: '(555) 123-4567', email: 'john.doe@example.com' },
            { name: 'Jane Smith', phone: '(555) 987-6543', email: 'jane.smith@example.com' },
            { name: 'Robert Johnson', phone: '(555) 456-7890', email: 'robert.j@example.com' },
            { name: 'Emily Davis', phone: '(555) 789-0123', email: 'emily.davis@example.com' },
            { name: 'Michael Wilson', phone: '(555) 321-6547', email: 'michael.w@example.com' }
        ];
        
        updateContactsTable();
        exportBtn.disabled = false;
    }
    
    /**
     * Update the contacts table with current contacts
     */
    function updateContactsTable() {
        // Update contact count
        contactCount.textContent = `${contacts.length} contacts loaded`;
        
        // Clear table body except header
        const tbody = contactsTable.querySelector('tbody');
        tbody.innerHTML = '';
        
        if (contacts.length === 0) {
            const row = document.createElement('tr');
            row.className = 'text-center text-gray-500 py-4';
            row.innerHTML = '<td colspan="4" class="px-4 py-8">No contacts loaded. Import a file or load sample data.</td>';
            tbody.appendChild(row);
            return;
        }
        
        // Add contacts to table
        contacts.forEach((contact, index) => {
            const row = document.createElement('tr');
            row.className = index % 2 === 0 ? 'bg-white' : 'bg-gray-50';
            
            row.innerHTML = `
                <td class="px-4 py-2 whitespace-nowrap">${escapeHtml(contact.name)}</td>
                <td class="px-4 py-2 whitespace-nowrap">${escapeHtml(contact.phone)}</td>
                <td class="px-4 py-2 whitespace-nowrap">${escapeHtml(contact.email)}</td>
                <td class="px-4 py-2 whitespace-nowrap text-right">
                    <button class="text-indigo-600 hover:text-indigo-900 mr-3" onclick="editContact(${index})">
                        <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path>
                        </svg>
                    </button>
                    <button class="text-red-600 hover:text-red-900" onclick="deleteContact(${index})">
                        <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                        </svg>
                    </button>
                </td>
            `;
            
            tbody.appendChild(row);
        });
    }
    
    /**
     * Show modal to add a new contact
     */
    function showAddContactModal() {
        modalTitle.textContent = 'Add New Contact';
        contactName.value = '';
        contactPhone.value = '';
        contactEmail.value = '';
        editingIndex = -1;
        contactModal.classList.remove('hidden');
    }
    
    /**
     * Hide the contact modal
     */
    function hideContactModal() {
        contactModal.classList.add('hidden');
    }
    
    /**
     * Save the contact from the form
     */
    function saveContact(e) {
        e.preventDefault();
        
        const contact = {
            name: contactName.value.trim(),
            phone: contactPhone.value.trim(),
            email: contactEmail.value.trim()
        };
        
        if (editingIndex >= 0) {
            // Update existing contact
            contacts[editingIndex] = contact;
        } else {
            // Add new contact
            contacts.push(contact);
        }
        
        updateContactsTable();
        hideContactModal();
        exportBtn.disabled = contacts.length === 0;
    }
    
    /**
     * Edit a contact
     */
    window.editContact = function(index) {
        if (index >= 0 && index < contacts.length) {
            const contact = contacts[index];
            modalTitle.textContent = 'Edit Contact';
            contactName.value = contact.name;
            contactPhone.value = contact.phone;
            contactEmail.value = contact.email;
            editingIndex = index;
            contactModal.classList.remove('hidden');
        }
    };
    
    /**
     * Delete a contact
     */
    window.deleteContact = function(index) {
        if (index >= 0 && index < contacts.length) {
            if (confirm('Are you sure you want to delete this contact?')) {
                contacts.splice(index, 1);
                updateContactsTable();
                exportBtn.disabled = contacts.length === 0;
            }
        }
    };
    
    /**
     * Escape HTML to prevent XSS
     */
    function escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
});