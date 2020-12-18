import * as p5 from 'p5'
import { Graphics } from 'p5';
import { setupColorMachine } from './colors';
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
    colorMachine = setupColorMachine('Spectral')
    setupPulleySystem();
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
    ]
    pulleySystem.drawPulleyGroup(pulleyGroup)
    pulleySystem.drawConnections(pulleyGroup)
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



