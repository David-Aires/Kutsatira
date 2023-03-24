const { EventStoreDBClient } = require('@eventstore/db-client');
import debug from 'debug';

const log = debug('umami:eventStore');
let projection_enabled = false;
let client_enabled = false;

function getClient() {
  if (!client_enabled) {
    const client = EventStoreDBClient.connectionString`${process.env.EVENTSTORE_URL}`;
    log('EventStore initialized');
    return client;
  } else {
    return evenStore;
  }
}

async function createProj() {
  if (!projection_enabled) {
    const name = `EventDB`;
    const projection = `
        fromAll()
            .when({
                $init() {
                    return {
                        event: null,
                    };
                },
                $any(state, event) {
                    state.event= event;
                }
            })
            .transformBy(function (state) {
                return {data: state.event}
            })
            .outputState();
        `;

    try {
      await evenStore.createProjection(name, projection);
      projection_enabled = true;
      log('EventStore Projection initialized');
    } catch (err) {
      log(`Projection ${name} already exists`);
      projection_enabled = true;
    }
  }
}

const evenStore = getClient();
createProj();

export default {
  client: evenStore,
};
