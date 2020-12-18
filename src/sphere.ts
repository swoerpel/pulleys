import { cubehelix } from "chroma.ts";
import { distance, getArcPath, getRadialVertices, getTangentPoints, hypotenuse, linSet, midPoint, rotate, shuffle, toCart, toDegrees, toPolar } from "./helpers";
import { Circle, Dims, Peg, Point, Polar } from "./models";
import { head, last } from 'lodash';
import { params } from "./params";

export class Sphere {

    constructor(private graphic,private color_machine){ }

    public updateColorMachine(color_machine){
        this.color_machine = color_machine;
    }

    public drawSphere(params){
        let radii = linSet(
            params.sphereRadiusRange.min * params.canvas.width,
            params.sphereRadiusRange.max * params.canvas.width,
            params.ringCount
        )
        let dotCounts = linSet(
            params.dotCountRange.min,
            params.dotCountRange.max,
            params.ringCount
        ).map(Math.floor);
        let angles: number[] = radii.map((_,i)=>i*params.offsetAngle);
        // let verticies: number[] = radii.map((,i)=>)
        let dots: Point[] = new Array(radii.length).fill(0).reduce((prev,_,i) => {
            let radius = radii[i % radii.length];
            let dotCount = dotCounts[i % dotCounts.length];
            let angle = angles[i % angles.length]
            return [...prev,...getRadialVertices({
                x: params.canvas.width * params.origin.x,
                y: params.canvas.height * params.origin.y,
            },radius,dotCount,angle)];
        },[])
        let dotRadii = linSet(
            params.dotRadiusRange.min,
            params.dotRadiusRange.max,
            dots.length
        )
        let prevX = dots[0].x;
        let prevY = dots[0].y;
        // shuffle(dots).forEach((dot: Point,i: number) => {
        dots.forEach((dot: Point,i: number) => {
            let dotRadius = dotRadii[i % dotRadii.length] * params.canvas.width;
            this.graphic.stroke(params.outline.color)
            this.graphic.strokeWeight(dotRadius * params.outline.width)
            this.graphic.fill(this.color_machine(i / dots.length).hex())
            this.graphic.rect(dot.x,dot.y,dotRadius,dotRadius)
            this.graphic.stroke('white')
            this.graphic.strokeWeight(10)
            // this.graphic.line(prevX,prevY,dot.x,dot.y)
            prevX = dot.x;
            prevY = dot.y
        })
    }

    public drawSlice(graphic,params){
        console.log('params',params);
        let c: Circle = {
            origin: {
                x: 0.5 * params.canvas.width,
                y: 0.5 * params.canvas.height,
            },
            radius: 0.25  * params.canvas.width
        }
        graphic.circle(c.origin.x,c.origin.y,c.radius)

        let p1 = {
            x: c.origin.x + c.radius/2,// * Math.cos(Math.PI/2),// + c.radius,// * Math.cos(0),
            y: c.origin.y,// * Math.sin(0),
        }
        graphic.strokeWeight(30);
        graphic.stroke('red');
        for(let i = 0; i < 90; i+=0.5){
            let p1r = rotate(c.origin,p1,i)
            // graphic.point(...Object.values(p1r));
        }
        // getArcPath(c.origin,p1,rotate(c.origin,p1,90));
        graphic.point(c.origin.x,c.origin.y)
        graphic.point(p1.x,p1.y)
        for(let i = 0; i < 90; i++){
            graphic.point(rotate(c.origin,p1,i).x,rotate(c.origin,p1,i).y)
        }
    }



