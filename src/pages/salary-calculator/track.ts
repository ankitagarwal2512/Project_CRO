/* Analytics events for the salary calculator. Pushes to window.dataLayer, which
   GTM / GA4 on hrone.cloud read, so each event can be picked up as a trigger.

   Events
   - salary_calc_submit      { regime, recalculate }  Calculate or Recalculate pressed with valid inputs
   - salary_breakup_toggle   { open: boolean }
   - salary_breakup_email    email submitted to download the breakup PDF
   - salary_back_to_top      back-to-top button used
   - salary_cta_click        { cta }  any demo, trial, pricing or expert link, named by its text */

type Payload = Record<string, string | number | boolean>;

export function track(event: string, payload: Payload = {}) {
  const w = window as unknown as { dataLayer?: object[] };
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({ event, ...payload });
}
