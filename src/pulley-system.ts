import { getExternalTangentLines, getInternalTangentLines, midPoint } from "./helpers";
import { Point, Pulley } from "./models";


export class PulleySystem {

    constructor(
        private canvas,
        private graphic: any,
        private colorMachine: any
    ){

    }

    public drawConnections(start:Point,end:Point,pulleyGroup: Pulley[]){
        start = this.toCanvasPoint(start);
        end = this.toCanvasPoint(end);
        pulleyGroup = pulleyGroup.map((p: Pulley)=>({
            ...p,
            origin: this.toCanvasPoint(p.origin),
            radius: p.radius * this.canvas.height
        }));
        this.graphic.stroke('orange');
        this.graphic.strokeWeight(this.canvas.height * 0.004);
        this.graphic.noFill();
        pulleyGroup.unshift({origin:start,radius:0,fill:'black'})
        pulleyGroup.push({origin:end,radius:0,fill:'black'})
        pulleyGroup.map((p: Pulley,i: number)=>{
            if(i !== pulleyGroup.length - 1){
                let nextPulley: Pulley = pulleyGroup[i +1 ]
                let c1 =p.origin
                let r1 =p.radius
                let c2 =nextPulley.origin
                let r2 =nextPulley.radius
                let externalTangentLines = getExternalTangentLines(c1,r1,c2,r2);
                let internalTangentLines = getInternalTangentLines(c1,r1,c2,r2);

                let x1 = internalTangentLines.A[0].x;
                let y1 = internalTangentLines.A[0].y;
                let x2 = internalTangentLines.A[1].x;
                let y2 = internalTangentLines.A[1].y;
                this.graphic.line(x1,y1,x2,y2)

                x1 = internalTangentLines.B[0].x;
                y1 = internalTangentLines.B[0].y;
                x2 = internalTangentLines.B[1].x;
                y2 = internalTangentLines.B[1].y;
                this.graphic.line(x1,y1,x2,y2)

                x1 = externalTangentLines.A[0].x;
                y1 = externalTangentLines.A[0].y;
                x2 = externalTangentLines.A[1].x;
                y2 = externalTangentLines.A[1].y;
                this.graphic.line(x1,y1,x2,y2)

                x1 = externalTangentLines.B[0].x;
                y1 = externalTangentLines.B[0].y;
                x2 = externalTangentLines.B[1].x;
                y2 = externalTangentLines.B[1].y;
                this.graphic.line(x1,y1,x2,y2)
            }
        })
    }
   
    public drawPulleyGroup(pulleyGroup: Pulley[]): void{
        pulleyGroup = pulleyGroup.map((p)=>this.mapGeometryToCanvas(p,this.canvas));
        this.graphic.strokeWeight(0);
        pulleyGroup.forEach((p:Pulley,i:number)=>{
            // this.graphic.fill(this.colorMachine(i/pulleyGroup.length).hex())
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