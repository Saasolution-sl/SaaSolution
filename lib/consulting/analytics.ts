/**
 * Privacy-preserving conversion events.
 *
 * The site currently uses NO analytics service (see /cookies), and this module
 * deliberately does not add one. `track()` only:
 *   1. dispatches a DOM CustomEvent "saasolution:analytics" on window, and
 *   2. pushes to window.dataLayer IF a consent-gated analytics tool has already
 *      created it.
 * Nothing is sent over the network, no identifiers are created, and event
 * payloads never contain personal data or free text. If an analytics provider
 * is added later it can subscribe to these events after obtaining consent.
 *
 * Event catalogue (name → purpose):
 *   consulting_page_view      A consulting page was viewed (props: page, lang)
 *   pathway_selected          Visitor chose the public or private pathway (props: pathway)
 *   service_engaged           Visitor opened a service page from a card/link (props: service)
 *   cta_click                 A contextual call-to-action was clicked (props: cta, location)
 *   health_check_start        Health Check started
 *   health_check_complete     Health Check results shown (props: overall_label)
 *   results_to_contact_click  "Discuss My Results" clicked
 *   consultation_form_start   First interaction with the consultation form
 *   consultation_submitted    Inquiry accepted by the server (props: source)
 *   booking_click             Visitor followed the "Book a meeting" link (props: location)
 */
export type AnalyticsEvent =
  | 'consulting_page_view'
  | 'pathway_selected'
  | 'service_engaged'
  | 'cta_click'
  | 'health_check_start'
  | 'health_check_complete'
  | 'results_to_contact_click'
  | 'consultation_form_start'
  | 'consultation_submitted'
  | 'booking_click';

export function track(name: AnalyticsEvent, props: Record<string, string | number | boolean> = {}) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent('saasolution:analytics', { detail: { name, ...props } }));
  const w = window as unknown as { dataLayer?: unknown[] };
  if (Array.isArray(w.dataLayer)) w.dataLayer.push({ event: name, ...props });
}
