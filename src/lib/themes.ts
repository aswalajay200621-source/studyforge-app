// HTML Note Themes - Multiple beautiful themes for different subjects and preferences

export interface Theme {
  id: string;
  name: string;
  description: string;
  preview: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
  };
  fonts: {
    heading: string;
    body: string;
    code: string;
  };
}

export const themes: Theme[] = [
  {
    id: 'modern-dark',
    name: 'Modern Dark',
    description: 'Sleek dark theme with vibrant accents',
    preview: '🌙',
    colors: {
      primary: '#6366F1',
      secondary: '#8B5CF6',
      accent: '#EC4899',
      background: '#0F172A',
      surface: '#1E293B',
      text: '#F1F5F9',
      textSecondary: '#94A3B8',
    },
    fonts: {
      heading: "'Inter', sans-serif",
      body: "'Inter', sans-serif",
      code: "'JetBrains Mono', monospace",
    },
  },
  {
    id: 'ocean-breeze',
    name: 'Ocean Breeze',
    description: 'Calm blue tones for focused studying',
    preview: '🌊',
    colors: {
      primary: '#0EA5E9',
      secondary: '#06B6D4',
      accent: '#10B981',
      background: '#F0F9FF',
      surface: '#FFFFFF',
      text: '#0C4A6E',
      textSecondary: '#64748B',
    },
    fonts: {
      heading: "'Poppins', sans-serif",
      body: "'Open Sans', sans-serif",
      code: "'Fira Code', monospace",
    },
  },
  {
    id: 'sunset-warm',
    name: 'Sunset Warm',
    description: 'Warm orange and pink gradients',
    preview: '🌅',
    colors: {
      primary: '#F59E0B',
      secondary: '#EF4444',
      accent: '#EC4899',
      background: '#FFF7ED',
      surface: '#FFFFFF',
      text: '#78350F',
      textSecondary: '#92400E',
    },
    fonts: {
      heading: "'Playfair Display', serif",
      body: "'Lora', serif",
      code: "'Source Code Pro', monospace",
    },
  },
  {
    id: 'forest-green',
    name: 'Forest Green',
    description: 'Natural green theme for biology and nature',
    preview: '🌲',
    colors: {
      primary: '#10B981',
      secondary: '#059669',
      accent: '#84CC16',
      background: '#F0FDF4',
      surface: '#FFFFFF',
      text: '#064E3B',
      textSecondary: '#047857',
    },
    fonts: {
      heading: "'Merriweather', serif",
      body: "'Georgia', serif",
      code: "'Roboto Mono', monospace",
    },
  },
  {
    id: 'royal-purple',
    name: 'Royal Purple',
    description: 'Elegant purple for premium feel',
    preview: '👑',
    colors: {
      primary: '#8B5CF6',
      secondary: '#A78BFA',
      accent: '#C084FC',
      background: '#FAF5FF',
      surface: '#FFFFFF',
      text: '#581C87',
      textSecondary: '#7C3AED',
    },
    fonts: {
      heading: "'Crimson Text', serif",
      body: "'Libre Baskerville', serif",
      code: "'IBM Plex Mono', monospace",
    },
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    description: 'Neon colors for tech and coding',
    preview: '⚡',
    colors: {
      primary: '#FF00FF',
      secondary: '#00FFFF',
      accent: '#FFFF00',
      background: '#0A0E27',
      surface: '#1A1F3A',
      text: '#00FFFF',
      textSecondary: '#FF00FF',
    },
    fonts: {
      heading: "'Orbitron', sans-serif",
      body: "'Rajdhani', sans-serif",
      code: "'Share Tech Mono', monospace",
    },
  },
];

export function getThemeById(id: string): Theme {
  return themes.find(t => t.id === id) || themes[0];
}

