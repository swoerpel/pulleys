import { getExternalTangentLines, getInternalTangentLines, midPoint } from "./helpers";
import { Point, Pulley } from "./models";


export class PulleySystem {

    constructor(
        private canvas,
        private graphic: any,
        private colorMachine: any
    ){

    }

    


    public drawConnections(pulleyGroup: Pulley[]) : void{

        pulleyGroup = pulleyGroup.map((p: Pulley)=>({
            ...p,
            origin: this.toCanvasPoint(p.origin),
            radius: p.radius * this.canvas.height
        }));

        this.graphic.stroke('orange');
        this.graphic.strokeWeight(this.canvas.height * 0.005);
        this.graphic.noFill();
        let p1 = pulleyGroup.shift();

        pulleyGroup.forEach((p: Pulley)=>{
            let externalTangentLines = getExternalTangentLines(
                p.origin,
                p.radius,
                p1.origin,
                p1.radius
            )
            this.graphic.beginShape()
            externalTangentLines.A.forEach((p)=>this.graphic.vertex(p.x,p.y))
            this.graphic.endShape();
            this.graphic.beginShape()
            externalTangentLines.B.forEach((p)=>this.graphic.vertex(p.x,p.y))
            this.graphic.endShape();
        })
        // let p1 = pulleyGroup.shift();
        // let p2 = pulleyGroup.shift();
        // let p3 = pulleyGroup.shift();
        // let p4 = pulleyGroup.shift();
        pulleyGroup.forEach((p: Pulley)=>{
            let internalTangentLines = getInternalTangentLines(
                p1.origin,
                p1.radius,
                p.origin,
                p.radius,
            )
            this.graphic.beginShape()
            internalTangentLines.A.forEach((p)=>this.graphic.vertex(p.x,p.y))
            this.graphic.endShape();
            this.graphic.beginShape()
            internalTangentLines.B.forEach((p)=>this.graphic.vertex(p.x,p.y))
            this.graphic.endShape();
            // this.graphic.beginShape()
            // internalTangentLines.C.forEach((p)=>this.graphic.vertex(p.x,p.y))
            // this.graphic.endShape();
        })


        // let internalTangentLines = getInternalTangentLines(
        //     p1.origin,
        //     p1.radius,
        //     main.origin,
        //     main.radius
        // )
        // this.graphic.noFill();
        // this.graphic.stroke('orange');
        // this.graphic.beginShape()
        // this.graphic.strokeWeight(this.canvas.height * 0.005);
        // internalTangentLines.A.forEach((p)=>this.graphic.vertex(p.x,p.y))
        // this.graphic.endShape();
        // this.graphic.beginShape()
        // this.graphic.strokeWeight(this.canvas.height * 0.005);
        // internalTangentLines.B.forEach((p)=>this.graphic.vertex(p.x,p.y))
        // this.graphic.endShape();


        // let c1 = this.toCanvasPoint(pulley1.origin);
        // let c2 = this.toCanvasPoint(pulley2.origin);
        // // let c3 = this.toCanvasPoint(pulley3.origin);
        // let r1 = pulley1.radius * this.canvas.height
        // let r2 = pulley2.radius * this.canvas.height
        // // let r3 = pulley3.radius * this.canvas.height


        // let internalTangentLines = getInternalTangentLines(c1,c2,r1,r2);
        // this.graphic.beginShape()
        // internalTangentLines.top.forEach((p)=>this.graphic.vertex(p.x,p.y))
        // this.graphic.endShape();
        // this.graphic.beginShape()
        // internalTangentLines.bottom.forEach((p)=>this.graphic.vertex(p.x,p.y))
        // this.graphic.endShape();


    }

    public drawPulleyGroup(pulleyGroup: Pulley[]): void{
        pulleyGroup = pulleyGroup.map((p)=>this.mapGeometryToCanvas(p,this.canvas));
        this.graphic.strokeWeight(0);
        pulleyGroup.forEach((p:Pulley)=>{
            this.graphic.fill(p.fill);
            this.graphic.circle(p.origin.x,p.origin.y,p.radius*2);
            // this.graphic.fill('white');
            // this.graphic.circle(p.origin.x,p.origin.y,p.radius*2*0.1);
        });
    }

    private getConnectionPoints(pulley1:Pulley,pulley2:Pulley):Point[]{
        let a = pulley1.origin.x * this.canvas.width;
        let b = pulley1.origin.y * this.canvas.height;
        let c = pulley2.origin.x * this.canvas.width;
        let d = pulley2.origin.y * this.canvas.height;
        let r1 = pulley1.radius * this.canvas.height;
        let r2 = pulley2.radius * this.canvas.height;
        let m = (d-b)/(c-a);
        let yInt = b - m * a;
        let line = (x) => m * x + yInt;
        let x1:number = r1 * Math.cos(Math.atan(m)) + a
        let x2:number = c - r2 * Math.cos(Math.atan(m))
        let p1:Point = {x:x1,y:line(x1)};
        let p2:Point = {x:x2,y:line(x2)}
        let mp = midPoint(p1,p2)
        return [p1,mp,p2];
    }



    private mapGeometryToCanvas(pulley: Pulley,canvas: any) : Pulley{
        return{
            ...pulley,
            radius: pulley.radius * canvas.height,
            origin: this.toCanvasPoint(pulley.origin),
        }
    }

    private toCanvasPoint(p:Point):Point{
        return{
            x: p.x * this.canvas.width,
            y: p.y * this.canvas.height,
        }
    }

}