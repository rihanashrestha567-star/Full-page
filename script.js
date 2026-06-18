/* ==================== NepalRide Client Script Engine ==================== */

// Wait for DOM to fully load
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    // 1. Mobile Hamburger menu toggle initialization
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navBar = document.getElementById('navBar');
    if (mobileMenuBtn && navBar) {
        mobileMenuBtn.addEventListener('click', () => {
            navBar.classList.toggle('active');
        });
    }

    // 2. Initialize input trackers for Username typing car animations
    initCredentialTrackers();
}

// Tab switching SPA navigation
function switchTab(tabName) {
    // Close mobile menu if open
    const navBar = document.getElementById('navBar');
    if (navBar) navBar.classList.remove('active');
    
    // Get all page section blocks and navigation buttons
    const sections = document.querySelectorAll('.page-section');
    const navButtons = document.querySelectorAll('.nav-btn');
    
    // Hide all sections, remove active classes
    sections.forEach(sec => sec.classList.remove('active'));
    navButtons.forEach(btn => btn.classList.remove('active'));
    
    // Activate the selected section
    const targetSection = document.getElementById(tabName + '-section');
    if (targetSection) {
        targetSection.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    // Highlight the corresponding navbar button
    navButtons.forEach(btn => {
        if(btn.innerText.toLowerCase().includes(tabName) || 
           (tabName === 'portfolio' && btn.innerText.toLowerCase().includes('port'))) {
            btn.classList.add('active');
        }
    });
}

// Scroll to Fleet Grid on Home Page
function scrollToFleet() {
    const fleetGrid = document.getElementById('rentals-heading');
    if (fleetGrid) {
        fleetGrid.scrollIntoView({ behavior: 'smooth' });
    }
}

// ==================== LOGIN DYNAMIC ANIMATIONS ====================
function initCredentialTrackers() {
    const loginUsernameInput = document.getElementById('loginUsername');
    const usernameCar = document.getElementById('username-car');
    const userCharCount = document.getElementById('userCharCount');

    const loginPasswordInput = document.getElementById('loginPassword');
    const passwordCar = document.getElementById('password-car');
    const passCharCount = document.getElementById('passCharCount');

    // Username Character Typing Car Animation Callback
    if (loginUsernameInput && usernameCar) {
        loginUsernameInput.addEventListener('input', (e) => {
            const length = e.target.value.length;
            const max = parseInt(e.target.maxLength) || 20;
            if (userCharCount) userCharCount.innerText = `(${length}/${max})`;
            
            // Calculate progress percent (cap vehicle left offset to 85% maximum so it stays on road track)
            const progressPct = Math.min((length / max) * 85, 85);
            usernameCar.style.left = progressPct + '%';
            
            // Add 'driving' class to start rotating wheel circles
            usernameCar.classList.add('driving');
            
            // Clear spin timeout and stop wheel spinning when user stops typing keys
            clearTimeout(usernameCar.spinTimeout);
            usernameCar.spinTimeout = setTimeout(() => {
                usernameCar.classList.remove('driving');
            }, 150);
        });
    }

    // Password Character Typing Car Animation Callback
    if (loginPasswordInput && passwordCar) {
        loginPasswordInput.addEventListener('input', (e) => {
            const length = e.target.value.length;
            const max = parseInt(e.target.maxLength) || 20;
            if (passCharCount) passCharCount.innerText = `(${length}/${max})`;
            
            // Calculate progress percent
            const progressPct = Math.min((length / max) * 85, 85);
            passwordCar.style.left = progressPct + '%';
            
            // Spin wheels
            passwordCar.classList.add('driving');
            
            clearTimeout(passwordCar.spinTimeout);
            passwordCar.spinTimeout = setTimeout(() => {
                passwordCar.classList.remove('driving');
            }, 150);
        });
    }
}

// Show/Hide Password Toggle with dynamic Headlight Cone illumination animation
function togglePasswordVisibility() {
    const loginPasswordInput = document.getElementById('loginPassword');
    const passwordCar = document.getElementById('password-car');
    const showPassBtn = document.getElementById('showPassBtn');
    
    if (!loginPasswordInput || !passwordCar || !showPassBtn) return;
    
    if (loginPasswordInput.type === "password") {
        loginPasswordInput.type = "text";
        passwordCar.classList.add('headlights-on'); // Turns on headlight glowing cone SVG
        showPassBtn.style.color = "var(--accent-teal)";
        showPassBtn.title = "Turn Off Car Headlights (Hide Password)";
        
        // Trigger a momentary "suspension jump" (hop/bump) on password car to signal active state
        passwordCar.style.transform = "scale(1.15) translateY(-3px)";
        setTimeout(() => {
            passwordCar.style.transform = "none";
        }, 150);
    } else {
        loginPasswordInput.type = "password";
        passwordCar.classList.remove('headlights-on'); // Turns off headlight glowing cone
        showPassBtn.style.color = "var(--text-secondary)";
        showPassBtn.title = "Turn On Car Headlights (Reveal Password)";
    }
}

// Login Submit success animation triggers
function handleLoginSubmit(event) {
    event.preventDefault();
    // Show the success race overlay screen
    const successOverlay = document.getElementById('loginSuccessOverlay');
    if (successOverlay) successOverlay.classList.add('active');
}

function resetLoginForm() {
    const successOverlay = document.getElementById('loginSuccessOverlay');
    if (successOverlay) successOverlay.classList.remove('active');
    
    const form = document.getElementById('loginForm');
    if (form) form.reset();

    const usernameCar = document.getElementById('username-car');
    const passwordCar = document.getElementById('password-car');
    const loginPasswordInput = document.getElementById('loginPassword');
    const showPassBtn = document.getElementById('showPassBtn');
    const userCharCount = document.getElementById('userCharCount');
    const passCharCount = document.getElementById('passCharCount');

    if (usernameCar) usernameCar.style.left = '0%';
    if (passwordCar) {
        passwordCar.style.left = '0%';
        passwordCar.classList.remove('headlights-on');
    }
    if (loginPasswordInput) loginPasswordInput.type = "password";
    if (showPassBtn) showPassBtn.style.color = "var(--text-secondary)";
    if (userCharCount) userCharCount.innerText = "(0/20)";
    if (passCharCount) passCharCount.innerText = "(0/20)";
}

// ==================== CONTACT & BOOKING FORM OPERATIONS ====================
// Pre-populates selected package when user clicks "Rent Car" cards from home page
function quickBook(packageName) {
    switchTab('contact');
    const selectField = document.getElementById('bookPackage');
    if (selectField) {
        for(let i=0; i < selectField.options.length; i++) {
            if(selectField.options[i].value.includes(packageName)) {
                selectField.selectedIndex = i;
                break;
            }
        }
    }
}

// Handles booking form submits, showing custom verified ticket modal with random id codes
function handleBookingSubmit(event) {
    event.preventDefault();
    
    const name = document.getElementById('bookName').value;
    const email = document.getElementById('bookEmail').value;
    const bDate = document.getElementById('bookDate').value;
    const packageVal = document.getElementById('bookPackage').value;
    
    // Build Ticket layout details
    document.getElementById('ticketRenterName').innerText = name;
    document.getElementById('ticketRenterEmail').innerText = email;
    document.getElementById('ticketBookDate').innerText = bDate;
    document.getElementById('ticketPackageName').innerText = packageVal;
    
    // Create a randomized booking ID code
    const randomIdNum = Math.floor(10000 + Math.random() * 90000);
    document.getElementById('ticketRandId').innerText = `#NR-${randomIdNum}`;
    
    // Open modal popup
    const modal = document.getElementById('bookingModal');
    if (modal) modal.classList.add('active');
}

function closeBookingModal() {
    const modal = document.getElementById('bookingModal');
    if (modal) modal.classList.remove('active');
    
    const form = document.getElementById('bookingForm');
    if (form) form.reset();
    
    switchTab('home');
}


// ==================== PORTFOLIO DEMO PRESENTERS ====================
function switchDemoPane(demoType) {
    // Uncheck other banners active state classes
    const banners = document.querySelectorAll('.portfolio-banner-card');
    banners.forEach(b => b.classList.remove('active'));
    
    // Add active class to corresponding card click
    const targetBanner = document.querySelector(`.demo-${demoType}`);
    if (targetBanner) targetBanner.classList.add('active');
    
    // Hide other panes
    const panes = document.querySelectorAll('.demo-pane');
    panes.forEach(p => p.classList.remove('active'));
    
    // Display chosen active pane
    const targetPane = document.getElementById(`demo-${demoType}-pane`);
    if (targetPane) targetPane.classList.add('active');
}

// Dynamic CSS variables adjuster playfield updates
function updateCssPlayground() {
    const speed = document.getElementById('slideSpeed').value;
    const bounce = document.getElementById('slideBounce').value;
    const colorIdx = document.getElementById('slideColor').value;
    
    const car = document.getElementById('cssPlaygroundCar');
    const road = document.getElementById('cssStageRoad');
    const wheel1 = document.getElementById('cssWheel1');
    const wheel2 = document.getElementById('cssWheel2');
    const underglow = document.getElementById('cssUnderglow');
    
    // Update UI dashboard text labels
    document.getElementById('lblSpeed').innerText = `${speed}s`;
    document.getElementById('lblBounce').innerText = `${bounce}px`;
    
    // Update Road motion velocity duration
    if (road) road.style.animationDuration = `${speed}s`;
    // Update Wheel rotation speed
    if (wheel1) wheel1.style.animationDuration = `${speed * 0.6}s`;
    if (wheel2) wheel2.style.animationDuration = `${speed * 0.6}s`;
    
    // Reapply suspension custom bounce vibration animation
    if (car) car.style.animation = `carVibe ${speed * 0.15}s infinite alternate`;
    
    // Modify bouncing amplitude directly via keyframe replacement or custom properties
    document.documentElement.style.setProperty('--bounce-height', `${bounce}px`);
    
    // Update Neon Underglow color spectrums
    let colorName = "Amber Glow";
    let colorHex = "#f59e0b";
    if(colorIdx === "2") {
        colorName = "Teal Sparks";
        colorHex = "#14b8a6";
    } else if(colorIdx === "3") {
        colorName = "Rose Redline";
        colorHex = "#f43f5e";
    }
    document.getElementById('lblColor').innerText = colorName;
    document.getElementById('lblColor').style.color = colorHex;
    if (underglow) {
        underglow.style.backgroundColor = colorHex;
        underglow.style.filter = `blur(8px) drop-shadow(0 0 10px ${colorHex})`;
    }
}


// ==================== ROCK PAPER SCISSORS ARCADE ENGINE ====================
let playerScore = 0;
let cpuScore = 0;

function playRPS(playerChoice) {
    const choices = ['rock', 'paper', 'scissors'];
    const cpuChoice = choices[Math.floor(Math.random() * 3)];
    
    // Hide default prompt text, load visual arena layout columns
    document.getElementById('rpsDefaultText').style.display = 'none';
    document.getElementById('rpsBattleArea').style.display = 'flex';
    
    // Setup SVGs for players choices
    const choiceSvgs = {
        rock: `<!-- SUV -->
        <svg viewBox="0 0 24 24"><path d="M19 10.5V6.8a1 1 0 0 0-.4-.8l-4-3a1 1 0 0 0-1.2 0l-4 3a1 1 0 0 0-.4.8v3.7a3 3 0 0 0-6 0v7.5A1.5 1.5 0 0 0 4.5 21h15a1.5 1.5 0 0 0 1.5-1.5v-7.5a3 3 0 0 0-2-1.5z"/></svg>`,
        paper: `<!-- Ticket -->
        <svg viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM7 11h10v2H7z"/></svg>`,
        scissors: `<!-- Keys -->
        <svg viewBox="0 0 24 24"><path d="M12.65 11.29l3.54-3.54a2 2 0 1 0-2.83-2.83l-3.54 3.54a5 5 0 1 0 2.83 2.83z"/></svg>`
    };
    
    document.getElementById('playerFighter').innerHTML = choiceSvgs[playerChoice];
    document.getElementById('cpuFighter').innerHTML = choiceSvgs[cpuChoice];
    
    // Determine Winner of the round
    let result = '';
    let bannerColor = 'var(--accent-teal)';
    
    if(playerChoice === cpuChoice) {
        result = "It's a Tie! (Equal Gears)";
        bannerColor = 'var(--text-secondary)';
    } else if(
        (playerChoice === 'rock' && cpuChoice === 'scissors') ||
        (playerChoice === 'paper' && cpuChoice === 'rock') ||
        (playerChoice === 'scissors' && cpuChoice === 'paper')
    ) {
        result = "You Win! Engine Overdrive!";
        playerScore++;
        document.getElementById('playerScore').innerText = playerScore;
        bannerColor = 'var(--accent-teal)';
    } else {
        result = "CPU Wins! Battery Drained!";
        cpuScore++;
        document.getElementById('cpuScore').innerText = cpuScore;
        bannerColor = 'var(--accent-rose)';
    }
    
    const banner = document.getElementById('rpsResultText');
    if (banner) {
        banner.innerText = result;
        banner.style.color = bannerColor;
    }
}
