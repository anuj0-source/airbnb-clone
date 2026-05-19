const Home = require('../models/home.model');

function escapeXml(unsafe) {
  return unsafe.replace(/[<>&'\"]/g, function (c) {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
    }
  });
}

exports.getSitemap = async (req, res, next) => {
  try {
    const baseUrl = `${req.protocol}://${req.get('host')}`;

    const urls = [];

    // Static / common pages
    urls.push({ loc: `${baseUrl}/`, changefreq: 'daily' });
    urls.push({ loc: `${baseUrl}/login`, changefreq: 'monthly' });
    urls.push({ loc: `${baseUrl}/signup`, changefreq: 'monthly' });
    urls.push({ loc: `${baseUrl}/bookings`, changefreq: 'weekly' });
    urls.push({ loc: `${baseUrl}/wishlists`, changefreq: 'weekly' });

    // Homes (dynamic)
    const homes = await Home.find().select('_id houseName updatedAt createdAt').lean();
    homes.forEach(home => {
      urls.push({ loc: `${baseUrl}/homes/${home._id}`, changefreq: 'weekly' });
    });

    // Build XML
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    urls.forEach(u => {
      xml += '  <url>\n';
      xml += `    <loc>${escapeXml(u.loc)}</loc>\n`;
      if (u.lastmod) xml += `    <lastmod>${u.lastmod}</lastmod>\n`;
      if (u.changefreq) xml += `    <changefreq>${u.changefreq}</changefreq>\n`;
      xml += '  </url>\n';
    });

    xml += '</urlset>';

    res.header('Content-Type', 'application/xml');
    // Cache for 1 hour
    res.header('Cache-Control', 'public, max-age=3600');
    res.send(xml);
  } catch (err) {
    next(err);
  }
};
