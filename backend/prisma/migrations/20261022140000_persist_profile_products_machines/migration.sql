-- Persist profile fields and complete the product/machine columns used by the current API.
ALTER TABLE `usuarios`
  ADD COLUMN `regiao` VARCHAR(191) NULL,
  ADD COLUMN `bio` TEXT NULL;

ALTER TABLE `produtos`
  ADD COLUMN `preco` DECIMAL(10, 2) NOT NULL DEFAULT 0,
  ADD COLUMN `imagem` LONGTEXT NULL;

ALTER TABLE `equipamentos`
  ADD COLUMN `condicoes` VARCHAR(191) NOT NULL DEFAULT 'Máquina cadastrada',
  ADD COLUMN `dias` DECIMAL(10, 2) NOT NULL DEFAULT 1,
  ADD COLUMN `imagem` LONGTEXT NULL,
  ADD COLUMN `localizacao` VARCHAR(191) NULL,
  ADD COLUMN `proprietario` VARCHAR(191) NULL,
  ADD COLUMN `excluidoEm` DATETIME(3) NULL;
