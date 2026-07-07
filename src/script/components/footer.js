const hideClass = 'nav-group--none';
let prevOpen = null;

/**
 * Toggles the visibility modifier class of a specific footer section.
 * @param {Event} e - The click event fired on the footer nav-group container
 */

export function toggleFooterLink(e) {
    const currentGroup = e.currentTarget;
    const currentList = currentGroup.querySelector('.nav-group__list');
    if (!currentList) return;

    const isAlreadyOpen = !currentList.classList.contains(hideClass);

    if (prevOpen && prevOpen !== currentGroup) {
        const prevList = prevOpen.querySelector('.nav-group__list');
        if (prevList) {
            rotateIcon(prevOpen, true);
            prevList.classList.add(hideClass);
        }
    }

    if (isAlreadyOpen) {
        currentList.classList.add(hideClass);
        rotateIcon(currentGroup, true);
        prevOpen = null;
    } else {
        currentList.classList.remove(hideClass);
        rotateIcon(currentGroup, false);
        prevOpen = currentGroup;
    }
}

function rotateIcon(ele, isRotate) {
    if (isRotate) {
        ele.querySelector('i').style.transform = 'rotate(0deg)';
    } else {
        ele.querySelector('i').style.transform = 'rotate(180deg)';
    }
}
