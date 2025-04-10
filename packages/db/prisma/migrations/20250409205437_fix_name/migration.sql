/*
  Warnings:

  - You are about to drop the column `avatr` on the `RoomUser` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "RoomUser" DROP COLUMN "avatr",
ADD COLUMN     "avatar" TEXT;
