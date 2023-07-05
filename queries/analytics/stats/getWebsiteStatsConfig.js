import prisma from 'lib/prisma';
import { runQuery, PRISMA } from 'lib/db';

export async function getWebsiteStatsConfig(...args) {
  return runQuery({
    [PRISMA]: () => relationalQuery(...args),
  });
}

async function relationalQuery(websiteId, { start_at, end_at, filters = {} }) {
  const { getDateQuery, getTimestampInterval, parseFilters, rawQuery, toUuid } = prisma;
  const params = [websiteId, start_at, end_at];
  const { sessionQuery, joinSession } = parseFilters(
    'pageview',
    null,
    filters,
    params,
  );

  return rawQuery(
    `select sum(t.c) as "pageviews",
        count(distinct t.session_id) as "uniques",
        sum(case when t.c = 1 then 1 else 0 end) as "bounces",
        sum(t.time) as "totaltime"
      from (
        select configuration.session_id,
          ${getDateQuery('configuration.created_at', 'hour')},
          count(*) c,
          ${getTimestampInterval('configuration.created_at')} as "time"
        from configuration
          join website 
            on pageview.website_id = website.website_id
          ${joinSession}
        where website.website_uuid = $1${toUuid()}
          and configuration.created_at between $2 and $3
          ${sessionQuery}
        group by 1, 2
     ) t`,
    params,
  );
}
