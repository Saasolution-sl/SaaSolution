export type EdgePlatformStatus = 'Planned' | 'Not yet supported';

export type EdgePlatform = {
  id: string;
  name: string;
  detail: string;
  status: EdgePlatformStatus;
};

export const edgePlatforms: EdgePlatform[] = [
  { id: 'docker', name: 'Docker', detail: 'The first packaging target for the Linux Edge Agent.', status: 'Planned' },
  { id: 'linux', name: 'Generic Linux', detail: 'A native service is being designed for supported 64-bit distributions.', status: 'Planned' },
  { id: 'x86', name: 'Generic x86-64', detail: 'Architecture support is present in the engineering plan, not a public build.', status: 'Planned' },
  { id: 'arm', name: 'Generic ARM64', detail: 'Architecture support is present in the engineering plan, not a public build.', status: 'Planned' },
  { id: 'synology', name: 'Synology DSM', detail: 'Container Manager packaging and DSM validation are still required.', status: 'Not yet supported' },
  { id: 'qnap', name: 'QNAP QTS/QuTS', detail: 'Container Station packaging and vendor validation are still required.', status: 'Not yet supported' },
  { id: 'truenas', name: 'TrueNAS SCALE', detail: 'Application packaging and dataset validation are still required.', status: 'Not yet supported' },
  { id: 'unraid', name: 'Unraid', detail: 'A Community Applications template has not been released.', status: 'Not yet supported' },
  { id: 'raspberry', name: 'Raspberry Pi OS 64-bit', detail: 'Hardware and storage endurance validation are still required.', status: 'Not yet supported' },
  { id: 'windows-server', name: 'Windows Server', detail: 'No supported or tested Edge service is available for Windows Server.', status: 'Not yet supported' },
];

export const edgeFaqs = [
  {
    question: 'Is SaaSolution Drive Edge available to install today?',
    answer: 'Not yet. The agent foundation is in active engineering, but public installers, signed container images and production enrollment services have not been released. You can request early access without being sent to a fake download.',
  },
  {
    question: 'Can people work when the internet is unavailable?',
    answer: 'The design keeps an authorized local operational copy on each site, so existing LAN access does not depend on a live Cubbit connection. Changes are journaled locally and synchronize after connectivity returns.',
  },
  {
    question: 'Does Edge silently overwrite concurrent edits?',
    answer: 'No. The planned conflict workflow preserves both concurrent versions. Text may be merged only when it can be done safely; binary files are presented to an administrator for an explicit choice.',
  },
  {
    question: 'Is synchronization the same as an immutable backup?',
    answer: 'No. Version history can assist recovery, but synchronization can propagate valid changes. Independent backups remain important. Object Lock is optional and depends on the selected retention design.',
  },
  {
    question: 'Can I use an existing SMB or NFS share?',
    answer: 'That is the intended deployment model. The NAS continues to provide SMB or NFS locally while Edge watches an approved host folder. Exact vendor procedures will be published only after platform validation.',
  },
];

export const troubleshootingEntries = [
  ['Node appears offline', 'Confirm local power and LAN access, then check outbound HTTPS connectivity and the privacy-safe health report. Local file access should remain available.'],
  ['Pairing code expired', 'Generate a new short-lived pairing code in Admin → Edge Nodes. Never reuse an expired code or paste a permanent secret into a command.'],
  ['Cubbit credentials rejected', 'Confirm the assigned project and bucket permissions. Do not send access keys, encryption keys or recovery codes to support.'],
  ['Folder permissions incorrect', 'Verify that the dedicated non-root Edge account can read, create, rename and delete a test file inside only the approved synchronization root.'],
  ['Files remain pending', 'Check the node journal, schedule, bandwidth limit, remote availability and whether a safety pause is active. Pending items should not be deleted.'],
  ['Not enough disk space', 'Free space on both the operational volume and the Edge data volume. The agent keeps a reserve before applying downloaded files.'],
  ['Filename case collision', 'Rename one of the colliding items. Case-insensitive systems can map two distinct remote names to the same local path, so materialization is intentionally blocked.'],
  ['Unsupported filename', 'Remove reserved characters or names for the destination platform, then allow the journal to retry the operation.'],
  ['Conflict requires attention', 'Open the conflict inbox, compare both retained versions and choose Keep A, Keep B, Keep both or download both for comparison.'],
  ['Upload interrupted', 'Restore connectivity and allow the idempotent journal operation to retry. Do not clear the Edge data directory.'],
  ['Initial synchronization incomplete', 'Keep the share disabled for users at a new destination until validation finishes. Check storage capacity, permissions and the pending-file count.'],
  ['SMB/NFS share unavailable', 'Check the NAS native file service separately from Edge. Edge synchronizes the host folder but does not replace the NAS file-sharing service.'],
  ['Container does not start', 'Inspect the health output for a missing image reference, architecture mismatch, read-only volume or non-root permission problem.'],
  ['ARM64 image unavailable', 'ARM64 is planned but no public image is available. Request early access and do not substitute an unverified third-party image.'],
  ['Clock or timezone warning', 'Enable reliable time synchronization on the host. Logical revisions protect causality, but accurate time keeps audits understandable.'],
  ['Collect a privacy-safe diagnostic bundle', 'Use the future diagnostics command to collect allow-listed health and configuration metadata. Review it before sharing and exclude secrets, keys, file contents and filenames.'],
] as const;
