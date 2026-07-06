import {
    backdropEle,
    specialDealsEle,
    wheelEle,
    dealButtonEle,
    dealsEle,
    unlockedDealsEle,
    winOfferEle,
    spinButtonEle,
    greetEle,
    unlockedDealsListEle,
} from '../data/domElements.js';

const actionTypes = {
    TOGGLE_SPECIAL_DEAL: 'close',
    SPIN_WHEEL: 'spin-wheel',
    SHOW_UNLOCKED_DEALS: 'unlocked-deals',
    SHOW_DEALS: 'deals',
    COPY_CODE: 'copy-code',
};

const classLists = {
    hideSpecialDeal: 'special-deals--hidden',
    slideDown: 'special-deals__slide-down',
    hideUnlockedDeals: 'unlocked-deals--hidden',
};

Object.freeze(actionTypes);

let state = {
    isSpinning: false,
    totalRotation: 0,
    currentReward: [],
    unlockedDeals: [],
};

const OFFER_URI =
    'https://gist.githubusercontent.com/ameer-wajid-ali/1f29ebee4295cede36f8d74b45e576df/raw/122966c9a123861249f173911d8d93a76dc06d7a/';

export function handleClick(e) {
    const actionName = e.target.dataset.name;
    if (!actionName) return;

    switch (actionName) {
        case actionTypes.TOGGLE_SPECIAL_DEAL:
            toggleSpecialDeal();
            return;
        case actionTypes.SPIN_WHEEL:
            spinWheel();
            return;
        case actionTypes.SHOW_UNLOCKED_DEALS:
            toggleDealsPage(actionName);
            return;
        case actionTypes.SHOW_DEALS:
            toggleDealsPage(actionName);
            return;
        case actionTypes.COPY_CODE:
            // handleCopyCode(e.target);
            return;
        default:
            break;
    }
}

export function toggleSpecialDeal() {
    // if specialDeals section already closed then open it.

    if (backdropEle.classList.contains(classLists.hideSpecialDeal)) {
        specialDealsEle.classList.remove(classLists.hideSpecialDeal);
        backdropEle.classList.remove(classLists.hideSpecialDeal);
        return;
    }
    // else close the specialDeals section with small animation
    specialDealsEle.classList.add(classLists.slideDown);

    setTimeout(() => {
        backdropEle.classList.add(classLists.hideSpecialDeal);
        specialDealsEle.classList.add(classLists.hideSpecialDeal);
        specialDealsEle.classList.remove(classLists.slideDown);
    }, 300);
}

function toggleDealsPage(actionName) {
    if (actionName === actionTypes.SHOW_DEALS) {
        dealButtonEle.innerHTML = ` View All Unlocked Deals
                    <span class="special-deals__badge">${state.unlockedDeals.length || ''}</span> `;

        dealButtonEle.dataset.name = actionTypes.SHOW_UNLOCKED_DEALS;
    } else {
        renderWonReward();
        dealButtonEle.innerHTML = 'Go Back';
        dealButtonEle.dataset.name = actionTypes.SHOW_DEALS;
    }

    dealsEle.classList.toggle(classLists.hideSpecialDeal);
    unlockedDealsEle.classList.toggle(classLists.hideUnlockedDeals);
}

function showDealsWheel() {
    wheelEle.classList.remove('wheel__loading');
    wheelEle.classList.add('wheel__loaded');
    spinButtonEle.classList.remove(classLists.hideSpecialDeal);

    wheelEle.innerHTML = `<li class="wheel__item wheel__item--top">
                            <div class="text text__top">
                                <span class="text__title">${state.currentReward[0].label}</span>
                            </div>
                        </li>
                        <li class="wheel__item wheel__item--right">
                            <div class="text text__right">
                                <span class="text__title">${state.currentReward[1].label}</span>
                            </div>
                        </li>
                        <li class="wheel__item wheel__item--bottom">
                            <div class="text text__bottom">
                                <span class="text__title">${state.currentReward[2].label}</span>
                            </div>
                        </li>
                        <li class="wheel__item wheel__item--left">
                            <div class="text text__left">
                                <span class="text__title">${state.currentReward[3].label}</span>
                            </div>
                        </li>`;
}

// async function handleCopyCode(e) {
//     try {
//         const code = e.closest('div').querySelector('.deals__code').innerText;
//         await navigator.clipboard.writeText(code);
//         showMessage('copied');
//     } catch (error) {
//         showMessage('copy failed');
//     }
// }

