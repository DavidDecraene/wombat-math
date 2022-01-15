import { Mathf } from "./math";

export interface IVector {
  x: number;
  y: number;
  z: number;
}
// https://github.com/Unity-Technologies/UnityCsReference/blob/61f92bd79ae862c4465d35270f9d1d57befd1761/Runtime/Export/Math/Vector3.cs#L361
export class Vector implements IVector {
  public static readonly kEpsilon = 0.00001;
  public static readonly kEpsilonNormalSqrt = 1e-15;


  public static lerp(a: Vector, b: Vector, t: number, clamp = true): Vector
  {
      if(clamp) { t = Mathf.clamp(t, 0, 1); }
      return new Vector(
          Mathf.lerp(a.x, b.x, t),
          Mathf.lerp(a.y, b.y, t),
          Mathf.lerp(a.z, b.z, t)
      );
  }

  public static angleRad(from: Vector, to: Vector): number
  {
      // sqrt(a) * sqrt(b) = sqrt(a * b) -- valid for real numbers
      const denominator = Math.sqrt(from.sqrMagnitude * to.sqrMagnitude);
      if (Math.abs(denominator ) < Vector.kEpsilonNormalSqrt)
          return 0;

      const dot = Mathf.clamp(from.dot(to) / denominator, -1, 1);
      return Math.acos(dot);
  }

  public static angle(from: Vector, to: Vector): number
  {
      // sqrt(a) * sqrt(b) = sqrt(a * b) -- valid for real numbers
      const denominator = Math.sqrt(from.sqrMagnitude * to.sqrMagnitude);
      if (Math.abs(denominator ) < Vector.kEpsilonNormalSqrt)
          return 0;

      const dot = Mathf.clamp(from.dot(to) / denominator, -1, 1);
      return Math.acos(dot) * (180/Math.PI);
  }

  public get sqrMagnitude(): number {
    return this.x * this.x + this.y * this.y + this.z * this.z;
  }

  public get magnitude(): number {
    return Math.sqrt(this.sqrMagnitude);
  }

  constructor(public x: number = 0, public y: number = 0, public z: number = 0) {

  }

  public toString(): string {
    return this.x + '_' + this.y + '_' + this.z;
  }

  public clone(): Vector {
    return new Vector(this.x, this.y, this.z);
  }

  public set(x = 0, y = 0, z = 0): this {
    this.x = x;
    this.y = y;
    this.z = z;
    return this;
  }

  private parse(fn: (x: number, y: number, z: number) => void, x: number | IVector, y?: number | boolean, z?: number){
    if (typeof x === 'number'){
      fn(x, y as number, z);
    } else {
      fn(x.x, x.y, x.z);
    }
  }

  private parseLocal(y?: number | boolean, local?: boolean): boolean {
    if (local === true) return  true;
    return y === true;
  }


  public add(x: number, y: number, z: number, local?: boolean): Vector;
  public add(other: IVector, local?: boolean): Vector;
  public add(x: number | IVector, y?: number | boolean, z?: number, local?: boolean): Vector {
    const target = this.parseLocal(y, local) ? this : this.clone();
    this.parse((xx,yy, zz) => {
      target.x += xx;
      target.y += yy;
      target.z += zz;
    }, x, y, z);
    return target;
  }

  public normalize(local  = false): Vector {
      const mag = this.magnitude;
      const target = local ? this : this.clone();
      if (mag < Vector.kEpsilon){
        target.x = 0;
        target.y = 0;
        target.z = 0;
      } else {
        target.divide(mag, mag, mag, true);
      }
      return target;
  }

  public dot(x: number, y: number, z: number): number;
  public dot(other: IVector): number;
  public dot(x: number | IVector, y?: number | boolean, z?: number): number  {
      const target = this;
      let r = 0;
      this.parse((xx,yy, zz) => {
        r = target.x * xx + target.y * yy + target.z * zz;
      }, x, y, z);
      return r;
  }

  public cross(x: number, y: number, z: number, local?: boolean): Vector;
  public cross(other: IVector, local?: boolean): Vector;
  public cross(x: number | IVector, y?: number | boolean, z?: number, local?: boolean): Vector  {

      const target = this.parseLocal(y, local) ? this : this.clone();
      this.parse((xx,yy, zz) => {
        const lx = target.y * zz - target.z * yy;
        const ly = target.z * xx - target.x * zz;
        const lz = target.x * yy - target.y * xx;
        target.x = lx;
        target.y = ly;
        target.z = lz;
      }, x, y, z);
      return target;
  }

  public divide(x: number, y: number, z: number, local?: boolean): Vector;
  public divide(other: IVector, local?: boolean): Vector;
  public divide(x: number | IVector, y?: number | boolean, z?: number, local?: boolean): Vector  {

      const target = this.parseLocal(y, local) ? this : this.clone();
      this.parse((xx,yy, zz) => {

        target.x = xx ? target.x/xx : 0;
        target.y = yy ? target.y/yy : 0;
        target.z = zz ? target.z/zz : 0;
      }, x, y, z);
      return target;
  }

  public multiply(x: number, y: number, z: number, local?: boolean): Vector;
  public multiply(other: IVector, local?: boolean): Vector;
  public multiply(x: number | IVector, y?: number | boolean, z?: number, local?: boolean): Vector  {

      const target = this.parseLocal(y, local) ? this : this.clone();
      this.parse((xx,yy, zz) => {
        target.x *= xx;
        target.y *= yy;
        target.z *= zz;
      }, x, y, z);
      return target;
  }

  public subtract(x: number, y: number, z: number, local?: boolean): Vector;
  public subtract(other: IVector, local?: boolean): Vector;
  public subtract(x: number | IVector, y?: number | boolean, z?: number, local?: boolean): Vector  {

      const target = this.parseLocal(y, local) ? this : this.clone();
      this.parse((xx,yy, zz) => {
        target.x -= xx;
        target.y -= yy;
        target.z -= zz;
      }, x, y, z);
      return target;
  }

  public equals(x: number, y: number, z: number): boolean;
  public equals(other: IVector): boolean;
  public equals(x: number | IVector | undefined, y?: number | boolean, z?: number): boolean {
    if (x === undefined) return false;
    let r = true;
    this.parse((xx,yy, zz) => {
      if (this.x !== xx) { r =  false; return; }
      if (this.y !== yy) { r =  false; return; }
      if (this.z !== zz) { r =  false; return; }
    }, x, y, z);
    return r;
  }
}
