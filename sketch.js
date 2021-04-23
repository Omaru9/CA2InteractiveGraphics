//Febuary 22nd 2021 Figures
//Confirmed cases: 215,743
//Number of dead: 4,137
//4137 divided by 12 (number of months since covid) = 344.75 //monthly death average
//344.75 divided 7 (weekly days) = 49.25 //weekly death average
//50(number of molecules) divided by 49.25 = 0.985 //(rounded it to 0.1 in code)

//211,606 divided by 12 (number of months since covid) = 17,633 // monthly recovered average
//17,633 divided by 7 (weekly days) = 2,519 //weekly recovered average
// 50(number of molecules) divided by 2519 = 50.38

//Number of Recovered: 211,606
//Overall goal was to display a week in Febuary 2021 simulation. 

let molecules = [];
let grid = [];
let colWidth, rowHeight;


let graphHeight = 150;
let graphArray = [];
let numHealthy;
let numInfected;
let numRecovered;
let numDead;
//let day = 24;

let oneWeek = 250;

function setup() {
  createCanvas(1000, 1000);
  colWidth = width / obj.numCols;
  rowHeight = height / obj.numRows;
  molecules = [];

  //pushes molcules and their indexes values into the molecules array
  for (let i = 0; i < obj.numOfMolecules; i++) {

    let randomNum = random();
    if (randomNum < obj.percentageOfInfected) {
      molecules.push(new Infected({
        _i: i
      }));
    } else {
      molecules.push(new Healthy({
        _i: i
      }));
    }

  }


  gridify();
  checkLoop();
}

function draw() {

  background(200);

  molecules.forEach((molecule) => {
    molecule.reset();
  });

  //calls recovered
  recoveringInfectedDead();

  splitObjectIntoGrid();

  obj.gridState ? drawGrid() : null;

  molecules.forEach((molecule) => {
    molecule.render();
    molecule.step();
  });

  //displays graph
  drawGraph();



}


//this function checks if molecules in a grid space is intersecting using a nested loop iterating through the elements of the moleculeCollection array.
//this function is called in each iteration of the splitObjectIntoGrid() function loop and takes in the moleculeCollection array as the parameter.
//moleculeCollection is an array that contains the molecule objects in a grid square. So checkIntersections() runs for each grid square.
function checkIntersections(_collection) {
  //console.time();
  for (let a = 0; a < _collection.length; a++) {
    for (let b = a + 1; b < _collection.length; b++) {
      let moleculeA = molecules[_collection[a]];
      let moleculeB = molecules[_collection[b]];
      if (obj.lineState) {
        stroke(125, 100);
        line(moleculeA.position.x, moleculeA.position.y, moleculeB.position.x, moleculeB.position.y);
        //draws a line between the molecules if lineState is set to true in the config
      };


      //when a moleculte touches off another, isIntersecting is called from the molecule class
      //within that, moleculeA and moleculeB checks if each is infected or healthy (and vice versa)
      //if the molecule is infected and the infectRate is above a random number (to simulate chance) and it collides with a healthy molecule, a new infected molecule is created using the same values as the healthy molecule.
      //this is stored within a temporary object that is added into the array.
      if (moleculeA.isIntersecting(moleculeB)) {

        if (moleculeA.constructor.name == "Infected" && moleculeB.constructor.name == "Healthy") {
          let randomNum = random();

          if (randomNum < obj.infectRate) {
            let tempObj = new Infected({
              _i: moleculeB.index,
              px: moleculeB.position.x,
              py: moleculeB.position.y,
              vx: moleculeB.velocity.x,
              vy: moleculeB.velocity.y
            });
            console.log(tempObj);

            molecules[moleculeB.index] = tempObj;
          }

        } else if (moleculeB.constructor.name == "Infected" && moleculeA.constructor.name == "Healthy") {
          let randomNum = random();

          if (randomNum < obj.infectRate) {
            let tempObj = new Infected({
              _i: moleculeA.index,
              px: moleculeA.position.x,
              py: moleculeA.position.y,
              vx: moleculeA.velocity.x,
              vy: moleculeA.velocity.y
            });
            console.log(tempObj);

            molecules[moleculeA.index] = tempObj;
          }
        }
      }
    }

  }
}




//called from the setup
//this function creates an array out of the molecule objects in a grid square using a nested loop iterating columns(i) within rows(j).
//colWidth and rowWidth are calculated in the setup().
//each iteration of the nested loop goes through each grid square, filters the molecules in the square, and maps those molecules indexes into a moleculeCollection array.
//then calls the checkIntersections function with the newly made array passed as the parameter.
function splitObjectIntoGrid() {

  //checkNum = 0;

  //console.time();

  for (let j = 0; j < obj.numRows; j++) {
    for (let i = 0; i < obj.numCols; i++) {

      //filters the molecules in the same grid space and maps their index into the moleculeCollection array
      let moleculeCollection = molecules.filter(molecule =>
        molecule.position.x > (i * colWidth) &&
        molecule.position.x < ((i + 1) * colWidth) &&
        molecule.position.y > j * rowHeight &&
        molecule.position.y < (j + 1) * rowHeight
      ).map(molecule => molecule.index);



      checkIntersections(moleculeCollection);
      //passes the moleculeCollection array into the checkIntersections function.
    }
  }
  //console.timeEnd();
}

