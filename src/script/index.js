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
import {
    fetchOffer,
    handleClick,
    toggleSpecialDeal,
} from './components/specialDeals.js';

import {
    hamburgerEle,
    asideEle,
    footer,
    specialDealsEle,
    specialDealsNavLink,
    asideDealNavEle,
} from './data/domElements.js';

// ----------------------------------------------------------
//                       EventListener
// ----------------------------------------------------------

// open the mobile navigation menu
hamburgerEle.addEventListener('click', () => {
    toggleMenu(hamburgerEle, asideEle, toggleClass);
});

specialDealsNavLink.addEventListener('click', function () {
    toggleSpecialDeal();
});

// close the mobile navigation menu when close is button clicked or link clicked.
asideEle.addEventListener('click', (e) => {
    if (e.target === asideDealNavEle) {
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

specialDealsEle.addEventListener('click', handleClick);

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
    fetchOffer();
})();
