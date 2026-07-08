import {
    backdropEle,
    specialDealsEle,
    wheelEle,
    dealButtonEle,
    dealsEle,
    rewardsSectionEle,
    winOfferEle,
    spinButtonEle,
    greetEle,
    unlockedDealsListEle,
    dealContainerButtonEle,
} from '../data/domElements.js';

/**
 * @type {Object<string, string>}
 * @property {string} TOGGLE_SPECIAL_DEAL - Toggles the visibility of the special deal.
 * @property {string} SPIN_WHEEL - Triggers the fortune wheel rotation logic.
 * @property {string} SHOW_UNLOCKED_DEALS - Opens the page displaying unlocked deals.
 * @property {string} SHOW_DEALS - Opens the main Unlocked Deals directory page.
 * @property {string} COPY_CODE - Copies the promotional code from the target element.
 */
const actionTypes = {
    TOGGLE_SPECIAL_DEAL: 'close',
    SPIN_WHEEL: 'spin-wheel',
    SHOW_UNLOCKED_DEALS: 'unlocked-deals',
    SHOW_DEALS: 'deals',
    COPY_CODE: 'copy-code',
};

// class name which used for toggle in HTML elements
const classLists = {
    hideSpecialDeal: 'special-deals--hidden',
    slideDown: 'special-deals__slide-down',
    hideUnlockedDeals: 'unlocked-deals--hidden',
};

// global state for manage all the ui and logics (state -> ui).
let state = {
    isSpinning: false,
    totalRotation: 0,
    currentReward: [],
    unlockedDeals: [],
    lastWonIdx: null,
};

// url for fetching special deals rewards.
const OFFER_URL =
    'https://gist.githubusercontent.com/ameer-wajid-ali/1f29ebee4295cede36f8d74b45e576df/raw/122966c9a123861249f173911d8d93a76dc06d7a/';

// ==============================================================
//                            controller
// ==============================================================

/**
 * Global click event delegator that intercepts actions based on an element's data attribute.
 * It reads the `data-name` property from the clicked element and routes it to the matching handler.
 *
 * @param {MouseEvent} e - The native DOM click event.
 * @param {HTMLElement} e.target - The DOM element that triggered the click event.
 * @param {DOMStringMap} e.target.dataset - The custom data attributes attached to the target element.
 * @param {string} [e.target.dataset.name] - The specific action type mapping to `actionTypes`.
 * @returns {void}
 */
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
            handleCopyCode(e.target);
            return;
        default:
            break;
    }
}

// ==============================================================
//                            render
// ==============================================================
/**
 * Toggles the Display none property of the special deals UI component and its backdrop.
 * If closed, it opens immediately; if open, it applies a slide-down animation before hiding the elements.
 *
 * @global {HTMLElement} backdropEle - The overlay backdrop DOM element.
 * @global {HTMLElement} specialDealsEle - The container DOM element for special deals.
 * @global {Object} classLists - Global object containing UI CSS class names.
 * @returns {void} This function mutates DOM classes and does not return a value.
 */
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

/**
 * Switches the active UI view between the current active deals page and the unlocked rewards list.
 * Updates the navigation button label, updates the total reward count badge, and toggles necessary visibility classes.
 *
 * @param {string} actionName - The string identifier matching an `actionTypes` value to determine the view target.
 * @global {HTMLElement} dealButtonEle - The main action toggle button DOM element.
 * @global {HTMLElement} dealsEle - The main deals view container DOM element.
 * @global {HTMLElement} unlockedDealsEle - The unlocked history view container DOM element.
 * @global {Object} state - The global application state containing user reward history.
 * @global {Object} classLists - Global object containing UI CSS class names.
 * @returns {void} This function updates the DOM layout directly and does not return a value.
 */

function toggleDealsPage(actionName) {
    if (actionName === actionTypes.SHOW_DEALS) {
        dealButtonEle.innerHTML = ` View All Unlocked Deals
                    <span class="special-deals__badge">${state.unlockedDeals.length}</span> `;

        dealButtonEle.dataset.name = actionTypes.SHOW_UNLOCKED_DEALS;
    } else {
        renderWonReward();
        dealButtonEle.innerHTML = 'Go Back';
        dealButtonEle.dataset.name = actionTypes.SHOW_DEALS;
    }

    dealsEle.classList.toggle(classLists.hideSpecialDeal);
    rewardsSectionEle.classList.toggle(classLists.hideUnlockedDeals);
}

