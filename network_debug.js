const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  page.on('request', req => {
      console.log(req.method(), req.url());
  });
  await page.goto('https://automationintesting.online/#/admin');
  await page.waitForTimeout(5000);
  const html = await page.content();
  console.log("HTML length:", html.length);
  // Try to find login fields
  await page.fill('input[name="username"]', 'admin').catch(()=>console.log('no username input by name'));
  await page.fill('input[name="password"]', 'password').catch(()=>console.log('no password input by name'));
  await page.fill('input[data-testid="username"]', 'admin').catch(()=>console.log('no username input by testid'));
  await page.fill('#username', 'admin').catch(()=>console.log('no username input by id'));
  await page.fill('#password', 'password').catch(()=>console.log('no password input by id'));
  await page.click('button[type="submit"], #doLogin').catch(()=>console.log('no submit button'));
  await page.waitForTimeout(2000);
  await browser.close();
})();