import { ChapterId, ChapterMeta, ChapterParams, StoryStep } from '../types/percent';
import {
  analyzePercentageChange,
  analyzeReverseIncrease,
  analyzeShopPrices,
  formatDollar,
  formatPct,
} from '../utils/percentMath';

export const CHAPTERS: ChapterMeta[] = [
  {
    id: 'base-anchor',
    number: 1,
    shortTitle: '100% Anchor',
    title: 'Who Owns 100%?',
    misconceptionTag: 'Mistake: Dividing by the New Value',
    summary:
      'Discover why percentage increase and decrease always divide by the Original Value—never the new price tag.',
    itemEmojiLabel: 'Canvas Backpack',
    defaultParams: {
      originalPrice: 40,
      newPrice: 50,
      reverseNewPrice: 60,
      reverseIncreasePct: 20,
      itemAPrice: 10,
      itemBPrice: 100,
      sharedDollarDiff: 5,
      costPrice: 80,
      markedPrice: 120,
      sellingPrice: 96,
    },
    questions: [
      {
        id: 'q1-1',
        prompt: 'A comic book goes up from $20 to $25. Which denominator gives the percentage increase?',
        contextLine: 'Remember: Ollie locks the 100% Anchor Ruler onto where the price started.',
        choices: [
          {
            id: 'a',
            label: '$5 ÷ $20 = 25%',
            sublabel: 'Divide the $5 rise by the Original Price ($20)',
            isCorrect: true,
            feedback:
              'Spot on! The $20 starting price is the 100% anchor, so a $5 jump is 5/20 = +25%.',
          },
          {
            id: 'b',
            label: '$5 ÷ $25 = 20%',
            sublabel: 'Divide the $5 rise by the New Price ($25)',
            isCorrect: false,
            feedback:
              'Watch out—that is Felix’s trap! $25 is the NEW price after the jump, not the 100% starting bar.',
          },
          {
            id: 'c',
            label: '$25 ÷ $20 = 125%',
            sublabel: 'Divide New Price directly by Original Price',
            isCorrect: false,
            feedback:
              '125% is the total new bar compared to the original. Subtract 100% (or divide the $5 increase) to get the 25% increase!',
          },
        ],
      },
      {
        id: 'q1-2',
        prompt: 'A cap drops from $50 down to $40. What is the percentage decrease?',
        contextLine: 'Compare the $10 drop against the 100% starting price.',
        choices: [
          {
            id: 'a',
            label: '25% decrease',
            sublabel: '$10 ÷ $40',
            isCorrect: false,
            feedback:
              'Careful! $40 is the new price after the drop. Always divide by the original $50 price.',
          },
          {
            id: 'b',
            label: '20% decrease',
            sublabel: '$10 ÷ $50',
            isCorrect: true,
            feedback:
              'Yes! The cap started at $50 (100% anchor), dropped by $10, and $10 ÷ $50 = 20% decrease.',
          },
          {
            id: 'c',
            label: '10% decrease',
            sublabel: 'Because it dropped by $10',
            isCorrect: false,
            feedback:
              '$10 is the dollar decrease, not the percentage! Only when the original price is $100 does $10 equal 10%.',
          },
        ],
      },
    ],
  },
  {
    id: 'reverse-percent',
    number: 2,
    shortTitle: 'Reverse Trap',
    title: 'The Reverse-Trip Trap',
    misconceptionTag: 'Mistake: Subtracting the Same % from New Value',
    summary:
      'When you know the new price after a percentage increase, find out why subtracting the same percentage breaks the bar.',
    itemEmojiLabel: 'Denim Jacket',
    defaultParams: {
      originalPrice: 40,
      newPrice: 50,
      reverseNewPrice: 60,
      reverseIncreasePct: 20,
      itemAPrice: 10,
      itemBPrice: 100,
      sharedDollarDiff: 5,
      costPrice: 80,
      markedPrice: 120,
      sellingPrice: 96,
    },
    questions: [
      {
        id: 'q2-1',
        prompt: 'After a +25% markup, a pair of headphones costs $100. What was the original price?',
        contextLine: 'Think in blocks: Original = 100%, Markup = +25%, so $100 = 125%.',
        choices: [
          {
            id: 'a',
            label: '$75',
            sublabel: 'Subtract 25% of $100 ($100 − $25)',
            isCorrect: false,
            feedback:
              'Trap alert! 25% of $100 ($25) is bigger than 25% of the original price. $100 represents 125%, not 100%.',
          },
          {
            id: 'b',
            label: '$80',
            sublabel: 'Divide $100 by 125% ($100 ÷ 1.25)',
            isCorrect: true,
            feedback:
              'Nailed it! $100 is 5 blocks of 25% ($20 each). Four blocks (100%) equals $80, and +25% of $80 is +$20 = $100!',
          },
          {
            id: 'c',
            label: '$125',
            sublabel: 'Add 25% to $100',
            isCorrect: false,
            feedback:
              '$100 is already the NEW price after the markup, so the original must be smaller than $100.',
          },
        ],
      },
      {
        id: 'q2-2',
        prompt: 'A sweater increased by 10% to $55. Why does subtracting 10% of $55 give the wrong original?',
        contextLine: 'Check what 100% belongs to!',
        choices: [
          {
            id: 'a',
            label: 'Because $55 is 110% of the original, not 100%',
            sublabel: '10% of $55 ($5.50) is bigger than 10% of $50 ($5)',
            isCorrect: true,
            feedback:
              'Exactly! The 10% was measured on the smaller original bar ($50), so $55 holds 110% and 1 block = $5.',
          },
          {
            id: 'b',
            label: 'Because percentages cannot be subtracted',
            sublabel: 'You can only ever add percentages',
            isCorrect: false,
            feedback:
              'You can subtract percentages when finding a decrease from the 100% original—just not to undo a rise using the new bar!',
          },
        ],
      },
    ],
  },
  {
    id: 'signed-change',
    number: 3,
    shortTitle: 'Signed Change',
    title: 'Up or Down Matters (+ / −)',
    misconceptionTag: 'Mistake: Ignoring the + or − Sign',
    summary:
      'See why Percentage Change requires a direction sign (+ for increase, − for decrease) and why round trips are not symmetric.',
    itemEmojiLabel: 'Shop Scooter',
    defaultParams: {
      originalPrice: 40,
      newPrice: 50,
      reverseNewPrice: 60,
      reverseIncreasePct: 20,
      itemAPrice: 10,
      itemBPrice: 100,
      sharedDollarDiff: 5,
      costPrice: 80,
      markedPrice: 120,
      sellingPrice: 96,
    },
    questions: [
      {
        id: 'q3-1',
        prompt: 'A skateboard drops from $80 to $60. How should you write its Percentage Change?',
        contextLine: 'Percentage Change tells both how big the change is AND which direction it moved.',
        choices: [
          {
            id: 'a',
            label: '25%',
            sublabel: 'Write just the number without a sign',
            isCorrect: false,
            feedback:
              'Careful! Without a minus sign, “25%” looks like the price went UP by 25% to $100!',
          },
          {
            id: 'b',
            label: '−25%',
            sublabel: 'Negative sign shows a $20 drop from $80',
            isCorrect: true,
            feedback:
              'Yes! Change = ($60 − $80) ÷ $80 = −$20 ÷ $80 = −25%. The minus sign immediately tells everyone the price fell.',
          },
          {
            id: 'c',
            label: '+25%',
            sublabel: 'Positive sign because $20 is positive',
            isCorrect: false,
            feedback:
              'New − Original = $60 − $80 = −$20. Because New is smaller than Original, the change is negative (−25%).',
          },
        ],
      },
      {
        id: 'q3-2',
        prompt: 'A $100 jacket rises by +20% on Monday, then falls by −20% on Tuesday. Does it return to $100?',
        contextLine: 'Watch what happens to the 100% anchor on Tuesday!',
        choices: [
          {
            id: 'a',
            label: 'Yes, +20% and −20% cancel out to $100',
            sublabel: '0% net change',
            isCorrect: false,
            feedback:
              'Oops! Monday adds 20% of $100 (+$20 → $120). Tuesday subtracts 20% of the NEW $120 (−$24 → $96)!',
          },
          {
            id: 'b',
            label: 'No, it ends at $96 (a −4% net change)',
            sublabel: '−20% of $120 is −$24, leaving $96',
            isCorrect: true,
            feedback:
              'Brilliant! Because Tuesday’s 100% anchor grew to $120, taking away 20% removes $24 instead of $20.',
          },
        ],
      },
    ],
  },
  {
    id: 'dollars-vs-percent',
    number: 4,
    shortTitle: '$ vs %',
    title: 'Dollar Bills vs. Percent Signs',
    misconceptionTag: 'Mistake: Confusing $ Profit/Discount with %',
    summary:
      'Compare a small item and a large item with the exact same $5 change to separate real dollar amounts from percentage rates.',
    itemEmojiLabel: 'Mug vs. Bike',
    defaultParams: {
      originalPrice: 40,
      newPrice: 50,
      reverseNewPrice: 60,
      reverseIncreasePct: 20,
      itemAPrice: 10,
      itemBPrice: 100,
      sharedDollarDiff: 5,
      costPrice: 80,
      markedPrice: 120,
      sellingPrice: 96,
    },
    questions: [
      {
        id: 'q4-1',
        prompt: 'Pippa makes $10 profit on a $20 scarf and $10 profit on a $100 coat. Which has the higher Profit %?',
        contextLine: 'Compare both $10 profits against their own 100% cost prices.',
        choices: [
          {
            id: 'a',
            label: 'They have the same Profit % (10%)',
            sublabel: 'Both made $10 profit',
            isCorrect: false,
            feedback:
              'That mixes up $10 (actual profit in dollars) with Profit %! $10 out of $20 is half the cost (50%), while $10 out of $100 is only 10%.',
          },
          {
            id: 'b',
            label: 'The $20 scarf (50% profit vs. 10% profit)',
            sublabel: '$10 ÷ $20 = 50%, while $10 ÷ $100 = 10%',
            isCorrect: true,
            feedback:
              'Exact! Actual Profit is $10 for both, but Profit % compares that $10 slice to each item’s Cost Price!',
          },
        ],
      },
      {
        id: 'q4-2',
        prompt: 'A tag says “$15 Discount on a $50 Lamp.” What is the Discount, and what is the Discount %?',
        contextLine: 'Keep your units crystal clear: $ for money, % for share of Marked Price.',
        choices: [
          {
            id: 'a',
            label: 'Discount = $15, Discount % = 30%',
            sublabel: '$15 ÷ $50 = 30%',
            isCorrect: true,
            feedback:
              'Spot on! You saved $15 in actual cash, which is 15/50 = 30% of the $50 marked tag.',
          },
          {
            id: 'b',
            label: 'Discount = 15%, Discount % = $30',
            sublabel: 'Swap $ and %',
            isCorrect: false,
            feedback:
              'Watch the units! Discount (without “per cent”) is always in dollars ($15), and Discount % is out of 100% (30%).',
          },
        ],
      },
    ],
  },
  {
    id: 'shop-price-tags',
    number: 5,
    shortTitle: '3 Price Tags',
    title: 'Cost, Marked & Selling Price',
    misconceptionTag: 'Mistake: Comparing to the Wrong Price Tag',
    summary:
      'Lock onto the two separate shop bridges: Profit/Loss always anchors on Cost Price, while Discount always anchors on Marked Price.',
    itemEmojiLabel: 'Headphones',
    defaultParams: {
      originalPrice: 40,
      newPrice: 50,
      reverseNewPrice: 60,
      reverseIncreasePct: 20,
      itemAPrice: 10,
      itemBPrice: 100,
      sharedDollarDiff: 5,
      costPrice: 80,
      markedPrice: 120,
      sellingPrice: 96,
    },
    questions: [
      {
        id: 'q5-1',
        prompt: 'Pippa buys a mug for $40 (Cost), tags it $60 (Marked), and sells it for $48 (Selling). How do you find Profit %?',
        contextLine: 'Ignore the price tag the customer did NOT pay—check what Pippa spent vs. received!',
        choices: [
          {
            id: 'a',
            label: 'Compare Cost ($40) & Selling ($48) → +$8 ÷ $40 = 20%',
            sublabel: 'Cost Price is the 100% anchor for Profit %',
            isCorrect: true,
            feedback:
              'Perfect! Profit only cares about Cost Price ($40) and Selling Price ($48). The $60 Marked Price stays on the shelf!',
          },
          {
            id: 'b',
            label: 'Compare Marked ($60) & Selling ($48) → $12 ÷ $60 = 20%',
            sublabel: 'Use the Marked Price as the base',
            isCorrect: false,
            feedback:
              'Careful! Marked ($60) vs. Selling ($48) measures DISCOUNT % (20% off), not Profit %!',
          },
          {
            id: 'c',
            label: 'Compare Cost ($40) & Marked ($60) → $20 ÷ $40 = 50%',
            sublabel: 'Use the Marked Price instead of Selling Price',
            isCorrect: false,
            feedback:
              'No customer actually paid $60! Profit depends on the real Selling Price ($48), not the sticker tag ($60).',
          },
        ],
      },
      {
        id: 'q5-2',
        prompt: 'For the same mug (Cost $40, Marked $60, Selling $48), which two tags measure Discount %?',
        contextLine: 'Discount is how much was knocked off the sticker tag.',
        choices: [
          {
            id: 'a',
            label: 'Cost Price ($40) and Selling Price ($48)',
            sublabel: 'Anchor on Cost Price',
            isCorrect: false,
            feedback:
              'Customers never see Pippa’s wholesale Cost Price ($40)! Discount is always measured off the Marked Price tag ($60).',
          },
          {
            id: 'b',
            label: 'Marked Price ($60) and Selling Price ($48)',
            sublabel: 'Discount = $12 off $60 → 12 ÷ 60 = 20%',
            isCorrect: true,
            feedback:
              'Champion! Marked Price ($60) is the 100% anchor for Discount %, and $12 off $60 equals a 20% discount.',
          },
        ],
      },
    ],
  },
];

