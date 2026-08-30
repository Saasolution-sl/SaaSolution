'use client';

import Image from 'next/image';
import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { FaApple, FaGooglePlay, FaLinux, FaWindows } from 'react-icons/fa6';
import { SiHuawei } from 'react-icons/si';
import type { IconType } from 'react-icons';

const releasePage = 'https://github.com/Saasolution-sl/SaaSolution/releases';
const googlePlayUrl = 'https://play.google.com/store/apps/details?id=es.saasolution.drive';
const appStoreUrl = 'https://apps.apple.com/us/search?term=SaaSolution%20Drive';
const appGalleryUrl = 'https://appgallery.huawei.com/';
const linuxCommand = 'curl -fsSL https://saasolution.es/drive/install.sh | sh';

type Platform = {
  id: string;
  number: string;
  name: string;
  summary: string;
  requirement: string;
  description: string;
  icon: IconType;
  kind: 'desktop' | 'mobile' | 'linux';
  href?: string;
  action?: string;
  badge?: 'apple' | 'google' | 'huawei';
};

const platforms: Platform[] = [
  {
    id: 'windows',
    number: '01',
    name: 'Windows',
    summary: 'Native desktop app',
    requirement: 'Requires Windows 10 or Windows 11 on a 64-bit PC.',
    description: 'Choose the latest Windows installer from the public release channel. Release notes and checksums will be listed alongside every build.',
    icon: FaWindows,
    kind: 'desktop',
    href: releasePage,
    action: 'View Windows downloads',
  },
  {
    id: 'macos',
    number: '02',
    name: 'macOS',
    summary: 'Native Mac app',
    requirement: 'Requires macOS 14 Sonoma or later on Apple silicon or Intel.',
    description: 'The macOS release channel will provide a signed universal installer together with release notes and checksum information.',
    icon: FaApple,
    kind: 'desktop',
    href: releasePage,
    action: 'View macOS downloads',
  },
  {
    id: 'linux',
    number: '03',
    name: 'Linux',
    summary: 'One-command installation',
    requirement: 'Requires a 64-bit x86 or ARM system, curl, tar and a supported systemd-based distribution.',
    description: 'Run the command in a terminal. The installer verifies the published checksum and installs SaaSolution Drive for the current user.',
    icon: FaLinux,
    kind: 'linux',
  },
  {
    id: 'google-play',
    number: '04',
    name: 'Google Play',
    summary: 'Android phones and tablets',
    requirement: 'Requires Android 8.0 or later and access to Google Play.',
    description: 'Scan the QR code with your Android device or use the store link to open the SaaSolution Drive listing.',
    icon: FaGooglePlay,
    kind: 'mobile',
    href: googlePlayUrl,
    badge: 'google',
  },
  {
    id: 'app-store',
    number: '05',
    name: 'Apple App Store',
    summary: 'iPhone and iPad',
    requirement: 'Requires iOS or iPadOS 17 or later and an Apple ID.',
    description: 'Scan the QR code with your iPhone or iPad, or continue to the App Store from this device.',
    icon: FaApple,
    kind: 'mobile',
    href: appStoreUrl,
    badge: 'apple',
  },
  {
    id: 'appgallery',
    number: '06',
    name: 'Huawei AppGallery',
    summary: 'Huawei phones and tablets',
    requirement: 'Requires a compatible Huawei device with AppGallery and HMS Core.',
    description: 'Scan the QR code with your Huawei device or continue to AppGallery from this device.',
    icon: SiHuawei,
    kind: 'mobile',
    href: appGalleryUrl,
    badge: 'huawei',
  },
];

function StoreBadge({ badge }: { badge: Platform['badge'] }) {
  if (badge === 'apple') {
    return <Image src="/download-on-app-store.svg" alt="Download on the App Store" width={144} height={48} />;
  }
  if (badge === 'huawei') {
    return <Image src="/huawei-appgallery-badge.png" alt="Explore it on Huawei AppGallery" width={160} height={48} />;
  }
  return <Image src="/get-it-on-google-play.png" alt="Get it on Google Play" width={186} height={72} style={{ width: 'auto' }} />;
}

export function DownloadOptions() {
  const [openPlatform, setOpenPlatform] = useState('windows');
  const [copied, setCopied] = useState(false);

  async function copyLinuxCommand() {
    await navigator.clipboard.writeText(linuxCommand);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="download-list" aria-label="SaaSolution Drive downloads">
      {platforms.map((platform) => {
        const isOpen = openPlatform === platform.id;
        const PlatformIcon = platform.icon;
        const panelId = `download-panel-${platform.id}`;

        return (
          <article className={`download-platform ${isOpen ? 'open' : ''}`} key={platform.id}>
            <button
              className="download-toggle"
              type="button"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => setOpenPlatform(isOpen ? '' : platform.id)}
            >
              <span className="download-number">{platform.number}</span>
              <span className="platform-icon" aria-hidden="true"><PlatformIcon /></span>
              <span className="download-name"><b>{platform.name}</b><small>{platform.summary}</small></span>
              <span className="download-action">Download <i aria-hidden="true">{isOpen ? '−' : '+'}</i></span>
            </button>

            <div className="download-panel" id={panelId} hidden={!isOpen}>
              <div className="download-panel-copy">
                <p>{platform.description}</p>
                <small>{platform.requirement}</small>
              </div>

              {platform.kind === 'linux' ? (
                <div className="command-box">
                  <code>{linuxCommand}</code>
                  <button type="button" onClick={copyLinuxCommand}>{copied ? 'Copied' : 'Copy command'}</button>
                  <p>The installer channel activates when the first verified Linux build is published.</p>
                </div>
              ) : platform.kind === 'mobile' && platform.href ? (
                <div className="mobile-download">
                  <div className="qr-shell" aria-label={`QR code for ${platform.name}`}>
                    <QRCodeSVG value={platform.href} size={132} level="M" bgColor="#ffffff" fgColor="#10201e" />
                  </div>
                  <div>
                    <span>Scan to open on your device</span>
                    <a className={`mobile-store-badge ${platform.badge}`} href={platform.href} target="_blank" rel="noreferrer"><StoreBadge badge={platform.badge} /></a>
                  </div>
                </div>
              ) : platform.href ? (
                <a className="platform-download-button" href={platform.href} target="_blank" rel="noreferrer">
                  <PlatformIcon aria-hidden="true" />
                  <span>{platform.action}</span>
                  <i aria-hidden="true">↗</i>
                </a>
              ) : null}

              <p className="release-status"><b>Release status</b> The download channel is ready, but public binaries and final store listings have not been published yet.</p>
            </div>
          </article>
        );
      })}
    </div>
  );
}
