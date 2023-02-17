-- CreateTable
CREATE TABLE `Resin` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `manufacturer` VARCHAR(191) NOT NULL,
    `color` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ResinComment` (
    `id` VARCHAR(191) NOT NULL,
    `resinId` VARCHAR(191) NOT NULL,
    `comment` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Trial` (
    `id` VARCHAR(191) NOT NULL,
    `resinId` VARCHAR(191) NOT NULL,
    `status` ENUM('SUCCESS', 'FAILURE', 'UNDER_EXPOSED', 'OVER_EXPOSED', 'FIRST_LAYER_UNDER_EXPOSED', 'FIRST_LAYER_OVER_EXPOSED') NOT NULL,
    `layerHeight` DOUBLE NOT NULL,
    `speed` DOUBLE NOT NULL,
    `bottomLayerCount` INTEGER NOT NULL,
    `bottomLayerExposureTime` DOUBLE NOT NULL,
    `bottomLayerLightOffDelay` DOUBLE NOT NULL,
    `bottomLayerLiftDistance` DOUBLE NOT NULL,
    `bottomLayerLiftSpeed` DOUBLE NOT NULL,
    `bottomLayerTransitionCount` INTEGER NOT NULL,
    `normalExposureTime` DOUBLE NOT NULL,
    `normalLightOffDelay` DOUBLE NOT NULL,
    `normalLiftDistance` DOUBLE NOT NULL,
    `normalLiftSpeed` DOUBLE NOT NULL,
    `transitionType` ENUM('LINEAR') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TrialComment` (
    `id` VARCHAR(191) NOT NULL,
    `trialId` VARCHAR(191) NOT NULL,
    `comment` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ResinComment` ADD CONSTRAINT `ResinComment_resinId_fkey` FOREIGN KEY (`resinId`) REFERENCES `Resin`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Trial` ADD CONSTRAINT `Trial_resinId_fkey` FOREIGN KEY (`resinId`) REFERENCES `Resin`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TrialComment` ADD CONSTRAINT `TrialComment_trialId_fkey` FOREIGN KEY (`trialId`) REFERENCES `Trial`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
