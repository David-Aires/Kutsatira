import prisma from 'lib/prisma';
import { runQuery, PRISMA } from 'lib/db';

export async function getEventsType(...args) {
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

    return rawQuery(`SELECT DISTINCT event_type FROM event e
    WHERE e.website_id = (SELECT website_id FROM website w WHERE w.website_uuid = $1${toUuid()})
    AND e.url = $2`, params);
}

