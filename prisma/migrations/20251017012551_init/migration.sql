-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('JUGADOR', 'ENTRENADOR', 'ADMINISTRADOR');

-- CreateEnum
CREATE TYPE "PlayerPosition" AS ENUM ('PORTERO', 'DEFENSA', 'MEDIOCAMPO', 'DELANTERO');

-- CreateEnum
CREATE TYPE "TrainingType" AS ENUM ('FISICO', 'TACTICO', 'TECNICO', 'PRACTICA');

-- CreateEnum
CREATE TYPE "TrainingStatus" AS ENUM ('PROGRAMADO', 'CONFIRMADO', 'COMPLETADO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('ENTRENAMIENTO', 'PARTIDO', 'REUNION', 'VACACIONES');

-- CreateEnum
CREATE TYPE "MessageType" AS ENUM ('GENERAL', 'PRIVADO');

-- CreateEnum
CREATE TYPE "TournamentStatus" AS ENUM ('ACTIVO', 'PROGRAMADO', 'FINALIZADO');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'JUGADOR',
    "age" INTEGER,
    "position" "PlayerPosition",
    "phone" TEXT,
    "jerseyNumber" INTEGER,
    "license" TEXT,
    "experienceYears" INTEGER,
    "specialization" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trainings" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" "TrainingType" NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "duration" INTEGER NOT NULL,
    "coachId" INTEGER NOT NULL,
    "location" TEXT,
    "status" "TrainingStatus" NOT NULL DEFAULT 'PROGRAMADO',

    CONSTRAINT "trainings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "training_participants" (
    "id" SERIAL NOT NULL,
    "trainingId" INTEGER NOT NULL,
    "playerId" INTEGER NOT NULL,
    "confirmed" BOOLEAN NOT NULL DEFAULT false,
    "attended" BOOLEAN,

    CONSTRAINT "training_participants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "training_results" (
    "id" SERIAL NOT NULL,
    "trainingId" INTEGER NOT NULL,
    "generalObservations" TEXT,
    "rating" INTEGER NOT NULL,
    "coachId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "training_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "player_training_results" (
    "id" SERIAL NOT NULL,
    "trainingId" INTEGER NOT NULL,
    "playerId" INTEGER NOT NULL,
    "endurance" TEXT NOT NULL,
    "technique" TEXT NOT NULL,
    "attitude" TEXT NOT NULL,
    "observations" TEXT,
    "rating" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "player_training_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" "EventType" NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "time" TEXT,
    "location" TEXT,
    "createdById" INTEGER NOT NULL,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "type" "MessageType" NOT NULL DEFAULT 'GENERAL',
    "senderId" INTEGER NOT NULL,
    "receiverId" INTEGER,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "player_stats" (
    "id" SERIAL NOT NULL,
    "playerId" INTEGER NOT NULL,
    "matchesPlayed" INTEGER NOT NULL DEFAULT 0,
    "goals" INTEGER NOT NULL DEFAULT 0,
    "assists" INTEGER NOT NULL DEFAULT 0,
    "year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,

    CONSTRAINT "player_stats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tournaments" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "status" "TournamentStatus" NOT NULL DEFAULT 'ACTIVO',
    "teamsCount" INTEGER NOT NULL,

    CONSTRAINT "tournaments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "training_participants_trainingId_playerId_key" ON "training_participants"("trainingId", "playerId");

-- CreateIndex
CREATE UNIQUE INDEX "training_results_trainingId_key" ON "training_results"("trainingId");

-- CreateIndex
CREATE UNIQUE INDEX "player_training_results_trainingId_playerId_key" ON "player_training_results"("trainingId", "playerId");

-- CreateIndex
CREATE UNIQUE INDEX "player_stats_playerId_year_month_key" ON "player_stats"("playerId", "year", "month");

-- AddForeignKey
ALTER TABLE "trainings" ADD CONSTRAINT "trainings_coachId_fkey" FOREIGN KEY ("coachId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_participants" ADD CONSTRAINT "training_participants_trainingId_fkey" FOREIGN KEY ("trainingId") REFERENCES "trainings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_participants" ADD CONSTRAINT "training_participants_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_results" ADD CONSTRAINT "training_results_trainingId_fkey" FOREIGN KEY ("trainingId") REFERENCES "trainings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_results" ADD CONSTRAINT "training_results_coachId_fkey" FOREIGN KEY ("coachId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_training_results" ADD CONSTRAINT "player_training_results_trainingId_fkey" FOREIGN KEY ("trainingId") REFERENCES "trainings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_training_results" ADD CONSTRAINT "player_training_results_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_stats" ADD CONSTRAINT "player_stats_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
