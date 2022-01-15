import { Mathf } from "./math";

export interface IVector2 {
  x: number;
  y: number;
}
// https://github.com/Unity-Technologies/UnityCsReference/blob/61f92bd79ae862c4465d35270f9d1d57befd1761/Runtime/Export/Math/Vector3.cs#L361
export class Vector2 implements IVector2 {
  public static readonly kEpsilon = 0.00001;
  public static readonly kEpsilonNormalSqrt = 1e-15;


  public static lerp(a: IVector2, b: IVector2, t: number, clamp = true): Vector2
  {
      if(clamp) { t = Mathf.clamp(t, 0, 1); }
      return new Vector2(
          Mathf.lerp(a.x, b.x, t),
          Mathf.lerp(a.y, b.y, t)
      );
  }

  public static angleRad(from: Vector2, to: Vector2): number
  {
      // sqrt(a) * sqrt(b) = sqrt(a * b) -- valid for real numbers
      const denominator = Math.sqrt(from.sqrMagnitude * to.sqrMagnitude);
      if (Math.abs(denominator ) < Vector2.kEpsilonNormalSqrt)
          return 0;

      const dot = Mathf.clamp(from.dot(to) / denominator, -1, 1);
      return Math.acos(dot);
  }

  public static angle(from: Vector2, to: Vector2): number
  {
      // sqrt(a) * sqrt(b) = sqrt(a * b) -- valid for real numbers
      const denominator = Math.sqrt(from.sqrMagnitude * to.sqrMagnitude);
      if (Math.abs(denominator ) < Vector2.kEpsilonNormalSqrt)
          return 0;

      const dot = Mathf.clamp(from.dot(to) / denominator, -1, 1);
      return Math.acos(dot) * (180/Math.PI);
  }

  public get sqrMagnitude(): number {
    return this.x * this.x + this.y * this.y ;
  }

  public get magnitude(): number {
    return Math.sqrt(this.sqrMagnitude);
  }

  constructor(public x: number = 0, public y: number = 0) {

  }

  public toString(): string {
    return this.x + '_' + this.y ;
  }

  public clone(): Vector2 {
    return new Vector2(this.x, this.y);
  }

  public set(x = 0, y = 0): this {
    this.x = x;
    this.y = y;
    return this;
  }

  private parse(fn: (x: number, y: number) => void, x: number | IVector2, y?: number | boolean){
    if (typeof x === 'number'){
      fn(x, y as number);
    } else {
      fn(x.x, x.y);
    }
  }

  private parseLocal(y?: number | boolean, local?: boolean): boolean {
    if (local === true) return  true;
    return y === true;
  }


  public add(x: number, y: number, local?: boolean): Vector2;
  public add(other: IVector2, local?: boolean): Vector2;
  public add(x: number | IVector2, y?: number | boolean, local?: boolean): Vector2 {
    const target = this.parseLocal(y, local) ? this : this.clone();
    this.parse((xx,yy) => {
      target.x += xx;
      target.y += yy;
    }, x, y);
    return target;
  }

  public normalize(local  = false): Vector2 {
      const mag = this.magnitude;
      const target = local ? this : this.clone();
      if (mag < Vector2.kEpsilon){
        target.x = 0;
        target.y = 0;
      } else {
        target.divide(mag, mag, true);
      }
      return target;
  }

  public dot(x: number, y: number): number;
  public dot(other: IVector2): number;
  public dot(x: number | IVector2, y?: number | boolean): number  {
      const target = this;
      let r = 0;
      this.parse((xx,yy) => {
        r = target.x * xx + target.y * yy;
      }, x, y);
      return r;
  }

  public divide(x: number, y: number, local?: boolean): Vector2;
  public divide(other: IVector2, local?: boolean): Vector2;
  public divide(x: number | IVector2, y?: number | boolean, local?: boolean): Vector2  {

      const target = this.parseLocal(y, local) ? this : this.clone();
      this.parse((xx,yy) => {

        target.x = xx ? target.x/xx : 0;
        target.y = yy ? target.y/yy : 0;
      }, x, y);
      return target;
  }

  public multiply(x: number, y: number, local?: boolean): Vector2;
  public multiply(other: IVector2, local?: boolean): Vector2;
  public multiply(x: number | IVector2, y?: number | boolean, local?: boolean): Vector2  {

      const target = this.parseLocal(y, local) ? this : this.clone();
      this.parse((xx,yy) => {
        target.x *= xx;
        target.y *= yy;
      }, x, y);
      return target;
  }

  public subtract(x: number, y: number,local?: boolean): Vector2;
  public subtract(other: IVector2, local?: boolean): Vector2;
  public subtract(x: number | IVector2, y?: number | boolean, local?: boolean): Vector2  {

      const target = this.parseLocal(y, local) ? this : this.clone();
      this.parse((xx,yy) => {
        target.x -= xx;
        target.y -= yy;
      }, x, y);
      return target;
  }

  public equals(x: number, y: number): boolean;
  public equals(other: IVector2): boolean;
  public equals(x: number | IVector2 | undefined, y?: number | boolean): boolean {
    if (x === undefined) return false;
    let r = true;
    this.parse((xx,yy) => {
      if (this.x !== xx) { r =  false; return; }
      if (this.y !== yy) { r =  false; return; }
    }, x, y);
    return r;
  }
}
