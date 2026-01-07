-- CreateTable
CREATE TABLE "store_settings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "store_name" TEXT NOT NULL DEFAULT 'Shoe Store',
    "store_address" TEXT,
    "store_logo" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);
