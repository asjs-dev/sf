const TextureAtlas = {
  getTexture : (baseTexture, id) => {
    const texture       = new PIXI.Texture(baseTexture);
          texture.frame = TextureAtlas.TextureRects[id];
    return texture;
  },
  TextureRects : {
    HitTestHelper  : new PIXI.Rectangle(192, 320, 64, 64),
    Ammo           : new PIXI.Rectangle(64, 256, 64, 64),
    Sky            : new PIXI.Rectangle(512, 192, 64, 64),
    Field          : new PIXI.Rectangle(576, 192, 64, 64),
    MeteorA        : new PIXI.Rectangle(192, 256, 64, 64),
    MeteorB        : new PIXI.Rectangle(256, 256, 64, 64),
    EnemyCabin     : new PIXI.Rectangle(0, 192, 64, 64),
    EnemyBodyA     : new PIXI.Rectangle(64, 128, 128, 64),
    EnemyBodyB     : new PIXI.Rectangle(192, 128, 128, 64),
    EnemyEngineA   : new PIXI.Rectangle(256, 192, 64, 64),
    EnemyEngineB   : new PIXI.Rectangle(0, 256, 64, 64),
    EnemyWingA     : new PIXI.Rectangle(64, 192, 64, 64),
    EnemyWingB     : new PIXI.Rectangle(128, 192, 128, 64),
    Explosion      : new PIXI.Rectangle(384, 256, 64, 64),
    Rocket         : new PIXI.Rectangle(0, 128, 64, 64),
    LightBeamBlueA : new PIXI.Rectangle(192, 0, 64, 64),
    LightBeamBlueB : new PIXI.Rectangle(192, 64, 64, 64),
    LightBeamRedA  : new PIXI.Rectangle(256, 0, 64, 64),
    LightBeamRedB  : new PIXI.Rectangle(256, 64, 64, 64),
    PlayerCabin    : new PIXI.Rectangle(128, 0, 64, 64),
    PlayerBody     : new PIXI.Rectangle(0, 0, 128, 64),
    PlayerEngine   : new PIXI.Rectangle(128, 64, 64, 64),
    PlayerWing     : new PIXI.Rectangle(0, 64, 64, 64),
    PlayerGun      : new PIXI.Rectangle(64, 64, 64, 64),
    Cloud          : new PIXI.Rectangle(320, 0, 320, 64),
    StarLine       : new PIXI.Rectangle(128, 320, 64, 64),
    PlanetA        : new PIXI.Rectangle(0, 832, 192, 192),
    PlanetB        : new PIXI.Rectangle(192, 768, 256, 256),
    PlanetC        : new PIXI.Rectangle(448, 768, 320, 256),
    PlanetD        : new PIXI.Rectangle(768, 768, 256, 256),
    Walker         : new PIXI.Rectangle(512, 64, 128, 128),
    TreeA          : new PIXI.Rectangle(640, 0, 128, 128),
    TreeB          : new PIXI.Rectangle(768, 0, 128, 128),
    TreeC          : new PIXI.Rectangle(896, 0, 64, 128),
  }
};

export default TextureAtlas;
