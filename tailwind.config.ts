import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '1.25rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				// Two faces, self-hosted (see src/main.tsx). Familjen Grotesk sets
				// everything a person reads; Martian Mono sets only what a machine
				// recorded — dates, durations, episode numbers, timecodes.
				sans: ['"Familjen Grotesk Variable"', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Helvetica Neue', 'sans-serif'],
				mono: ['"Martian Mono Variable"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				// Two grounds, not a ground plus accents. `ink` is the dark the
				// podcast is listened in; `paper` is the record it is written on.
				// The page switches between them at a hard edge, never a gradient.
				ink: {
					DEFAULT: '#0B0B0D',
					900: '#050506',
					800: '#0B0B0D',
					700: '#141417',
					600: '#222227', // hairline rule on ink
					500: '#35353D',
					400: '#5A5A64',
				},
				paper: {
					DEFAULT: '#EDE9E1',
					100: '#F7F5F1',
					200: '#EDE9E1',
					300: '#DFDAD0',
					400: '#C6C0B4', // hairline rule on paper
					500: '#A29B8D', // muted text on ink — 7.1:1
					600: '#6E685E', // muted text on paper — 4.6:1
					700: '#4A463F', // secondary text on paper — 7.8:1
				},
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
			},
			// A record has square corners. Radius is opt-in per element (the play
			// button, the cover thumbnails) rather than the default everywhere.
			borderRadius: {
				lg: '0px',
				md: '0px',
				sm: '0px',
			},
			letterSpacing: {
				label: '0.14em',
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' },
				},
				// The page assembles itself once, top down.
				reveal: {
					from: { opacity: '0', transform: 'translateY(18px)' },
					to: { opacity: '1', transform: 'none' },
				},
				// The fracture draws itself from the point of impact outwards.
				fracture: {
					from: { strokeDashoffset: '1400' },
					to: { strokeDashoffset: '0' },
				},
				// The player bar rises from the bottom edge when playback starts.
				dock: {
					from: { transform: 'translateY(100%)' },
					to: { transform: 'none' },
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				reveal: 'reveal 0.85s cubic-bezier(0.16, 1, 0.3, 1) both',
				dock: 'dock 0.45s cubic-bezier(0.16, 1, 0.3, 1) both',
			}
		}
	},
	plugins: [animate],
} satisfies Config;