export function getThemeForSubject(subject: string): Theme {
  const subjectLower = subject.toLowerCase();
  
  if (subjectLower.includes('bio') || subjectLower.includes('life')) {
    return getThemeById('forest-green');
  }
  if (subjectLower.includes('chem')) {
    return getThemeById('sunset-warm');
  }
  if (subjectLower.includes('physic')) {
    return getThemeById('ocean-breeze');
  }
  if (subjectLower.includes('math')) {
    return getThemeById('royal-purple');
  }
  if (subjectLower.includes('comput') || subjectLower.includes('code')) {
    return getThemeById('cyberpunk');
  }
  
  return getThemeById('modern-dark');
}

export function generateThemedHtml(
  title: string,
  content: string,
  theme: Theme,
  subject: string
): string {
  const { colors, fonts } = theme;
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Poppins:wght@300;400;500;600;700;800&family=Playfair+Display:wght@400;500;600;700;800&family=Lora:wght@400;500;600;700&family=Merriweather:wght@300;400;700;900&family=Crimson+Text:wght@400;600;700&family=Orbitron:wght@400;500;600;700;800;900&family=Rajdhani:wght@300;400;500;600;700&family=JetBrains+Mono:wght@300;400;500;600;700&family=Fira+Code:wght@300;400;500;600;700&family=Source+Code+Pro:wght@300;400;500;600;700&family=Roboto+Mono:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@300;400;500;600;700&family=Share+Tech+Mono&family=Open+Sans:wght@300;400;500;600;700;800&family=Georgia&family=Libre+Baskerville:wght@400;700&display=swap" rel="stylesheet">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: ${fonts.body};
      background: ${colors.background};
      color: ${colors.text};
      line-height: 1.8;
      padding: 2rem;
      min-height: 100vh;
    }
    
    .container {
      max-width: 900px;
      margin: 0 auto;
      background: ${colors.surface};
      border-radius: 24px;
      padding: 3rem;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    }
    
    .header {
      text-align: center;
      margin-bottom: 3rem;
      padding-bottom: 2rem;
      border-bottom: 3px solid ${colors.primary};
    }
    
    .theme-badge {
      display: inline-block;
      background: linear-gradient(135deg, ${colors.primary}, ${colors.secondary});
      color: white;
      padding: 0.5rem 1.5rem;
      border-radius: 50px;
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 1rem;
    }
    
    h1 {
      font-family: ${fonts.heading};
      font-size: 2.5rem;
      font-weight: 800;
      color: ${colors.primary};
      margin-bottom: 0.5rem;
      line-height: 1.2;
    }
    
    .subtitle {
      color: ${colors.textSecondary};
      font-size: 1rem;
      font-weight: 500;
    }
    
    h2 {
      font-family: ${fonts.heading};
      font-size: 1.75rem;
      font-weight: 700;
      color: ${colors.primary};
      margin: 2.5rem 0 1rem;
      padding-bottom: 0.5rem;
      border-bottom: 2px solid ${colors.secondary};
    }
    
    h3 {
      font-family: ${fonts.heading};
      font-size: 1.35rem;
      font-weight: 600;
      color: ${colors.secondary};
      margin: 2rem 0 0.75rem;
    }
    
    h4 {
      font-family: ${fonts.heading};
      font-size: 1.15rem;
      font-weight: 600;
      color: ${colors.accent};
      margin: 1.5rem 0 0.5rem;
    }
    
    p {
      margin-bottom: 1.25rem;
      color: ${colors.text};
      font-size: 1.05rem;
    }
    
    strong {
      color: ${colors.primary};
      font-weight: 700;
    }
    
    em {
      color: ${colors.secondary};
      font-style: italic;
    }
    
    code {
      font-family: ${fonts.code};
      background: ${colors.background};
      color: ${colors.accent};
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
      font-size: 0.9em;
    }
    
    pre {
      background: ${colors.background};
      border-left: 4px solid ${colors.primary};
      padding: 1.5rem;
      border-radius: 8px;
      overflow-x: auto;
      margin: 1.5rem 0;
    }
    
    pre code {
      background: none;
      padding: 0;
      color: ${colors.text};
    }
    
    ul, ol {
      margin: 1rem 0 1.5rem 2rem;
    }
    
    li {
      margin-bottom: 0.75rem;
      color: ${colors.text};
      line-height: 1.7;
    }
    
    li::marker {
      color: ${colors.primary};
      font-weight: 700;
    }
    
    .callout {
      background: linear-gradient(135deg, ${colors.primary}15, ${colors.secondary}15);
      border-left: 4px solid ${colors.primary};
      padding: 1.5rem;
      border-radius: 8px;
      margin: 1.5rem 0;
    }
    
    .callout-title {
      font-weight: 700;
      color: ${colors.primary};
      margin-bottom: 0.5rem;
      font-size: 1.1rem;
    }
    
    .highlight-box {
      background: ${colors.accent}20;
      border: 2px solid ${colors.accent};
      padding: 1.5rem;
      border-radius: 12px;
      margin: 1.5rem 0;
    }
    
    .definition {
      background: ${colors.primary}10;
      border-left: 4px solid ${colors.primary};
      padding: 1rem 1.5rem;
      margin: 1rem 0;
      border-radius: 0 8px 8px 0;
    }
    
    .definition-term {
      font-weight: 700;
      color: ${colors.primary};
      font-size: 1.1rem;
      margin-bottom: 0.5rem;
    }
    
    .example {
      background: ${colors.secondary}10;
      border: 2px dashed ${colors.secondary};
      padding: 1.5rem;
      border-radius: 8px;
      margin: 1.5rem 0;
    }
    
    .example-title {
      font-weight: 700;
      color: ${colors.secondary};
      margin-bottom: 0.75rem;
      font-size: 1.05rem;
    }
    
    .formula {
      background: ${colors.background};
      border: 2px solid ${colors.accent};
      padding: 1rem;
      border-radius: 8px;
      text-align: center;
      font-family: ${fonts.code};
      font-size: 1.2rem;
      color: ${colors.accent};
      margin: 1.5rem 0;
    }
    
    blockquote {
      border-left: 4px solid ${colors.accent};
      padding-left: 1.5rem;
      margin: 1.5rem 0;
      font-style: italic;
      color: ${colors.textSecondary};
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 1.5rem 0;
      border-radius: 8px;
      overflow: hidden;
    }
    
    th {
      background: linear-gradient(135deg, ${colors.primary}, ${colors.secondary});
      color: white;
      padding: 1rem;
      text-align: left;
      font-weight: 700;
    }
    
    td {
      padding: 1rem;
      border-bottom: 1px solid ${colors.background};
    }
    
    tr:nth-child(even) {
      background: ${colors.background};
    }
    
    .footer {
      margin-top: 3rem;
      padding-top: 2rem;
      border-top: 2px solid ${colors.primary};
      text-align: center;
      color: ${colors.textSecondary};
      font-size: 0.9rem;
    }
    
    .theme-indicator {
      display: inline-block;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: ${colors.primary};
      margin-right: 0.5rem;
    }
    
    @media (max-width: 768px) {
      body {
        padding: 1rem;
      }
      
      .container {
        padding: 1.5rem;
      }
      
      h1 {
        font-size: 2rem;
      }
      
      h2 {
        font-size: 1.5rem;
      }
    }
    
    @media print {
      body {
        background: white;
      }
      
      .container {
        box-shadow: none;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="theme-badge">${theme.name} Theme ${theme.preview}</div>
      <h1>${title}</h1>
      <p class="subtitle">${subject} • Generated with AI</p>
    </div>
    
    <div class="content">
      ${content}
    </div>
    
    <div class="footer">
      <p><span class="theme-indicator"></span>Styled with ${theme.name} theme • StudyForge AI</p>
    </div>
  </div>
</body>
</html>`;
}

// Made with Bob
