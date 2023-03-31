import prisma from 'lib/prisma';
import { runQuery, PRISMA } from 'lib/db';

export async function getEventStep(...args) {
  return runQuery({
    [PRISMA]: () => relationalQuery(...args),
  });
}

async function relationalQuery(
  websiteId,
  url
) {
  const params = [websiteId, url];
  const {rawQuery, toUuid} = prisma;

    return rawQuery(`SELECT DISTINCT step FROM event e
    WHERE e.website_id = (SELECT website_id FROM website w WHERE e.step is not null and w.website_uuid = $1${toUuid()})
    AND e.url = $2`, params);
}

