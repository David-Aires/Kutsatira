import prisma from 'lib/prisma';
import { runQuery, PRISMA } from 'lib/db';

export async function getScreenshot(...args) {
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

    return rawQuery(`SELECT screenshot FROM subpages s
    WHERE s.website_id = (SELECT website_id FROM website w WHERE w.website_uuid = $1${toUuid()})
    AND s.url = $2`, params);
}

