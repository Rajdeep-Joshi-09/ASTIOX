-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "is_status" INTEGER NOT NULL,
    "is_delete" INTEGER NOT NULL,
    "category_name" TEXT NOT NULL,
    "created_date" TIMESTAMP(3) NOT NULL,
    "modify_date" TIMESTAMP(3) NOT NULL,
    "delete_date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);
