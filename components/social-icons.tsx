import type { SVGProps } from 'react';

export type SocialIconName =
  | 'discord'
  | 'github'
  | 'telegram'
  | 'youtube'
  | 'x'
  | 'instagram'
  | 'tiktok'
  | 'twitch'
  | 'max'
  | 'linkedin';

export function SocialIcon({
  name,
  ...props
}: SVGProps<SVGSVGElement> & { name: SocialIconName }) {
  switch (name) {
    case 'discord':
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
          <path
            d="M8.1 7.2a9.5 9.5 0 0 1 7.8 0m-9.6 9.1c2.2 1.7 9.2 1.7 11.4 0 1.3-1 2.1-6.1 1.1-8.4a11.3 11.3 0 0 0-3-1.6l-.8 1.1a9.8 9.8 0 0 0-6 0l-.8-1.1a11.3 11.3 0 0 0-3 1.6c-1 2.3-.2 7.4 1.1 8.4Z"
            stroke="currentColor"
            strokeWidth="1.65"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9.1 13.4h.01M14.9 13.4h.01"
            stroke="currentColor"
            strokeWidth="2.6"
            strokeLinecap="round"
          />
        </svg>
      );
    case 'github':
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
          <path
            d="M12 3.2a8.8 8.8 0 0 0-2.8 17.1c.4.1.6-.2.6-.4v-1.7c-2.4.5-2.9-1-2.9-1-.4-1-.9-1.2-.9-1.2-.8-.5.1-.5.1-.5.8.1 1.3.9 1.3.9.7 1.3 2 1 2.5.8.1-.6.3-1 .6-1.2-1.9-.2-3.9-1-3.9-4.3 0-1 .3-1.7.9-2.4-.1-.2-.4-1.1.1-2.3 0 0 .7-.2 2.4.9a8.3 8.3 0 0 1 4.4 0c1.7-1.1 2.4-.9 2.4-.9.5 1.2.2 2.1.1 2.3.6.7.9 1.5.9 2.4 0 3.4-2 4.1-3.9 4.3.3.3.6.8.6 1.6v2.3c0 .2.2.5.6.4A8.8 8.8 0 0 0 12 3.2Z"
            stroke="currentColor"
            strokeWidth="1.55"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'telegram':
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
          <path
            d="m20 4-3 15-5.1-3.7-2.6 2.5.4-4.3L17.2 7 8 12.6 4 11.2 20 4Z"
            stroke="currentColor"
            strokeWidth="1.65"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'youtube':
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
          <rect
            x="3"
            y="6"
            width="18"
            height="12"
            rx="4"
            stroke="currentColor"
            strokeWidth="1.65"
          />
          <path d="m10 9.5 5 2.5-5 2.5v-5Z" fill="currentColor" />
        </svg>
      );
    case 'x':
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
          <path
            d="M5 4.5h3.8L19 19.5h-3.8L5 4.5Zm13.5 0-5.8 6.7M5.5 19.5l5.9-6.8"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'instagram':
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
          <rect
            x="4"
            y="4"
            width="16"
            height="16"
            rx="5"
            stroke="currentColor"
            strokeWidth="1.65"
          />
          <circle
            cx="12"
            cy="12"
            r="3.5"
            stroke="currentColor"
            strokeWidth="1.65"
          />
          <circle cx="17.2" cy="6.9" r="1" fill="currentColor" />
        </svg>
      );
    case 'tiktok':
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
          <path
            d="M14.2 4v9.8a4.1 4.1 0 1 1-3.4-4v3.1a1.4 1.4 0 1 0 .7 1.2V4h2.7Zm0 0c.3 2.2 1.6 3.7 3.8 4.2"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'twitch':
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
          <path
            d="M5 4h15v10l-4 4h-4l-2.5 2.5V18H5V4Z"
            stroke="currentColor"
            strokeWidth="1.65"
            strokeLinejoin="round"
          />
          <path
            d="M10 8v4M15 8v4"
            stroke="currentColor"
            strokeWidth="1.65"
            strokeLinecap="round"
          />
        </svg>
      );
    case 'max':
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
          <path
            d="M4.5 17.5V6.5l4 6 3.5-6 3.5 6 4-6v11"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'linkedin':
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
          <rect x="4" y="9" width="3" height="10" rx="1" fill="currentColor" />
          <circle cx="5.5" cy="5.5" r="1.8" fill="currentColor" />
          <path
            d="M11 19V9h3v1.7c.8-1.3 2-2 3.5-2 2.3 0 3.5 1.6 3.5 4.3v6h-3v-5.2c0-1.5-.6-2.3-1.8-2.3-1.4 0-2.2 1-2.2 2.8V19h-3Z"
            fill="currentColor"
          />
        </svg>
      );
  }
}
