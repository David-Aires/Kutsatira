import prisma from 'lib/prisma';
import { runQuery, PRISMA } from 'lib/db';

export async function getConfigStats(...args) {
  return runQuery({
    [PRISMA]: () => relationalQuery(...args),
  });
}

async function relationalQuery(
  websiteId,
  {
    start_at,
    end_at,
    timezone = 'utc',
    unit = 'day',
    count = '*',
    filters = {},
    sessionKey = 'session_id',
  },
) {
  const { getDateQuery, parseFilters, rawQuery, toUuid } = prisma;
  const params = [websiteId, start_at, end_at];
  const { sessionQuery, joinSession } = parseFilters(
    'pageview',
    null,
    filters,
    params,
  );

  return rawQuery(
    `select ${getDateQuery('configuration.created_at', unit, timezone)} t,
        count(${count !== '*' ? `${count}${sessionKey}` : count}) y
      from configuration
        join website
            on pageview.website_id = website.website_id
        ${joinSession}
      where website.website_uuid = $1${toUuid()}
        and configuration.created_at between $2 and $3
        ${sessionQuery}
      group by 1`,
    params,
  );
}
