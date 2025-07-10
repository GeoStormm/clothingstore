const puppeteer = require('puppeteer');
const fs = require('fs');

const categories = [
  {
    name: 'Chemises',
    url: 'https://www.cafecoton.com/fr/chemises-homme',
    category: 'chemise',
  },
  {
    name: 'Pantalons',
    url: 'https://www.cafecoton.com/fr/pantalons-outlet',
    category: 'pantalon',
  },
  {
    name: 'Accessoires',
    url: 'https://www.cafecoton.com/fr/accessoires',
    category: 'accessoire',
  },
];

async function scrapeCategory(page, category) {
  await page.goto(category.url, { waitUntil: 'networkidle2' });
  await new Promise(resolve => setTimeout(resolve, 3000));

  // Try to select product cards with better selectors
  const products = await page.evaluate((cat) => {
    const items = [];
    
    // Try multiple selectors to find product cards
    const selectors = [
      '.product-item',
      '.item',
      '.product',
      '.product-list-item',
      '[data-product]',
      '.product-card',
      '.product-container'
    ];
    
    let cards = [];
    for (const selector of selectors) {
      cards = document.querySelectorAll(selector);
      if (cards.length > 0) break;
    }
    
    console.log(`Found ${cards.length} cards with selector`);
    
    for (let i = 0; i < cards.length && items.length < 7; i++) {
      const card = cards[i];
      
      // Try multiple selectors for product name
      const nameSelectors = [
        'h2', 'h3', 'h4',
        '.product-name',
        '.product-title',
        '.name',
        '.title',
        'a[href*="/fr/"]',
        '.product-item-link'
      ];
      
      let name = '';
      for (const nameSelector of nameSelectors) {
        const nameElement = card.querySelector(nameSelector);
        if (nameElement && nameElement.textContent.trim()) {
          name = nameElement.textContent.trim();
          // Skip promotional text
          if (!name.includes('Jusqu\'à') && !name.includes('OUTLET') && !name.includes('%')) {
            break;
          }
        }
      }
      
      // Get image
      const imgElement = card.querySelector('img');
      const image = imgElement ? imgElement.src : '';
      
      // Get price
      const priceSelectors = [
        '.price',
        '.product-price',
        '.price-box',
        '.special-price',
        '.current-price'
      ];
      
      let price = '';
      for (const priceSelector of priceSelectors) {
        const priceElement = card.querySelector(priceSelector);
        if (priceElement && priceElement.textContent.trim()) {
          price = priceElement.textContent.trim();
          break;
        }
      }
      
      // Get link
      const linkElement = card.querySelector('a[href*="/fr/"]');
      const link = linkElement ? linkElement.href : '';
      
      if (name && image && price && link && !name.includes('Jusqu\'à') && !name.includes('OUTLET')) {
        items.push({
          name,
          image,
          price,
          category: cat.category,
          link
        });
      }
    }
    return items;
  }, category);
  
  return products;
}

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  let allProducts = [];

  for (const category of categories) {
    console.log(`Scraping ${category.name}...`);
    const products = await scrapeCategory(page, category);
    allProducts = allProducts.concat(products);
    console.log(`Found ${products.length} products in ${category.name}`);
  }

  fs.writeFileSync('cafecoton-products-new.json', JSON.stringify(allProducts, null, 2));
  console.log('Saved products to cafecoton-products-new.json');

  await browser.close();
})(); 