import { EVENT_NAME_LENGTH, URL_LENGTH } from 'lib/constants';
import { CLICKHOUSE, PRISMA, runQuery } from 'lib/db';
import kafka from 'lib/kafka';
import prisma from 'lib/prisma';
import eventstore from 'lib/eventstore';
import { jsonEvent } from '@eventstore/db-client';

export async function saveEvent(...args) {
  return runQuery({
    [PRISMA]: () => eventStoreQuery(...args),
    [CLICKHOUSE]: () => clickhouseQuery(...args),
  });
}

function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

async function eventStoreQuery(
  { websiteId },
  { session: { id: sessionId }, eventUuid, url, eventName, eventType, eventData },
) {

  const data = {
    websiteId: websiteId,
    sessionId: sessionId,
    url: url?.substring(0, URL_LENGTH),
    eventName: eventName?.substring(0, EVENT_NAME_LENGTH),
    eventType: eventType?.substring(0, EVENT_NAME_LENGTH),
    entityId: eventUuid,
  };

  if (eventData) {
    data.additional = eventData;
  }


  if(data.eventName.includes(":")) {
    const split_name = data.eventName.split(":")
    data.eventName = split_name[1]
    data.step = split_name[0]
  }

  if(data.eventName.includes("void_")) {
    data.eventType = "void_"+data.eventType
  }


  const event = jsonEvent({
    type: 'event',
    data: data,
  });

  eventstore.client.appendToStream(url + '_' + eventName, event);

  await eventstore.client.enableProjection('EventDB');

  await delay(500);

  const result = await eventstore.client.getProjectionResult('EventDB');

  return relationalQuery(result);
}

async function relationalQuery(event) {
  const data = {
    websiteId: event.data.body.websiteId,
    sessionId: event.data.body.sessionId,
    url: event.data.body.url,
    eventName: event.data.body.eventName,
    eventType: event.data.body.eventType,
    eventUuid: event.data.eventId,
  };

  if(event.data.body.step) {
    data.step = event.data.body.step
  }

  if (event.data.body.additional) {
    data.eventData = {
      create: {
        eventData: event.data.body.additional,
      },
    };
  }

  return prisma.client.event.create({
    data,
  });
}

async function clickhouseQuery(
  { websiteUuid: websiteId },
  { session: { country, sessionUuid, ...sessionArgs }, eventUuid, url, eventName, eventData },
) {
  const { getDateFormat, sendMessage } = kafka;

  const params = {
    session_id: sessionUuid,
    event_id: eventUuid,
    website_id: websiteId,
    created_at: getDateFormat(new Date()),
    url: url?.substring(0, URL_LENGTH),
    event_name: eventName?.substring(0, EVENT_NAME_LENGTH),
    event_data: eventData ? JSON.stringify(eventData) : null,
    ...sessionArgs,
    country: country ? country : null,
  };

  await sendMessage(params, 'event');
}
