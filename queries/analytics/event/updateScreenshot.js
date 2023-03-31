import prisma from 'lib/prisma';
import { runQuery, PRISMA } from 'lib/db';

export async function updateScreenshot(...args) {
  return runQuery({
    [PRISMA]: () => relationalQuery(...args),
  });
}

async function relationalQuery(
  websiteId,
  url,
  step,
  image
) {
  const {executeQuery, toUuid} = prisma;
  
  if(step) {
    const params = [websiteId, url, image, step];
    return executeQuery(`INSERT INTO subpages (website_id , url, screenshot, step) 
    values ( (select website_id from website where website_uuid = $1${toUuid()}) ,$2, $3, $4)
    ON CONFLICT ON CONSTRAINT subpages_screenshot_unique_step
    DO UPDATE SET screenshot = EXCLUDED.screenshot`, params);
  } else {
    const params = [websiteId, url, image];
    return executeQuery(`INSERT INTO subpages (website_id , url, screenshot) 
    values ( (select website_id from website where website_uuid = $1${toUuid()}) ,$2, $3)
    ON CONFLICT ON CONSTRAINT subpages_screenshot_unique
    DO UPDATE SET screenshot = EXCLUDED.screenshot`, params);
  }
}

