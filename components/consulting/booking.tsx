'use client';

import type { Lang } from '@/lib/health-check/questions';
import { tr, type SiteLocale } from '@/lib/consulting/content';
import { ui } from '@/lib/consulting/ui';
import { track } from '@/lib/consulting/analytics';
import { useSiteLocale } from '@/app/i18n/language-provider';

/**
 * Booking page on SaaSolution's own RSViP Online scheduler.
 *
 * Why a link and not the inline embed (meet.saasolution.es/embed.js)? The scheduler currently
 * answers every request with `Content-Security-Policy: frame-ancestors 'none'` and
 * `X-Frame-Options: SAMEORIGIN`, so browsers refuse to display it inside saasolution.es (verified).
 * If RSViP Online later allows `frame-ancestors https://saasolution.es`, the embed can be added here.
 */
export const BOOKING_URL = 'https://meet.saasolution.es/othmanderaz?layout=column';

/** The scheduler accepts `locale` (en, es, nl, ar, pt, fr, de), so it opens in the language the visitor is reading. */
export const bookingUrl = (locale: SiteLocale) => `${BOOKING_URL}&locale=${locale}`;

export function BookingCard({ lang }: { lang: Lang }) {
  const { locale } = useSiteLocale();
  const tl: SiteLocale = lang === 'es' ? 'es' : locale;
  const b = ui.booking;
  return (
    <section className="cx-booking" id="booking" aria-labelledby="booking-title" data-i18n-skip>
      <h2 id="booking-title">{tr(b.heading, tl)}</h2>
      <p>{tr(b.text, tl)}</p>
      <div className="cx-actions">
        <a className="cx-btn" href={bookingUrl(tl)} target="_blank" rel="noopener" onClick={() => track('booking_click', { location: 'booking-card', locale: tl })}>
          {tr(b.link, tl)} <span aria-hidden="true">↗</span>
        </a>
      </div>
      <p className="cx-note">{tr(b.note, tl)}</p>
    </section>
  );
}
