/**
 * Galaxy Heritage Club plans (Studio room), one row per Key, one card per tenure.
 *
 * !! PLACEHOLDER PRICES !! The amounts below were copied from a competitor's public plans page as stand-ins while the
 * real Galaxy Heritage World prices are decided. Replace `total` and `emi` (in rupees) here and every card, the compare
 * table and the page update automatically.
 */
export type TierKey = 'SILVER' | 'GOLD' | 'PLATINUM';

export interface Plan {
  id: string;
  tier: TierKey;
  years: number;
  room: string;
  /** total package cost in rupees */
  total: number;
  /** EMI starting amount per month in rupees */
  emi: number;
}

export interface TierStyle {
  key: TierKey;
  /** card surface + text colours */
  card: string;
  muted: string;
  divider: string;
  button: string;
  buttonOn: string;
}

export const TIERS: TierStyle[] = [
  {
    key: 'SILVER',
    card: 'bg-[#0c0c0d] text-white',
    muted: 'text-white/65',
    divider: 'bg-white/25',
    button: 'border-white/60 text-white hover:bg-white hover:text-ink',
    buttonOn: 'border-accent bg-accent text-ink',
  },
  {
    key: 'GOLD',
    card: 'bg-[#e9e4d3] text-ink',
    muted: 'text-ink/60',
    divider: 'bg-ink/20',
    button: 'border-ink/50 text-ink hover:bg-ink hover:text-white',
    buttonOn: 'border-ink bg-ink text-white',
  },
  {
    key: 'PLATINUM',
    card: 'bg-[#1b6b62] text-white',
    muted: 'text-white/70',
    divider: 'bg-white/25',
    button: 'border-white/60 text-white hover:bg-white hover:text-ink',
    buttonOn: 'border-accent bg-accent text-ink',
  },
];

const plan = (tier: TierKey, years: number, total: number, emi: number): Plan => ({
  id: `${tier.toLowerCase()}-${years}`,
  tier,
  years,
  room: 'Studio',
  total,
  emi,
});

export const PLANS: Plan[] = [
  plan('SILVER', 20, 1165000, 26414),
  plan('SILVER', 15, 975000, 22106),
  plan('SILVER', 10, 740000, 21959),
  plan('SILVER', 5, 575000, 20850), // invented placeholder (not in the reference)
  plan('GOLD', 20, 775000, 17571),
  plan('GOLD', 15, 660000, 14964),
  plan('GOLD', 10, 510000, 15134),
  plan('GOLD', 5, 410000, 15904),
  plan('PLATINUM', 20, 555000, 11797),
  plan('PLATINUM', 15, 485000, 10309),
  plan('PLATINUM', 10, 395000, 10342),
  plan('PLATINUM', 5, 325000, 10810), // invented placeholder (not in the reference)
];

/** Indian digit grouping, e.g. 1165000 -> "₹11,65,000/-" */
export const rupees = (n: number) => `₹${n.toLocaleString('en-IN')}/-`;
