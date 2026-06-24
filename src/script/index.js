// ----------------------------------------------------------
//                        imports
// ----------------------------------------------------------
import {
    toggleMenu,
    handleKeyPress,
    handleOutsideClick,
} from './components/hamburgerMenu.js';
import { toggleClass } from './data/navItem.js';

// ----------------------------------------------------------
//                        DOM Element
// ----------------------------------------------------------
const hamburgerEle = document.querySelector('.nav__menu');
const asideEle = document.querySelector('#hamburger-menu');

// ----------------------------------------------------------
//                       EventListener
// ----------------------------------------------------------

// open the mobile navigation menu
hamburgerEle.addEventListener('click', () =>
    toggleMenu(hamburgerEle, asideEle, toggleClass),
);

// close the mobile navigation menu when close is button clicked or link clicked.
asideEle.addEventListener('click', (e) => {
    if (e.target.tagName !== 'A' && e.target.tagName !== 'BUTTON') return;
    toggleMenu(hamburgerEle, asideEle, toggleClass);
});

// close the mobile navigation menu when Escape Key is pressed.
window.addEventListener('keyup', (e) =>
    handleKeyPress(e, hamburgerEle, asideEle, toggleClass),
);

window.addEventListener('click', (e) =>
    handleOutsideClick(e, hamburgerEle, asideEle, toggleClass),
);
