// ----------------------------------------------------------
//                        imports
// ----------------------------------------------------------
import Swiper from 'https://cdn.jsdelivr.net/npm/swiper@12/swiper-bundle.min.mjs';

import {
    toggleMenu,
    handleEscape,
    handleOutsideClick,
} from './components/hamburgerMenu.js';
import { showTravelPointData } from './components/travelPoint.js';
// ----------------------------------------------------------
//                        DOM Element
// ----------------------------------------------------------
const hamburgerEle = document.querySelector('.nav__toggle');
const asideEle = document.querySelector('#hamburger-menu');

// ----------------------------------------------------------
//                       EventListener
// ----------------------------------------------------------

// open the mobile navigation menu
hamburgerEle.addEventListener('click', () =>
    toggleMenu(hamburgerEle, asideEle),
);

// close the mobile navigation menu when close is button clicked or link clicked.
asideEle.addEventListener('click', (e) => {
    const clickableElement = e.target.closest('.sidebar__link, .sidebar__btn');
    if (!clickableElement) return;
    toggleMenu(hamburgerEle, asideEle);
});

// close the mobile navigation menu when Escape Key is pressed.
window.addEventListener('keyup', (e) =>
    handleEscape(e, hamburgerEle, asideEle),
);

// Close the mobile navigation menu when the user clicks outside the screen.
window.addEventListener('click', (e) =>
    handleOutsideClick(e, hamburgerEle, asideEle),
);

// Library setup for the testimonials section
new Swiper('.swiper', {
    loop: true,

    autoplay: {
        delay: 5000,
    },

    pagination: {
        el: '.swiper-pagination',
    },

    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
});

// Show the Travel Point data immediately.
(function init() {
    showTravelPointData();
})();
