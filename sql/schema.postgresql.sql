-- CreateTable
CREATE TABLE "account" (
    "user_id" SERIAL NOT NULL,
    "username" VARCHAR(255) NOT NULL,
    "password" VARCHAR(60) NOT NULL,
    "is_admin" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "subpages" (
    "subpage_id" SERIAL NOT NULL,
    "website_id" INTEGER NOT NULL,
    "url" VARCHAR(500) NOT NULL,
    "step" VARCHAR(500) DEFAULT NULL,
    "screenshot" bytea DEFAULT NULL,

    PRIMARY KEY ("subpage_id")
);

-- CreateTable
CREATE TABLE "event" (
    "event_id" SERIAL NOT NULL,
    "website_id" INTEGER NOT NULL,
    "session_id" INTEGER NOT NULL,
    "configuration_uuid" VARCHAR(500) DEFAULT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "url" VARCHAR(500) NOT NULL,
    "step" VARCHAR(500) DEFAULT NULL,
    "event_type" VARCHAR(50) NOT NULL,
    "event_value" VARCHAR(50) NOT NULL,

    PRIMARY KEY ("event_id")
);

-- CreateTable
CREATE TABLE "pageview" (
    "view_id" SERIAL NOT NULL,
    "website_id" INTEGER NOT NULL,
    "session_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "url" VARCHAR(500) NOT NULL,
    "from" VARCHAR(500) NOT NULL,
    "referrer" VARCHAR(500),

    PRIMARY KEY ("view_id")
);

-- CreateTable
CREATE TABLE "configuration" (
    "configuration_id" SERIAL NOT NULL,
    "website_id" INTEGER NOT NULL,
    "session_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "is_complete" BOOLEAN NOT NULL DEFAULT false,
    "configuration_uuid" VARCHAR(500) NOT NULL,

    PRIMARY KEY ("configuration_id")
);

-- CreateTable
CREATE TABLE "session" (
    "session_id" SERIAL NOT NULL,
    "session_uuid" UUID NOT NULL,
    "website_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "hostname" VARCHAR(100),
    "browser" VARCHAR(20),
    "os" VARCHAR(20),
    "device" VARCHAR(20),
    "screen" VARCHAR(11),
    "language" VARCHAR(35),
    "country" CHAR(2),

    PRIMARY KEY ("session_id")
);

-- CreateTable
CREATE TABLE "website" (
    "website_id" SERIAL NOT NULL,
    "website_uuid" UUID NOT NULL,
    "user_id" INTEGER NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "domain" VARCHAR(500),
    "share_id" VARCHAR(64),
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("website_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "account.username_unique" ON "account"("username");

-- CreateIndex
CREATE UNIQUE INDEX "configuration.uuid_unique" ON "configuration"("configuration_uuid");

-- CreateIndex
CREATE INDEX "event_created_at_idx" ON "event"("created_at");

-- CreateIndex
CREATE INDEX "event_session_id_idx" ON "event"("session_id");

-- CreateIndex
CREATE INDEX "event_configuration_uuid_idx" ON "event"("configuration_uuid");

-- CreateIndex
CREATE INDEX "event_website_id_idx" ON "event"("website_id");

-- CreateIndex
CREATE INDEX "pageview_created_at_idx" ON "pageview"("created_at");

-- CreateIndex
CREATE INDEX "configuration_created_at_idx" ON "configuration"("created_at");

-- CreateIndex
CREATE INDEX "configuration_configuration_id_idx" ON "configuration"("configuration_id");

-- CreateIndex
CREATE INDEX "subpages_created_at_idx" ON "subpages"("subpage_id");

-- CreateIndex
CREATE INDEX "pageview_session_id_idx" ON "pageview"("session_id");

-- CreateIndex
CREATE INDEX "configuration_session_id_idx" ON "configuration"("session_id");

-- CreateIndex
CREATE INDEX "pageview_website_id_created_at_idx" ON "pageview"("website_id", "created_at");

-- CreateIndex
CREATE INDEX "configuration_website_id_created_at_idx" ON "configuration"("website_id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "subpages_website_id_url_idx" ON "subpages"("website_id", "url");

-- CreateIndex
CREATE UNIQUE INDEX "subpages_website_id_url_step_idx" ON "subpages"("website_id", "url", "step");

-- CreateIndex
CREATE INDEX "pageview_website_id_idx" ON "pageview"("website_id");

-- CreateIndex
CREATE INDEX "pageview_website_id_session_id_created_at_idx" ON "pageview"("website_id", "session_id", "created_at");

-- CreateIndex
CREATE INDEX "configuration_website_id_idx" ON "configuration"("website_id");

-- CreateIndex
CREATE INDEX "configuration_website_id_session_id_created_at_idx" ON "configuration"("website_id", "session_id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "session.session_uuid_unique" ON "session"("session_uuid");

-- CreateIndex
CREATE INDEX "session_created_at_idx" ON "session"("created_at");

-- CreateIndex
CREATE INDEX "session_website_id_idx" ON "session"("website_id");

-- CreateIndex
CREATE UNIQUE INDEX "website.website_uuid_unique" ON "website"("website_uuid");

-- CreateIndex
CREATE UNIQUE INDEX "website.share_id_unique" ON "website"("share_id");

-- CreateIndex
CREATE INDEX "website_user_id_idx" ON "website"("user_id");

-- CreateIndex
ALTER TABLE "subpages" ADD CONSTRAINT "subpages_screenshot_unique" UNIQUE USING INDEX "subpages_website_id_url_idx";

-- CreateIndex
ALTER TABLE "subpages" ADD CONSTRAINT "subpages_screenshot_unique_step" UNIQUE USING INDEX "subpages_website_id_url_step_idx";

-- AddForeignKey
ALTER TABLE "event" ADD FOREIGN KEY ("session_id") REFERENCES "session"("session_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event" ADD FOREIGN KEY ("website_id") REFERENCES "website"("website_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event" ADD FOREIGN KEY ("configuration_uuid") REFERENCES "configuration"("configuration_uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pageview" ADD FOREIGN KEY ("session_id") REFERENCES "session"("session_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pageview" ADD FOREIGN KEY ("website_id") REFERENCES "website"("website_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "configuration" ADD FOREIGN KEY ("website_id") REFERENCES "website"("website_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "configuration" ADD FOREIGN KEY ("session_id") REFERENCES "session"("session_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session" ADD FOREIGN KEY ("website_id") REFERENCES "website"("website_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "website" ADD FOREIGN KEY ("user_id") REFERENCES "account"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subpages" ADD FOREIGN KEY ("website_id") REFERENCES "website"("website_id") ON DELETE CASCADE ON UPDATE CASCADE;


-- CreateAdminUser
INSERT INTO account (username, password, is_admin) values ('admin', '$2a$10$60dp/YMUJ1MDR9lbQt7msOqEDZZN8LhuCSZCu8Yqwl.kKwa4BmVtq', true);
