// ----------------------------------------------------------
//                        imports
// ----------------------------------------------------------
import Swiper from 'https://cdn.jsdelivr.net/npm/swiper@12/swiper-bundle.min.mjs';

import {
    toggleMenu,
    handleKeyPress,
    handleOutsideClick,
} from './components/hamburgerMenu.js';
import { showTravelPointData } from './components/travelPoint.js';
import { toggleClass } from './data/navItem.js';
import { footerDropsAria, toggleFooterLink } from './components/footer.js';
import { handleClick, toggleSpecialDeal } from './components/specialDeals.js';

import {
    hamburgerEle,
    asideEle,
    footer,
    specialDealsEle,
    navEle,
} from './data/domElements.js';

// ----------------------------------------------------------
//                       EventListener
// ----------------------------------------------------------

specialDealsEle.addEventListener('click', handleClick);

// open the mobile navigation menu
navEle.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON' || e.target.tagName === 'IMG') {
        toggleMenu(hamburgerEle, asideEle, toggleClass);
        return;
    }
    if (e.target.innerText === 'Special Deals') {
        toggleSpecialDeal();
    }
});

// close the mobile navigation menu when close is button clicked or link clicked.
asideEle.addEventListener('click', (e) => {
    if (e.target.tagName !== 'A' && e.target.tagName !== 'BUTTON') return;
    if (e.target.tagName === 'A' && e.target.innerText === 'Special Deals') {
        toggleSpecialDeal();
    }
    toggleMenu(hamburgerEle, asideEle, toggleClass);
});

// close the mobile navigation menu when Escape Key is pressed.
window.addEventListener('keyup', (e) =>
    handleKeyPress(e, hamburgerEle, asideEle, toggleClass),
);

// Close the mobile navigation menu when the user clicks outside the screen.
window.addEventListener('click', (e) =>
    handleOutsideClick(e, hamburgerEle, asideEle, toggleClass),
);

// Library setup for the testimonials section
new Swiper('.swiper', {
    loop: true,

    pagination: {
        el: '.swiper-pagination',
    },

    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
});

/**
 * Global event listener for the footer container.
 * Uses event delegation to capture clicks on chevron icon wrappers.
 */
footer.addEventListener('click', function (e) {
    const targetSpan = e.target.dataset.footerName;
    if (!footerDropsAria.includes(targetSpan)) return;
    toggleFooterLink(targetSpan);
});

// Show the Travel Point data immediately.
(function init() {
    showTravelPointData();
})();
