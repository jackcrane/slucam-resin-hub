-- AlterTable
ALTER TABLE `Trial` ADD COLUMN `notes` VARCHAR(191) NOT NULL DEFAULT '',
    MODIFY `status` ENUM('IN_PROGRESS', 'SUCCESS', 'FAILURE', 'UNDER_EXPOSED', 'OVER_EXPOSED', 'FIRST_LAYER_UNDER_EXPOSED', 'FIRST_LAYER_OVER_EXPOSED') NOT NULL,
    MODIFY `transitionType` ENUM('LINEAR') NOT NULL DEFAULT 'LINEAR';