    ///==================================================================
    private toCanvasPoint(p:Point,canvas:Dims):Point{
        return{
            x: p.x * canvas.width,
            y: p.y * canvas.height,
        }
    }
    public drawPulleyRow(graphic: any,canvas: Dims, pulleys: Circle[]):void{
        pulleys = pulleys.map((p:Circle)=>({
            radius: p.radius * canvas.width,
            origin: this.toCanvasPoint({...p.origin},canvas)})
        )
        graphic.strokeWeight(0);
        pulleys.forEach((p)=>{
            graphic.circle(p.origin.x,p.origin.y,p.radius*2);
        });
    }
    public drawPulleyConnection(
        graphic: any,
        canvas: Dims, 
        pulleys: Circle[],
        start: Point,
        end: Point,
    ): void{
        start = this.toCanvasPoint(start,canvas);
        end = this.toCanvasPoint(end,canvas);
        let sw = canvas.width * 0.002;
        graphic.strokeWeight(sw);
        pulleys = pulleys.map((p:Circle)=>({
            radius: p.radius * canvas.width,
            origin:this.toCanvasPoint({...p.origin},canvas)
        }))
        let tPoints: Point[] = getTangentPoints(pulleys[0],start);
        let bottom: Point = last(tPoints);
        graphic.stroke('black');

        graphic.line(start.x,start.y,bottom.x,bottom.y);

      
        let c = pulleys[0].origin;
        let r = pulleys[0].radius;
        let p1 = bottom;
        pulleys[0].radius// += sw;
        let p2 = head(getTangentPoints(pulleys[0],pulleys[1].origin));
        let arcPath = getArcPath(c,r,p1,p2);
        // graphic.strokeWeight(canvas.width * 0.005);
        // graphic.stroke('orange');
        graphic.noFill();
        graphic.translate(c.x,c.y);
        graphic.beginShape();
        arcPath.forEach((p:Point)=>graphic.vertex(p.x,p.y))
        graphic.endShape();
        graphic.translate(-c.x,-c.y);
        graphic.stroke('black');
        // graphic.strokeWeight(canvas.width * 0.002);

        // middle line and second pulley arc
       
        p1 = {...p2};
        p2 = head(getTangentPoints(pulleys[1],p1));
        graphic.line(p1.x,p1.y,p2.x,p2.y);
        // graphic.stroke('red');
        graphic.point(p2.x,p2.y)


        c = pulleys[1].origin;
        r = pulleys[1].radius;
        p1 = {...p2};
        p2 = last(getTangentPoints(pulleys[1],end));
        graphic.line(p2.x,p2.y,end.x,end.y);
        // graphic.stroke('orange');
        graphic.point(p1.x,p1.y)
        graphic.point(p2.x,p2.y)
        arcPath = getArcPath(c,r,p1,p2);
        console.log("arcPath",arcPath)
        graphic.translate(c.x,c.y);
        graphic.beginShape();
        arcPath.forEach((p:Point)=>graphic.vertex(p.x,p.y))
        graphic.endShape();
        graphic.translate(-c.x,-c.y);
    }




    //============================================================================
    public drawPulleyRow_old(graphic,params){
        let stepX = params.canvas.width / (params.pulley.count + 1);
        let pulleys: Circle[] = new Array(params.pulley.count).fill({}).map((_,i)=>({
            origin:{
                x: (i + 1) * stepX,
                y: (Math.random() * 0.8 + 0.1) * params.canvas.height,
            },
            radius: params.pulley.diameter / 2
        }))
        pulleys.forEach((p)=>{
            graphic.circle(
                p.origin.x,
                p.origin.y,
                p.radius * 2
            );
        })
        graphic.stroke('blue');
        graphic.strokeWeight(params.pulley.diameter * 0.05);
        pulleys = [{
            origin:{
                x: 0,
                y: params.startHeight * params.canvas.height,
            },
            radius: 0,
        },...pulleys]; 
        for(let i = 0; i < pulleys.length - 1; i++){
            let mid = midPoint(
                pulleys[i].origin,
                pulleys[i+1].origin
            );
            let tp1 = getTangentPoints(pulleys[i],mid);
            let tp2 = getTangentPoints(pulleys[i+1],mid);
            let flip = false;//pulleys[i+1].origin.y > pulleys[(i+2)%pulleys.length].origin.y;//i % 2 === 0;
            // flip = pulleys[(i+2)%pulleys.length].origin.y < pulleys[(i+3)%pulleys.length].origin.y;//i % 2 === 0;
            let p1 = !flip ? [head(tp1).x,head(tp1).y]:[last(tp1).x,last(tp1).y]
            let p2 = !flip ? [head(tp2).x,head(tp2).y]:[last(tp2).x,last(tp2).y]
            graphic.point();
            graphic.point(...p1);
            graphic.line(...p1,...p2);
        }
    }

    public drawGeometry(
        index,
        graphic,
        canvas: Dims,
        xOffset: number,
        yOffset: number, 
        xOriginOffset:number,
        yOriginOffset:number
    ){
        let circle = {
            origin:{
                x:xOriginOffset * canvas.width,
                y: yOriginOffset * canvas.width,
            },
            radius: 0.1 * canvas.width
        }
        let p1 = {
            x: xOffset * canvas.width + circle.origin.x,
            y: yOffset * canvas.width + circle.origin.y,
        }
        graphic.fill('orange')
        graphic.strokeWeight(0)
        graphic.circle(
            circle.origin.x,
            circle.origin.y,
            circle.radius * 2
        );
        graphic.strokeWeight(5)

        let points = getTangentPoints(circle,p1)
        graphic.stroke('blue')
        graphic.strokeWeight(60)
        graphic.point(...Object.values(p1));
        graphic.point(...Object.values(points[0]));
        graphic.point(...Object.values(points[1]));
        graphic.strokeWeight(20)
        graphic.stroke('black')
        graphic.line(points[0].x,points[0].y,p1.x,p1.y);
        graphic.line(points[1].x,points[1].y,p1.x,p1.y);

    }


}