/* ============================================
   PREGAME - JavaScript Interactions
============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    initModeToggle();
    initNavigation();
    initMenuTabs();
    initMenuData();
    initEventsData();
    initTaglineRotation();
    initScrollAnimations();
    initCounters();
});

// ---- Time-Based Tagline Rotation ----
function initTaglineRotation() {
    const heroTitle = document.querySelector('.hero__title');
    const heroSubtitle = document.querySelector('.hero__subtitle');
    
    if (!heroTitle || !heroSubtitle) return;

    const hour = new Date().getHours();
    let timeOfDay = 'morning'; // Default

    if (hour >= 6 && hour < 12) timeOfDay = 'morning';
    else if (hour >= 12 && hour < 17) timeOfDay = 'afternoon';
    else if (hour >= 17 || hour < 6) timeOfDay = 'evening';
    
    // Data for taglines
    const taglines = {
        morning: {
            headlines: [
                { line1: 'WORK FROM HERE.', line2: 'WE’LL KEEP THE COFFEE COMING.' },
                { line1: 'YOUR OFFICE,', line2: 'BUT BETTER.' },
                { line1: 'FREE WI-FI. REAL COFFEE.', line2: 'ZERO ZOOM FATIGUE.' },
                { line1: 'TIRED OF WORKING FROM HOME?', line2: 'UPGRADE YOUR DESK.' },
                { line1: 'COFFEE FIRST.', line2: 'EVERYTHING ELSE LATER.' }
            ],
            subline: 'Fresh coffee, comfortable space, and fast Wi-Fi right on NW 23rd.'
        },
        afternoon: {
            headlines: [
                { line1: 'CLOCK OUT', line2: 'EARLY.' },
                { line1: 'START THE', line2: 'PREGAME.' },
                { line1: 'COFFEE OR COCKTAILS —', line2: 'YOUR CALL.' },
                { line1: 'MIDDAY RESET', line2: 'STARTS HERE.' },
                { line1: 'GOOD VIBES', line2: 'BEFORE THE NIGHT BEGINS.' }
            ],
            subline: 'Affordable drinks, games, patio seating, and no cover—ever.'
        },
        evening: {
            headlines: [
                { line1: 'START THE NIGHT', line2: 'AT THE PREGAME.' },
                { line1: 'WHERE OKC', line2: 'PREGAMES.' },
                { line1: 'DRINKS. GAMES.', line2: 'NO COVER.' },
                { line1: 'YOUR NIGHT', line2: 'STARTS HERE.' },
                { line1: 'MEET HERE', line2: 'BEFORE ANYWHERE.' }
            ],
            subline: 'Pool, darts, cornhole, trivia, karaoke, and front-row patio vibes on NW 23rd.'
        }
    };

    // Special override for Event Nights (needs logic to determine if tonights an event)
    const day = new Date().getDay(); // 0-6 Sun-Sat
    const isTriviaNight = day === 2; // Tuesday
    const isKaraokeNight = day === 5; // Friday
    
    let selectedContent = taglines[timeOfDay];
    
    if (hour >= 17) {
        if (isTriviaNight) {
             selectedContent = {
                headlines: [
                    { line1: 'TONIGHT’S NOT', line2: 'A STAY-HOME NIGHT.' },
                    { line1: 'GRAB YOUR TEAM.', line2: 'GRAB THE MIC.' }, // Maybe shared?
                    { line1: 'SMART DRINKS.', line2: 'SMARTER TEAMS.' },
                    { line1: 'NO COVER.', line2: 'ALL ENERGY.' }
                ],
                subline: 'Trivia Night: Prizes, bragging rights, and cold drinks.'
            };
        } else if (isKaraokeNight) {
             selectedContent = {
                headlines: [
                    { line1: 'YOUR SONG.', line2: 'YOUR STAGE.' },
                    { line1: 'GRAB THE MIC.', line2: 'WE’LL HANDLE THE DRINKS.' },
                    { line1: 'COME FOR THE DRINKS.', line2: 'STAY FOR THE SHOW.' },
                    { line1: 'NO COVER.', line2: 'ALL ENERGY.' }
                ],
                subline: 'Karaoke Night: Sing solo, bring a duet, or just enjoy the show.'
            };
        }
    }

    // Pick a random headline from the available options
    const randomIndex = Math.floor(Math.random() * selectedContent.headlines.length);
    const headline = selectedContent.headlines[randomIndex];

    // Update DOM
    heroTitle.innerHTML = `
        <span class="hero__title-line">${headline.line1}</span>
        <span class="hero__title-line hero__title-line--accent">${headline.line2}</span>
    `;
    heroSubtitle.textContent = selectedContent.subline;
}

// ---- Day/Night Mode Toggle ----
function initModeToggle() {
    const toggle = document.getElementById('modeToggle');
    const html = document.documentElement;

    // Check for saved preference or time-based default
    const savedMode = localStorage.getItem('pregame-mode');
    const hour = new Date().getHours();
    const defaultMode = (hour >= 16 || hour < 6) ? 'night' : 'day';
    const mode = savedMode || defaultMode;

    html.setAttribute('data-mode', mode);

    // Dispatch initial mode event after DOM is ready
    setTimeout(() => {
        window.dispatchEvent(new CustomEvent('modechange', { detail: { mode } }));
    }, 100);

    toggle.addEventListener('click', () => {
        const currentMode = html.getAttribute('data-mode');
        const newMode = currentMode === 'day' ? 'night' : 'day';
        html.setAttribute('data-mode', newMode);
        localStorage.setItem('pregame-mode', newMode);

        // Dispatch mode change event for other components to react
        window.dispatchEvent(new CustomEvent('modechange', { detail: { mode: newMode } }));
    });
}

// ---- Navigation ----
function initNavigation() {
    const nav = document.getElementById('nav');
    const mobileToggle = document.getElementById('mobileToggle');
    const navLinks = document.querySelector('.nav__links');

    // Scroll behavior
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    mobileToggle.addEventListener('click', () => {
        navLinks.classList.toggle('nav__links--open');
        mobileToggle.classList.toggle('active');
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 80;
                const position = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top: position, behavior: 'smooth' });
                navLinks.classList.remove('nav__links--open');
            }
        });
    });
}

// ---- Menu Tabs ----
function initMenuTabs() {
    const tabs = document.querySelectorAll('.menu__tab');

    function switchToTab(targetTab) {
        const panels = document.querySelectorAll('.menu__panel');
        tabs.forEach(t => t.classList.remove('menu__tab--active'));
        panels.forEach(p => p.classList.remove('menu__panel--active'));

        const tab = document.querySelector(`.menu__tab[data-tab="${targetTab}"]`);
        if (tab) {
            tab.classList.add('menu__tab--active');
            const panel = document.getElementById(`${targetTab}-panel`);
            if (panel) panel.classList.add('menu__panel--active');
        }
    }

    // Manual tab clicking still works
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            switchToTab(tab.dataset.tab);
        });
    });

    // Listen for mode changes and auto-switch menu
    window.addEventListener('modechange', (e) => {
        const mode = e.detail.mode;
        // Day mode = Coffee menu, Night mode = Bar menu
        switchToTab(mode === 'day' ? 'coffee' : 'bar');
    });
}

// ---- Menu Data ----
function initMenuData() {
    const menuContent = document.getElementById('menu-content');

    const coffeeMenu = {
        'ESPRESSO PLAYBOOK': [
            { name: 'The Kickoff', price: '$4.50', desc: 'Double shot espresso, bold and undefeated' },
            { name: 'Red Zone Latte', price: '$5.75', desc: 'Espresso with velvety steamed milk, vanilla, and cinnamon' },
            { name: 'The Blitz', price: '$6.25', desc: 'Triple shot with caramel, brown sugar, and oat milk' },
            { name: 'Hail Mary Mocha', price: '$6.50', desc: 'Rich chocolate espresso with whipped cream finish' }
        ],
        'COLD PLAYS': [
            { name: 'Nitro Cold Brew', price: '$5.50', desc: 'Creamy, cascading cold brew straight from the tap' },
            { name: 'The Overtime', price: '$6.75', desc: 'Extra-strength cold brew with espresso shot' },
            { name: 'Crimson Refresher', price: '$5.25', desc: 'Hibiscus tea with strawberry and lemon' }
        ]
    };

    const barMenu = {
        'SIGNATURE PLAYS': [
            { name: 'The Sooner Sunset', price: '$12', desc: 'Bourbon, blood orange, honey, aromatic bitters' },
            { name: 'Fourth Quarter', price: '$11', desc: 'Vodka, espresso, coffee liqueur, cream' },
            { name: 'Touchdown Mule', price: '$10', desc: 'Premium vodka, ginger beer, lime, copper mug' },
            { name: 'The Heisman', price: '$14', desc: 'Aged rum, coconut, pineapple, trophy-worthy' }
        ],
        'DRAFT PICKS': [
            { name: 'Local IPA', price: '$7', desc: 'Rotating selection from Oklahoma breweries' },
            { name: 'Stadium Lager', price: '$5', desc: 'Crisp, clean, crowd-pleaser' },
            { name: 'Craft Flight', price: '$15', desc: 'Four 5oz pours of your choice' }
        ]
    };

    function renderMenu(menu) {
        let html = '';
        for (const [category, items] of Object.entries(menu)) {
            html += `
                <div class="menu__category">
                    <h3 class="menu__category-title">${category}</h3>
                    <div class="menu__items">
                        ${items.map(item => `
                            <div class="menu__item">
                                <div class="menu__item-header">
                                    <span class="menu__item-name">${item.name}</span>
                                    <span class="menu__item-price">${item.price}</span>
                                </div>
                                <p class="menu__item-desc">${item.desc}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }
        return html;
    }

    menuContent.innerHTML = `
        <div class="menu__panel menu__panel--active" id="coffee-panel">
            ${renderMenu(coffeeMenu)}
        </div>
        <div class="menu__panel" id="bar-panel">
            ${renderMenu(barMenu)}
        </div>
    `;
}

// ---- Events Data ----
function initEventsData() {
    const eventsGrid = document.querySelector('.events__grid');

    const events = [
        { day: 'MON', title: 'MONDAY NIGHT FOOTBALL', desc: '$3 domestic drafts during the game. Every. Single. Monday.', time: 'Kickoff to Final Whistle' },
        { day: 'TUE', title: 'TRIVIA TUESDAY', desc: 'Test your sports knowledge. Win prizes. Defend your honor.', time: '7:00 PM', link: 'trivia.html' },
        { day: 'WED', title: 'WINE DOWN WEDNESDAY', desc: 'Half-price wine all evening. Classy midweek reset.', time: '4PM — Close' },
        { day: 'THU', title: 'THROWBACK THURSDAY', desc: 'Classic games on every screen. Retro drink specials.', time: 'All Night' },
        { day: 'FRI', title: 'KARAOKE NIGHT', desc: 'Your song. Your stage. No cover. Liquid courage available.', time: '8:00 PM', link: 'karaoke.html' },
        { day: 'SAT', title: 'GAME DAY HEADQUARTERS', desc: 'THE place to watch Oklahoma football. Arrive early or miss out.', time: 'All Day Event', featured: true },
        { day: 'SUN', title: 'SUNDAY FUNDAY', desc: 'NFL all day. Brunch cocktails. Bottomless mimosas until 2pm.', time: '10AM — Close' }
    ];

    eventsGrid.innerHTML = events.map(event => `
        <${event.link ? 'a href="' + event.link + '"' : 'div'} class="events__card ${event.featured ? 'events__card--featured' : ''}" ${event.link ? 'style="display: block; text-decoration: none; color: inherit; cursor: pointer;"' : ''}>
            <div class="events__card-day">${event.day}</div>
            <h3 class="events__card-title">${event.title}</h3>
            <p class="events__card-desc">${event.desc}</p>
            <span class="events__card-time">${event.time}</span>
            ${event.featured ? '<div class="events__card-badge">FEATURED</div>' : ''}
            ${event.link ? '<div class="events__card-link">Learn More &rarr;</div>' : ''}
        </${event.link ? 'a' : 'div'}>
    `).join('');
}

// ---- Scroll Animations ----
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    // Add reveal class to animatable elements
    const animatableSelectors = [
        '.section-header',
        '.concept__card',
        '.menu__category',
        '.atmosphere__item',
        '.events__card',
        '.location__detail',
        '.location__hours-block'
    ];

    animatableSelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach((el, i) => {
            el.classList.add('reveal');
            el.style.transitionDelay = `${i * 0.1}s`;
            observer.observe(el);
        });
    });
}

// ---- Counter Animation ----
function initCounters() {
    const counters = document.querySelectorAll('[data-count]');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.dataset.count);
                animateCounter(counter, target);
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element, target) {
    const duration = 2000;
    const start = 0;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(start + (target - start) * easeOut);

        element.textContent = current;

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = target;
        }
    }

    requestAnimationFrame(update);
}

// ---- Newsletter Form ----
document.querySelector('.footer__form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = e.target.querySelector('input');
    if (input.value) {
        alert('Thanks for subscribing! See you at game time.');
        input.value = '';
    }
});

// ---- Status Indicator ----
function updateStatus(mode) {
    const statusText = document.querySelector('.nav__status-text');
    if (statusText) {
        statusText.textContent = mode === 'day' ? 'NOW POURING: COFFEE' : 'NOW POURING: COCKTAILS';
    }
}

window.addEventListener('modechange', (e) => {
    updateStatus(e.detail.mode);
});

// ---- Daily Chalkboard Specials ----
function initDailySpecials() {
    const chalkboardItem = document.querySelector('.menu__chalkboard-item');
    if (!chalkboardItem) return;

    const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const today = days[new Date().getDay()];

    const specials = {
        'MON': 'Game Day Pitcher + Wings — $25',
        'TUE': 'Taco Trio + Cerveza — $15',
        'WED': 'Wine Bottles — 1/2 Price',
        'THU': 'Throwback Cocktails — $8',
        'FRI': 'Late Night Flatbreads — $10',
        'SAT': 'Sooner Bomb Shots — $6',
        'SUN': 'Bottomless Mimosas — $20'
    };

    if (specials[today]) {
        chalkboardItem.textContent = specials[today];
    }
}

// Call this in DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    initDailySpecials();
});
