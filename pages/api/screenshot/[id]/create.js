import { ok, methodNotAllowed, unauthorized } from 'next-basics';
import { allowQuery } from 'lib/auth';
import { useAuth, useCors } from 'lib/middleware';
import { TYPE_WEBSITE } from 'lib/constants';
import { updateScreenshot } from 'queries'; 
import puppeteer from 'puppeteer';

export default async (req, res) => {
  await useCors(req, res);
  await useAuth(req, res);

  if (req.method === 'POST') {
    if (!(await allowQuery(req, TYPE_WEBSITE))) {
      return unauthorized(res);
    }

    const { id: websiteId } = req.query;
    const { url, site, step, token } = req.body;
    let domain = (new URL(site));
    domain = domain.hostname;

   

    const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
    const page = await browser.newPage();
    if(token) {
      const cookies = [{
        name: 'vitrum-auth',
        value: token,
        domain: domain,
      }];
      await page.setCookie(...cookies);
    }
    await page.goto(site);
    const image = await page.screenshot({fullPage : true});

    await browser.close();

    await updateScreenshot(websiteId, url, step, image)

    return ok(res);
  }

  return methodNotAllowed(res);
};
