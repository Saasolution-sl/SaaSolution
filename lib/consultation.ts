import { z } from 'zod';

/**
 * Consultation request — shared by the browser form (client-side validation) and
 * the API route (server-side validation). Error messages are stable CODES, which
 * the form maps to localized text.
 */
export const consultationServices = ['general', 'consultancy', 'audit', 'tender', 'oversight', 'ai', 'public', 'private', 'healthcheck'] as const;
export const organizationTypes = ['private', 'public', 'nonprofit', 'other'] as const;

export const consultationSchema = z.object({
  fullName: z.string().trim().min(2, 'required').max(100, 'tooLong'),
  organization: z.string().trim().min(2, 'required').max(150, 'tooLong'),
  email: z.email('email').max(254, 'tooLong'),
  phone: z.string().trim().max(40, 'tooLong').optional(),
  country: z.string().trim().min(2, 'required').max(80, 'tooLong'),
  organizationType: z.enum(organizationTypes, { error: 'required' }),
  service: z.enum(consultationServices, { error: 'required' }),
  message: z.string().trim().min(10, 'messageShort').max(2000, 'tooLong'),
  language: z.enum(['en', 'es']),
  privacyAccepted: z.literal(true, { error: 'consent' }),
  /** Health Check follow-up: the visitor explicitly opts in to attach the summary. */
  attachSummary: z.boolean().optional(),
  summary: z.string().max(3000).optional(),
  /** Honeypot — real visitors never see or fill this. */
  website: z.string().max(200).optional(),
  /** Epoch ms when the form was rendered (minimum-fill-time spam check). */
  startedAt: z.number().int(),
});

export type ConsultationRequest = z.infer<typeof consultationSchema>;
export type ConsultationErrorCode = 'required' | 'email' | 'tooLong' | 'messageShort' | 'consent';

/** Convert a zod error into { field: code } for the form. */
export function fieldErrors(error: z.ZodError): Partial<Record<string, ConsultationErrorCode>> {
  const out: Partial<Record<string, ConsultationErrorCode>> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? 'form');
    if (!out[key]) out[key] = (['required', 'email', 'tooLong', 'messageShort', 'consent'].includes(issue.message) ? issue.message : 'required') as ConsultationErrorCode;
  }
  return out;
}