/**
 * Initialises and displays the deals wheel interface once assets are loaded.
 * Removes the loading state, reveals the spin button, populates the unlocked deals badge counter, and render the wheel.
 *
 * @global {HTMLElement} wheelEle - The main wheel component DOM element.
 * @global {HTMLElement} spinButtonEle - The button DOM element used to initiate the wheel spin.
 * @global {HTMLElement} dealButtonEle - The navigation button DOM element displaying the unlocked rewards count.
 * @global {Object} state - The global application state containing user data.
 * @global {Object} classLists - Global object containing UI CSS class names.
 * @returns {void} This function manipulates DOM states and does not return a value.
 */

function renderDealsWheel() {
    wheelEle.classList.remove('wheel__loading');
    wheelEle.classList.add('wheel__loaded');
    spinButtonEle.classList.remove(classLists.hideSpecialDeal);
    dealContainerButtonEle.classList.remove(classLists.hideSpecialDeal);
    dealButtonEle.innerHTML = `View All Unlocked Deals
                          <span class="special-deals__badge">${state.unlockedDeals.length}</span> `;
    renderWheel();
}

/**
 * Renders the structural HTML list items for the four main directional segments of the wheel.
 * Dynamically injects reward text labels from the global state array into the top, right, bottom, and left slots.
 *
 * @global {HTMLElement} wheelEle - The main container DOM element representing the physical wheel.
 * @global {Object} state - The global application state containing the active rewards metadata.
 * @global {Object[]} state.currentReward - The array of rewards currently mapped to the wheel layout.
 * @global {string} state.currentReward[].label - The display name string for an individual prize item.
 * @returns {void} This function modifies inner HTML directly and does not return a value.
 */

function renderWheel() {
    wheelEle.innerHTML = `<li class="wheel__item wheel__item--top">
                            <div class="reward-text__top">
                                <span class="reward-text__title">${escapeHTML(state.currentReward[0].label)}</span>
                            </div>
                        </li>
                        <li class="wheel__item wheel__item--right">
                            <div class="reward-text reward-text__right">
                                <span class="text__title">${escapeHTML(state.currentReward[1].label)}</span>
                            </div>
                        </li>
                        <li class="wheel__item wheel__item--bottom">
                            <div class="reward-text reward-text__bottom">
                                <span class="reward-text__title">${escapeHTML(state.currentReward[2].label)}</span>
                            </div>
                        </li>
                        <li class="wheel__item wheel__item--left">
                            <div class="reward-text reward-text__left">
                                <span class="reward-text__title">${escapeHTML(state.currentReward[3].label)}</span>
                            </div>
                        </li>`;
}

/**
 * Updates the user interface with the details of the won reward after a fixed delay.
 * Reveals the greeting card, refreshes the unlocked deals counter, updates the win message layout with the promo code details, and unlocks the wheel state.
 *
 * @param {Object} selectedReward - The configuration object representing the prize won by the user.
 * @param {number|string} [selectedReward.id] - The unique identifier of the reward, used to check if a valid prize was won.
 * @param {string} selectedReward.label - The title text or description of the offer.
 * @param {string} selectedReward.validFor - The expiration timeframe or validity string.
 * @param {string} selectedReward.promoCode - The alphanumeric voucher string to be copied by the user.
 * @global {HTMLElement} greetEle - The greeting element container that congratulates the user.
 * @global {HTMLElement} dealButtonEle - The main toggle button element displaying total active rewards.
 * @global {HTMLElement|null} winOfferEle - The presentation container displaying winning codes or loss text.
 * @global {Object} state - The global application state tracking animation and reward status.
 * @global {boolean} state.isSpinning - Flag indicating if the wheel is currently animating.
 * @global {Object} classLists - Global object containing UI CSS class names.
 * @returns {void} This function runs an asynchronous timeout to modify the DOM and state properties.
 */

