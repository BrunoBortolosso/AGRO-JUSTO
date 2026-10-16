/*
  Warnings:

  - Added the required column `tenant` to the `alugueis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `usuarioId` to the `custos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `condicoes` to the `equipamentos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dias` to the `equipamentos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `custoPorKm` to the `precos_justos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `custoUnitario` to the `precos_justos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `demanda` to the `precos_justos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `distanciaKm` to the `precos_justos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `insumos` to the `precos_justos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `manutencao` to the `precos_justos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maoDeObra` to the `precos_justos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `margem` to the `precos_justos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `oferta` to the `precos_justos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantidade` to the `precos_justos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transporteBase` to the `precos_justos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `usuarioId` to the `precos_justos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `preco` to the `produtos` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `alugueis` DROP FOREIGN KEY `alugueis_locatarioId_fkey`;

-- DropForeignKey
ALTER TABLE `custos` DROP FOREIGN KEY `custos_produtoId_fkey`;

-- DropForeignKey
ALTER TABLE `precos_justos` DROP FOREIGN KEY `precos_justos_produtoId_fkey`;

-- DropIndex
DROP INDEX `alugueis_locatarioId_fkey` ON `alugueis`;

-- AlterTable
ALTER TABLE `alugueis` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `finalizadoEm` DATETIME(3) NULL,
    ADD COLUMN `tenant` VARCHAR(191) NOT NULL,
    MODIFY `locatarioId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `custos` ADD COLUMN `usuarioId` VARCHAR(191) NOT NULL,
    MODIFY `produtoId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `equipamentos` ADD COLUMN `condicoes` VARCHAR(191) NOT NULL,
    ADD COLUMN `dias` DECIMAL(10, 2) NOT NULL,
    ADD COLUMN `excluidoEm` DATETIME(3) NULL,
    ADD COLUMN `imagem` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `precos_justos` ADD COLUMN `custoPorKm` DECIMAL(10, 2) NOT NULL,
    ADD COLUMN `custoUnitario` DECIMAL(10, 2) NOT NULL,
    ADD COLUMN `demanda` DECIMAL(5, 2) NOT NULL,
    ADD COLUMN `distanciaKm` DECIMAL(10, 3) NOT NULL,
    ADD COLUMN `insumos` DECIMAL(10, 2) NOT NULL,
    ADD COLUMN `manutencao` DECIMAL(10, 2) NOT NULL,
    ADD COLUMN `maoDeObra` DECIMAL(10, 2) NOT NULL,
    ADD COLUMN `margem` DECIMAL(5, 2) NOT NULL,
    ADD COLUMN `oferta` DECIMAL(5, 2) NOT NULL,
    ADD COLUMN `quantidade` DECIMAL(10, 3) NOT NULL,
    ADD COLUMN `transporteBase` DECIMAL(10, 2) NOT NULL,
    ADD COLUMN `usuarioId` VARCHAR(191) NOT NULL,
    MODIFY `produtoId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `produtos` ADD COLUMN `imagem` VARCHAR(191) NULL,
    ADD COLUMN `preco` DECIMAL(10, 2) NOT NULL;

-- AlterTable
ALTER TABLE `usuarios` ADD COLUMN `regiao` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `sessoes` (
    `id` VARCHAR(191) NOT NULL,
    `tokenHash` VARCHAR(191) NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `usuarioId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `sessoes_tokenHash_key`(`tokenHash`),
    INDEX `sessoes_usuarioId_idx`(`usuarioId`),
    INDEX `sessoes_expiresAt_idx`(`expiresAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `alugueis_finalizadoEm_idx` ON `alugueis`(`finalizadoEm`);

-- CreateIndex
CREATE INDEX `custos_usuarioId_idx` ON `custos`(`usuarioId`);

-- CreateIndex
CREATE INDEX `precos_justos_usuarioId_idx` ON `precos_justos`(`usuarioId`);

-- AddForeignKey
ALTER TABLE `sessoes` ADD CONSTRAINT `sessoes_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `custos` ADD CONSTRAINT `custos_produtoId_fkey` FOREIGN KEY (`produtoId`) REFERENCES `produtos`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `custos` ADD CONSTRAINT `custos_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `precos_justos` ADD CONSTRAINT `precos_justos_produtoId_fkey` FOREIGN KEY (`produtoId`) REFERENCES `produtos`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `precos_justos` ADD CONSTRAINT `precos_justos_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `alugueis` ADD CONSTRAINT `alugueis_locatarioId_fkey` FOREIGN KEY (`locatarioId`) REFERENCES `usuarios`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- RedefineIndex
CREATE INDEX `alugueis_equipamentoId_idx` ON `alugueis`(`equipamentoId`);
DROP INDEX `alugueis_equipamentoId_fkey` ON `alugueis`;

-- RedefineIndex
CREATE INDEX `alugueis_locadorId_idx` ON `alugueis`(`locadorId`);
DROP INDEX `alugueis_locadorId_fkey` ON `alugueis`;

-- RedefineIndex
CREATE INDEX `custos_produtoId_idx` ON `custos`(`produtoId`);
DROP INDEX `custos_produtoId_fkey` ON `custos`;

-- RedefineIndex
CREATE INDEX `precos_justos_produtoId_idx` ON `precos_justos`(`produtoId`);
DROP INDEX `precos_justos_produtoId_fkey` ON `precos_justos`;
