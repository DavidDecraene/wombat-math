// https://github.com/Unity-Technologies/UnityCsReference/blob/02d565cf3dd0f6b15069ba976064c75dc2705b08/Runtime/Export/Math/Mathf.cs#L360


class MathImpl {
  public static readonly DegToRad = Math.PI / 180;
  public static readonly RadToDef = 180 / Math.PI;

  /** Clamps a value between a minimum float and maximum float value.  */
  public clamp(value: number, min: number, max: number): number {
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
}

export const Mathf = new MathImpl();
