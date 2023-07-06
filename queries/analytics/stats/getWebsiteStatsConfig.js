import prisma from 'lib/prisma';
import { runQuery, PRISMA } from 'lib/db';

export async function getWebsiteStatsConfig(...args) {
  return runQuery({
    [PRISMA]: () => relationalQuery(...args),
  });
}

async function relationalQuery(websiteId, { start_at, end_at, filters = {} }) {
  const { getDateQuery, parseFilters, rawQuery, toUuid } = prisma;
  const params = [websiteId, start_at, end_at];
  const { sessionQuery, joinSession } = parseFilters(
    'pageview',
    null,
    filters,
    params,
  );

  return rawQuery(
    `select sum(t.c) as "configurations",
        count(distinct t.session_id) as "uniques",
        sum(case when t.cp then 1 else 0 end) as "close"
      from (
        select configuration.session_id,
          ${getDateQuery('configuration.created_at', 'hour')},
          count(*) c,
          configuration.isComplete cp
        from configuration
          join website 
            on configuration.website_id = website.website_id
          ${joinSession}
        where website.website_uuid = $1${toUuid()}
          and configuration.created_at between $2 and $3
          ${sessionQuery}
        group by 1, 2, 4
     ) t`,
    params,
  );
}