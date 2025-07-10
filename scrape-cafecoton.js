const puppeteer = require('puppeteer');
const fs = require('fs');

const categories = [
  {
    url: 'https://www.cafecoton.com/fr/chemises-homme',
    type: 'chemise',
    count: 3,
  },
  {
    url: 'https://www.cafecoton.com/fr/pantalons-outlet',
    type: 'pantalon',
    count: 3,
  },
  {
    url: 'https://www.cafecoton.com/fr/cravates',
    type: 'cravate',
    count: 3,
  },
];

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  let products = [];

  for (const cat of categories) {
    await page.goto(cat.url, { waitUntil: 'networkidle2' });
    await page.waitForSelector('.product-item');

    const productData = await page.$$eval('.product-item', (items, count) => {
      return items.slice(0, count).map(item => {
        const link = item.querySelector('.text a')?.href || '';
        const name = item.querySelector('.title.trunc')?.innerText.trim() || '';
        const image = item.querySelector('.product-thumbnail a picture img')?.src || '';
        const price = item.querySelector('.price-area span')?.innerText.trim() || '';
        return { link, name, image, price };
      });
    }, cat.count);

    for (const data of productData) {
      products.push({
        ...data,
        category: cat.type,
        url: data.link.startsWith('http') ? data.link : `https://www.cafecoton.com${data.link}`,
      });
    }
  }

  await browser.close();

  // Save to JSON
  fs.writeFileSync('cafecoton-products.json', JSON.stringify(products, null, 2), 'utf-8');
  console.log('Scraping complete! Data saved to cafecoton-products.json');
})(); 