-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_sales" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shoe_id" TEXT NOT NULL,
    "user_id" TEXT,
    "size" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unit_price" REAL NOT NULL,
    "total_price" REAL NOT NULL,
    "profit" REAL NOT NULL,
    "exchange_rate" REAL,
    "is_online" BOOLEAN NOT NULL DEFAULT false,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "sales_shoe_id_fkey" FOREIGN KEY ("shoe_id") REFERENCES "shoes" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "sales_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_sales" ("created_at", "exchange_rate", "id", "is_online", "profit", "quantity", "shoe_id", "size", "total_price", "unit_price") SELECT "created_at", "exchange_rate", "id", "is_online", "profit", "quantity", "shoe_id", "size", "total_price", "unit_price" FROM "sales";
DROP TABLE "sales";
ALTER TABLE "new_sales" RENAME TO "sales";
CREATE INDEX "sales_created_at_idx" ON "sales"("created_at");
CREATE INDEX "sales_shoe_id_idx" ON "sales"("shoe_id");
CREATE INDEX "sales_is_online_idx" ON "sales"("is_online");
CREATE INDEX "sales_user_id_idx" ON "sales"("user_id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
