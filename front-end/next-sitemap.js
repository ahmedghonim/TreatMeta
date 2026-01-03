/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://www.treatmeta.com',
  generateRobotsTxt: true,
  sitemapSize: 5000,
  changefreq: 'weekly',
  priority: 0.7,

  // Exclude dashboard/app routes from sitemap
  exclude: [
    '/start/*',
    '/history/*',
    '/api/*',
  ],

  // Additional paths to include
  additionalPaths: async (config) => [
    await config.transform(config, '/'),
    await config.transform(config, '/presets'),
    await config.transform(config, '/docs'),
    await config.transform(config, '/cite-us'),
    await config.transform(config, '/contact-us'),
    await config.transform(config, '/about-us'),
  ],

  // Robots.txt policies
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/start/', '/history/', '/api/'],
      },
      // AI Crawlers
      {
        userAgent: 'GPTBot',
        allow: '/',
      },
      {
        userAgent: 'ChatGPT-User',
        allow: '/',
      },
      {
        userAgent: 'Google-Extended',
        allow: '/',
      },
      {
        userAgent: 'Anthropic-AI',
        allow: '/',
      },
      {
        userAgent: 'ClaudeBot',
        allow: '/',
      },
    ],
    additionalSitemaps: [],
  },
};