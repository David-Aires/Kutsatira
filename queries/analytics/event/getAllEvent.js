import prisma from 'lib/prisma';
import { runQuery, PRISMA } from 'lib/db';

export async function getAllEvent(...args) {
  return runQuery({
    [PRISMA]: () => relationalQuery(...args),
  });
}

async function relationalQuery(websiteId, url, type, step) {
  const params = step == null ? [type, websiteId, url, step] : [type, websiteId, url];
  const { rawQuery, toUuid } = prisma;

  const isStep = step == null ? 'and e.step = $4' : '';

  console.log(isStep);

  return rawQuery(
    `select e.event_id , e.event_name , e.url, e.event_type , ed.event_data from event e
    natural join event_data ed 
    where event_type = $1 and e.website_id = (SELECT website_id FROM website w WHERE w.website_uuid = $2${toUuid()}) 
    and e.url = $3 ${isStep}`,
    params,
  );
}
