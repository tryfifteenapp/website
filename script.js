// Smooth scrolling for navigation links
// scrollToWaitlist function removed since waitlist is now inline

function scrollToDemo() {
    document.getElementById('how-it-works').scrollIntoView({
        behavior: 'smooth'
    });
}

// Before/After toggle functionality
function showBefore() {
    // Update button states
    document.querySelector('.before-btn').classList.add('active');
    document.querySelector('.after-btn').classList.remove('active');
    
    // Show before content, hide after content
    document.querySelector('.before-content').classList.add('active');
    document.querySelector('.after-content').classList.remove('active');
}

function showAfter() {
    // Update button states
    document.querySelector('.after-btn').classList.add('active');
    document.querySelector('.before-btn').classList.remove('active');
    
    // Show after content, hide before content
    document.querySelector('.after-content').classList.add('active');
    document.querySelector('.before-content').classList.remove('active');
}

// Handle waitlist form submission
function handleWaitlistSubmit(event) {
    event.preventDefault();
    
    const email = event.target.querySelector('input[name="email"]').value;
    
    if (email) {
        // Show success message
        showMessage('Thanks! You\'ve been added to the waitlist.', 'success');
        
        // Log the email to console (for development purposes)
        console.log('Email collected:', email);
        
        // Add email to CSV data
        addEmailToCSV(email);
        
        // Reset form
        event.target.reset();
    }
}

// Send email to backend server
async function addEmailToCSV(email) {
    try {
        const response = await fetch('http://localhost:3000/api/submit-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email })
        });

        const data = await response.json();
        
        if (data.success) {
            console.log('Email successfully added to CSV:', data.email, data.timestamp);
        } else {
            console.error('Error from server:', data.message);
        }
    } catch (error) {
        console.error('Error sending email to server:', error);
    }
}

// Handle inline waitlist form submission
function handleWaitlistSubmitInline(event) {
    event.preventDefault();
    
    const email = event.target.parentElement.querySelector('input[type="email"]').value;
    
    if (email) {
        // For now, just show a success message
        // Later you can integrate with your email service
        showMessage('Thanks! You\'ve been added to the waitlist.', 'success');
        event.target.parentElement.querySelector('input[type="email"]').value = '';
    }
}

// Update waitlist stats (increment the number)
function updateWaitlistStats() {
    const statNumber = document.querySelector('.stat-number');
    if (statNumber) {
        const currentNumber = parseInt(statNumber.textContent.replace(/,/g, ''));
        const newNumber = currentNumber + 1;
        statNumber.textContent = newNumber.toLocaleString();
    }
}

// Show message to user
function showMessage(message, type = 'info') {
    // Remove existing message if any
    const existingMessage = document.querySelector('.message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `message message-${type}`;
    messageDiv.textContent = message;
    
    // Style the message
    messageDiv.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        color: white;
        font-weight: 500;
        z-index: 1000;
        animation: slideIn 0.3s ease;
        max-width: 300px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        font-family: 'Inter', sans-serif;
    `;
    
    // Set background color based on type
    if (type === 'success') {
        messageDiv.style.background = '#10b981';
    } else if (type === 'error') {
        messageDiv.style.background = '#ef4444';
    } else {
        messageDiv.style.background = '#6366f1';
    }
    
    // Add to page
    document.body.appendChild(messageDiv);
    
    // Remove after 4 seconds
    setTimeout(() => {
        messageDiv.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 300);
    }, 4000);
}

// Add CSS animations for messages
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Enhanced scroll handling and animations
document.addEventListener('DOMContentLoaded', function() {
    // Check if device is mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
    
    // Smooth scrolling for all anchor links
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Enhanced header scroll effect
    const navbar = document.querySelector('.navbar');
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', function() {
        const currentScrollY = window.scrollY;
        
        // Add/remove background blur based on scroll position
        if (currentScrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.backdropFilter = 'blur(20px)';
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.backdropFilter = 'blur(20px)';
            navbar.style.boxShadow = 'none';
        }
        
        // Hide/show navbar on scroll (only on desktop)
        if (!isMobile && currentScrollY > lastScrollY && currentScrollY > 100) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollY = currentScrollY;
    });
    
    // Mobile-optimized intersection observer
    const observerOptions = {
        threshold: isMobile ? 0.05 : 0.1,
        rootMargin: isMobile ? '0px 0px -30px 0px' : '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation with mobile-optimized delays
    const animateElements = document.querySelectorAll('.feature-card, .hero-content, .hero-visual');
    animateElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.6s ease, transform 0.6s ease`;
        
        // Reduce animation delay on mobile for better performance
        if (isMobile) {
            el.style.transitionDelay = `${Math.min(index * 0.1, 0.3)}s`;
        }
        
        observer.observe(el);
    });
    
    // Enhanced hover effects (only on desktop)
    if (!isMobile) {
        const featureCards = document.querySelectorAll('.feature-card');
        featureCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-8px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });
    }
    
    // Mobile touch optimizations
    if (isMobile) {
        // Improve touch targets
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            button.style.minHeight = '44px'; // iOS recommended minimum
        });
        
        // Add touch feedback for mobile
        const touchElements = document.querySelectorAll('.feature-card, .btn-primary, .btn-secondary');
        touchElements.forEach(element => {
            element.addEventListener('touchstart', function() {
                this.style.transform = 'scale(0.98)';
                this.style.transition = 'transform 0.1s ease';
            });
            
            element.addEventListener('touchend', function() {
                this.style.transform = 'scale(1)';
                this.style.transition = 'transform 0.2s ease';
            });
        });
        
        // Optimize scroll performance on mobile
        let ticking = false;
        function updateScroll() {
            ticking = false;
        }
        
        function requestTick() {
            if (!ticking) {
                requestAnimationFrame(updateScroll);
                ticking = true;
            }
        }
        
        window.addEventListener('scroll', requestTick, { passive: true });
    }
    
    // Hero title animation is now handled by CSS for consistency
    // Removed typing effect to match the page-wide fadeInUp animation style
});