// function showMessage(message) {}

export async function fetchOffer() {
    try {
        const res = await fetch(OFFER_URI);

        if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
        }

        const offers = await res.json();
        storeOfferWithId(offers);
        getCurrentReward();
        showDealsWheel();
    } catch (e) {
        alert(e);
    }
}

function storeOfferWithId(offers) {
    state.offers = offers.map((offer) => ({
        ...offer,
        id: crypto.randomUUID(),
        isUnlocked: false,
        validFor: formatRelativeDate(offer.validFor),
    }));
}

function getCurrentReward() {
    let idx = 0;
    if (state.offers.length - state.unlockedDeals.length <= 4) {
        for (let i = 0; i < state.offers.length && idx < 4; i++) {
            if (state.offers.isUnlocked === false) {
                state.currentReward[idx++] = state.offers[i];
            }
        }
        while (idx < 4) {
            state.currentReward[idx++] = {
                label: 'No Spacial Deal',
                promoCode: '',
                validFor: '',
                id: '',
            };
        }
        return;
    }

    const mp = {};
    while (idx < 4) {
        const randomIdx = Math.floor(Math.random() * state.offers.length);

        if (!state.offers[randomIdx].isUnlocked && !mp[randomIdx]) {
            state.currentReward[idx++] = state.offers[randomIdx];
            mp[randomIdx] = true;
        }
    }
}

function formatRelativeDate(validFor) {
    if (!validFor) return 'Expires in 7d';

    const today = new Date();
    const currentDay = today.getDate();

    if (validFor < currentDay) {
        return 'expired';
    }
    const remainingDays = validFor - currentDay;
    if (remainingDays === 0) return 'Expires Today';
    return `Expires in ${remainingDays}d`;
}

export function spinWheel() {
    if (state.isSpinning) return;
    state.isSpinning = true;

    const randomIndex = Math.floor(Math.random() * state.currentReward.length);
    const selectedReward = state.currentReward[randomIndex];

    state.unlockedDeals.push(selectedReward);

    const targetAngles = [45, 315, 135, 225];
    const targetAngle = targetAngles[randomIndex];

    const randomOffset = Math.floor(Math.random() * 30) - 15;

    const fullTurns = 5 * 360;
    const currentRotationBase = Math.floor(state.totalRotation / 360) * 360;

    state.totalRotation =
        currentRotationBase + fullTurns + targetAngle + randomOffset;

    wheelEle.style.transition = 'transform 2s cubic-bezier(0.1, 0.8, 0.3, 1)';
    wheelEle.style.transform = `rotate(${state.totalRotation}deg)`;

    setTimeout(() => {
        if (greetEle.classList.contains(classLists.hideSpecialDeal)) {
            greetEle.classList.remove(classLists.hideSpecialDeal);
        }

        if (winOfferEle) {
            winOfferEle.innerHTML = `
                <div class="deals__offer">
                    <span class="deals__text deals__title"
                        >${selectedReward.label}</span
                    >
                    <span class="deals__text deals__validity"
                        > ${selectedReward.validFor}</span
                    >
                </div>
                <div>
                    <span class="deals__code">FLY20-ABCD</span>
                    <span data-name="copy-code" class="deals__code-copy"
                        ><i
                            data-name="copy-code"
                            class="fa-regular fa-copy"
                            style="color: rgb(0, 0, 0)"
                        ></i
                    ></span>
                </div>
      `;
        }

        state.isSpinning = false;
    }, 2000);
}

function renderWonReward() {
    unlockedDealsListEle.innerHTML = '';
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < state.unlockedDeals.length; i++) {
        const div = document.createElement('div');
        div.classList.add('deals');
        div.innerHTML = `
     
                        <div class="deals__offer">
                            <span class="deals__text deals__title"
                                >${state.unlockedDeals[i].label}</span
                            >
                            <span class="deals__text deals__validaty"
                                >${state.unlockedDeals[i].validFor}</span
                            >
                        </div>
                        <div>
                            <span class="deals__code">${state.unlockedDeals[i].promoCode}</span>
                            <span data-name="copy-code"
                                ><i
                                    class="fa-regular fa-copy"
                                    style="color: rgb(0, 0, 0)"
                                ></i
                            ></span>
                        </div>
                     
    `;

        fragment.appendChild(div);
    }

    unlockedDealsListEle.appendChild(fragment);
}
