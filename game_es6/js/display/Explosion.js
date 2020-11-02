import {between, getAnimatedColor, easeInOut} from "../utility/utils.js";
import Config from "../Config.js";
import TextureAtlas from "../helper/TextureAtlas.js";
import AbstractRenderable from "./AbstractRenderable.js";

export default class Explosion extends AbstractRenderable {
  constructor(baseTexture) {
    super(baseTexture, PIXI.ParticleContainer);

    this._SPEED         = Config.speed;
    this._MAX_PARTICLES = 10;
    this._COLORS        = {
      from : {
        r : 255,
        g : 64,
        b : 32
      },
      to : {
        r : 105,
        g : 105,
        b : 105
      }
    };

    this._container.setProperties({
      rotation : true,
      scale    : true,
      tint     : true
    });
    this._container.scale.set(0.5);

    const texture = TextureAtlas.getTexture(this._baseTexture, "Explosion");
    for (let i = 0, l = this._MAX_PARTICLES; i < l; ++i)
      this._container.addChild(new PIXI.Sprite(texture));
  }

  reset(state, x, y) {
    super.reset();

    this._container.alpha = 1;
    this._container.x     = x;
    this._container.y     = y;

    const explosionConfig = Config.explosion;

    for (let i = 0, l = this._container.children.length; i < l; ++i) {
      let particle                 = this._container.children[i];
          particle.rotation        = Math.random() * 360;
          particle._ROTATION_SPEED = (Math.random() - 0.5) * 0.05;
          particle._SPEED          = between(
            explosionConfig.minSpeed,
            explosionConfig.maxSpeed,
            Math.random() * explosionConfig.maxSpeed
          );
          particle._step = 0;
          particle.scale.set(Math.random() * 0.25);

          particle.position.set(0);
          particle.alpha = 1;
    }
  }

  update(state) {
    const {timeScale} = state;

    for (let i = 0, l = this._container.children.length; i < l; ++i) {
      let particle = this._container.children[i];
          particle.scale.set(particle.scale.x + 0.05 * timeScale);
          particle.rotation += particle._ROTATION_SPEED * timeScale;

      const speed = particle._SPEED * timeScale;
      particle.x += Math.sin(particle.rotation) * speed;
      particle.y += Math.cos(particle.rotation) * speed;

      particle._step += (0.005 + particle._SPEED * 0.001) * timeScale;
      particle.tint = getAnimatedColor(this._COLORS.from, this._COLORS.to, easeInOut(particle._step));
    }

    this._container.alpha -= Math.random() * 0.01 * timeScale;
    this._container.x     -= this._SPEED * timeScale;

    if (this._container.alpha < 0) this.removable = true;
  }

  _customDestruct() {
    this._container.removeChild(this._body);
  }
};
