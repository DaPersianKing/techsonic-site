export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#09090B',
        surface: '#18181B',
        'surface-secondary': '#111827',
        'brand-primary': '#2563EB',
        'brand-text': '#2563EB',
        'brand-subtext': '#94A3B8',
        'brand-stripe': 'rgba(255,255,255,0.18)',
        'brand-background': '#ffffff',
        accent: '#38BDF8',
        success: '#22C55E',
        text: '#FFFFFF',
        muted: '#A1A1AA',
        'text-placeholder': '#64748B', // slate-500 equivalent
        'text-error': '#F43F5E' // rose-400 equivalent
      },
      boxShadow: {
        soft: '0 30px 90px rgba(0,0,0,0.32)',
        glow: '0 0 0 40px rgba(56,189,248,0.08)',
        'shadow-accent': '0 18px 45px rgba(56,189,248,0.22)'
      }
    }
  },
  plugins: []
};
