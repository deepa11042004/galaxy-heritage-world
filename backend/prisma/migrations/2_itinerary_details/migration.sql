-- AlterTable: itineraries get highlights, gallery, best time, category and domestic/international (additive, nullable)
ALTER TABLE `itineraries` ADD COLUMN `highlights` JSON NULL,
    ADD COLUMN `gallery` JSON NULL,
    ADD COLUMN `best_time` VARCHAR(100) NULL,
    ADD COLUMN `category` VARCHAR(100) NULL,
    ADD COLUMN `location_type` VARCHAR(20) NULL;
