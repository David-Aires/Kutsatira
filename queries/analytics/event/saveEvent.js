import { EVENT_NAME_LENGTH, URL_LENGTH, REGEXCUT } from 'lib/constants';
import { PRISMA, runQuery } from 'lib/db';
import prisma from 'lib/prisma';
import eventstore from 'lib/eventstore';
import { jsonEvent } from '@eventstore/db-client';

export async function saveEvent(...args) {
  return runQuery({
    [PRISMA]: () => eventStoreQuery(...args),
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

  if (url.startsWith('#')) data.url = data.url.substr(1, data.url.length - 1);
  data.url = data.url.replace(REGEXCUT, '/[id]');
  if (data.eventName.includes(':')) {
    const split_name = data.eventName.split(':');
    data.configId = split_name[0];
    data.eventName = split_name[2];
    data.step = split_name[1];
  }

  if (data.eventName.includes('void_')) {
    data.eventType = 'void_' + data.eventType;
  }

  const event = jsonEvent({
    type: 'event',
    data: data,
  });

  const currentdate = new Date();
  const formatedDate = currentdate.getDate() + "/"+  (parseInt(currentdate.getMonth())    + 1)+ "/" + currentdate.getFullYear();
  eventstore.client.appendToStream(websiteId + ':' + sessionId + '_' + formatedDate, event);

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
    eventUuid: event.data.eventId
  };


  if(event.data.body.configId && event.data.body.step) {
    data.step = event.data.body.step;
    await prisma.client.configuration.upsert({
      where: {
        configurationUuid: event.data.body.configId,
      },
      update: {},
      create: {
        websiteId: data.websiteId,
        sessionId: data.sessionId,
        configurationUuid: event.data.body.configId,
      }
    });
    data.configurationUuid = event.data.body.configId
    if(data.eventName == "thend") {
      await prisma.client.configuration.update({
        where: {
          configurationUuid: event.data.body.configId
        },
        data: {
          isComplete: true,
        }
      });
    }
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
