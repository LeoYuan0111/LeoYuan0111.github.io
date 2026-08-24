// Main JavaScript functionality

// Performance optimization: Image loading
document.addEventListener('DOMContentLoaded', function() {
    // Remove loading placeholders when images load
    const profileImg = document.getElementById('profile-avatar');
    if (profileImg) {
        profileImg.onload = function() {
            this.style.opacity = '1';
            this.classList.remove('loading-placeholder');
        };
        
        // Add loading state initially
        if (!profileImg.complete) {
            profileImg.classList.add('loading-placeholder');
            profileImg.style.opacity = '0.7';
        }
    }

    // Initialize modal functionality
    initializeModals();
    
    // Initialize back to top functionality
    initializeBackToTop();
    
    // Initialize badminton image hover effect
    initializeBadmintonHover();

    // Initialize publication filter tabs
    initializePublicationTabs();

    // Initialize hover-to-unfold TLDRs on publication cards
    initializePublicationTldrs();
});

// Email generation function
function generateEmail() {
    const name = "leoyuan";
    const domain = "cmu.edu";
    const email = name + "@" + domain;
    const emailEl = document.getElementById("email");
    if (emailEl) emailEl.innerHTML = email;
}

// Show/Hide function
function ShowHide(divId, linkDivId) {
    const divEl = document.getElementById(divId);
    const linkEl = document.getElementById(linkDivId);
    if(divEl && divEl.style.display == 'none') {
        divEl.style.display='block';
        if(linkEl) linkEl.style.display='none';
    } else if(divEl) {
        divEl.style.display = 'none';
    }
}

// Initialize modal functionality
function initializeModals() {
    // Image overlay functionality
    document.querySelectorAll('.image-link').forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const imgSrc = this.getAttribute('data-image');
            openOverlay(imgSrc);
        });
    });

    // BibTeX modal functionality
    document.querySelectorAll('.bibtex-link').forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const bibtexKey = this.getAttribute('data-bibtex');
            if (bibtexData[bibtexKey]) {
                openBibtexModal(bibtexData[bibtexKey]);
            }
        });
    });

    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        const bibtexModal = document.getElementById('bibtex-modal');
        const imageOverlay = document.getElementById('image-overlay');
        
        if (event.target === bibtexModal) {
            closeBibtexModal();
        }
        if (event.target === imageOverlay) {
            closeOverlay();
        }
    });

    // Close modals with Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeBibtexModal();
            closeOverlay();
        }
    });
}

// Back to top functionality
function initializeBackToTop() {
    const offset = 220;
    const backToTop = document.querySelector('.back-to-top');
    
    function fadeIn(element) {
        element.style.opacity = 0;
        element.style.display = 'block';
        const tick = function() {
            element.style.opacity = +element.style.opacity + 0.02;
            if (+element.style.opacity < 1) {
                requestAnimationFrame(tick);
            }
        };
        tick();
    }
    
    function fadeOut(element) {
        element.style.opacity = 1;
        const tick = function() {
            element.style.opacity = +element.style.opacity - 0.02;
            if (+element.style.opacity > 0) {
                requestAnimationFrame(tick);
            } else {
                element.style.display = 'none';
            }
        };
        tick();
    }
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > offset) {
            fadeIn(backToTop);
        } else {
            fadeOut(backToTop);
        }
    });
    
    backToTop.addEventListener('click', function(event) {
        event.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Publication filter tabs
function initializePublicationTabs() {
    const tabBar = document.getElementById('pub-tabs');
    const pubSection = document.getElementById('publications');
    if (!tabBar || !pubSection) return;

    const tabs = Array.from(tabBar.querySelectorAll('.pub-tab'));
    const pubs = Array.from(pubSection.querySelectorAll('.pub-list .pub'));
    const emptyState = pubSection.querySelector('.pub-empty');

    function applyFilter(filter) {
        let visibleCount = 0;
        let lastVisible = null;

        pubs.forEach(function(pub) {
            const tags = (pub.getAttribute('data-tags') || '').split(/\s+/);
            const show = filter === 'all' || tags.indexOf(filter) !== -1;
            pub.hidden = !show;
            pub.classList.remove('pub--last-visible');
            if (show) {
                visibleCount++;
                lastVisible = pub;
            }
        });

        if (lastVisible) {
            lastVisible.classList.add('pub--last-visible');
        }
        if (emptyState) {
            emptyState.hidden = visibleCount !== 0;
        }
    }

    tabs.forEach(function(tab) {
        tab.addEventListener('click', function() {
            tabs.forEach(function(t) { t.classList.remove('is-active'); });
            tab.classList.add('is-active');
            applyFilter(tab.getAttribute('data-filter'));
        });
    });

    // Apply the initially active tab (defaults to the first tab)
    const initial = tabs.find(function(t) { return t.classList.contains('is-active'); }) || tabs[0];
    if (initial) {
        initial.classList.add('is-active');
        applyFilter(initial.getAttribute('data-filter'));
    }
}

// Publication TLDRs that unfold while the card is hovered or focused
function initializePublicationTldrs() {
    const pubs = document.querySelectorAll('#publications .pub-list .pub');

    pubs.forEach(function(pub) {
        const details = pub.querySelector('.tldr-details');
        const summary = details && details.querySelector('.tldr-label');
        const content = details && details.querySelector('.tldr-content');
        if (!details || !summary || !content) return;

        // A single grid item is what lets the fold animate to the text's own height.
        const text = document.createElement('span');
        text.className = 'tldr-text';
        while (content.firstChild) text.appendChild(content.firstChild);
        content.appendChild(text);

        // Keep the text laid out at all times so folding can be animated, and
        // take over the disclosure state from the native [open] attribute.
        let pinned = details.hasAttribute('open');
        details.classList.add('tldr--enhanced');
        details.open = true;
        details.classList.toggle('is-open', pinned);
        details.classList.toggle('is-wide', pinned);

        let foldTimer = null;
        function setOpen(open) {
            clearTimeout(foldTimer);
            if (open) {
                // Widen first so the text unfolds at its final width.
                details.classList.add('is-wide', 'is-open');
            } else {
                details.classList.remove('is-open');
                // Narrow back to the label only once the text has finished folding.
                foldTimer = setTimeout(function() {
                    details.classList.remove('is-wide');
                }, 320);
            }
        }

        summary.addEventListener('click', function(event) {
            event.preventDefault();
            pinned = !details.classList.contains('is-open');
            setOpen(pinned);
        });

        pub.addEventListener('mouseenter', function() { setOpen(true); });
        pub.addEventListener('mouseleave', function() { setOpen(pinned); });
        pub.addEventListener('focusin', function() { setOpen(true); });
        pub.addEventListener('focusout', function(event) {
            if (!pub.contains(event.relatedTarget)) setOpen(pinned);
        });
    });
}

// Badminton image hover effect
function initializeBadmintonHover() {
    const badmintonImg = document.getElementById('badminton-img');
    const staticSrc = './images/self-portrait/badminton.png';
    const animatedSrc = './images/self-portrait/badminton.gif';
    
    if (badmintonImg) {
        badmintonImg.addEventListener('mouseenter', function() {
            this.src = animatedSrc;
        });
        
        badmintonImg.addEventListener('mouseleave', function() {
            this.src = staticSrc;
        });
    }
}
