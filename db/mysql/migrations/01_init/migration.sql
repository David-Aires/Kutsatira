-- CreateTable
CREATE TABLE `account` (
    `user_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(255) NOT NULL,
    `password` VARCHAR(60) NOT NULL,
    `is_admin` BOOLEAN NOT NULL DEFAULT false,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `account_uuid` VARCHAR(36) NOT NULL,

    UNIQUE INDEX `account_username_key`(`username`),
    UNIQUE INDEX `account_account_uuid_key`(`account_uuid`),
    INDEX `account_account_uuid_idx`(`account_uuid`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `event` (
    `event_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `website_id` INTEGER UNSIGNED NOT NULL,
    `session_id` INTEGER UNSIGNED NOT NULL,
    `configuration_uuid` VARCHAR(500) DEFAULT NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `url` VARCHAR(500) NOT NULL,
    `step` VARCHAR(500) DEFAULT NULL,
    `event_name` VARCHAR(50) NOT NULL,
    `event_type` VARCHAR(50) NOT NULL,
    `event_uuid` VARCHAR(36) NOT NULL,

    UNIQUE INDEX `event_event_uuid_key`(`event_uuid`),
    INDEX `event_created_at_idx`(`created_at`),
    INDEX `event_session_id_idx`(`session_id`),
    INDEX `event_website_id_idx`(`website_id`),
    INDEX `event_configuration_uuid_idx`(`configuration_uuid`),
    INDEX `event_event_uuid_idx`(`event_uuid`),
    PRIMARY KEY (`event_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `event_data` (
    `event_data_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `event_id` INTEGER UNSIGNED NOT NULL,
    `event_data` JSON NOT NULL,

    UNIQUE INDEX `event_data_event_id_key`(`event_id`),
    PRIMARY KEY (`event_data_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pageview` (
    `view_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `website_id` INTEGER UNSIGNED NOT NULL,
    `session_id` INTEGER UNSIGNED NOT NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `url` VARCHAR(500) NOT NULL,
    `from` VARCHAR(500) NOT NULL,
    `referrer` VARCHAR(500) NULL,

    INDEX `pageview_created_at_idx`(`created_at`),
    INDEX `pageview_session_id_idx`(`session_id`),
    INDEX `pageview_website_id_created_at_idx`(`website_id`, `created_at`),
    INDEX `pageview_website_id_idx`(`website_id`),
    INDEX `pageview_website_id_session_id_created_at_idx`(`website_id`, `session_id`, `created_at`),
    PRIMARY KEY (`view_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `configuration` (
    `configuration_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `website_id` INTEGER UNSIGNED NOT NULL,
    `session_id` INTEGER UNSIGNED NOT NULL,
    `configuration_uuid` VARCHAR(500) NOT NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `isComplete` BOOLEAN NOT NULL DEFAULT false,

    INDEX `configuration_created_at_idx`(`created_at`),
    INDEX `configuration_session_id_idx`(`session_id`),
    UNIQUE INDEX `configuration_session_uuid_idx`(`configuration_uuid`),
    INDEX `configuration_website_id_created_at_idx`(`website_id`, `created_at`),
    INDEX `configuration_website_id_idx`(`website_id`),
    INDEX `configuration_website_id_session_id_created_at_idx`(`website_id`, `session_id`, `created_at`),
    PRIMARY KEY (`configuration_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `session` (
    `session_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `session_uuid` VARCHAR(36) NOT NULL,
    `website_id` INTEGER UNSIGNED NOT NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `hostname` VARCHAR(100) NULL,
    `browser` VARCHAR(20) NULL,
    `os` VARCHAR(20) NULL,
    `device` VARCHAR(20) NULL,
    `screen` VARCHAR(11) NULL,
    `language` VARCHAR(35) NULL,
    `country` CHAR(2) NULL,

    UNIQUE INDEX `session_session_uuid_key`(`session_uuid`),
    INDEX `session_created_at_idx`(`created_at`),
    INDEX `session_website_id_idx`(`website_id`),
    INDEX `session_session_uuid_idx`(`session_uuid`),
    PRIMARY KEY (`session_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE "subpages" (
    "subpage_id" INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    "website_id" INTEGER UNSIGNED NOT NULL,
    "url" VARCHAR(500) NOT NULL,
    "step" VARCHAR(500) DEFAULT NULL,
    "screenshot" BLOB DEFAULT NULL,
    INDEX `subpages_website_id_idx`(`website_id`),
    INDEX `subpages_website_id_url_idx`(`website_id`, `url`),
    INDEX `subpages_website_id_url_step_idx`(`website_id`, `url`, `step`),
    PRIMARY KEY (`subpage_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;


-- CreateTable
CREATE TABLE `website` (
    `website_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `website_uuid` VARCHAR(36) NOT NULL,
    `user_id` INTEGER UNSIGNED NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `domain` VARCHAR(500) NULL,
    `share_id` VARCHAR(64) NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `website_website_uuid_key`(`website_uuid`),
    UNIQUE INDEX `website_share_id_key`(`share_id`),
    INDEX `website_user_id_idx`(`user_id`),
    INDEX `website_website_uuid_idx`(`website_uuid`),
    PRIMARY KEY (`website_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;


ALTER TABLE subpages ADD CONSTRAINT `subpages_screenshot_unique` UNIQUE KEY(`website_id`,`url`);
ALTER TABLE subpages ADD CONSTRAINT `subpages_screenshot_unique_step` UNIQUE KEY(`website_id`,`url`, `step`);

-- CreateAdminUser
INSERT INTO account (username, password, is_admin, account_uuid) values ('admin', '$2a$10$60dp/YMUJ1MDR9lbQt7msOqEDZZN8LhuCSZCu8Yqwl.kKwa4BmVtq', true, uuid());