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
    initScrollAnimations();
    initCounters();
});

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
        { day: 'TUE', title: 'TRIVIA TUESDAY', desc: 'Test your sports knowledge. Win prizes. Defend your honor.', time: '7:00 PM' },
        { day: 'WED', title: 'WINE DOWN WEDNESDAY', desc: 'Half-price wine all evening. Classy midweek reset.', time: '4PM — Close' },
        { day: 'THU', title: 'THROWBACK THURSDAY', desc: 'Classic games on every screen. Retro drink specials.', time: 'All Night' },
        { day: 'SAT', title: 'GAME DAY HEADQUARTERS', desc: 'THE place to watch Oklahoma football. Arrive early or miss out.', time: 'All Day Event', featured: true },
        { day: 'SUN', title: 'SUNDAY FUNDAY', desc: 'NFL all day. Brunch cocktails. Bottomless mimosas until 2pm.', time: '10AM — Close' }
    ];

    eventsGrid.innerHTML = events.map(event => `
        <div class="events__card ${event.featured ? 'events__card--featured' : ''}">
            <div class="events__card-day">${event.day}</div>
            <h3 class="events__card-title">${event.title}</h3>
            <p class="events__card-desc">${event.desc}</p>
            <span class="events__card-time">${event.time}</span>
            ${event.featured ? '<div class="events__card-badge">FEATURED</div>' : ''}
        </div>
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
