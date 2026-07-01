export const footerDropsAria = ['contact', 'company', 'meetup'];

const classes = {
    contact: 'nav-group__list--disable-contact',
    company: 'nav-group__list--disable-company',
    meetup: 'contact-group__list--disable-meetup',
};
Object.freeze(classes);

// ----------------------------------------------------------
const contactEle = document.querySelector(`.${classes.contact}`);
const companyEle = document.querySelector(`.${classes.company}`);
const meetupEle = document.querySelector(`.${classes.meetup}`);

export function toggleFooterLink(target) {
    contactEle.classList.toggle(classes.contact);
    companyEle.classList.toggle(classes.company);
    meetupEle.classList.toggle(classes.meetup);
    meetupEle.classList.toggle(classes[target]);
}
