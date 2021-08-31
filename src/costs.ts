export interface CostData {
  costBase: number;
  multiplier: number; // 1.07
}

export class Costs {
  public static getCost(currentCount: number, data: CostData, amount = 1): number | undefined {
    if (amount < 1){
      throw new Error('Amount out of range ' + amount);
    }
    if (amount === 1){
      return data.costBase * Math.pow(data.multiplier, currentCount);
    }
    const r = data.multiplier;
    return data.costBase * Math.pow(r, currentCount) * (Math.pow(r, amount) - 1) / (r - 1);
  }

  public static getMaxBuy(currentCount: number, data: CostData, income: number): number {
     const ll = (income * (data.multiplier - 1) / (data.costBase * Math.pow(data.multiplier, currentCount))) + 1;
     return Math.floor(Math.log(ll) / Math.log(data.multiplier));
  }

}
