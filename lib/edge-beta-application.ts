import { z } from 'zod';

export const edgeBetaApplicationSchema = z.object({
  applicationType: z.enum(['business', 'individual']),
  organizationName: z.string().trim().max(120).optional(),
  organizationSize: z.enum(['solo', '2-10', '11-50', '51-250', '251-plus']).optional(),
  role: z.string().trim().max(100).optional(),
  individualUse: z.enum(['home-lab', 'consulting', 'product-evaluation', 'other']).optional(),
  country: z.string().trim().min(2, 'Enter your country.').max(80),
  platform: z.enum(['linux-amd64', 'linux-arm64', 'raspberry-pi', 'other']),
  otherPlatform: z.string().trim().max(120).optional(),
  locations: z.enum(['one', 'two', 'three-plus']),
  dataSize: z.enum(['under-100gb', '100gb-1tb', 'over-1tb']),
  cubbitReadiness: z.enum(['ready', 'can-create', 'not-ready']),
  linuxExperience: z.enum(['comfortable', 'with-guidance', 'new-to-linux']),
  startWindow: z.enum(['now', 'within-30-days', 'researching']),
  backupConfirmed: z.literal(true, { error: 'Confirm that you will keep an independent backup.' }),
  testScopeConfirmed: z.literal(true, { error: 'Confirm that this is a test deployment.' }),
  operatorConfirmed: z.literal(true, { error: 'Confirm that a named operator will own the test.' }),
  fullName: z.string().trim().min(2, 'Enter your name.').max(100),
  email: z.email('Enter a valid email address.').max(254),
  phone: z.string().trim().max(40).optional(),
  notes: z.string().trim().max(1200).optional(),
  privacyAccepted: z.literal(true, { error: 'Accept the privacy notice to submit.' }),
  betaTermsAccepted: z.literal(true, { error: 'Accept the beta conditions to submit.' }),
  productUpdates: z.boolean().optional(),
  website: z.string().max(200).optional(),
  turnstileToken: z.string().max(2048).optional(),
  startedAt: z.number().int().positive(),
}).superRefine((application, context) => {
  if (application.applicationType === 'business') {
    if (!application.organizationName) {
      context.addIssue({ code: 'custom', path: ['organizationName'], message: 'Enter the organization name.' });
    }
    if (!application.organizationSize) {
      context.addIssue({ code: 'custom', path: ['organizationSize'], message: 'Select the organization size.' });
    }
    if (!application.role) {
      context.addIssue({ code: 'custom', path: ['role'], message: 'Enter your role.' });
    }
  }
  if (application.applicationType === 'individual' && !application.individualUse) {
    context.addIssue({ code: 'custom', path: ['individualUse'], message: 'Choose how you plan to evaluate Edge.' });
  }
  if (application.platform === 'other' && !application.otherPlatform) {
    context.addIssue({ code: 'custom', path: ['otherPlatform'], message: 'Tell us which platform you use.' });
  }
});

export type EdgeBetaApplication = z.infer<typeof edgeBetaApplicationSchema>;
export type EdgeBetaOutcome = 'instant-access' | 'guided-review' | 'platform-waitlist';

export const edgeBetaRelease = {
  version: '0.2.0-beta.1',
  base: '/drive/edge/beta/0.2.0-beta.1',
  downloads: {
    'linux-amd64': {
      label: 'Linux x86-64',
      file: 'saasolution-drive-edge_0.2.0-beta.1_linux_amd64.tar.gz',
      sha256: 'b96016ecc37f9002b1c7ba5bcbaf4760a8361baac01cc84b309ebd1af783a4dd',
    },
    'linux-arm64': {
      label: 'Linux ARM64',
      file: 'saasolution-drive-edge_0.2.0-beta.1_linux_arm64.tar.gz',
      sha256: 'ab62842a78a47b1ebe1a281098ec4bb4e3f39bb57090434e8a34e28a4874db33',
    },
  },
} as const;

export function qualifyEdgeBetaApplication(application: EdgeBetaApplication): EdgeBetaOutcome {
  if (application.platform === 'other') return 'platform-waitlist';
  if (
    application.locations === 'three-plus'
    || application.dataSize === 'over-1tb'
    || application.cubbitReadiness === 'not-ready'
    || application.linuxExperience === 'new-to-linux'
  ) {
    return 'guided-review';
  }
  return 'instant-access';
}

export function downloadForPlatform(platform: EdgeBetaApplication['platform']) {
  if (platform === 'linux-amd64') return edgeBetaRelease.downloads['linux-amd64'];
  if (platform === 'linux-arm64' || platform === 'raspberry-pi') return edgeBetaRelease.downloads['linux-arm64'];
  return null;
}
