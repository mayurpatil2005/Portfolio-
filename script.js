document.addEventListener('DOMContentLoaded', () => {
    
    /* ==========================================
       STICKY HEADER SCROLL EFFECT
       ========================================== */
    const header = document.getElementById('header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    /* ==========================================
       MOBILE NAVIGATION TOGGLE
       ========================================== */
    const mobileToggle = document.getElementById('mobile-toggle');
    const navLinksContainer = document.getElementById('nav-links');
    const navLinks = document.querySelectorAll('.nav-link');

    mobileToggle.addEventListener('click', () => {
        navLinksContainer.classList.toggle('active');
        // Toggle icon visual states if needed
        mobileToggle.classList.toggle('open');
    });

    // Close menu when clicking nav link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navLinksContainer.classList.remove('active');
            mobileToggle.classList.remove('open');
        });
    });

    /* ==========================================
       TYPING TEXT ANIMATION
       ========================================== */
    const typingTextElement = document.getElementById('typing-text');
    const words = ["Full-Stack Developer", "Data Enthusiast", "Tech Explorer", "Computer Engineer"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            // Delete characters
            typingTextElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50; // Deleting is faster
        } else {
            // Type characters
            typingTextElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 120; // Natural typing speed
        }

        // Handle word completion transitions
        if (!isDeleting && charIndex === currentWord.length) {
            // Pause at completion
            typingSpeed = 1500;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            // Move to next word
            wordIndex = (wordIndex + 1) % words.length;
            typingSpeed = 500; // Brief pause before typing next word
        }

        setTimeout(type, typingSpeed);
    }

    // Start typing loop
    if (typingTextElement) {
        setTimeout(type, 1000);
    }

    /* ==========================================
       SCROLL-DRIVEN ACTIVE LINK HIGHLIGHTING
       ========================================== */
    const sections = document.querySelectorAll('section[id]');
    
    const navObserverOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px', // Trigger when section occupies center viewport
        threshold: 0
    };

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, navObserverOptions);

    sections.forEach(section => {
        navObserver.observe(section);
    });

    /* ==========================================
       SKILL BARS ANIMATION ON SCROLL
       ========================================== */
    const skillsSection = document.getElementById('skills');
    const skillBars = document.querySelectorAll('.skill-bar');

    const skillObserverOptions = {
        root: null,
        threshold: 0.15
    };

    const skillObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animate each skill bar to its target value
                skillBars.forEach(bar => {
                    const progress = bar.getAttribute('data-progress');
                    bar.style.width = progress;
                });
                // Once animated, disconnect observer so it doesn't trigger again
                observer.unobserve(entry.target);
            }
        });
    }, skillObserverOptions);

    if (skillsSection) {
        skillObserver.observe(skillsSection);
    }

    /* ==========================================
       CONTACT FORM SUBMISSION (Direct Email Dispatch)
       ========================================== */
    /* ==========================================
       CONTACT FORM SUBMISSION (Web3Forms Integration)
       ========================================== */
    const contactForm = document.getElementById('contact-form');
    const formFeedback = document.getElementById('form-feedback');
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const submitBtnText = submitBtn.querySelector('span');

    // Paste your Web3Forms Access Key here!
    const WEB3FORMS_ACCESS_KEY = '3863aaa0-cf40-4431-b938-389a7fbad836';

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Disable submit button and show loading state
        submitBtn.disabled = true;
        const originalBtnText = submitBtnText.textContent;
        submitBtnText.textContent = 'Sending Message...';
        submitBtn.classList.add('loading');
        
        const formData = new FormData(contactForm);
        formData.append('access_key', WEB3FORMS_ACCESS_KEY);
        formData.append('subject', `[Portfolio Contact] ${document.getElementById('form-subject').value}`);
        formData.append('from_name', document.getElementById('form-name').value);

        if (WEB3FORMS_ACCESS_KEY === 'YOUR_ACCESS_KEY_HERE') {
            setTimeout(() => {
                formFeedback.textContent = "Setup Required: Please add your Web3Forms Access Key in script.js.";
                formFeedback.className = "form-message-feedback error";
                submitBtn.disabled = false;
                submitBtnText.textContent = originalBtnText;
                submitBtn.classList.remove('loading');
            }, 1000);
            return;
        }

        fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            body: formData
        })
        .then(async (response) => {
            let json = await response.json();
            if (response.status == 200) {
                formFeedback.textContent = "Thank you! Your message has been sent successfully.";
                formFeedback.className = "form-message-feedback success";
                contactForm.reset();
            } else {
                formFeedback.textContent = json.message || "Oops! There was a problem submitting your form.";
                formFeedback.className = "form-message-feedback error";
            }
        })
        .catch(error => {
            formFeedback.textContent = "Oops! Connection error. Please try again later.";
            formFeedback.className = "form-message-feedback error";
        })
        .finally(() => {
            // Restore button state
            submitBtn.disabled = false;
            submitBtnText.textContent = originalBtnText;
            submitBtn.classList.remove('loading');

            // Hide feedback after 6 seconds
            setTimeout(() => {
                formFeedback.style.opacity = '0';
                setTimeout(() => {
                    formFeedback.textContent = '';
                    formFeedback.className = 'form-message-feedback';
                    formFeedback.style.opacity = '1';
                }, 400);
            }, 6000);
        });
    });

    /* ==========================================
       INTERACTIVE CALCULATOR MODAL LOGIC
       ========================================== */
    const openCalcBtn = document.getElementById('open-calc-btn');
    const closeCalcBtn = document.getElementById('close-calc');
    const calcBackdrop = document.getElementById('calc-backdrop');
    
    // Toggle Modal
    if (openCalcBtn && calcBackdrop) {
        openCalcBtn.addEventListener('click', () => {
            calcBackdrop.classList.add('active');
            resetCalc();
        });
    }
    
    if (closeCalcBtn && calcBackdrop) {
        closeCalcBtn.addEventListener('click', () => {
            calcBackdrop.classList.remove('active');
        });
        
        calcBackdrop.addEventListener('click', (e) => {
            if (e.target === calcBackdrop) {
                calcBackdrop.classList.remove('active');
            }
        });
    }
    
    // Calculator Math Operations
    const calcDisplay = document.getElementById('calc-display');
    const calcHistory = document.getElementById('calc-history');
    const calcKeys = document.querySelector('.calc-keys');
    
    let calcValue = '0';
    let calcEquation = '';
    let isFinishedEquation = false;
    
    function resetCalc() {
        calcValue = '0';
        calcEquation = '';
        isFinishedEquation = false;
        updateDisplay();
    }
    
    function updateDisplay() {
        if (calcDisplay) calcDisplay.textContent = calcValue;
        if (calcHistory) calcHistory.textContent = calcEquation;
    }
    
    if (calcKeys) {
        calcKeys.addEventListener('click', (e) => {
            const key = e.target.closest('button');
            if (!key) return;
            
            const action = key.dataset.action;
            const val = key.dataset.val;
            
            if (action === 'clear') {
                resetCalc();
                return;
            }
            
            if (action === 'delete') {
                if (isFinishedEquation) {
                    resetCalc();
                    return;
                }
                calcValue = calcValue.slice(0, -1);
                if (calcValue === '' || calcValue === '-') {
                    calcValue = '0';
                }
                updateDisplay();
                return;
            }
            
            if (action === 'calculate') {
                if (calcValue === '0' && calcEquation === '') return;
                try {
                    let expression = calcEquation + calcValue;
                    // Safely evaluate simple arithmetic expressions
                    const sanitized = expression.replace(/[^0-9+\-*/%.]/g, '');
                    let result = Function(`"use strict"; return (${sanitized})`)();
                    
                    if (result === Infinity || isNaN(result)) {
                        calcValue = 'Error';
                    } else {
                        calcValue = Number(Math.round(result + 'e6') + 'e-6').toString();
                    }
                    calcEquation = expression + ' =';
                    isFinishedEquation = true;
                    updateDisplay();
                } catch (err) {
                    calcValue = 'Error';
                    updateDisplay();
                }
                return;
            }
            
            if (val) {
                if (isFinishedEquation) {
                    calcValue = '0';
                    calcEquation = '';
                    isFinishedEquation = false;
                }
                
                // Handling operators
                if (['+', '-', '*', '/', '%'].includes(val)) {
                    calcEquation = calcEquation + calcValue + ' ' + val + ' ';
                    calcValue = '0';
                    updateDisplay();
                    return;
                }
                
                // Handling numbers & decimals
                if (val === '.') {
                    if (calcValue.includes('.')) return;
                    calcValue += '.';
                } else {
                    if (calcValue === '0') {
                        calcValue = val;
                    } else {
                        calcValue += val;
                    }
                }
                updateDisplay();
            }
        });
    }

});
