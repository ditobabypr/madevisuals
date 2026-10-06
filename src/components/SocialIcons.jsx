// Thin line icons in the same 1.4 stroke as the site's arrows, so they read
// as part of the design rather than pasted-in brand logos.
const svgProps = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.4,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
}

export const InstagramIcon = () => (
  <svg {...svgProps}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.3" cy="6.7" r="0.6" fill="currentColor" stroke="none" />
  </svg>
)

export const YouTubeIcon = () => (
  <svg {...svgProps}>
    <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
    <path d="M10.2 9.4v5.2l4.4-2.6z" />
  </svg>
)

export const LinkedInIcon = () => (
  <svg {...svgProps}>
    <rect x="3" y="3" width="18" height="18" rx="3" />
    <path d="M8 10.5V16.5M8 7.5v.01M11.5 16.5v-6M11.5 13.3c0-1.6 1-2.8 2.4-2.8s2.1 1 2.1 2.6v3.4" />
  </svg>
)

export const MailIcon = () => (
  <svg {...svgProps}>
    <rect x="3" y="5.5" width="18" height="13" rx="2.5" />
    <path d="M3.8 7l8.2 6 8.2-6" />
  </svg>
)