function updateWinEle(selectedReward) {
    setTimeout(() => {
        if (greetEle.classList.contains(classLists.hideSpecialDeal)) {
            greetEle.classList.remove(classLists.hideSpecialDeal);
        }

        dealButtonEle.innerHTML = `View All Unlocked Deals
                          <span class="special-deals__badge">${state.unlockedDeals.length}</span> `;

        if (winOfferEle) {
            if (selectedReward.id) {
                winOfferEle.innerHTML = `
                <div class="deals__offer">
                    <span class="deals__text deals__title"
                        >${selectedReward.label}</span
                    >
                    <span class="deals__text deals__validity"
                        > Expire in ${selectedReward.validFor}d</span
                    >
                </div>
                <div>
                    <span class="deals__code">${selectedReward.promoCode}</span>
                    <span data-name="copy-code" class="deals__code-copy"
                        ><i
                            data-name="copy-code"
                            class="fa-regular fa-copy" 
                        ></i
                    ></span>
                </div>
                `;
            } else {
                winOfferEle.innerText = 'Better Luck Next Time.';
            }
        }

        state.isSpinning = false;
    }, 2000);
}

/**
 * Renders the full list of rewards accumulated by the user into the unlocked deals panel.
 * Clears existing entries, displays a empty state fallback message if no rewards exist, and efficiently appends styled reward nodes using a DOM DocumentFragment.
 *
 * @global {HTMLElement} unlockedDealsListEle - The target list container element where unlocked rewards are injected.
 * @global {Object} state - The global application state object.
 * @global {Object[]} state.unlockedDeals - Collection of all rewards unlocked by the user during their session.
 * @global {string} state.unlockedDeals[].label - The title or description text of the reward offer.
 * @global {string} state.unlockedDeals[].validFor - The expiration status or timeframe string (e.g., 'expired').
 * @global {string} state.unlockedDeals[].promoCode - The unique discount code string assigned to the reward.
 * @returns {void} This function modifies the active DOM structure and does not return a value.
 */

function renderWonReward() {
    unlockedDealsListEle.innerHTML = '';

    if (state.unlockedDeals.length === 0) {
        unlockedDealsListEle.innerHTML = "you don't have any unlocked reward ";
        return;
    }

    const fragment = document.createDocumentFragment();

    for (let i = 0; i < state.unlockedDeals.length; i++) {
        const style =
            state.unlockedDeals[i].validFor === 'expired'
                ? 'deals--disable'
                : '';

        const div = document.createElement('div');
        div.classList.add('deals');
        div.innerHTML = `
     
                        <div class="deals__offer ${style}">
                            <span class="deals__text deals__title"
                                >${escapeHTML(state.unlockedDeals[i].label)}</span
                            >
                            <span class="deals__text deals__validity"
                                >expire in ${checkDaysLeft(state.unlockedDeals[i].expiresAt)}d</span
                            >
                        </div>
                        <div class="${style}" >
                            <span class="deals__code">${escapeHTML(state.unlockedDeals[i].promoCode)}</span>
                            <span data-name="copy-code"
                                ><i data-name="copy-code"
                                    class="fa-regular fa-copy"
                                ></i
                            ></span>
                        </div>
                     
    `;
        fragment.appendChild(div);
    }

    unlockedDealsListEle.appendChild(fragment);
}

// ====================================================================
//                              utils
// =====================================================================

/**
 * Asynchronously extracts a promo code string from the DOM and copies it directly to the user's system clipboard.
 * Dispatches a success toast message upon completion or displays a timed error notification if the clipboard API access fails.
 *
 * @async
 * @param {HTMLElement} ele - The source DOM element that triggered the copy action (typically the copy button icon or wrapper).
 * @global {function(string, [number]): void} showMessage - Global helper function that displays transient feedback notifications to the user.
 * @returns {Promise<void>} Resolves when the async code extraction and clipboard write operations are complete.
 */
async function handleCopyCode(ele) {
    const code = ele.closest('div').querySelector('.deals__code').innerText;
    navigator.clipboard.writeText(code).then(() => {
        showMessage('copied');
    });
}

