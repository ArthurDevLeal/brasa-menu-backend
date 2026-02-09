/*
  Warnings:

  - You are about to drop the `UserRestaurant` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userId` to the `Restaurant` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UserRestaurant" DROP CONSTRAINT "UserRestaurant_restaurantId_fkey";

-- DropForeignKey
ALTER TABLE "UserRestaurant" DROP CONSTRAINT "UserRestaurant_userId_fkey";

-- AlterTable
ALTER TABLE "Restaurant" ADD COLUMN     "userId" TEXT NOT NULL;

-- DropTable
DROP TABLE "UserRestaurant";

-- DropEnum
DROP TYPE "Role";

-- CreateIndex
CREATE INDEX "Restaurant_userId_idx" ON "Restaurant"("userId");

-- AddForeignKey
ALTER TABLE "Restaurant" ADD CONSTRAINT "Restaurant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
