import { travelPointData } from '../data/travelItem.js';

const travelPointEle = document.querySelectorAll('.stat-card');

export function showTravelPointData() {
    travelPointEle.forEach((ele, idx) => {
        ele.children[0].innerText = travelPointData.state[idx].number;
        ele.children[1].innerText = travelPointData.state[idx].label;
    });
}
