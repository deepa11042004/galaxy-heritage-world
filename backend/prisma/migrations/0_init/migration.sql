-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(36) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password_hash` VARCHAR(255) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(30) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `reset_token` VARCHAR(255) NULL,
    `reset_expires` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    INDEX `users_email_idx`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `roles` (
    `id` VARCHAR(36) NOT NULL,
    `name` VARCHAR(50) NOT NULL,
    `description` VARCHAR(255) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `roles_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_roles` (
    `id` VARCHAR(36) NOT NULL,
    `user_id` VARCHAR(36) NOT NULL,
    `role_id` VARCHAR(36) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `user_roles_user_id_idx`(`user_id`),
    INDEX `user_roles_role_id_idx`(`role_id`),
    UNIQUE INDEX `user_roles_user_id_role_id_key`(`user_id`, `role_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sessions` (
    `id` VARCHAR(36) NOT NULL,
    `user_id` VARCHAR(36) NOT NULL,
    `refresh_token` VARCHAR(500) NOT NULL,
    `ip_address` VARCHAR(45) NULL,
    `user_agent` VARCHAR(255) NULL,
    `expires_at` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `sessions_refresh_token_key`(`refresh_token`),
    INDEX `sessions_user_id_idx`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pages` (
    `id` VARCHAR(36) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `subtitle` VARCHAR(500) NULL,
    `content_html` LONGTEXT NOT NULL,
    `meta_title` VARCHAR(255) NULL,
    `meta_description` TEXT NULL,
    `source_url` VARCHAR(500) NULL,
    `is_published` BOOLEAN NOT NULL DEFAULT true,
    `deleted_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `pages_slug_key`(`slug`),
    INDEX `pages_slug_is_published_idx`(`slug`, `is_published`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `destinations` (
    `id` VARCHAR(36) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `region` VARCHAR(100) NOT NULL,
    `country` VARCHAR(100) NOT NULL DEFAULT 'India',
    `type` ENUM('DOMESTIC', 'INTERNATIONAL') NOT NULL DEFAULT 'DOMESTIC',
    `tagline` VARCHAR(255) NULL,
    `description` TEXT NOT NULL,
    `hero_image_url` VARCHAR(500) NOT NULL,
    `gallery` JSON NULL,
    `highlights` JSON NULL,
    `best_time_to_visit` VARCHAR(150) NULL,
    `source_url` VARCHAR(500) NULL,
    `featured` BOOLEAN NOT NULL DEFAULT false,
    `is_published` BOOLEAN NOT NULL DEFAULT true,
    `meta_title` VARCHAR(255) NULL,
    `meta_description` TEXT NULL,
    `deleted_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `destinations_slug_key`(`slug`),
    INDEX `destinations_type_is_published_featured_idx`(`type`, `is_published`, `featured`),
    INDEX `destinations_slug_idx`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hotels` (
    `id` VARCHAR(36) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `destination_id` VARCHAR(36) NULL,
    `location_name` VARCHAR(191) NOT NULL,
    `state` VARCHAR(100) NULL,
    `country` VARCHAR(100) NOT NULL DEFAULT 'India',
    `category` ENUM('ASSOCIATED', 'INTERNAL', 'EXCHANGE') NOT NULL DEFAULT 'ASSOCIATED',
    `rating_stars` INTEGER NOT NULL DEFAULT 4,
    `image_url` VARCHAR(500) NOT NULL,
    `gallery` JSON NULL,
    `amenities` JSON NULL,
    `description` TEXT NOT NULL,
    `source_url` VARCHAR(500) NULL,
    `hotel_code` VARCHAR(30) NULL,
    `hotel_type` VARCHAR(30) NULL,
    `location_type` VARCHAR(20) NULL,
    `address` TEXT NULL,
    `map_link` TEXT NULL,
    `featured` BOOLEAN NOT NULL DEFAULT false,
    `is_published` BOOLEAN NOT NULL DEFAULT true,
    `deleted_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `hotels_slug_key`(`slug`),
    UNIQUE INDEX `hotels_hotel_code_key`(`hotel_code`),
    INDEX `hotels_category_is_published_featured_idx`(`category`, `is_published`, `featured`),
    INDEX `hotels_location_type_location_name_idx`(`location_type`, `location_name`),
    INDEX `hotels_destination_id_idx`(`destination_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `packages` (
    `id` VARCHAR(36) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `subtitle` VARCHAR(255) NULL,
    `destination_id` VARCHAR(36) NULL,
    `location_label` VARCHAR(191) NOT NULL,
    `duration_days` INTEGER NOT NULL,
    `duration_nights` INTEGER NOT NULL,
    `price_starting` DECIMAL(10, 2) NULL,
    `price_label` VARCHAR(100) NULL,
    `category` VARCHAR(100) NOT NULL DEFAULT 'Holiday Package',
    `hero_image_url` VARCHAR(500) NOT NULL,
    `overview` TEXT NOT NULL,
    `inclusions` JSON NULL,
    `exclusions` JSON NULL,
    `highlights` JSON NULL,
    `source_url` VARCHAR(500) NULL,
    `featured` BOOLEAN NOT NULL DEFAULT false,
    `is_published` BOOLEAN NOT NULL DEFAULT true,
    `deleted_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `packages_slug_key`(`slug`),
    INDEX `packages_is_published_featured_idx`(`is_published`, `featured`),
    INDEX `packages_destination_id_idx`(`destination_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `package_features` (
    `id` VARCHAR(36) NOT NULL,
    `package_id` VARCHAR(36) NOT NULL,
    `label` VARCHAR(255) NOT NULL,
    `icon_name` VARCHAR(100) NULL,
    `sort_order` INTEGER NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `package_features_package_id_idx`(`package_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `itineraries` (
    `id` VARCHAR(36) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `badge_text` VARCHAR(100) NULL,
    `destination_id` VARCHAR(36) NULL,
    `location_label` VARCHAR(191) NOT NULL,
    `duration_days` INTEGER NOT NULL,
    `duration_nights` INTEGER NOT NULL,
    `hero_image_url` VARCHAR(500) NOT NULL,
    `summary` TEXT NOT NULL,
    `overview` TEXT NOT NULL,
    `inclusions` JSON NULL,
    `featured` BOOLEAN NOT NULL DEFAULT false,
    `is_published` BOOLEAN NOT NULL DEFAULT true,
    `deleted_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `itineraries_slug_key`(`slug`),
    INDEX `itineraries_is_published_featured_idx`(`is_published`, `featured`),
    INDEX `itineraries_destination_id_idx`(`destination_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `itinerary_days` (
    `id` VARCHAR(36) NOT NULL,
    `itinerary_id` VARCHAR(36) NOT NULL,
    `day_number` INTEGER NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NOT NULL,
    `meals` VARCHAR(150) NULL,
    `stay_location` VARCHAR(150) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `itinerary_days_itinerary_id_day_number_idx`(`itinerary_id`, `day_number`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `activities` (
    `id` VARCHAR(36) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `category` VARCHAR(100) NOT NULL DEFAULT 'Day Outing & Picnic',
    `location_label` VARCHAR(191) NOT NULL,
    `duration_label` VARCHAR(150) NOT NULL DEFAULT 'Full Day (9:00 AM - 5:00 PM)',
    `image_url` VARCHAR(500) NOT NULL,
    `description` TEXT NOT NULL,
    `highlights` JSON NULL,
    `inclusions` JSON NULL,
    `source_url` VARCHAR(500) NULL,
    `featured` BOOLEAN NOT NULL DEFAULT false,
    `is_published` BOOLEAN NOT NULL DEFAULT true,
    `deleted_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `activities_slug_key`(`slug`),
    INDEX `activities_is_published_featured_idx`(`is_published`, `featured`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `media_assets` (
    `id` VARCHAR(36) NOT NULL,
    `media_code` VARCHAR(50) NULL,
    `filename` VARCHAR(255) NOT NULL,
    `original_url` VARCHAR(500) NULL,
    `storage_path` VARCHAR(500) NOT NULL,
    `mime_type` VARCHAR(100) NOT NULL,
    `file_size` INTEGER NULL,
    `alt_text` VARCHAR(255) NULL,
    `width` INTEGER NULL,
    `height` INTEGER NULL,
    `category` VARCHAR(100) NOT NULL DEFAULT 'general',
    `source_page` VARCHAR(500) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `media_assets_media_code_key`(`media_code`),
    INDEX `media_assets_category_idx`(`category`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `content_media` (
    `id` VARCHAR(36) NOT NULL,
    `media_asset_id` VARCHAR(36) NOT NULL,
    `entity_type` VARCHAR(50) NOT NULL,
    `entity_id` VARCHAR(36) NOT NULL,
    `role` VARCHAR(50) NOT NULL DEFAULT 'gallery',
    `sort_order` INTEGER NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `content_media_entity_type_entity_id_idx`(`entity_type`, `entity_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `faqs` (
    `id` VARCHAR(36) NOT NULL,
    `question` VARCHAR(500) NOT NULL,
    `answer` TEXT NOT NULL,
    `category` VARCHAR(100) NOT NULL DEFAULT 'General',
    `sort_order` INTEGER NOT NULL DEFAULT 0,
    `is_published` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `faqs_category_is_published_sort_order_idx`(`category`, `is_published`, `sort_order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `testimonials` (
    `id` VARCHAR(36) NOT NULL,
    `customer_name` VARCHAR(150) NOT NULL,
    `customer_location` VARCHAR(150) NULL,
    `rating` INTEGER NOT NULL DEFAULT 5,
    `comment` TEXT NOT NULL,
    `trip_title` VARCHAR(191) NULL,
    `avatar_url` VARCHAR(500) NULL,
    `is_verified` BOOLEAN NOT NULL DEFAULT true,
    `is_published` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `testimonials_is_published_is_verified_idx`(`is_published`, `is_verified`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `enquiries` (
    `id` VARCHAR(36) NOT NULL,
    `reference_number` VARCHAR(50) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(30) NOT NULL,
    `city` VARCHAR(100) NOT NULL,
    `age_group` VARCHAR(30) NULL,
    `destination_interest` VARCHAR(191) NULL,
    `package_interest` VARCHAR(191) NULL,
    `travel_dates` VARCHAR(100) NULL,
    `travelers_count` INTEGER NULL,
    `message` TEXT NULL,
    `source_page` VARCHAR(255) NULL,
    `status` ENUM('NEW', 'CONTACTED', 'QUALIFIED', 'CONVERTED', 'CLOSED', 'SPAM') NOT NULL DEFAULT 'NEW',
    `consent` BOOLEAN NOT NULL DEFAULT true,
    `ip_address` VARCHAR(45) NULL,
    `user_agent` VARCHAR(255) NULL,
    `notes` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `enquiries_reference_number_key`(`reference_number`),
    INDEX `enquiries_status_created_at_idx`(`status`, `created_at`),
    INDEX `enquiries_email_idx`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `voucher_redemptions` (
    `id` VARCHAR(36) NOT NULL,
    `reference_number` VARCHAR(50) NOT NULL,
    `voucher_code` VARCHAR(80) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(30) NOT NULL,
    `city` VARCHAR(100) NOT NULL,
    `preferred_destination` VARCHAR(191) NOT NULL,
    `preferred_dates` VARCHAR(100) NULL,
    `message` TEXT NULL,
    `status` VARCHAR(50) NOT NULL DEFAULT 'PENDING_VERIFICATION',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `voucher_redemptions_reference_number_key`(`reference_number`),
    INDEX `voucher_redemptions_voucher_code_idx`(`voucher_code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `newsletter_subscriptions` (
    `id` VARCHAR(36) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `name` VARCHAR(120) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `subscribed_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `unsubscribed_at` DATETIME(3) NULL,

    UNIQUE INDEX `newsletter_subscriptions_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `site_settings` (
    `id` VARCHAR(36) NOT NULL,
    `setting_key` VARCHAR(100) NOT NULL,
    `setting_val` TEXT NOT NULL,
    `group_name` VARCHAR(50) NOT NULL DEFAULT 'general',
    `is_public` BOOLEAN NOT NULL DEFAULT true,
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `site_settings_setting_key_key`(`setting_key`),
    INDEX `site_settings_group_name_is_public_idx`(`group_name`, `is_public`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `audit_logs` (
    `id` VARCHAR(36) NOT NULL,
    `user_id` VARCHAR(36) NULL,
    `action` VARCHAR(100) NOT NULL,
    `entity_type` VARCHAR(50) NOT NULL,
    `entity_id` VARCHAR(100) NULL,
    `details` JSON NULL,
    `ip_address` VARCHAR(45) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `audit_logs_entity_type_created_at_idx`(`entity_type`, `created_at`),
    INDEX `audit_logs_user_id_idx`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `user_roles` ADD CONSTRAINT `user_roles_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_roles` ADD CONSTRAINT `user_roles_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sessions` ADD CONSTRAINT `sessions_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hotels` ADD CONSTRAINT `hotels_destination_id_fkey` FOREIGN KEY (`destination_id`) REFERENCES `destinations`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `packages` ADD CONSTRAINT `packages_destination_id_fkey` FOREIGN KEY (`destination_id`) REFERENCES `destinations`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `package_features` ADD CONSTRAINT `package_features_package_id_fkey` FOREIGN KEY (`package_id`) REFERENCES `packages`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `itineraries` ADD CONSTRAINT `itineraries_destination_id_fkey` FOREIGN KEY (`destination_id`) REFERENCES `destinations`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `itinerary_days` ADD CONSTRAINT `itinerary_days_itinerary_id_fkey` FOREIGN KEY (`itinerary_id`) REFERENCES `itineraries`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `content_media` ADD CONSTRAINT `content_media_media_asset_id_fkey` FOREIGN KEY (`media_asset_id`) REFERENCES `media_assets`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `audit_logs` ADD CONSTRAINT `audit_logs_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

