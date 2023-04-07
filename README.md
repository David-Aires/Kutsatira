# kutsatira

Kutsatira is a simple, fast, web analytics tool for configurator.

## Getting started

A detailed getting started guide can be found at the original project [https://umami.is/docs/](https://umami.is/docs/)

## SDK 

Kutsatira has its own sdk for use with Angular. You can find more information on the github [https://github.com/Kutsatira/Kutsatira-SDK-Angular](https://github.com/Kutsatira/Kutsatira-SDK-Angular)

## Installing from source

### Requirements

- A server with Node.js version 12 or newer
- A database. Kutsatira supports [MySQL](https://www.mysql.com/) and [Postgresql](https://www.postgresql.org/) databases.

### Install Yarn

```
npm install -g yarn
```

### Get the source code and install packages

```
git clone https://github.com/David-Aires/Kutsatira.git
cd kutsatira
yarn install
```

### Configure umami

Create an `.env` file with the following

```
DATABASE_URL=connection-url
EVENTSTORE_URL=connection-url
```

The connection url is in the following format:
```
postgresql://username:mypassword@localhost:5432/mydb

mysql://username:mypassword@localhost:3306/mydb

esdb://localhost:2113?tls=false
```

### Build the application

```bash
yarn build
```

The build step will also create tables in your database if you ae installing for the first time. It will also create a login account with username **admin** and password **kutsatira**.

### Start the application

```bash
yarn start
```

By default this will launch the application on `http://localhost:3000`. You will need to either
[proxy](https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/) requests from your web server
or change the [port](https://nextjs.org/docs/api-reference/cli#production) to serve the application directly.

## Installing with Docker

To build the kutsatira container and start up a Postgres database, run:

```bash
docker compose up
```

## Getting updates

To get the latest features, simply do a pull, install any new dependencies, and rebuild:

```bash
git pull
yarn install
yarn build
```

To update the Docker image, simply pull the new images and rebuild:

```bash
docker compose pull
docker compose up --force-recreate
```

## License

MIT
