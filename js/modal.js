// Modal functionality for image overlays and BibTeX citations

// Image overlay functions
function openOverlay(imgSrc) {
    const overlay = document.getElementById('image-overlay');
    const overlayImg = document.getElementById('overlay-image');
    if (overlay && overlayImg) {
        overlayImg.src = imgSrc;
        overlay.style.display = 'flex';
    }
}

function closeOverlay() {
    const overlay = document.getElementById('image-overlay');
    if (overlay) overlay.style.display = 'none';
}

// BibTeX modal functions
function openBibtexModal(bibtexContent) {
    const modal = document.getElementById('bibtex-modal');
    const contentEl = document.getElementById('bibtex-content');
    if (modal && contentEl) {
        contentEl.textContent = bibtexContent;
        modal.style.display = 'block';
        // Reset copy button state
        const copyBtn = document.getElementById('copy-bibtex-btn');
        if (copyBtn) {
            copyBtn.classList.remove('copied');
            copyBtn.innerHTML = '<i class="fa fa-copy"></i> Copy to Clipboard';
        }
    }
}

function closeBibtexModal() {
    const modal = document.getElementById('bibtex-modal');
    if (modal) modal.style.display = 'none';
}

function copyBibtex() {
    const content = document.getElementById('bibtex-content').textContent;
    const copyBtn = document.getElementById('copy-bibtex-btn');
    
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(content).then(function() {
            if (copyBtn) {
                copyBtn.classList.add('copied');
                copyBtn.innerHTML = '<i class="fa fa-check"></i> Copied!';
                setTimeout(function() {
                    copyBtn.classList.remove('copied');
                    copyBtn.innerHTML = '<i class="fa fa-copy"></i> Copy to Clipboard';
                }, 2000);
            }
        }).catch(function(err) {
            console.error('Failed to copy: ', err);
            fallbackCopyTextToClipboard(content, copyBtn);
        });
    } else {
        fallbackCopyTextToClipboard(content, copyBtn);
    }
}

function fallbackCopyTextToClipboard(text, copyBtn) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        const successful = document.execCommand('copy');
        if (successful && copyBtn) {
            copyBtn.classList.add('copied');
            copyBtn.innerHTML = '<i class="fa fa-check"></i> Copied!';
            setTimeout(function() {
                copyBtn.classList.remove('copied');
                copyBtn.innerHTML = '<i class="fa fa-copy"></i> Copy to Clipboard';
            }, 2000);
        }
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
    }
    
    document.body.removeChild(textArea);
}
