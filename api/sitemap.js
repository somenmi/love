export default (req, res) => {
    // Важно: XML в ОДНУ строку без переносов!
    const xml = '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://awalores-only.vercel.app/</loc><lastmod>2025-04-15</lastmod><changefreq>weekly</changefreq><priority>1.0</priority></url><url><loc>https://awalores-only.vercel.app/music.html</loc><lastmod>2025-04-15</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url><url><loc>https://awalores-only.vercel.app/faq.html</loc><lastmod>2025-04-15</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url><url><loc>https://awalores-only.vercel.app/splash.html</loc><lastmod>2025-04-15</lastmod><changefreq>yearly</changefreq><priority>0.1</priority></url></urlset>';
    
    res.setHeader('Content-Type', 'application/xml');
    res.end(xml); // Используем res.end() вместо res.send()
  };