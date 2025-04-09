export default (req, res) => {
    res.setHeader('Content-Type', 'text/plain');
    res.send(`
      User-agent: *
      Allow: /
      Sitemap: https://awalores-only.vercel.app/sitemap.xml
    `);
  };