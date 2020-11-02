SF.Config = deepFreeze({
  defaultState : {
    view      : "splash",
    preview   : null,
    levelId   : "menu",
    time      : Date.now(),
    timeScale : 1,
    player    : {
      targetPosition : {
        x : 200,
        y : 280
      }
    },
    status : {
      kills   : 0,
      rockets : 20,
    },
    control : {
      latestShot : 0,
      shotTime   : 0
    },
    latestEnemyTime : Date.now()
  },

  bgColorChangingSpeed : 0.01,
  speed                : 5,
  breakingSpeed        : 5,
  maxRockets           : 20,
  landingPage          : "//www.google.com/",

  size : {
    width: 800,
    height: 600
  },

  keys : {
    up    : 87,
    left  : 65,
    right : 68,
    down  : 83
  },

  gameArea : {
    x      : 50,
    y      : 50,
    width  : 730,
    height : 520
  },

  bulletTime : {
    speed        : 0.1,
    deceleration : 0.99,
  },

  player : {
    speed        : 5,
    deceleration : 0.05,
    shotDelay    : 250,
  },

  extension : {
    speed  : 2.5,
    chance : 500,
    ammo   : {
      minValue : 1,
      maxValue : 10,
    }
  },

  explosion : {
    minSpeed : 1,
    maxSpeed : 5,
  },

  level : {
    element: {
      chance : 7,
      speed  : 10
    }
  },

  enemy : {
    delay    : 2000,
    minSpeed : 3,
    maxSpeed : 7,
    meteor   : {
      chance      : 10,
      maxRotation : 0.25,
      minScale    : 0.5,
      maxScale    : 2.5
    }
  }
});
