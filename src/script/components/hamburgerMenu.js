/**
 * Toggles the Mobile navigation menu and update the hamburger icon state.
 * @param {HTMLElement} hamburgerEle - Hamburger menu button
 * @param {HTMLElement} targetEle - Mobile navigation container.
 * @param {String} toggleClass - css class used to show or hide the menu.
 */
export function toggleMenu(hamburgerEle, targetEle, toggleClass) {
    // toggle the visibility for hamburger icon.
    hamburgerEle.children[0].toggleAttribute('hidden');

    // toggle menu visibility
    targetEle.classList.toggle(toggleClass);
}

/**
 * Close the Mobile  navigation menu when press the `Escape` Key.
 * @param {HTMLElement} hamburgerEle - Hamburger menu button
 * @param {HTMLElement} targetEle  - Mobile navigation container
 * @param {String} toggleClass - css class used to show or hide the menu.
 */
export function handleKeyPress(e, hamburgerEle, targetEle, toggleClass) {
    // return if the pressed key is not Escape or the menu is already closed.
    const isAsideOpen = targetEle.classList.contains(toggleClass);

    if (e.key !== 'Escape' || isAsideOpen) {
        return;
    }

    toggleMenu(hamburgerEle, targetEle, toggleClass);
}
