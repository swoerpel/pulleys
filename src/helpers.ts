import { Point, Polar } from "./models";

export function getRadialVertices(
    origin: Point, 
    radius: number, 
    vertices: number = 4,
    rotation:number = 0,
  ) : Point[]{
    let angle = Math.PI * 2 / vertices
    let points = []
    let orientation = Math.PI / vertices // -> pointy top : 0 -> flat top
    rotation = rotation / (Math.PI * 2);
    // console.log('angle,vertices',angle,vertices)
    // console.log(' Math.PI * 2 * (1 - 1 / vertices)', Math.PI * 2 * (1 - 1 / vertices))
    for (let a = -angle+0.001; a < Math.PI * 2 * (1 - 1 / vertices); a += angle) {
        let sx = origin.x + Math.cos(a + orientation + rotation) * radius;
        let sy = origin.y + Math.sin(a + orientation + rotation) * radius;
        points.push({ x: round(sx), y: round(sy) })
    }
    return points
  }

  
export var round = (N,acc = 100000) => {
    return Math.round(N * acc) / acc
}

export function rotate(center: Point,point: Point, angle,scaleX = 1, scaleY = 1): Point {
  var radians = (Math.PI / 180) * angle,
      cos = scaleX * Math.cos(radians),
      sin = scaleY * Math.sin(radians),
      nx = (cos * (point.x - center.x)) + (sin * (point.y - center.y)) + center.x,
      ny = (cos * (point.y - center.y)) - (sin * (point.x - center.x)) + center.y;
  return {x:nx, y:ny};
}

export function SmoothLine(
  line: Point[], 
  current_iter: number, 
  dist_ratio: number,
  total_iters: number = 8, 
): Point[] {
  if(total_iters == current_iter)
    return line;
  else{
    let sm_line:Point[] = [line[0]]
    for (let i = 0; i < line.length - 1; i++) {
      let offsetX = (line[i + 1].x - line[i].x);
      let offsetY = (line[i + 1].y - line[i].y);
      sm_line.push({
        x: line[i].x + (dist_ratio) * offsetX,
        y: line[i].y + (dist_ratio) * offsetY
      })
      sm_line.push({
        x: line[i].x + (1 - dist_ratio) * offsetX,
        y: line[i].y + (1 - dist_ratio) * offsetY
      })
    }
    sm_line.push(line[line.length - 1])
    return SmoothLine(sm_line, current_iter + 1, dist_ratio,total_iters)
  }
}



export function linSet(min: number, max: number, length: number, sorted = true){
  const vals = [];
  if(min === max){
    return new Array(length).fill(min);
  }
  const step = Math.abs((max - min) / (length - 1));
  for(let i = min; i <= max; i += step){
    vals.push(i)
  }
  // vals.push(max)
  return vals//..sort().reverse();;
}


    
export function toDegrees(radians: number): number{
  return radians * (180 / Math.PI);
}

export function toRadians(degrees: number): number{
  return degrees * Math.PI / 180
}



export function randSet(min, max, length){
  const vals = [];
  for(let i = 0; i < length; i++){
    vals.push(Math.random() * length * (max - min) + min)
  }
  return vals.sort()
}

export function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function midPoint(p1:Point, p2:Point): Point{
  const minX = Math.min(p1.x,p2.x)
  const minY = Math.min(p1.y,p2.y)
  const maxX = Math.max(p1.x,p2.x)
  const maxY = Math.max(p1.y,p2.y)
  return {
    x: (maxX - minX) / 2 + minX,
    y: (maxY - minY) / 2 + minY
  }
}

export function rotateArray(arr: any[], count = 1): any[] {
  return [...arr.slice(count, arr.length), ...arr.slice(0, count)];
};

export function hypotenuse(p: Point):number{
  return Math.sqrt(p.x*p.x + p.y*p.y);
}

export function distance(p1:Point,p2:Point): number{
  return Math.sqrt(Math.pow(p2.x-p1.x,2)+Math.pow(p2.y-p1.y,2))
}


export function getArcPath(c: Point,r: number,p1:Point,p2:Point,density:number=100):Point[] {
  p1 = {x: p1.x - c.x,y: p1.y - c.y}
  p2 = {x: p2.x - c.x,y: p2.y - c.y}
  let polar1: Polar = {r,t:Math.acos(p1.x/r)}
  let polar2: Polar = {r,t:Math.acos(p2.x/r)}
  let tDiff = polar2.t - polar1.t;
  return new Array(density + 1).fill({}).map((_,i)=>({
      x: (p1.x < 0 ? 1:-1) * r * Math.cos(polar1.t + (tDiff / density) * i),
      y: (p1.y < 0 ? -1:1) * r * Math.sin(polar1.t + (tDiff / density) * i),
  }))
}

