// css class used to show or hide the menu.
export const toggleClass = 'sidebar--disabled';

/**
 * Toggles the Mobile navigation menu.
 * @param {HTMLElement} hamburgerEle - Hamburger menu button
 * @param {HTMLElement} targetEle - Mobile navigation container.
 */
export function toggleMenu(hamburgerEle, targetEle) {
    targetEle.classList.toggle(toggleClass);
}

/**
 * Close the Mobile  navigation menu when press the `Escape` Key.
 * @param {HTMLElement} hamburgerEle - Hamburger menu button
 * @param {HTMLElement} targetEle  - Mobile navigation container
 */
export function handleEscape(e, hamburgerEle, targetEle) {
    // return if the pressed key is not Escape or the menu is already closed.
    const isAsideOpen = targetEle.classList.contains(toggleClass);

    if (e.key !== 'Escape' || isAsideOpen) {
        return;
    }

    toggleMenu(hamburgerEle, targetEle);
}

/**
 * Closes the mobile navigation menu when clicking outside it.
 *
 * @param {MouseEvent} e - Mouse click event.
 * @param {HTMLElement} hamburgerEle - Hamburger menu button.
 * @param {HTMLElement} targetEle - Mobile navigation container.
 */
export function handleOutsideClick(e, hamburgerEle, targetEle) {
    if (targetEle.classList.contains(toggleClass)) return;

    const clickedInsideMenu = targetEle.contains(e.target);
    const clickedHamburger = hamburgerEle.contains(e.target);

    if (clickedInsideMenu || clickedHamburger) return;

    toggleMenu(hamburgerEle, targetEle);
}
