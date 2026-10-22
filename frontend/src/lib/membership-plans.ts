/**
 * Galaxy Heritage Club plans (Studio room), one row per Key, one card per tenure.
 *
 * !! PLACEHOLDER PRICES !! The amounts below were copied from a competitor's public plans page as stand-ins while the
 * real Galaxy Heritage World prices are decided. Replace `total` and `emi` (in rupees) here and every card, the compare
 * table and the page update automatically.
 */
export type TierKey = 'EBONY' | 'IVORY' | 'JADE';

export interface Plan {
  id: string;
  tier: TierKey;
  years: number;
  room: string;
  /** total membership cost in rupees */
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
    key: 'EBONY',
    card: 'bg-[#0c0c0d] text-white',
    muted: 'text-white/65',
    divider: 'bg-white/25',
    button: 'border-white/60 text-white hover:bg-white hover:text-ink',
    buttonOn: 'border-accent bg-accent text-ink',
  },
  {
    key: 'IVORY',
    card: 'bg-[#e9e4d3] text-ink',
    muted: 'text-ink/60',
    divider: 'bg-ink/20',
    button: 'border-ink/50 text-ink hover:bg-ink hover:text-white',
    buttonOn: 'border-ink bg-ink text-white',
  },
  {
    key: 'JADE',
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
  plan('EBONY', 20, 1165000, 26414),
  plan('EBONY', 15, 975000, 22106),
  plan('EBONY', 10, 740000, 21959),
  plan('EBONY', 5, 575000, 20850), // invented placeholder (not in the reference)
  plan('IVORY', 20, 775000, 17571),
  plan('IVORY', 15, 660000, 14964),
  plan('IVORY', 10, 510000, 15134),
  plan('IVORY', 5, 410000, 15904),
  plan('JADE', 20, 555000, 11797),
  plan('JADE', 15, 485000, 10309),
  plan('JADE', 10, 395000, 10342),
  plan('JADE', 5, 325000, 10810), // invented placeholder (not in the reference)
];

/** Indian digit grouping, e.g. 1165000 -> "₹11,65,000/-" */
export const rupees = (n: number) => `₹${n.toLocaleString('en-IN')}/-`;
