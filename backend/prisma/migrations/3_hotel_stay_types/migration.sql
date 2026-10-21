-- AlterTable: hotels can be tagged with stay types (villas, cabins, treehouses...). Additive, nullable.
ALTER TABLE `hotels` ADD COLUMN `stay_types` JSON NULL;
