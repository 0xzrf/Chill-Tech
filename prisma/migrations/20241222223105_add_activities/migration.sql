-- DropIndex
DROP INDEX "Activities_childrenId_key";

-- AlterTable
ALTER TABLE "Activities" ADD COLUMN     "completed" BOOLEAN NOT NULL DEFAULT false;
