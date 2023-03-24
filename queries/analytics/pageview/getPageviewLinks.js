import prisma from 'lib/prisma';
import clickhouse from 'lib/clickhouse';
import { runQuery, CLICKHOUSE, PRISMA } from 'lib/db';

export async function getPageviewLinks(...args) {
  return runQuery({
    [PRISMA]: () => relationalQuery(...args),
    [CLICKHOUSE]: () => clickhouseQuery(...args),
  });
}

async function relationalQuery(websiteId) {
  const { rawQuery } = prisma;

  return rawQuery(
    `select distinct url, count(*), count(*) * 100/(SELECT count(*) FROM pageview pin where pin.website_id = ${websiteId} ) as pourcent, p.from 
    from pageview p 
    where p.website_id = ${websiteId} and p.from is not null
    group by p.url, p.from`,
  );
}

async function clickhouseQuery(websiteId) {
  const { rawQuery } = clickhouse;

  return rawQuery(
    `select distinct url, count(*), count(*) * 100/(SELECT count(*) FROM pageview pin where pin.website_id = ${websiteId} ) as pourcent, p.from
    from pageview p 
    where p.website_id = ${websiteId} and p.from is not null
    group by p.url, p.from`,
  );
}
