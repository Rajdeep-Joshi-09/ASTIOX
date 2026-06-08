-- CreateTable
CREATE TABLE "Menu" (
    "id" SERIAL NOT NULL,
    "menu_name" TEXT NOT NULL,
    "menu_key" TEXT NOT NULL,
    "menu_path" TEXT NOT NULL,
    "icon" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_developer_only" INTEGER NOT NULL DEFAULT 0,
    "is_status" INTEGER NOT NULL DEFAULT 1,
    "is_delete" INTEGER NOT NULL DEFAULT 0,
    "created_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modify_date" TIMESTAMP(3),
    "delete_date" TIMESTAMP(3),

    CONSTRAINT "Menu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoleMenuPermission" (
    "id" SERIAL NOT NULL,
    "user_type" TEXT NOT NULL,
    "menu_id" INTEGER NOT NULL,
    "can_access" INTEGER NOT NULL DEFAULT 1,
    "created_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RoleMenuPermission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Menu_menu_key_key" ON "Menu"("menu_key");

-- CreateIndex
CREATE UNIQUE INDEX "RoleMenuPermission_user_type_menu_id_key" ON "RoleMenuPermission"("user_type", "menu_id");

-- AddForeignKey
ALTER TABLE "RoleMenuPermission" ADD CONSTRAINT "RoleMenuPermission_menu_id_fkey" FOREIGN KEY ("menu_id") REFERENCES "Menu"("id") ON DELETE CASCADE ON UPDATE CASCADE;
