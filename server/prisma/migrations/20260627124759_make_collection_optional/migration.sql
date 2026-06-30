-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_collection_id_fkey";

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "collection_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_collection_id_fkey" FOREIGN KEY ("collection_id") REFERENCES "Collection"("id") ON DELETE SET NULL ON UPDATE CASCADE;
