import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Emergency Response Risk Colors
        risk: {
          safe: {
            DEFAULT: "hsl(var(--risk-safe))",
            foreground: "hsl(var(--risk-safe-foreground))",
          },
          low: {
            DEFAULT: "hsl(var(--risk-low))",
            foreground: "hsl(var(--risk-low-foreground))",
          },
          moderate: {
            DEFAULT: "hsl(var(--risk-moderate))",
            foreground: "hsl(var(--risk-moderate-foreground))",
          },
          high: {
            DEFAULT: "hsl(var(--risk-high))",
            foreground: "hsl(var(--risk-high-foreground))",
          },
          critical: {
            DEFAULT: "hsl(var(--risk-critical))",
            foreground: "hsl(var(--risk-critical-foreground))",
          },
        },
        // Emergency UI Elements
        emergency: {
          header: "hsl(var(--emergency-header))",
          "header-foreground": "hsl(var(--emergency-header-foreground))",
        },
        alert: {
          background: "hsl(var(--alert-background))",
          border: "hsl(var(--alert-border))",
          foreground: "hsl(var(--alert-foreground))",
        },
        // Dashboard & Metrics
        dashboard: {
          panel: "hsl(var(--dashboard-panel))",
          border: "hsl(var(--dashboard-border))",
        },
        metric: {
          positive: "hsl(var(--metric-positive))",
          warning: "hsl(var(--metric-warning))",
          danger: "hsl(var(--metric-danger))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
