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
    `with data as (select event.event_id, 
      event.configuration_uuid as "id"
      ${getTimestampInterval('event.created_at')} as "time",
      from event
      group by 1,2),
    
    data2 as (select configuration.session_id,
      ${getDateQuery('configuration.created_at', 'hour')},
      count(*) c,
      configuration.configuration_uuid as "id"
    from configuration
      join website 
        on configuration.website_id = website.website_id
      ${joinSession}
    where website.website_uuid = $1${toUuid()}
      and configuration.created_at between $2 and $3
      ${sessionQuery}
    group by 1, 2, 4)
    
    select sum(data2.c) as "pageviews",
    count(distinct data2.session_id) as "uniques",
    sum(case when data2.c = 1 then 1 else 0 end) as "bounces",
    sum(data.time) as "totaltime"
    from data join data2 on data.id = data2.id`,
    params,
  );
}