export default (req, res) => {
    res.setHeader('Content-Type', 'application/xml');
    res.send(`
      <?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>https://awalores-only.vercel.app/</loc>
        <lastmod>2025-04-15</lastmod>
        <changefreq>weekly</changefreq>
        <priority>1.0</priority>
    </url>

    <url>
        <loc>https://awalores-only.vercel.app/music.html</loc>
        <lastmod>2025-04-15</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
    </url>
  
    <url>
        <loc>https://awalores-only.vercel.app/faq.html</loc>
        <lastmod>2025-04-15</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.7</priority>
    </url>
  
    <url>
        <loc>https://awalores-only.vercel.app/splash.html</loc>
        <lastmod>2025-04-15</lastmod>
        <changefreq>yearly</changefreq>
        <priority>0.1</priority>
    </url>
    </urlset>
    `);
};