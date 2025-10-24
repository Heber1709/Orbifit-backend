/*
  Warnings:

  - You are about to drop the column `coachId` on the `training_results` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `training_results` table. All the data in the column will be lost.
  - You are about to drop the column `generalObservations` on the `training_results` table. All the data in the column will be lost.
  - You are about to drop the column `rating` on the `training_results` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `training_results` table. All the data in the column will be lost.
  - You are about to drop the `player_training_results` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[trainingId,playerId]` on the table `training_results` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `playerId` to the `training_results` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "player_training_results" DROP CONSTRAINT "player_training_results_playerId_fkey";

-- DropForeignKey
ALTER TABLE "player_training_results" DROP CONSTRAINT "player_training_results_trainingId_fkey";

-- DropForeignKey
ALTER TABLE "training_results" DROP CONSTRAINT "training_results_coachId_fkey";

-- DropForeignKey
ALTER TABLE "training_results" DROP CONSTRAINT "training_results_trainingId_fkey";

-- DropIndex
DROP INDEX "training_results_trainingId_key";

-- AlterTable
ALTER TABLE "messages" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "training_results" DROP COLUMN "coachId",
DROP COLUMN "createdAt",
DROP COLUMN "generalObservations",
DROP COLUMN "rating",
DROP COLUMN "updatedAt",
ADD COLUMN     "attitude" INTEGER,
ADD COLUMN     "endurance" INTEGER,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "playerId" INTEGER NOT NULL,
ADD COLUMN     "technique" INTEGER;

-- DropTable
DROP TABLE "player_training_results";

-- CreateIndex
CREATE UNIQUE INDEX "training_results_trainingId_playerId_key" ON "training_results"("trainingId", "playerId");

-- AddForeignKey
ALTER TABLE "training_results" ADD CONSTRAINT "training_results_trainingId_fkey" FOREIGN KEY ("trainingId") REFERENCES "trainings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_results" ADD CONSTRAINT "training_results_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