// Add some interactive elements
function addInteractiveElements() {
    // Add click effect to buttons
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// Add ripple animation CSS
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    button {
        position: relative;
        overflow: hidden;
    }
`;
document.head.appendChild(rippleStyle);

// Initialize interactive elements when DOM is loaded
document.addEventListener('DOMContentLoaded', addInteractiveElements);

// Activity Tracker Functionality
function initializeActivityTracker() {
    const activityCells = document.querySelectorAll('.activity-cell');
    
    // Available activities for each category
    const activities = {
        productive: ['9-5', 'Side Hustle', 'Eat', 'Recording', 'Editing'],
        unproductive: ['IG', 'Youtube', 'TikTok', 'Netflix'],
        life: ['Chores', 'Commute', 'Friends', 'Gym', 'Run', 'Sleep']
    };
    
    // Color mapping for activities
    const activityColors = {
        '9-5': 'productive',
        'Side Hustle': 'productive',
        'Eat': 'productive',
        'Recording': 'productive',
        'Editing': 'productive',
        'IG': 'unproductive',
        'Youtube': 'unproductive',
        'TikTok': 'unproductive',
        'Netflix': 'unproductive',
        'Chores': 'life',
        'Commute': 'life',
        'Friends': 'life',
        'Gym': 'life',
        'Run': 'life',
        'Sleep': 'life'
    };
    
    activityCells.forEach(cell => {
        cell.addEventListener('click', function() {
            const currentActivity = this.getAttribute('data-activity');
            const currentCategory = this.className.includes('productive') ? 'productive' : 
                                  this.className.includes('unproductive') ? 'unproductive' : 'life';
            
            // Create activity selector
            const selector = createActivitySelector(activities, currentActivity, currentCategory);
            
            // Position the selector
            const rect = this.getBoundingClientRect();
            selector.style.position = 'absolute';
            selector.style.top = `${rect.bottom + window.scrollY}px`;
            selector.style.left = `${rect.left + window.scrollX}px`;
            selector.style.zIndex = '1000';
            
            // Remove existing selector
            const existingSelector = document.querySelector('.activity-selector');
            if (existingSelector) {
                existingSelector.remove();
            }
            
            // Add to page
            document.body.appendChild(selector);
            
            // Handle activity selection
            selector.addEventListener('click', function(e) {
                if (e.target.classList.contains('activity-option')) {
                    const newActivity = e.target.textContent;
                    const newCategory = activityColors[newActivity];
                    
                    // Update cell
                    cell.textContent = newActivity;
                    cell.setAttribute('data-activity', newActivity);
                    
                    // Update classes
                    cell.className = `activity-cell ${newCategory}`;
                    
                    // Remove selector
                    selector.remove();
                }
            });
            
            // Close selector when clicking outside
            document.addEventListener('click', function closeSelector(e) {
                if (!selector.contains(e.target) && !cell.contains(e.target)) {
                    selector.remove();
                    document.removeEventListener('click', closeSelector);
                }
            });
        });
    });
}

function createActivitySelector(activities, currentActivity, currentCategory) {
    const selector = document.createElement('div');
    selector.className = 'activity-selector';
    selector.style.cssText = `
        background: white;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        padding: 0.5rem;
        min-width: 150px;
        max-height: 300px;
        overflow-y: auto;
    `;
    
    // Add category headers and options
    Object.entries(activities).forEach(([category, categoryActivities]) => {
        const categoryHeader = document.createElement('div');
        categoryHeader.style.cssText = `
            font-weight: 600;
            font-size: 0.75rem;
            color: #64748b;
            padding: 0.5rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            border-bottom: 1px solid #f1f5f9;
            margin-bottom: 0.25rem;
        `;
        categoryHeader.textContent = category;
        selector.appendChild(categoryHeader);
        
        categoryActivities.forEach(activity => {
            const option = document.createElement('div');
            option.className = 'activity-option';
            option.textContent = activity;
            option.style.cssText = `
                padding: 0.5rem;
                cursor: pointer;
                border-radius: 4px;
                font-size: 0.875rem;
                transition: background-color 0.2s;
                ${activity === currentActivity ? 'background-color: #f1f5f9; font-weight: 600;' : ''}
            `;
            
            option.addEventListener('mouseenter', function() {
                this.style.backgroundColor = '#f8fafc';
            });
            
            option.addEventListener('mouseleave', function() {
                this.style.backgroundColor = activity === currentActivity ? '#f1f5f9' : 'transparent';
            });
            
            selector.appendChild(option);
        });
        
        // Add spacing between categories
        if (category !== Object.keys(activities)[Object.keys(activities).length - 1]) {
            const spacer = document.createElement('div');
            spacer.style.height = '0.5rem';
            selector.appendChild(spacer);
        }
    });
    
    return selector;
}

// Initialize activity tracker when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeActivityTracker();
});
