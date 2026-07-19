-- CreateEnum
CREATE TYPE "CategoriaServicio" AS ENUM ('BARBERIA', 'ESTETICA');

-- AlterTable
ALTER TABLE "Servicio" ADD COLUMN     "categoria" "CategoriaServicio" NOT NULL DEFAULT 'BARBERIA';
