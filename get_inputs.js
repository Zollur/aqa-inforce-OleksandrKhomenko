const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://automationintesting.online/#/admin');
  await page.waitForTimeout(10000);
  const inputs = await page.evaluate(() => Array.from(document.querySelectorAll('input')).map(i => i.outerHTML));
  console.log(inputs);
  const buttons = await page.evaluate(() => Array.from(document.querySelectorAll('button')).map(i => i.outerHTML));
  console.log(buttons);
  await browser.close();
})();