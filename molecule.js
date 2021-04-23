class Molecule {
//constructor holds all the default values of the molecule class
//this constructor and the values is carried on to the subclasses and must be referenced from them.
  constructor({
  _i,
  px = random(0, width),
  py = random(0, height),
  vx = random(-2.5, 2.5),
  vy = random(-2.5, 2.5)
}) {
    this.position = createVector(px,py);
    this.velocity = createVector(vx,vy);
    this.radius = random(obj.minMoleculeSize, obj.maxMoleculeSize);

    this.fillColor = color(0,0,255);
    this.intersectingColor = color(0,0,100);
    this.color = this.fillColor;

    this.index = _i;

    this.personAge = Math.ceil(random(1, 80));

  }

//displays the balls on the canvas
  render() {
    noStroke()
    fill(this.color);
    ellipse(this.position.x, this.position.y, this.radius * 2, this.radius * 2);
    fill(0);
    (obj.showText) ? (
      textSize(16),
      textAlign(CENTER),
      text(this.index,this.position.x,this.position.y +6),
      strokeWeight(100),
      text(this.personAge,this.position.x,this.position.y - 20)
      ):null;
  }


//checks if two molecules are intersecting with each other and measures the distance between them
//It takes a molecule as a parameter.
//the molecule parameter is given from the checkIntersections function in the sketch
//if the gap between the two molecules is less than or equal to 0, it means they are overlapping and check is returned as true
  isIntersecting(_molecule) {
    let distance = dist(this.position.x, this.position.y, _molecule.position.x, _molecule.position.y)
    let gap = distance - this.radius - _molecule.radius;
    let check = (gap <= 0) ? true : false;

    if (check) {

        this.dock(_molecule);

        let dx = this.position.x - _molecule.position.x;
        let dy = this.position.y - _molecule.position.y;
        //let distance = Math.sqrt(dx * dx + dy * dy);

        let normalX = dx / distance;
        let normalY = dy / distance;

        let dVector = (this.velocity.x - _molecule.velocity.x) * normalX;
        dVector += (this.velocity.y - _molecule.velocity.y) * normalY;

        let dvx = dVector * normalX;
        let dvy = dVector * normalY;

        dvx = constrain(dvx, -2, 2);
        dvy = constrain(dvy, -2, 2);

        this.velocity.x -= dvx;
        this.velocity.y -= dvy;

        _molecule.velocity.x += dvx;
        _molecule.velocity.y += dvy;

      }

    return check;
  }



  dock(_otherMolecule) {

        // This is where we want to dock it to
        let fixedBall = molecules[_otherMolecule.index];

        //this vector creates a new vector called resultantV
        //a resultant vector is done by taking away two vectors from each other
        let resultantV = p5.Vector.sub(this.position, fixedBall.position);

        //gets the vector heading
        let rHeading = resultantV.heading();
        //gets the length
        let rDist = (resultantV.mag() - this.radius - fixedBall.radius);

        // Here we thake away the calculated distance from the current position
        let moveX = cos(rHeading) * rDist;
        let moveY = sin(rHeading) * rDist;

        this.position.x -= moveX;
        this.position.y -= moveY;

        molecules[_otherMolecule.index].position.x += moveX;
        molecules[_otherMolecule.index].position.y += moveY;

      }


  changeColor(){
    this.color = this.intersectingColor;
  }

  reset(){
    this.color = this.fillColor;
  }

  step() {

    (this.position.x > width - this.radius*2 || this.position.x < 0 + this.radius*2) ?
    this.velocity.x *= -1: null;

    (this.position.y > height - this.radius*2 - graphHeight|| this.position.y < 0 + this.radius*2) ?
    this.velocity.y *= -1: null;

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}
