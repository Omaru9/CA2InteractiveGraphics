class Recovered extends Molecule {
  constructor({
    _i,
    px = random(0, width),
    py = random(0, height),
    vx = random(-2.5, 2.5),
    vy = random(-2.5, 2.5)
  }) {
    super({
      _i,
      px,
      py,
      vx,
      vy
    });

    this.fillColor = color(149, 200, 255);
    // this.intersectingColor = color(100, 0, 0);

    //this.age = frameCount
  }

}
