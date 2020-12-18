export interface Range{
    min: number;
    max: number;
}
export interface Dims{
    width: number;
    height: number;
}
export interface Point {
    x: number;
    y: number;
}
export interface Polar {
    r: number;
    t: number;
}
export interface Pulley{
    radius: number;
    origin: Point;
    fill: string;
}
