import { URL_LENGTH } from 'lib/constants';
import { CLICKHOUSE, PRISMA, runQuery } from 'lib/db';
import kafka from 'lib/kafka';
import prisma from 'lib/prisma';
import eventstore from 'lib/eventstore';
import { jsonEvent } from '@eventstore/db-client';

export async function savePageView(...args) {
  return runQuery({
    [PRISMA]: () => eventStoreQuery(...args),
    [CLICKHOUSE]: () => clickhouseQuery(...args),
  });
}

function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

async function eventStoreQuery({ websiteId }, { session: { id: sessionId }, url, from, referrer }) {
  const data = {
    websiteId: websiteId,
    sessionId: sessionId,
    url: url?.substring(0, URL_LENGTH),
    from: from?.substring(0, URL_LENGTH),
    referrer: referrer?.substring(0, URL_LENGTH),
  };

  const event = jsonEvent({
    type: 'pageView',
    data: data,
  });

  eventstore.client.appendToStream('pageView_' + data.url, event);

  await eventstore.client.enableProjection('EventDB');

  await delay(500);

  const result = await eventstore.client.getProjectionResult('EventDB');

  return relationalQuery(result);
}

async function relationalQuery(event) {
  return prisma.client.pageview.create({
    data: {
      websiteId: event.data.body.websiteId,
      sessionId: event.data.body.sessionId,
      url: event.data.body.url,
      from: event.data.body.from,
      referrer: event.data.body.referrer,
    },
  });
}

async function clickhouseQuery(
  { websiteUuid: websiteId },
  { session: { country, sessionUuid, ...sessionArgs }, url, from, referrer },
) {
  const { getDateFormat, sendMessage } = kafka;
  const params = {
    session_uuid: sessionUuid,
    website_id: websiteId,
    created_at: getDateFormat(new Date()),
    url: url?.substring(0, URL_LENGTH),
    from: from?.substring(0, URL_LENGTH),
    referrer: referrer?.substring(0, URL_LENGTH),
    ...sessionArgs,
    country: country ? country : null,
  };

  await sendMessage(params, 'event');
}