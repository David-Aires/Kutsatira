import prisma from 'lib/prisma';
import clickhouse from 'lib/clickhouse';
import { runQuery, CLICKHOUSE, PRISMA } from 'lib/db';

export async function getEventMetrics(...args) {
  return runQuery({
    [PRISMA]: () => relationalQuery(...args),
    [CLICKHOUSE]: () => clickhouseQuery(...args),
  });
}

async function relationalQuery(
  websiteId,
  start_at,
  end_at,
  timezone = 'utc',
  unit = 'day',
  filters = {},
) {
  const { rawQuery, getDateQuery, getFilterQuery, toUuid } = prisma;
  const params = [websiteId, start_at, end_at];

  return rawQuery(
    `select
      event_name x,
      ${getDateQuery('event.created_at', unit, timezone)} t,
      count(*) y
    from event
      join website 
        on event.website_id = website.website_id
    where website_uuid = $1${toUuid()}
      and event.created_at between $2 and $3
    ${getFilterQuery('event', filters, params)}
    group by 1, 2
    order by 2`,
    params,
  );
}

async function clickhouseQuery(
  websiteId,
  start_at,
  end_at,
  timezone = 'UTC',
  unit = 'day',
  filters = {},
) {
  const { rawQuery, getDateQuery, getBetweenDates, getFilterQuery } = clickhouse;
  const params = [websiteId];

  return rawQuery(
    `select
      event_name x,
      ${getDateQuery('created_at', unit, timezone)} t,
      count(*) y
    from event
    where event_name != ''
      and position('void_'  in event_name) = 0
      and website_id= $1
      and ${getBetweenDates('created_at', start_at, end_at)}
      ${getFilterQuery('event', filters, params)}
    group by x, t
    order by t`,
    params,
  );
}
