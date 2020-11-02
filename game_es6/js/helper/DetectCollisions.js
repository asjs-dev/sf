import {areRectsCollided} from "../utility/utils.js";

export default (state, elements, callback) => {
  for (let i = 0, l = elements.length; i < l - 1; ++i) {
    let elementA = elements[i] ? elements[i].owner : null;

    if (elementA && elementA.isAbleToCollide) {
      for (let j = i + 1; j < l; ++j) {
        let elementB = elements[j] ? elements[j].owner : null;

        if (elementB && elementB.isAbleToCollide) {
          let boundsA = elementA.getBounds();
          let boundsB = elementB.getBounds();

          if (areRectsCollided(boundsA, boundsB) && callback(state, elementA, elementB, boundsA, boundsB)) return;
        }
      }
    }
  }
};
