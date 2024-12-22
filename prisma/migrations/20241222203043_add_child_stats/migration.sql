-- AlterTable
ALTER TABLE "Children" ADD COLUMN     "activitiesCompleted" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "currentStreak" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "lastActivityDate" TIMESTAMP(3),
ADD COLUMN     "longestStreak" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "totalPoints" SET DEFAULT 0;
