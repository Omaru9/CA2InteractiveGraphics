let obj = {
    numOfMolecules: 50
    , numRows: 2
    , numCols: 2
    , showText: false
    , loopState: true
    , gridState: false
    , lineState: false
    , moleculeColor: [255, 0, 0]
    , intersectingColor: [0, 255, 0]
    , minMoleculeSize: 20
    , maxMoleculeSize: 20
    , infectRate: 0.5
    , percentageOfInfected: 0.3
};

var gui = new dat.gui.GUI();

gui.remember(obj);

section01 = gui.addFolder('Layout');
section01.add(obj, 'numOfMolecules').min(0).max(1000).step(1).onChange(function () {
    setup();
    draw();
});
section01.add(obj, 'numRows').min(1).max(20).step(1).onChange(function () {
    setup();
    draw();
});
section01.add(obj, 'numCols').min(1).max(20).step(1).onChange(function () {
    setup();
    draw();
});
section01.add(obj, 'showText').onChange(function () {
    draw()
});
section01.add(obj, 'loopState').onChange(function () {
    checkLoop()
});
section01.add(obj, 'gridState').onChange(function () {
    draw()
});
section01.add(obj, 'lineState').onChange(function () {
    draw()
});

section02 = gui.addFolder('Design');
section02.addColor(obj, 'moleculeColor').onChange(function () {
    draw()
});
section02.addColor(obj, 'intersectingColor').onChange(function () {
    draw()
});
section02.add(obj, 'minMoleculeSize').min(1).max(50).step(1).onChange(function () {
    setup();
    draw()
});
section02.add(obj, 'maxMoleculeSize').min(1).max(50).step(1).onChange(function () {
    setup();
    draw()
});

section03 = gui.addFolder('Rates');
section03.add(obj, 'infectRate').min(0).max(1).step(0.1).onChange(function () {
    setup();
    draw();
});
section03.add(obj, 'percentageOfInfected').min(0).max(1).step(0.1).onChange(function () {
    setup();
    draw();
});
