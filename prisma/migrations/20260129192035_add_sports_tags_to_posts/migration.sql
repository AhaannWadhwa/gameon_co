-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "sportsTags" TEXT[] DEFAULT ARRAY[]::TEXT[];
