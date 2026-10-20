-- AlterTable: day outings get an image gallery and an optional YouTube video id (additive, nullable)
ALTER TABLE `activities` ADD COLUMN `gallery` JSON NULL,
    ADD COLUMN `video_id` VARCHAR(30) NULL;
