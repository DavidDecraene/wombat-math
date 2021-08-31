// https://github.com/Unity-Technologies/UnityCsReference/blob/02d565cf3dd0f6b15069ba976064c75dc2705b08/Runtime/Export/Math/Mathf.cs#L360


class MathImpl {

  public static readonly DegToRad = Math.PI / 180;
  public static readonly RadToDef = 180 / Math.PI;

  /** Clamps a value between a minimum float and maximum float value. min default 0, max default 1 */
  public clamp(value: number, min = 0, max = 1): number {
    if (value < min) { value = min; }
    else if (value > max) { value = max; }
    return value;
  }

  /** Loops the value t, so that it is never larger than length and never smaller than 0. */
  public repeat(t: number, length: number): number {
    return this.clamp(t - Math.floor(t / length) * length, 0, length);
  }

  /** PingPongs the value t, so that it is never larger than length and never smaller than 0. */
  public pingPong(t: number, length: number): number {
    t = this.repeat(t, length * 2);
    return length - Math.abs(t - length);
  }

  /** Interpolates between /a/ and /b/ by /t/. /t/ is clamped between 0 and 1.*/
  public lerp(a: number, b: number, t: number)  {
    return a + (b - a) * this.clamp(t);
  }

  /** Calculates the ::ref::Lerp parameter between of two values. */
  public inverseLerp(a: number, b: number, value: number)  {
    if (a != b)
                return this.clamp((value - a) / (b - a));
            else
                return 0;
  }
}

export const Mathf = new MathImpl();
