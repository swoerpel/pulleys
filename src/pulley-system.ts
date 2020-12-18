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
        })

    }

    public drawPulleyGroup(pulleyGroup: Pulley[]): void{
        pulleyGroup = pulleyGroup.map((p)=>this.mapGeometryToCanvas(p,this.canvas));
        this.graphic.strokeWeight(0);
        pulleyGroup.forEach((p:Pulley)=>{
            this.graphic.fill(p.fill);
            this.graphic.circle(p.origin.x,p.origin.y,p.radius*2);
        });
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