/**
 * Displays a temporary status notification message or alert toast to the user.
 * Unhides the alert component, injects the text message, and automatically dismisses the element after a brief interval.
 *
 * @param {string} message - The status message text or error content to display in the alert container.
 * @param {number|*} [timeOut] - Optional timeout duration in milliseconds (defaults to 1500 if missing or invalid).
 * @global {HTMLElement} alertEle - The DOM container element responsible for holding and displaying alert text.
 * @global {Object} classLists - Global object containing UI CSS class names.
 * @returns {void} This function utilizes an asynchronous timer to change DOM classes and does not return a value.
 */
function showMessage(message) {
    alert(message);
}

/**
 * Populates the current wheel layout slots with four distinct, valid reward options from the available offers list.
 * Fallbacks to filling remaining empty positions with a dummy fallback object if insufficient valid deals are found.
 * Otherwise, randomly pools un-unlocked offers ensuring no duplicate indices are picked during the active wheel generation.
 *
 * @global {Object} state - The global application state tracking tracking game inventories and rules.
 * @global {Object[]} state.offers - Array containing the absolute registry of all possible promotion deals.
 * @global {Object[]} state.unlockedDeals - Array containing the history of rewards already claimed by the user.
 * @global {Object[]} state.currentReward - Array allocated to exactly four mapped elements displayed on the wheel visual.
 * @global {function(Object): boolean} canAdd - Global validation rule utility evaluating if an offer configuration is eligible to sit on the wheel.
 * @returns {void} This function performs iterative collection picking and mutates the global state tracking reference directly.
 */
