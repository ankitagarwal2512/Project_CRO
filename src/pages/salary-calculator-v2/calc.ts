/* CTC to in-hand maths for the v2 (simple) salary calculator.

   Inputs are only what an offer letter shows: CTC, variable pay, basic as a
   share of CTC, and the tax regime. Everything else uses common defaults:
   - Variable pay is part of CTC but paid separately, so it is left out of the
     monthly salary. It is still taxed, so it counts toward income tax.
   - HRA is 50% of basic; special allowance balances the rest of gross.
   - Employer PF = employee PF = 12% of basic, capped at ₹1,800/month.
   - Gratuity (4.81% of basic) sits inside CTC.
   - Professional tax is ₹2,400 a year (varies by state).
   - New regime: ₹75,000 standard deduction, nil tax up to ₹12L taxable (87A
     rebate, with marginal relief).
   - Old regime: ₹50,000 standard deduction, professional tax and employee PF
     (under 80C) deducted, 87A rebate up to ₹5L taxable. No HRA exemption or
     other investments, which the note under the breakup says.
   - 4% cess on both. Surcharge is not included. */

export type Regime = "new" | "old";

export type Inputs = {
  ctc: number;
  variable: number;
  basicPct: number;
  regime: Regime;
};

export type Result = {
  ctc: number;
  variable: number;
  basic: number;
  hra: number;
  special: number;
  gross: number;
  employerPf: number;
  gratuity: number;
  employeePf: number;
  professionalTax: number;
  tax: number; // annual, on salary + variable pay
  taxOnSalary: number; // the part deducted from monthly salary
  taxable: number;
  inhand: number; // annual, from fixed pay only
  takeHome: number; // annual, including variable pay
};

export const MAX_CTC = 100000000;

const NEW_SLABS: [number, number][] = [
  [400000, 0],
  [800000, 0.05],
  [1200000, 0.1],
  [1600000, 0.15],
  [2000000, 0.2],
  [2400000, 0.25],
  [Infinity, 0.3],
];

const OLD_SLABS: [number, number][] = [
  [250000, 0],
  [500000, 0.05],
  [1000000, 0.2],
  [Infinity, 0.3],
];

function slabTax(taxable: number, slabs: [number, number][]) {
  let tax = 0;
  let floor = 0;
  for (const [ceil, rate] of slabs) {
    if (taxable > floor) tax += (Math.min(taxable, ceil) - floor) * rate;
    floor = ceil;
  }
  return tax;
}

export function calculate(i: Inputs): Result {
  const ctc = Math.max(0, Math.min(i.ctc || 0, MAX_CTC));
  const variable = Math.max(0, Math.min(i.variable || 0, ctc));
  const fixed = ctc - variable;

  const basic = (fixed * i.basicPct) / 100;
  const employerPf = Math.min(basic * 0.12, 21600);
  const gratuity = basic * 0.0481;
  const gross = Math.max(fixed - employerPf - gratuity, 0);
  const hra = Math.min(basic * 0.5, Math.max(gross - basic, 0));
  const special = Math.max(gross - basic - hra, 0);
  const employeePf = employerPf;
  const professionalTax = ctc > 0 ? 2400 : 0;

  const income = gross + variable;
  let taxable: number;
  let tax: number;
  if (i.regime === "new") {
    taxable = Math.max(income - 75000, 0);
    tax = slabTax(taxable, NEW_SLABS);
    tax = taxable <= 1200000 ? 0 : Math.min(tax, taxable - 1200000);
  } else {
    taxable = Math.max(income - 50000 - professionalTax - Math.min(employeePf, 150000), 0);
    tax = taxable <= 500000 ? 0 : slabTax(taxable, OLD_SLABS);
  }
  tax *= 1.04;

  /* TDS on the variable pay is taken from the variable payout, the rest from salary */
  const taxOnVariable = income > 0 ? (tax * variable) / income : 0;
  const taxOnSalary = tax - taxOnVariable;
  const inhand = Math.max(gross - employeePf - professionalTax - taxOnSalary, 0);
  const takeHome = inhand + variable - taxOnVariable;

  return { ctc, variable, basic, hra, special, gross, employerPf, gratuity, employeePf, professionalTax, tax, taxOnSalary, taxable, inhand, takeHome };
}

export const inr = (n: number) => "₹" + Math.round(n).toLocaleString("en-IN");
