
import type { Config } from "tailwindcss";

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
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				sans: ['Inter var', 'Inter', 'sans-serif'],
				mono: ['JetBrains Mono', 'monospace'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
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
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Premium brand colors
				'electric-blue': {
					DEFAULT: '#3B82F6',
					dark: '#2563EB',
					light: '#60A5FA',
				},
				'neon-violet': {
					DEFAULT: '#8B5CF6',
					dark: '#7C3AED',
					light: '#A78BFA',
				},
				'cyber-cyan': {
					DEFAULT: '#06B6D4',
					dark: '#0891B2',
					light: '#22D3EE',
				},
				// Glass-morphism colors
				'glass-white': 'rgba(255, 255, 255, 0.05)',
				'glass-white-hover': 'rgba(255, 255, 255, 0.08)',
				'glass-border': 'rgba(255, 255, 255, 0.1)',
				'glass-border-strong': 'rgba(255, 255, 255, 0.2)',
			},
			backgroundImage: {
				// Hero gradients
				'hero-gradient': 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(59, 130, 246, 0.15), transparent)',
				'hero-glow': 'radial-gradient(circle at 50% 0%, rgba(139, 92, 246, 0.1), transparent 50%)',
				// Button gradients
				'btn-primary': 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
				'btn-secondary': 'linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)',
				// Card gradients
				'card-glow': 'radial-gradient(circle at top, rgba(59, 130, 246, 0.05), transparent 60%)',
				// Background patterns
				'grid-pattern': 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
				'dot-pattern': 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)',
			},
			boxShadow: {
				// Glow effects
				'glow-blue': '0 0 40px rgba(59, 130, 246, 0.4)',
				'glow-violet': '0 0 40px rgba(139, 92, 246, 0.4)',
				'glow-cyan': '0 0 40px rgba(6, 182, 212, 0.4)',
				// Glass shadows
				'glass': '0 20px 50px rgba(0, 0, 0, 0.5)',
				'glass-lg': '0 25px 60px rgba(0, 0, 0, 0.6)',
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
				// Premium variants
				'xl': '1rem',
				'2xl': '1.25rem',
				'3xl': '1.5rem',
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'fade-in': {
					from: { opacity: '0' },
					to: { opacity: '1' }
				},
				'fade-out': {
					from: { opacity: '1' },
					to: { opacity: '0' }
				},
				'slide-in': {
					from: { transform: 'translateY(10px)', opacity: '0' },
					to: { transform: 'translateY(0)', opacity: '1' }
				},
				'slide-out': {
					from: { transform: 'translateY(0)', opacity: '1' },
					to: { transform: 'translateY(10px)', opacity: '0' }
				},
				'scale-in': {
					from: { transform: 'scale(0.95)', opacity: '0' },
					to: { transform: 'scale(1)', opacity: '1' }
				},
				'blur-in': {
					from: { filter: 'blur(5px)', opacity: '0' },
					to: { filter: 'blur(0)', opacity: '1' }
				},
				// Premium animations
				'glow-pulse': {
					'0%, 100%': { boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)' },
					'50%': { boxShadow: '0 0 40px rgba(59, 130, 246, 0.6)' }
				},
				'slide-in-bottom': {
					from: { opacity: '0', transform: 'translateY(20px)' },
					to: { opacity: '1', transform: 'translateY(0)' }
				},
				'fade-in-blur': {
					from: { opacity: '0', filter: 'blur(8px)' },
					to: { opacity: '1', filter: 'blur(0px)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-out',
				'fade-out': 'fade-out 0.3s ease-out',
				'slide-in': 'slide-in 0.4s ease-out',
				'slide-out': 'slide-out 0.4s ease-out',
				'scale-in': 'scale-in 0.3s ease-out',
				'blur-in': 'blur-in 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
				// Premium animations
				'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
				'slide-in-bottom': 'slide-in-bottom 0.4s ease-out',
				'fade-in-blur': 'fade-in-blur 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
			},
			backdropFilter: {
				'none': 'none',
				'blur': 'blur(8px)',
				'blur-sm': 'blur(4px)',
				'blur-md': 'blur(12px)',
				'blur-lg': 'blur(16px)',
				'blur-xl': 'blur(24px)',
			},
			transitionTimingFunction: {
				'ease-out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
				'ease-in-out-circ': 'cubic-bezier(0.85, 0, 0.15, 1)',
				'bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
			},
			transitionDuration: {
				'fast': '150ms',
				'slower': '700ms',
			},
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
