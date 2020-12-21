import { color } from 'chroma.ts';
import * as p5 from 'p5'
import { Graphics } from 'p5';
import { setupColorMachine } from './colors';
import { Point, Pulley } from './models';
import { params } from './params';
import { PulleySystem } from './pulley-system';

var sketch = function (p: p5) {
  var graphic: Graphics; 
  var pause = false;
  var pulleySystem: PulleySystem;
  var colorMachine: any;
  var index: number = 0;
  p.setup = function () {
    setupGraphic();
    resetGraphic();
    colorMachine = setupColorMachine('RdBu')
    setupPulleySystem();
  }

  function setupPulleySystem(){
    pulleySystem = new PulleySystem(
      params.canvas,
      graphic,
      colorMachine,
    );
    let r1 = 0.15;
    let r2 = 0.04
    let r3 = 0.08
    let startPoint = {x:0,y:0};
    let endPoint = {x:1,y:1};
    let origins = [
      {x: 0.25, y: Math.random() * (1 - r1*2) +  r1},
      {x: 0.5, y: Math.random() * (1 - r1*2) + r1},
      {x: 0.75, y: Math.random() * (1 - r1*2) + r1},
    ]
    // let origins = generateGrid()

    let radii = [r1];

    let pulleyStackSize = 3;
    for(let i = 0; i < pulleyStackSize; i++){
      if(i !== 0){
        radii = radii.map(r=>r*0.6)
      }
      console.log("radii",radii)
      let fills = new Array(pulleyStackSize).fill('').map((_,j)=>{
        let cv = (i * origins.length + j) / ((pulleyStackSize - 1) * origins.length);
        // let cv = Math.random()
        return colorMachine(cv).hex()
      })
      console.log("fills",fills)
      let pulleyGroup: Pulley[] = generatePulleyParameters(origins,radii,fills);
      pulleySystem.drawPulleyGroup(pulleyGroup)
  
      let configuration = new Array(1).fill(0).map((_)=>Math.floor(Math.random()*4))
      console.log("configuration",configuration)
      pulleySystem.drawConnections(configuration,startPoint,endPoint,pulleyGroup)
  
    }

    // let fills = ['white']
    // let pulleyGroup: Pulley[] = generatePulleyParameters(origins,radii,fills);
    // pulleySystem.drawPulleyGroup(pulleyGroup)

    // let configuration = new Array(Math.floor(Math.random()*4)).fill(0).map((_)=>Math.floor(Math.random()*4))
    // console.log("configuration",configuration)
    // pulleySystem.drawConnections(configuration,startPoint,endPoint,pulleyGroup)

    // radii = radii.map(r=>r/2);
    // fills = ['gold']
    // pulleyGroup = generatePulleyParameters(origins,radii,fills);
    // pulleySystem.drawPulleyGroup(pulleyGroup)

    // // configuration = [1]
    // pulleySystem.drawConnections(configuration,startPoint,endPoint,pulleyGroup)
  }

  
  function generatePulleyParameters(
    origins: Point[],
    radii: number[],
    fills: string[],
  ): Pulley[]{
      return origins.map((origin:Point,i:number)=>({
        origin,
        radius: radii[i % radii.length],
        fill: fills[i % fills.length]
      }))
  }

  p.draw = function () {
    if(!pause){
      index++;
      p.image(graphic, 0, 0);
      // pause = true;
    }
  }

  p.keyPressed = function (){
    switch(event.key){
      case " ": pause = !pause; break;
      // case "ArrowRight": updateXOffset(true); break;
      // case "ArrowLeft": updateXOffset(false); break;
      // case "ArrowUp": updateYOffset(false); break;
      // case "ArrowDown": updateYOffset(true); break;
    }
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