function getCurrentReward() {
    let idx = 0;

    if (state.offers.length - state.unlockedDeals.length <= 4) {
        for (let i = 0; i < state.offers.length && idx < 4; i++) {
            if (canAdd(state.offers[i])) {
                state.currentReward[idx++] = state.offers[i];
            }
        }
        while (idx < 4) {
            state.currentReward[idx++] = {
                label: 'No Special Deal',
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

        if (canAdd(state.offers[randomIdx]) && !mp[randomIdx]) {
            state.currentReward[idx++] = state.offers[randomIdx];
            mp[randomIdx] = true;
        }
    }
}

function checkDaysLeft(expiresAtString) {
    const today = new Date();
    const expireDate = new Date(expiresAtString);

    today.setHours(0, 0, 0, 0);
    expireDate.setHours(0, 0, 0, 0);

    const diffTime = expireDate - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function markWonReward(reward) {
    const today = new Date();
    today.setDate(today.getDate() + reward.validFor);
    reward.expiresAt = today.toISOString().split('T')[0];
    return reward;
}

function escapeHTML(str) {
    if (!str) return '';
    return str.replace(
        /[&<>'"]/g,
        (tag) =>
            ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;',
            })[tag] || tag,
    );
}

// ==============================================================
//                          offer service
// ==============================================================

/**
 * Asynchronously requests external rewards from the server API endpoint and handles the initialization lifecycle workflows.
 * If successful, assigns structural primary IDs, populates active wheel slot options, and triggers visual layout updates.
 * Catches all network errors or bad responses and dispatches targeted error notification messages instead.
 *
 * @async
 * @global {string} OFFER_URL - The source API web address endpoint requested to retrieve the promotional offers payload data.
 * @global {function(Object[]): void} storeOfferWithId - Utility function that appends unique identifier keys to fetched items.
 * @global {function(): void} getCurrentReward - Engine function that populates active prize slots randomly into state.
 * @global {function(): void} renderDealsWheel - View workflow layout function that cleans loaders and initializes the wheel UI.
 * @global {function(string, [number]): void} showMessage - Notification helper used to render fallback toast alert banners.
 * @returns {Promise<void>} Resolves when all structural dataset fetching and UI presentation rendering functions execute completely.
 */
export async function fetchOffer() {
    try {
        const res = await fetch(OFFER_URL);

        if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
        }

        const offers = await res.json();
        storeOfferWithId(offers);
        getCurrentReward();
        renderDealsWheel();
    } catch (e) {
        console.log(e);

        alert('some thing went wrong please try again letter.');
        toggleDealsPage();
    }
}

/**
 * Normalises and hydrates the incoming array of raw promotion items before saving them into the global application store.
 * Maps over each item to inject a unique tracking ID, an initial locked status flag, and a formatted relative validity string.
 *
 * @param {Object[]} offers - The array of raw offer configurations retrieved from the API response payload.
 * @param {number|string} offers[].validFor - The raw expiration day number parameter passed into the date formatter.
 * @global {Object} state - The global application state tracking tracking game inventories and rules.
 * @global {Object[]} state.offers - Array reference that gets overwritten with the newly structured and tracked promotional items.
 * @global {function(number|string): string} formatRelativeDate - Helper utility that converts numerical expiration targets into text descriptors.
 * @returns {void} This function performs sequential dataset property modifications and mutates the global store directly.
 */

function storeOfferWithId(offers) {
    state.offers = offers.map((offer) => ({
        ...offer,
        id: crypto.randomUUID(),
        isUnlocked: false,
        validFor: offer.validFor || 7,
    }));
}

// ===========================================================================
//                                 Logics
// ===========================================================================

/**
 * Spins the wheel, selects a random reward, and runs the spin animation.
 *
 * @global {Object} state - The global app state tracker.
 * @global {boolean} state.isSpinning - Guard to stop clicking while the wheel is spinning.
 * @global {Object[]} state.currentReward - The 4 items currently on the wheel slots.
 * @global {HTMLElement} wheelEle - The wheel DOM element that gets rotated via CSS.
 * @returns {void}
 */

function spinWheel() {
    if (state.isSpinning) return;
    state.isSpinning = true;

    if (state.lastWonIdx !== null) {
        addNewDeal(state.lastWonIdx);
    }

    const randomIndex = Math.floor(Math.random() * state.currentReward.length);
    const selectedReward = markWonReward(state.currentReward[randomIndex]);
    // updating state
    state.currentReward[randomIndex].isUnlocked = true;
    state.lastWonIdx = randomIndex;

    if (selectedReward.id) {
        state.unlockedDeals.push(selectedReward);
    }

    const targetAngles = [45, 315, 135, 225];
    const targetAngle = targetAngles[randomIndex];

    const randomOffset = Math.floor(Math.random() * 30) - 15;

    const fullTurns = 5 * 360;
    const currentRotationBase = Math.floor(state.totalRotation / 360) * 360;

    state.totalRotation =
        currentRotationBase + fullTurns + targetAngle + randomOffset;

    wheelEle.style.transition = 'transform 2s cubic-bezier(0.1, 0.8, 0.3, 1)';
    wheelEle.style.transform = `rotate(${state.totalRotation}deg)`;

    updateWinEle(selectedReward);
}

/**
 * Replaces a specific slot on the wheel with a new random valid reward.
 * If no valid deals are found, it fills the slot with a fallback "No Special Deal" placeholder.
 *
 * @param {number} idx - The index position (0 to 3) on the wheel to be replaced.
 * @global {Object} state - The global app state tracker.
 * @global {Object[]} state.offers - All available deals fetched from the database.
 * @global {Object[]} state.currentReward - The 4 items currently mapped to the wheel.
 * @global {function} renderWheel - Re-renders the wheel's HTML layout with updated labels.
 * @returns {void}
 */

function addNewDeal(idx) {
    let flag = false;

    for (let i = 0; i < state.offers.length; i++) {
        if (canAdd(state.offers[idx])) {
            state.currentReward[idx] = state.offers[idx];
            flag = true;
            break;
        }
    }

    if (!flag) {
        state.currentReward[idx] = {
            label: 'No Spacial Deal',
            promoCode: '',
            validFor: '',
            id: '',
        };
    }

    renderWheel();
}

/**
 * Checks if a reward can be added to the wheel.
 * Filters out items already on the wheel, unlocked, or expired.
 *
 * @param {Object} current - The offer to validate.
 * @global {Object} state - The global app state.
 * @returns {boolean} True if valid, false if blocked.
 */
function canAdd(current) {
    for (const reward of state.currentReward) {
        if (!current.validFor) return false;
        if (reward.id === current.id) return false;
    }
    if (current.isUnlocked) return false;
    return true;
}