//called from the setup function
//gridify function spaces the molecule objects evenly on the canvas
//numDivisions ceils the squared number of molecules set in the config.
//colPos returns the modulus of index and numDivisions
//rowPos floors the product of index divided by numDivisions
//the spacing variable is multiplied on for added spacing.
//each iteration of the foreach loop, moves the molecule x and y positions to a grid cell in relation to its index.
function gridify() {

  let numDivision = ceil(Math.sqrt(obj.numOfMolecules));
  let spacing = (width - graphHeight) / numDivision;

  molecules.forEach((molecule, index) => {

    let colPos = (index % numDivision) * spacing;
    let rowPos = floor(index / numDivision) * spacing;
    //console.log(`The col pos ${colPos} and the row pos ${rowPos}`);
    molecule.position.x = colPos + (obj.maxMoleculeSize) * 2;
    molecule.position.y = rowPos + (obj.minMoleculeSize) * 2;

  });

}

// The function drawGrid draws a grid using a nested loop iterating columns(i)
// within rows(j). colWidth and rowWidth are calculated in the setup(). The style
// of grid is defined by fill, stroke and strokeWeight. There
// are no parameters required to fulfil the function and no returns
function drawGrid() {
  noFill();
  stroke(155, 155, 155, 50);
  strokeWeight(1);

  for (let j = 0; j < obj.numRows; j++) {
    for (let i = 0; i < obj.numCols; i++) {
      //
      rect(i * colWidth, j * rowHeight, colWidth, rowHeight)
    }
  }
}

function checkLoop() {
  if (obj.loopState) {
    loop();
  } else {
    noLoop();
  }
}

//called from draw()
//function that turns infected molecules to either recovered, dead or stay infected after a specific frame count
//the forEach loops iterates through the objects in the molecules array. If the molecule is infected and if the molecules lifetime variable is less than the frameCount
//it turns that molecule into either Recovered, Dead, or Infected by creating a new recovered/dead/infected molecule using its values.
//A temporary object is created holding the index, x position and y position, velocity x & y values to insert the recovered/dead/infected molecule into molecules array
function recoveringInfectedDead() {

  molecules.forEach((molecule) => {

    if (molecule.constructor.name == "Infected") {

      if (frameCount > molecule.lifetime + oneWeek) {

        console.log("week1");
        console.log(molecule.lifetime);
        console.log(frameCount);

        let randomNum = random();
        //recovery chance
        if (randomNum > 0.5) {
          let tempObj = new Recovered({
            _i: molecule.index,
            px: molecule.position.x,
            py: molecule.position.y,
            vx: molecule.velocity.x,
            vy: molecule.velocity.y
          });

          //console.log(tempObj);
          //
          molecules[molecule.index] = tempObj;

        } else if (randomNum > 0.4) {
          let tempObj = new Infected({
            _i: molecule.index,
            px: molecule.position.x,
            py: molecule.position.y,
            vx: molecule.velocity.x,
            vy: molecule.velocity.y
          });

          molecules[molecule.index] = tempObj;
        } else if (randomNum < 0.1) {
          let tempObj = new Dead({
            _i: molecule.index,
            px: molecule.position.x,
            py: molecule.position.y,
            vx: molecule.velocity.x = 0,
            vy: molecule.velocity.y = 0
          });


          molecules[molecule.index] = tempObj;
        }

      }

      // else if (frameCount > molecule.lifetime + 200) {
      //
      //   console.log("week2");
      //   let randomNum = random();
      //   if (randomNum < 1) {
      //
      //     let tempObj = new Dead({
      //       _i: molecule.index,
      //       px: molecule.position.x,
      //       py: molecule.position.y,
      //       vx: molecule.velocity.x = 0,
      //       vy: molecule.velocity.y = 0
      //     });
      //
      //
      //     molecules[molecule.index] = tempObj;
      //   }
      // }

    }

  });
}

function drawGraph() {
  let numInfected = molecules.filter(molecule => molecule.constructor.name == "Infected")
  let numHealthy = molecules.filter(molecule => molecule.constructor.name == "Healthy")
  let numRecovered = molecules.filter(molecule => molecule.constructor.name == "Recovered")
  let numDead = molecules.filter(molecule => molecule.constructor.name == "Dead")

  iHeight = map(numInfected.length, 0, obj.numOfMolecules, 0, graphHeight);
  hHeight = map(numHealthy.length, 0, obj.numOfMolecules, 0, graphHeight);
  rHeight = map(numRecovered.length, 0, obj.numOfMolecules, 0, graphHeight);
  dHeight = map(numDead.length, 0, obj.numOfMolecules, 0, graphHeight);

  if (graphArray.length >= 400) {
    graphArray.shift();
  }

  //displays the text
  //rect(150,300,0,-1000);
  textAlign(RIGHT);
  textSize(20);
  text("Infected: " + numInfected.length + " / " + molecules.length, 1000, 850);
  text("Healthy: " + numHealthy.length + " / " + molecules.length, 1000, 900);
  text("Recovered: " + numRecovered.length + "  / " + molecules.length, 1000, 950);
  text("Dead: " + numDead.length + "  / " + molecules.length, 1000, 1000);


  graphArray.push({
    numInfected: numInfected.length,
    numHealthy: numHealthy.length,
    numRecovered: numRecovered.length,
    numDead: numDead.length,
    iHeight: iHeight,
    hHeight: hHeight,
    rHeight: rHeight,
    dHeight: dHeight
  })

  //console.log(graphArray);

  push();
  translate(0, 1000)
  graphArray.forEach(function(data, index) {
    noStroke();
    fill(255, 0, 0)
    rect(index, 0, 1, -data.iHeight) //infected graph
    fill(0, 255, 0);
    rect(index, -data.iHeight, 1, -data.hHeight) //healthy graph
    fill(149, 200, 255);
    rect(index, -data.hHeight + -data.iHeight, 1, -data.rHeight) //recovered graph
    fill(0, 0, 0);
    rect(index, -data.rHeight + -data.hHeight + -data.iHeight, 1, -data.dHeight) //dead graph
  })
  pop();
}