export function toPolar(p:Point):Polar{
  return {
    r: hypotenuse(p),
    t: Math.acos(p.x/hypotenuse(p))
  }
}

export function toCart(p:Polar):Point{
  return {
    x: p.r * Math.cos(p.t),
    y: p.r * Math.sin(p.t),
  }
}

export function getTangentPoints(origin: Point,radius: number,point: Point): Point[]{
  let R = radius;
  let H = distance(origin, point);
  let L = Math.sqrt(Math.pow(H, 2) - R*R);
  let alpha = Math.atan((point.y - origin.y) / (point.x - origin.x));
  let beta = Math.acos((R * R + H * H - L * L) / (2 * R * H));
  if((point.x-origin.x) < 0){ alpha += Math.PI }
  return [
      { 
        x: R * Math.cos(beta + alpha) + origin.x,
        y: R * Math.sin(beta + alpha) + origin.y
      },
      { 
        x: R * Math.cos(alpha - beta) + origin.x,
        y: R * Math.sin(alpha - beta) + origin.y
      }
  ]
}

export function getExternalTangentLines(c1: Point,r1: number,c2: Point,r2: number){
  const rDiff = Math.abs((r1-r2))
  const d = distance(c1,c2);
  let alpha = Math.atan(rDiff/d)
  let beta = Math.atan((c2.y-c1.y)/(c2.x-c1.x))
  let betaUp = Math.PI/2 + beta
  let betaDown = Math.PI/2 - beta
  if(c1.x <= c2.x){
    let temp = betaUp;
    betaUp = -betaDown;
    betaDown = -temp;
  }
  if(r1 > r2){
    alpha = -alpha
  }
  let xt1 = c1.x + r1 * Math.cos(alpha - betaUp);
  let yt1 = c1.y - r1 * Math.sin(alpha - betaUp);
  let xt2 = c2.x + r2 * Math.cos(alpha - betaUp);
  let yt2 = c2.y - r2 * Math.sin(alpha - betaUp);
  let xb1 = c1.x + r1 * Math.cos(betaDown - alpha);
  let yb1 = c1.y - r1 * Math.sin(betaDown - alpha);
  let xb2 = c2.x + r2 * Math.cos(betaDown - alpha);
  let yb2 = c2.y - r2 * Math.sin(betaDown - alpha);
  return {
      A:[{x:xt1,y:yt1},{x:xt2,y:yt2}],
      B:[{x:xb1,y:yb1},{x:xb2,y:yb2}]
  }
}

export function getInternalTangentLines(c1: Point,r1: number,c2: Point,r2: number){
  const d = distance(c1,c2);
  let alpha = Math.acos((r1 + r2)/d)
  let beta = Math.acos((c2.x - c1.x)/d);
  if(c1.y >= c2.y){beta = -beta;}
  let offset1 = alpha - beta
  let xb1 = c1.x + r1 * Math.cos(offset1);
  let yb1 = c1.y - r1 * Math.sin(offset1);
  let xb2 = c2.x - r2 * Math.cos(offset1);
  let yb2 = c2.y + r2 * Math.sin(offset1);
  let offset2 = -(beta + alpha);
  let xt1 = c1.x + r1 * Math.cos(offset2);
  let yt1 = c1.y - r1 * Math.sin(offset2);
  let xt2 = c2.x - r2 * Math.cos(offset2);
  let yt2 = c2.y + r2 * Math.sin(offset2);
  return {
      A:[{x:xb1,y:yb1},{x:xb2,y:yb2}],
      B:[{x:xt1,y:yt1},{x:xt2,y:yt2}],
  }
}

export function getLineBetween(c1: Point,c2: Point,r1: number,r2: number){
  let m = (c2.y-c1.y)/(c2.x-c1.x);
  let yInt = c1.y - m * c1.x;
  let line = (x) => m * x + yInt;
  let x1:number = r1 * Math.cos(Math.atan(m)) + c1.x
  let x2:number = c2.x - r2 * Math.cos(Math.atan(m))
  let p1:Point = {x:x1,y:line(x1)};
  let p2:Point = {x:x2,y:line(x2)}
  let mp = midPoint(p1,p2)
  return [p1,mp,p2]
}