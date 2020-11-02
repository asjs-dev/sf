SF.DetectCollisions = function(state, elements, callback) {
  var elementA;
  var elementB;

  var boundsA;
  var boundsB;

  for (var i = 0, l = elements.length; i < l - 1; ++i) {
    elementA = elements[i] ? elements[i].owner : null;

    if (elementA && elementA.isAbleToCollide) {
      for (var j = i + 1; j < l; ++j) {
        elementB = elements[j] ? elements[j].owner : null;

        if (elementB && elementB.isAbleToCollide) {
          boundsA = elementA.getBounds();
          boundsB = elementB.getBounds();

          if (areRectsCollided(boundsA, boundsB) && callback(state, elementA, elementB, boundsA, boundsB)) return;
        }
      }
    }
  }
};
