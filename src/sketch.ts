import * as p5 from 'p5'
import * as chroma from 'chroma.ts';

// import * as createLoop from '../node_modules/createloop/dist/createloop.js';
// import { createLoop } from '../node_modules/createloop/src/createLoop.js';
import { Graphics } from 'p5';
import { setupColorMachine } from './colors';
import { paletteNames, params } from './params';
import { Range, Point, Dims, Circle } from './models';
import { Sphere } from './sphere';
import { PulleySystem } from './pulley-system';

var sketch = function (p: p5) {
  var graphic: Graphics; 
  var pause = false;
  var sphereMachine: Sphere;
  var pulleySystem: PulleySystem;
  var colorMachine: any;
  var index: number = 0;
  var gif;
  var capture;
  var xOffset = -.25;
  var yOffset = -.25;
  var xOriginOffset = .5;
  var yOriginOffset = .5;
  p.setup = function () {
    setupGraphic();
    resetGraphic();
    colorMachine = setupColorMachine('Spectral')

    setupPulleySystem();

    // sphereMachine = new Sphere(graphic,setupColorMachine('Spectral'));
    // drawGeometry();
    // drawGrid()
  }

  function setupPulleySystem(){
    pulleySystem = new PulleySystem(
      params.canvas,
      graphic,
      colorMachine,
    );

    let r1 = 0.08;
    let r2 = 0.1
    let pulleyGroup = [
      {
        origin: {x:0.5,y:0.5},
        radius: 0.05,
        fill: 'black'
      },
      // NSEW
      {
        origin: {x:0.5,y:0.2},
        radius: r1,
        fill: 'black'
      },
      {
        origin: {x:0.2,y:0.5},
        radius: r1,
        fill: 'black'
      },
      {
        origin: {x:0.8,y:0.5},
        radius: r1,
        fill: 'black'
      },
      {
        origin: {x:0.5,y:0.8},
        radius: r1,
        fill: 'black'
      },
      // CORNERS
      {
        origin: {x:0.25,y:0.25},
        radius: r2,
        fill: 'black'
      },
      {
        origin: {x:0.75,y:0.25},
        radius: r2,
        fill: 'black'
      },
      {
        origin: {x:0.25,y:0.75},
        radius: r2,
        fill: 'black'
      },
      {
        origin: {x:0.75,y:0.75},
        radius: r2,
        fill: 'black'
      },
    ]



    pulleySystem.drawPulleyGroup(pulleyGroup)
    pulleySystem.drawConnections(pulleyGroup)
  }

  p.draw = function () {
    
    if(!pause){
      index++;
      // drawGrid()
      // drawGeometry();
      // drawSpheres(index++)
      // if(index % 40 === 0){
        // console.log('randomize')
        // randomizeColorMachine();
      // }
      p.image(graphic, 0, 0);
      // pause = true;
    }
  }

  function drawGeometry(){
    let canvasDims = params.canvas;
    let r = 0.5 * Math.sin(Math.random()*index*100);
    // let x = r * Math.cos(index*.01);
    // let y = r * Math.sin(index*.01);
    let x = xOffset;
    let y = yOffset;
    let ox = xOriginOffset;
    let oy = yOriginOffset;
    sphereMachine.drawGeometry(index,graphic,canvasDims, x,y,ox,oy)
  }


  function drawGrid(){
    let pulleys: Circle[] = [
      {
        origin: {x:.25,y:0.5},
        radius: 0.1,// + 0.002,
      },
      {
        origin: {x:0.5,y:0.5},
        radius: 0.05,// - params.canvas.width * 0.002 / 2,
      },
      {
        origin: {x:0.75,y:0.5},
        radius: 0.05,// - params.canvas.width * 0.002 / 2,
      },
    ]
    sphereMachine.drawPulleyRow(
      graphic,
      params.canvas,
      pulleys
    );

    let start: Point = {x:0,y:0};
    let end: Point = {x:1,y:1};
    sphereMachine.drawPulleyConnection(
      graphic,
      params.canvas,
      pulleys,
      start,
      end,
    );


    // let pulleyParams = {
    //   count: 3,
    //   strokeWeight: 0.0 * canvasDims.width,
    //   stroke: 'black',
    //   fill: 'white',
    //   diameter: 0.05 * canvasDims.width,
    // } 
    // console.log("canvasDims",canvasDims)
    // sphereMachine.drawSlice(graphic,{
    //   canvas: canvasDims
    // });
    

    // sphereMachine.drawPulleyRow(graphic,pulleyParams,pulleys)


    // sphereMachine.drawPulleyRow(graphic,{
    //   startHeight,
    //   canvas: canvasDims,
    //   pulley: pulleyParams,
    // })
  }

  function randomizeColorMachine(){
    let palName = paletteNames[Math.floor(Math.random() * paletteNames.length)];
    sphereMachine.updateColorMachine(setupColorMachine(palName))
  }

  function drawSpheres(i){
    let sphereParams = generateSphereParams(i);
    sphereMachine.drawSphere(sphereParams);
  }

  function generateSphereParams(i){
    let canvasDims = params.canvas;
    let ringCount = 7;
    let sphereRadiusRange: Range = {
      min:0.05,
      max:0.5,
    }
    let dotRadiusRange: Range = {
      min: 0.01,
      max: 0.01
    }
    let dotCountRange: Range = {
      min: 2,
      max: 6
    }
    let origin: Point = {
      x: 0.5,
      y: 0.5,
    }
    let outline = {
      color: 'black',
      width: 0.01,
    }
    let offsetAngle = 0 + i;
    return {
      canvas: canvasDims,
      ringCount,
      origin,
      offsetAngle,
      sphereRadiusRange,
      dotRadiusRange,
      dotCountRange,
      outline
    }
  }

  p.keyPressed = function (){
    switch(event.key){
      case " ": pause = !pause; break;
      case "ArrowRight": updateXOffset(true); break;
      case "ArrowLeft": updateXOffset(false); break;
      case "ArrowUp": updateYOffset(false); break;
      case "ArrowDown": updateYOffset(true); break;
      case "d": updateXOriginOffset(true); break;
      case "a": updateXOriginOffset(false); break;
      case "w": updateYOriginOffset(false); break;
      case "s": updateYOriginOffset(true); break;
      // case "ArrowUp": updateRingRadiusRange(true, false); break;
      // case "ArrowDown": updateRingRadiusRange(false, false); break;
      // case ".": updateRingCount(true); break;
      // case ",": updateRingCount(false); break;
      // case "=": updateStrokeWidthRange(true); break;
      // case "-": updateStrokeWidthRange(false); break;
    }
    console.log(event?.key)
  }

  function updateXOffset(inc: boolean){
    xOffset += (0.05 *(inc ? 1 : -1))
    resetGraphic();
    drawGeometry();
  }
  function updateYOffset(inc: boolean){
    yOffset += (0.05 *(inc ? 1 : -1))
    resetGraphic();
    drawGeometry();
  }
  function updateXOriginOffset(inc: boolean){
    xOriginOffset += (0.05 *(inc ? 1 : -1))
    resetGraphic();
    drawGeometry();
  }
  function updateYOriginOffset(inc: boolean){
    yOriginOffset += (0.05 *(inc ? 1 : -1))
    resetGraphic();
    drawGeometry();
  }


  function resetGraphic(){
    graphic.clear();
    graphic.background(params.color.background);
    graphic.strokeJoin(p.ROUND);
    graphic.strokeWeight(0);
    pause = false;
  }

  function setupGraphic(){
    p.frameRate(params.animation.frameRate);
    const rw = params.canvas.width + params.border.x * 2
    const rh = params.canvas.height + params.border.y * 2
    p.createCanvas(rw, rh)
    graphic = p.createGraphics(rw, rh);
    graphic.translate(params.border.x, params.border.y)
    resetGraphic();
  }



}

new p5(sketch);



