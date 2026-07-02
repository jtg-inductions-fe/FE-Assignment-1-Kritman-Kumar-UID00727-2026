/**
 * Valid target names for the footer dropdown accordion sections.
 * Used for input validation during click events.
 * @type {string[]}
 */
export const footerDropsAria = ['contact', 'company', 'meetup'];

/**
 * Single source of truth for the CSS class names that control
 * the visibility/state of each footer section.
 */
const classNames = {
    contact: 'nav-group__list--disable-contact',
    company: 'nav-group__list--disable-company',
    meetup: 'contact-group__list--disable-meetup',
};
Object.freeze(classNames);

// ----------------------------------------------------------

const contactEle = document.querySelector(`.${classNames.contact}`);
const companyEle = document.querySelector(`.${classNames.company}`);
const meetupEle = document.querySelector(`.${classNames.meetup}`);

/**
 * Toggles the visibility modifier class of a specific footer section.
 * @param {string} target - The name of the section to toggle ('contact', 'company', or 'meetup')
 */
export function toggleFooterLink(target) {
    if (!target) return;
    let isOpen = null;
    switch (target) {
        case 'contact':
            isOpen = contactEle.classList.toggle(classNames.contact);
            rotateIcon(contactEle, isOpen);
            break;
        case 'company':
            isOpen = companyEle.classList.toggle(classNames.company);
            rotateIcon(companyEle, isOpen);
            break;
        case 'meetup':
            isOpen = meetupEle.classList.toggle(classNames.meetup);
            rotateIcon(meetupEle, isOpen);
            break;
        default:
            break;
    }
}

function rotateIcon(ele, isRotate) {
    if (isRotate) {
        ele.previousElementSibling.querySelector('i').style.transform =
            'rotate(0deg)';
    } else {
        ele.previousElementSibling.querySelector('i').style.transform =
            'rotate(180deg)';
    }
}
