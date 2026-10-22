/* CTC → in-hand maths for the salary calculator. Same model as the SEO team's
   redesign brief, so the worked ₹18 LPA example on the page matches the tool.

   - Basic is 40% or 50% of CTC. HRA is 50% of basic in a metro, 40% elsewhere;
     special allowance balances the rest of gross.
   - Employer PF = employee PF = 12% of basic, optionally capped at ₹1,800/month.
   - Gratuity (4.81% of basic) sits inside CTC when switched on.
   - Professional tax is ₹2,400 a year (varies by state).
   - Income tax: new regime, ₹75,000 standard deduction, nil up to ₹12L taxable
     (87A rebate, with marginal relief), 4% cess. Surcharge, bonus and ESI are
     not included, the assumptions note under the breakup says so. */

export type Inputs = {
  ctc: number;
  basicPct: 40 | 50;
  metro: boolean;
  pfCap: boolean;
  gratuity: boolean;
};

export type Result = {
  ctc: number;
  basic: number;
  hra: number;
  special: number;
  gross: number;
  employerPf: number;
  gratuity: number;
  employeePf: number;
  professionalTax: number;
  tax: number;
  taxable: number;
  inhand: number;
};

const SLABS: [number, number][] = [
  [400000, 0],
  [800000, 0.05],
  [1200000, 0.1],
  [1600000, 0.15],
  [2000000, 0.2],
  [2400000, 0.25],
  [Infinity, 0.3],
];

export const MAX_CTC = 100000000;

export function calculate(i: Inputs): Result {
  const ctc = Math.max(0, Math.min(i.ctc || 0, MAX_CTC));
  const basic = (ctc * i.basicPct) / 100;
  const employerPf = i.pfCap ? Math.min(basic * 0.12, 21600) : basic * 0.12;
  const gratuity = i.gratuity ? basic * 0.0481 : 0;
  const gross = Math.max(ctc - employerPf - gratuity, 0);
  const hra = Math.min(basic * (i.metro ? 0.5 : 0.4), Math.max(gross - basic, 0));
  const special = Math.max(gross - basic - hra, 0);
  const employeePf = employerPf;
  const professionalTax = ctc > 0 ? 2400 : 0;

  const taxable = Math.max(gross - 75000, 0);
  let tax = 0;
  let floor = 0;
  for (const [ceil, rate] of SLABS) {
    if (taxable > floor) tax += (Math.min(taxable, ceil) - floor) * rate;
    floor = ceil;
  }
  tax = taxable <= 1200000 ? 0 : Math.min(tax, taxable - 1200000);
  tax *= 1.04;

  const inhand = Math.max(gross - employeePf - professionalTax - tax, 0);
  return { ctc, basic, hra, special, gross, employerPf, gratuity, employeePf, professionalTax, tax, taxable, inhand };
}

export const inr = (n: number) => "₹" + Math.round(n).toLocaleString("en-IN");
