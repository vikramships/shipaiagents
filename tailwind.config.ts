import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--color-background)",
        foreground: "var(--color-foreground)",
        card: "var(--color-card)",
        "card-foreground": "var(--color-card-foreground)",
        primary: "var(--color-primary)",
        "primary-foreground": "var(--color-primary-foreground)",
        secondary: "var(--color-secondary)",
        "secondary-foreground": "var(--color-secondary-foreground)",  
        muted: "var(--color-muted)",
        "muted-foreground": "var(--color-muted-foreground)",
        accent: "var(--color-accent)",
        "accent-foreground": "var(--color-accent-foreground)",
        border: "var(--color-border)",
        ring: "var(--color-ring)",
        
        // Category colors
        "product-strategy": "var(--color-product-strategy)",
        development: "var(--color-development)",
        "design-ux": "var(--color-design-ux)",
        "quality-testing": "var(--color-quality-testing)",
        operations: "var(--color-operations)",
        "business-analytics": "var(--color-business-analytics)",
        "ai-innovation": "var(--color-ai-innovation)",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "Menlo", "monospace"],
      },
      spacing: {
        xs: "var(--spacing-xs)",
        sm: "var(--spacing-sm)", 
        md: "var(--spacing-md)",
        lg: "var(--spacing-lg)",
        xl: "var(--spacing-xl)",
        "2xl": "var(--spacing-2xl)",
        "3xl": "var(--spacing-3xl)",
      },
      borderRadius: {
        xs: "var(--radius-sm)",
        sm: "var(--radius)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
      },
      boxShadow: {
        xs: "var(--shadow-sm)",
        sm: "var(--shadow)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        xl: "var(--shadow-xl)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.3s ease-out",
        "scale-in": "scaleIn 0.2s ease-out",
        "float": "float 6s ease-in-out infinite",
      },
      transitionTimingFunction: {
        "premium": "cubic-bezier(0.4, 0, 0.2, 1)",
        "premium-spring": "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
      },
      letterSpacing: {
        tight: "-0.025em",
        normal: "0em",
        wide: "0.025em",
      }
    },
  },
  plugins: [
    function({ addUtilities }: any) {
      const newUtilities = {
        '.line-clamp-2': {
          overflow: 'hidden',
          display: '-webkit-box',
          '-webkit-box-orient': 'vertical',
          '-webkit-line-clamp': '2',
        },
        '.line-clamp-4': {
          overflow: 'hidden',
          display: '-webkit-box',
          '-webkit-box-orient': 'vertical',
          '-webkit-line-clamp': '4',
        },
      }
      addUtilities(newUtilities, ['responsive'])
    },
  ],
};

export default config;