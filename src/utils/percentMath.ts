export function roundToClean(val: number, decimals = 1): number {
  const factor = Math.pow(10, decimals);
  return Math.round(val * factor) / factor;
}

export function formatPct(val: number, forceSign = false): string {
  const rounded = roundToClean(val, 1);
  const absFormatted = Number.isInteger(rounded) ? `${Math.abs(rounded)}` : `${Math.abs(rounded).toFixed(1)}`;
  if (rounded > 0) {
    return `${forceSign ? '+' : ''}${absFormatted}%`;
  }
  if (rounded < 0) {
    return `−${absFormatted}%`;
  }
  return '0%';
}

export function formatDollar(val: number, forceSign = false): string {
  const rounded = Math.round(val);
  if (rounded > 0) {
    return `${forceSign ? '+' : ''}$${rounded}`;
  }
  if (rounded < 0) {
    return `−$${Math.abs(rounded)}`;
  }
  return '$0';
}

export interface ChangeAnalysis {
  original: number;
  current: number;
  diff: number;
  absDiff: number;
  pctChange: number;
  absPct: number;
  wrongNewBasePct: number;
  isIncrease: boolean;
  isDecrease: boolean;
}

export function analyzePercentageChange(original: number, current: number): ChangeAnalysis {
  const safeOriginal = Math.max(1, original);
  const safeCurrent = Math.max(1, current);
  const diff = safeCurrent - safeOriginal;
  const absDiff = Math.abs(diff);
  const pctChange = roundToClean((diff / safeOriginal) * 100, 1);
  const absPct = Math.abs(pctChange);
  const wrongNewBasePct = roundToClean((absDiff / safeCurrent) * 100, 1);

  return {
    original: safeOriginal,
    current: safeCurrent,
    diff,
    absDiff,
    pctChange,
    absPct,
    wrongNewBasePct,
    isIncrease: diff > 0,
    isDecrease: diff < 0,
  };
}

export interface ReverseAnalysis {
  newPrice: number;
  increasePct: number;
  totalPct: number;
  originalPrice: number;
  wrongSubtractAmount: number;
  wrongOriginalPrice: number;
  unitBlockPct: number;
  originalBlocks: number;
  extraBlocks: number;
  totalBlocks: number;
  valuePerBlock: number;
}

export function analyzeReverseIncrease(newPrice: number, increasePct: number): ReverseAnalysis {
  const multiplier = 1 + increasePct / 100;
  const originalPrice = roundToClean(newPrice / multiplier, 2);
  const wrongSubtractAmount = roundToClean((newPrice * increasePct) / 100, 2);
  const wrongOriginalPrice = roundToClean(newPrice - wrongSubtractAmount, 2);

  // Pick clean unit block size (e.g. 20% -> 5 base blocks + 1 extra = 6; 25% -> 4 + 1 = 5; 10% -> 10 + 1 = 11; 50% -> 2 + 1 = 3)
  let unitBlockPct = 20;
  if (increasePct === 25) unitBlockPct = 25;
  else if (increasePct === 50) unitBlockPct = 50;
  else if (increasePct === 10) unitBlockPct = 10;
  else if (increasePct === 20) unitBlockPct = 20;

  const originalBlocks = Math.round(100 / unitBlockPct);
  const extraBlocks = Math.round(increasePct / unitBlockPct);
  const totalBlocks = originalBlocks + extraBlocks;
  const valuePerBlock = roundToClean(newPrice / totalBlocks, 2);

  return {
    newPrice,
    increasePct,
    totalPct: 100 + increasePct,
    originalPrice,
    wrongSubtractAmount,
    wrongOriginalPrice,
    unitBlockPct,
    originalBlocks,
    extraBlocks,
    totalBlocks,
    valuePerBlock,
  };
}

export interface ShopPriceAnalysis {
  costPrice: number;
  markedPrice: number;
  sellingPrice: number;
  // Profit / Loss (Cost Price = 100% anchor vs Selling Price)
  profitDollar: number;
  absProfitDollar: number;
  profitPct: number;
  absProfitPct: number;
  isProfit: boolean;
  isLoss: boolean;
  isBreakEven: boolean;
  // Discount (Marked Price = 100% anchor vs Selling Price)
  discountDollar: number;
  discountPct: number;
  isDiscount: boolean;
  isAboveMarked: boolean;
  // Common student mistakes
  wrongProfitOverMarkedPct: number;
  wrongProfitOverSellingPct: number;
  wrongDiscountOverCostPct: number;
}

export function analyzeShopPrices(
  costPrice: number,
  markedPrice: number,
  sellingPrice: number
): ShopPriceAnalysis {
  const safeCost = Math.max(1, costPrice);
  const safeMarked = Math.max(1, markedPrice);
  const safeSelling = Math.max(1, sellingPrice);

  const profitDollar = safeSelling - safeCost;
  const absProfitDollar = Math.abs(profitDollar);
  const profitPct = roundToClean((profitDollar / safeCost) * 100, 1);

  const discountDollar = safeMarked - safeSelling;
  const discountPct = roundToClean((discountDollar / safeMarked) * 100, 1);

  const wrongProfitOverMarkedPct = roundToClean((absProfitDollar / safeMarked) * 100, 1);
  const wrongProfitOverSellingPct = roundToClean((absProfitDollar / safeSelling) * 100, 1);
  const wrongDiscountOverCostPct = roundToClean((Math.max(0, discountDollar) / safeCost) * 100, 1);

  return {
    costPrice: safeCost,
    markedPrice: safeMarked,
    sellingPrice: safeSelling,
    profitDollar,
    absProfitDollar,
    profitPct,
    absProfitPct: Math.abs(profitPct),
    isProfit: profitDollar > 0,
    isLoss: profitDollar < 0,
    isBreakEven: profitDollar === 0,
    discountDollar,
    discountPct,
    isDiscount: discountDollar > 0,
    isAboveMarked: discountDollar < 0,
    wrongProfitOverMarkedPct,
    wrongProfitOverSellingPct,
    wrongDiscountOverCostPct,
  };
}