export function buildChapterSteps(
  chapterId: ChapterId,
  params: ChapterParams,
  showWrongOverlay: boolean
): StoryStep[] {
  if (chapterId === 'base-anchor') {
    const a = analyzePercentageChange(params.originalPrice, params.newPrice);
    const directionWord = a.isIncrease ? 'went UP' : a.isDecrease ? 'went DOWN' : 'stayed the SAME';
    const changeLabel = a.isIncrease ? 'Increase' : a.isDecrease ? 'Decrease' : 'Change';

    return [
      {
        id: 'c1-s1',
        title: 'Start with the Original Bar (100%)',
        speaker: 'pippa',
        secondarySpeaker: 'ollie',
        mood: 'happy',
        secondaryMood: 'pointing',
        focus: 'anchor',
        speech: `Yesterday this backpack cost ${formatDollar(a.original)}. Today the price ${directionWord} to ${formatDollar(a.current)}. Before doing any math, lock our 100% Anchor onto the ORIGINAL price (${formatDollar(a.original)})!`,
        tip: 'Rule #1: Wherever the price started is always 100%.',
        formula: `Original Price = ${formatDollar(a.original)} = 100% Anchor`,
      },
      {
        id: 'c1-s2',
        title: `Measure the Dollar ${changeLabel}`,
        speaker: 'ollie',
        secondarySpeaker: 'pippa',
        mood: 'pointing',
        secondaryMood: 'happy',
        focus: 'difference',
        speech: `Compare the two bars side by side. The actual dollar ${changeLabel.toLowerCase()} is ${formatDollar(a.absDiff)} (from ${formatDollar(a.original)} to ${formatDollar(a.current)}).`,
        tip: 'First find the difference in dollars ($), not percent yet!',
        formula: `Difference = |${formatDollar(a.current)} − ${formatDollar(a.original)}| = ${formatDollar(a.absDiff)}`,
      },
      {
        id: 'c1-s3',
        title: showWrongOverlay ? 'Felix’s Trap: Wrong Denominator!' : 'Watch Out for the New-Value Trap',
        speaker: 'felix',
        secondarySpeaker: 'ollie',
        mood: 'confused',
        secondaryMood: 'warning',
        focus: 'wrong-way',
        speech: `Wait—if I divide ${formatDollar(a.absDiff)} by the NEW price (${formatDollar(a.current)}), I get ${formatPct(a.wrongNewBasePct)}. Why does Ollie say that’s wrong?`,
        tip: `Because ${formatDollar(a.current)} is the NEW bar—not the 100% starting bar! Dividing by ${formatDollar(a.current)} shrinks or stretches the ruler unfairly.`,
        formula: `WRONG: ${formatDollar(a.absDiff)} ÷ ${formatDollar(a.current)} = ${formatPct(a.wrongNewBasePct)}`,
      },
      {
        id: 'c1-s4',
        title: `Divide by the 100% Original Anchor`,
        speaker: 'ollie',
        secondarySpeaker: 'felix',
        mood: 'aha',
        secondaryMood: 'aha',
        focus: 'anchor',
        speech: `Always divide the ${formatDollar(a.absDiff)} change by the ORIGINAL ${formatDollar(a.original)} anchor! That gives ${a.absDiff} ÷ ${a.original} × 100% = ${formatPct(a.absPct)} ${changeLabel.toLowerCase()}.`,
        tip: 'Increase % or Decrease % = (Dollar Change ÷ Original Price) × 100%.',
        formula: `RIGHT: (${formatDollar(a.absDiff)} ÷ ${formatDollar(a.original)}) × 100% = ${formatPct(a.absPct)}`,
      },
    ];
  }

  if (chapterId === 'reverse-percent') {
    const r = analyzeReverseIncrease(params.reverseNewPrice, params.reverseIncreasePct);
    return [
      {
        id: 'c2-s1',
        title: 'The Mystery Original Price',
        speaker: 'pippa',
        secondarySpeaker: 'felix',
        mood: 'happy',
        secondaryMood: 'confused',
        focus: 'anchor',
        speech: `This jacket is now ${formatDollar(r.newPrice)} AFTER a +${r.increasePct}% increase. We do NOT know the original price yet—only that the original was 100%.`,
        tip: 'Notice: the 100% anchor belongs to the missing original price, NOT the new tag!',
        formula: `Original (100%) + ${r.increasePct}% = ${formatDollar(r.newPrice)}`,
      },
      {
        id: 'c2-s2',
        title: 'Felix’s Reverse-Trip Trap',
        speaker: 'felix',
        secondarySpeaker: 'ollie',
        mood: 'confused',
        secondaryMood: 'warning',
        focus: 'wrong-way',
        speech: `Easy! To undo a +${r.increasePct}% increase, I’ll just decrease ${formatDollar(r.newPrice)} by ${r.increasePct}%: ${r.increasePct}% of ${formatDollar(r.newPrice)} is $${r.wrongSubtractAmount}, so $${r.wrongOriginalPrice}?`,
        tip: `Wait! If the original were $${r.wrongOriginalPrice}, adding +${r.increasePct}% back only gives $${Math.round(r.wrongOriginalPrice * (1 + r.increasePct / 100) * 100) / 100}—not ${formatDollar(r.newPrice)}!`,
        formula: `TRAP: ${formatDollar(r.newPrice)} − (${r.increasePct}% of ${formatDollar(r.newPrice)}) = $${r.wrongOriginalPrice} ❌`,
      },
      {
        id: 'c2-s3',
        title: `Count Equal Blocks (${r.totalPct}%)`,
        speaker: 'ollie',
        secondarySpeaker: 'felix',
        mood: 'pointing',
        secondaryMood: 'aha',
        focus: 'blocks',
        speech: `Look at the blocks! Original is ${r.originalBlocks} blocks (${r.unitBlockPct}% each = 100%). The +${r.increasePct}% rise adds ${r.extraBlocks} more block${r.extraBlocks > 1 ? 's' : ''}. Together, ${r.totalBlocks} equal blocks = ${formatDollar(r.newPrice)}!`,
        tip: `Every single ${r.unitBlockPct}% block is worth ${formatDollar(r.newPrice)} ÷ ${r.totalBlocks} = $${r.valuePerBlock}.`,
        formula: `${r.totalPct}% (${r.totalBlocks} blocks) = ${formatDollar(r.newPrice)} → 1 block = $${r.valuePerBlock}`,
      },
      {
        id: 'c2-s4',
        title: 'Divide by (100% + Increase %)',
        speaker: 'pippa',
        secondarySpeaker: 'ollie',
        mood: 'aha',
        secondaryMood: 'happy',
        focus: 'blocks',
        speech: `Now take just the original ${r.originalBlocks} blocks (100%): ${r.originalBlocks} × $${r.valuePerBlock} = $${r.originalPrice}! Shortcut: divide ${formatDollar(r.newPrice)} by ${r.totalPct}% (${(r.totalPct / 100).toFixed(2)}).`,
        tip: 'Check it forwards: $' + r.originalPrice + ' + ' + r.increasePct + '% = ' + formatDollar(r.newPrice) + '!',
        formula: `Original = ${formatDollar(r.newPrice)} ÷ ${(r.totalPct / 100).toFixed(2)} = $${r.originalPrice} ✅`,
      },
    ];
  }

  if (chapterId === 'signed-change') {
    const a = analyzePercentageChange(params.originalPrice, params.newPrice);
    const reverseTrip = analyzePercentageChange(params.newPrice, params.originalPrice);
    return [
      {
        id: 'c3-s1',
        title: 'Percentage Change Has a Direction',
        speaker: 'ollie',
        secondarySpeaker: 'felix',
        mood: 'pointing',
        secondaryMood: 'happy',
        focus: 'signed-trip',
        speech: `“Percentage Increase” and “Percentage Decrease” already tell you the direction in words. But “Percentage Change” uses a + or − sign!`,
        tip: 'Always calculate (New − Original) ÷ Original × 100% so the sign appears automatically.',
        formula: `Change % = (New − Original) ÷ Original × 100%`,
      },
      {
        id: 'c3-s2',
        title: `Compute New − Original First`,
        speaker: 'pippa',
        secondarySpeaker: 'ollie',
        mood: 'happy',
        secondaryMood: 'pointing',
        focus: 'signed-trip',
        speech: `Going from ${formatDollar(a.original)} to ${formatDollar(a.current)}: New − Original = ${formatDollar(a.current)} − ${formatDollar(a.original)} = ${formatDollar(a.diff, true)}. Divide by ${formatDollar(a.original)} to get ${formatPct(a.pctChange, true)}!`,
        tip: a.diff >= 0 ? 'Positive (+) means the price went UP.' : 'Negative (−) means the price went DOWN.',
        formula: `(${formatDollar(a.current)} − ${formatDollar(a.original)}) ÷ ${formatDollar(a.original)} = ${formatPct(a.pctChange, true)}`,
      },
      {
        id: 'c3-s3',
        title: 'Why Dropping the Sign Causes Confusion',
        speaker: 'felix',
        secondarySpeaker: 'pippa',
        mood: 'confused',
        secondaryMood: 'warning',
        focus: 'wrong-way',
        speech: `If I only write “${formatPct(a.absPct)}” without a + or − sign, nobody knows if the scooter got more expensive or went on sale!`,
        tip: 'In Grade 7 math, leaving off the minus sign on a drop loses the direction completely.',
        formula: `Ambiguous: ${formatPct(a.absPct)}  vs.  Clear: ${formatPct(a.pctChange, true)}`,
      },
      {
        id: 'c3-s4',
        title: 'Flip the Trip: Different Sign & Size!',
        speaker: 'ollie',
        secondarySpeaker: 'felix',
        mood: 'aha',
        secondaryMood: 'aha',
        focus: 'signed-trip',
        speech: `Trip A (${formatDollar(a.original)} → ${formatDollar(a.current)}) is ${formatPct(a.pctChange, true)}. Trip B back (${formatDollar(a.current)} → ${formatDollar(a.original)}) uses ${formatDollar(a.current)} as the new 100% anchor—so it’s ${formatPct(reverseTrip.pctChange, true)}!`,
        tip: 'Changing direction swaps which number is the 100% Original anchor!',
        formula: `Forward: ${formatPct(a.pctChange, true)}  |  Return: ${formatPct(reverseTrip.pctChange, true)}`,
      },
    ];
  }

  if (chapterId === 'dollars-vs-percent') {
    const pctA = Math.round((params.sharedDollarDiff / params.itemAPrice) * 1000) / 10;
    const pctB = Math.round((params.sharedDollarDiff / params.itemBPrice) * 1000) / 10;
    return [
      {
        id: 'c4-s1',
        title: 'Same Dollar Bills on Two Different Items',
        speaker: 'pippa',
        secondarySpeaker: 'felix',
        mood: 'happy',
        secondaryMood: 'happy',
        focus: 'dollar-vs-pct',
        speech: `Today we added the EXACT same ${formatDollar(params.sharedDollarDiff, true)} profit onto a ${formatDollar(params.itemAPrice)} mug AND a ${formatDollar(params.itemBPrice)} bike. Both earned ${formatDollar(params.sharedDollarDiff)} in cash!`,
        tip: 'Actual Profit / Discount / Increase is measured in DOLLARS ($).',
        formula: `Mug Profit = $${params.sharedDollarDiff}   |   Bike Profit = $${params.sharedDollarDiff}`,
      },
      {
        id: 'c4-s2',
        title: 'Felix’s Mix-Up: Does Same $ Mean Same %?',
        speaker: 'felix',
        secondarySpeaker: 'ollie',
        mood: 'confused',
        secondaryMood: 'warning',
        focus: 'wrong-way',
        speech: `Since both items gained $${params.sharedDollarDiff}, shouldn’t they both have a ${params.sharedDollarDiff}% profit?`,
        tip: `No! ${params.sharedDollarDiff} dollars is NOT ${params.sharedDollarDiff}% unless the starting 100% price happens to be $100!`,
        formula: `TRAP: $${params.sharedDollarDiff} ≠ ${params.sharedDollarDiff}%`,
      },
      {
        id: 'c4-s3',
        title: 'Watch the Bars Tell the Real Story',
        speaker: 'ollie',
        secondarySpeaker: 'pippa',
        mood: 'pointing',
        secondaryMood: 'happy',
        focus: 'dollar-vs-pct',
        speech: `On the ${formatDollar(params.itemAPrice)} mug, $${params.sharedDollarDiff} is a HUGE slice: ${params.sharedDollarDiff} ÷ ${params.itemAPrice} = ${formatPct(pctA)}! On the ${formatDollar(params.itemBPrice)} bike, $${params.sharedDollarDiff} is a tiny slice: ${params.sharedDollarDiff} ÷ ${params.itemBPrice} = ${formatPct(pctB)}.`,
        tip: 'Percent (%) compares the dollar change to the size of the whole 100% bar.',
        formula: `Mug: +${formatPct(pctA)} (${formatDollar(params.sharedDollarDiff)}/${formatDollar(params.itemAPrice)})  |  Bike: +${formatPct(pctB)} (${formatDollar(params.sharedDollarDiff)}/${formatDollar(params.itemBPrice)})`,
      },
      {
        id: 'c4-s4',
        title: 'Two Questions, Two Different Units',
        speaker: 'pippa',
        secondarySpeaker: 'ollie',
        mood: 'aha',
        secondaryMood: 'aha',
        focus: 'dollar-vs-pct',
        speech: `Always check the question’s last words! “Find the profit/discount” asks for DOLLARS ($). “Find the profit/discount PER CENT” asks for a PERCENT (%) out of 100%.`,
        tip: 'Look for “$” (how much money) vs. “per cent / %” (fraction of the 100% anchor).',
        formula: `Profit ($) = $${params.sharedDollarDiff}  vs.  Profit % = ${formatPct(pctA)} or ${formatPct(pctB)}`,
      },
    ];
  }

  // Chapter 5: shop-price-tags
  const s = analyzeShopPrices(params.costPrice, params.markedPrice, params.sellingPrice);
  const profitWord = s.isProfit ? 'Profit' : s.isLoss ? 'Loss' : 'Break-Even';

  return [
    {
      id: 'c5-s1',
      title: 'Meet the Three Shop Price Tags',
      speaker: 'pippa',
      secondarySpeaker: 'ollie',
      mood: 'happy',
      secondaryMood: 'pointing',
      focus: 'bridge-compare',
      speech: `Every item in my shop has THREE prices: Cost Price (${formatDollar(s.costPrice)}, what I paid), Marked Price (${formatDollar(s.markedPrice)}, on the shelf sticker), and Selling Price (${formatDollar(s.sellingPrice)}, what the customer paid).`,
      tip: 'Never compare all three in one giant fraction—each question pairs just TWO tags!',
      formula: `CP = ${formatDollar(s.costPrice)}  |  MP = ${formatDollar(s.markedPrice)}  |  SP = ${formatDollar(s.sellingPrice)}`,
    },
    {
      id: 'c5-s2',
      title: `Bridge 1: ${profitWord} % Uses Cost & Selling`,
      speaker: 'pippa',
      secondarySpeaker: 'ollie',
      mood: 'pointing',
      secondaryMood: 'happy',
      focus: 'bridge-profit',
      speech: `To find ${profitWord} %, ignore the Marked Price sticker! Compare what I paid (Cost ${formatDollar(s.costPrice)} = 100% Anchor) with what I got (Selling ${formatDollar(s.sellingPrice)}). ${profitWord} = ${formatDollar(s.absProfitDollar)} ÷ ${formatDollar(s.costPrice)} = ${formatPct(s.absProfitPct)}.`,
      tip: 'Profit % and Loss % ALWAYS anchor 100% on Cost Price (CP).',
      formula: `${profitWord} % = (${formatDollar(s.absProfitDollar)} ÷ Cost ${formatDollar(s.costPrice)}) × 100% = ${formatPct(s.absProfitPct)}`,
    },
    {
      id: 'c5-s3',
      title: 'Bridge 2: Discount % Uses Marked & Selling',
      speaker: 'ollie',
      secondarySpeaker: 'felix',
      mood: 'pointing',
      secondaryMood: 'aha',
      focus: 'bridge-discount',
      speech: `Customers don’t know my Cost Price! For Discount %, ignore Cost Price and compare Marked Price (${formatDollar(s.markedPrice)} = 100% Anchor) with Selling Price (${formatDollar(s.sellingPrice)}).`,
      tip: 'Discount % ALWAYS anchors 100% on Marked Price (MP).',
      formula: s.isDiscount
        ? `Discount % = (${formatDollar(s.discountDollar)} ÷ Marked ${formatDollar(s.markedPrice)}) × 100% = ${formatPct(s.discountPct)}`
        : `Selling (${formatDollar(s.sellingPrice)}) ≥ Marked (${formatDollar(s.markedPrice)}) → 0% Discount`,
    },
    {
      id: 'c5-s4',
      title: 'Catch the Wrong-Tag Trap!',
      speaker: 'felix',
      secondarySpeaker: 'pippa',
      mood: showWrongOverlay ? 'confused' : 'aha',
      secondaryMood: 'happy',
      focus: showWrongOverlay ? 'wrong-way' : 'bridge-compare',
      speech: showWrongOverlay
        ? `If I accidentally divide the ${formatDollar(s.absProfitDollar)} ${profitWord.toLowerCase()} by Marked Price (${formatDollar(s.markedPrice)}), I get ${formatPct(s.wrongProfitOverMarkedPct)} instead of ${formatPct(s.absProfitPct)}!`
        : `Aha! Profit/Loss Bridge = Cost (100%) ↔ Selling. Discount Bridge = Marked (100%) ↔ Selling. Two bridges, two different 100% anchors!`,
      tip: 'Toggle “Compare Wrong Way vs. Right Way” to inspect what happens when you pick the wrong price tag!',
      formula: showWrongOverlay
        ? `WRONG: ${formatDollar(s.absProfitDollar)} ÷ MP ${formatDollar(s.markedPrice)} = ${formatPct(s.wrongProfitOverMarkedPct)} ❌`
        : `${profitWord}: ${formatPct(s.absProfitPct)} (base CP)  |  Discount: ${s.isDiscount ? formatPct(s.discountPct) : '0%'} (base MP)`,
    },
  ];
}

export function getChapterById(id: ChapterId): ChapterMeta {
  return CHAPTERS.find((c) => c.id === id) || CHAPTERS[0];
}
