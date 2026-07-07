import { backdropEle, specialDealsEle } from '../data/domElements.js';

const actionTypes = {
    TOGGLE_SPECIAL_DEAL: 'close',
    SPIN_WHEEL: 'spin-button',
};

const classLists = {
    toggleSpecialDeal: 'special-deals--hidden',
    slideDown: 'special-deals__slide-down',
};

Object.freeze(actionTypes);

export function handleClick(e) {
    const actionName = e.target.dataset.name;
    if (!actionName) return;

    switch (actionName) {
        case actionTypes.TOGGLE_SPECIAL_DEAL:
            toggleSpecialDeal();
            break;
        case actionTypes.SPIN_WHEEL:
            spinWheel();
            break;
        default:
            break;
    }
}

export function toggleSpecialDeal() {
    // if specialDeals section already closed then open it.
    if (backdropEle.classList.contains(classLists.toggleSpecialDeal)) {
        specialDealsEle.classList.remove(classLists.toggleSpecialDeal);
        backdropEle.classList.remove(classLists.toggleSpecialDeal);
        return;
    }
    // else close the specialDeals section with small animation
    specialDealsEle.classList.add(classLists.slideDown);

    setTimeout(() => {
        specialDealsEle.classList.remove(classLists.slideDown);
        backdropEle.classList.add(classLists.toggleSpecialDeal);
        specialDealsEle.classList.add(classLists.toggleSpecialDeal);
    }, 300);
}

function spinWheel() {}
