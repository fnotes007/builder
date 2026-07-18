/**
 * social-media.js — Social Media Links section component
 * Provides a flexible, theme-aware social media section with icon links
 */

// Social platform configurations with icon symbols and URLs
const SocialPlatforms = {
  facebook: { name: 'Facebook', icon: 'f', defaultUrl: 'https://facebook.com' },
  twitter: { name: 'Twitter / X', icon: '𝕏', defaultUrl: 'https://twitter.com' },
  instagram: { name: 'Instagram', icon: '📷', defaultUrl: 'https://instagram.com' },
  linkedin: { name: 'LinkedIn', icon: 'in', defaultUrl: 'https://linkedin.com' },
  youtube: { name: 'YouTube', icon: '▶️', defaultUrl: 'https://youtube.com' },
  github: { name: 'GitHub', icon: '🐙', defaultUrl: 'https://github.com' },
  tiktok: { name: 'TikTok', icon: '🎵', defaultUrl: 'https://tiktok.com' },
  pinterest: { name: 'Pinterest', icon: '📌', defaultUrl: 'https://pinterest.com' },
  whatsapp: { name: 'WhatsApp', icon: '💬', defaultUrl: 'https://wa.me' },
  telegram: { name: 'Telegram', icon: '✈️', defaultUrl: 'https://telegram.me' },
  email: { name: 'Email', icon: '✉️', defaultUrl: 'mailto:' },
  website: { name: 'Website', icon: '🌐', defaultUrl: 'https://' },
};

// Register the Social Media section
registerSection({
  meta: {
    type: 'social-media',
    name: 'Social Media',
    icon: '📱',
    category: 'Sections',
  },
  
  defaultData: () => ({
    type: 'social-media',
    id: uid('sec'),
    visible: true,
    heading: 'Follow Us',
    subheading: 'Connect with us on social media',
    layout: 'grid', // 'grid', 'row', 'column'
    spacing: 'medium', // 'small', 'medium', 'large'
    bgColor: '#ffffff',
    textColor: '#0f172a',
    iconSize: 48, // pixels
    hoverEffect: 'scale', // 'scale', 'glow', 'bounce', 'none'
    items: [
      { id: uid('item'), platform: 'facebook', url: 'https://facebook.com/yourpage', active: true },
      { id: uid('item'), platform: 'twitter', url: 'https://twitter.com/yourhandle', active: true },
      { id: uid('item'), platform: 'instagram', url: 'https://instagram.com/yourhandle', active: true },
      { id: uid('item'), platform: 'linkedin', url: 'https://linkedin.com/company/yourcompany', active: true },
    ],
  }),
  
  fields: [
    { key: 'heading', label: 'Section Heading', type: 'text' },
    { key: 'subheading', label: 'Subheading', type: 'text' },
    { key: 'layout', label: 'Layout', type: 'select', options: ['grid', 'row', 'column'] },
    { key: 'spacing', label: 'Spacing', type: 'select', options: ['small', 'medium', 'large'] },
    { key: 'bgColor', label: 'Background Color', type: 'color' },
    { key: 'textColor', label: 'Text Color', type: 'color' },
    { key: 'iconSize', label: 'Icon Size (px)', type: 'number', min: 24, max: 120 },
    { key: 'hoverEffect', label: 'Hover Effect', type: 'select', options: ['scale', 'glow', 'bounce', 'none'] },
    {
      key: 'items',
      label: 'Social Links',
      type: 'list',
      itemFields: [
        {
          key: 'platform',
          label: 'Platform',
          type: 'select',
          options: Object.keys(SocialPlatforms),
        },
        { key: 'url', label: 'URL / Handle', type: 'text' },
        { key: 'active', label: 'Show', type: 'toggle' },
      ],
    },
  ],
  
  render(d) {
    const spacingMap = { small: '12px', medium: '20px', large: '32px' };
    const gap = spacingMap[d.spacing] || spacingMap.medium;
    
    const layoutClass = `wb-social-${d.layout}`;
    const effectClass = d.hoverEffect !== 'none' ? `wb-social-${d.hoverEffect}` : '';
    
    // Filter active items and build links
    const links = (d.items || [])
      .filter((item) => item.active !== false)
      .map((item) => {
        const platform = SocialPlatforms[item.platform];
        if (!platform) return '';
        
        const url = item.url || platform.defaultUrl;
        return `<a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer" class="wb-social-link ${effectClass}" title="${escapeHtml(platform.name)}" style="font-size:${d.iconSize}px;">
          <span class="wb-social-icon">${platform.icon}</span>
          <span class="wb-social-label">${escapeHtml(platform.name)}</span>
        </a>`;
      })
      .join('');
    
    const headingHtml = d.heading ? `<h2 class="wb-social-heading">${escapeHtml(d.heading)}</h2>` : '';
    const subheadingHtml = d.subheading ? `<p class="wb-social-subheading">${escapeHtml(d.subheading)}</p>` : '';
    
    const containerStyle = `gap:${gap};`;
    
    return `<section id="${d.id}" class="wb-section wb-social-section" style="background-color:${escapeHtml(d.bgColor)};color:${escapeHtml(d.textColor)};padding:60px 0;">
      <div class="wb-container">
        <div class="wb-social-header">
          ${headingHtml}
          ${subheadingHtml}
        </div>
        <div class="wb-social-links ${layoutClass}" style="${containerStyle}">
          ${links}
        </div>
      </div>
    </section>`.trim();
  },
});

window.SocialPlatforms = SocialPlatforms;
