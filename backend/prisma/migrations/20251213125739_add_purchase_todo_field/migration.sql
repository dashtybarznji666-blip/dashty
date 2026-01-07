-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_purchases" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "supplier_id" TEXT NOT NULL,
    "shoe_id" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unit_cost" REAL NOT NULL,
    "total_cost" REAL NOT NULL,
    "is_credit" BOOLEAN NOT NULL DEFAULT false,
    "paid_amount" REAL NOT NULL DEFAULT 0,
    "is_todo" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "purchase_date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "purchases_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "suppliers" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "purchases_shoe_id_fkey" FOREIGN KEY ("shoe_id") REFERENCES "shoes" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_purchases" ("created_at", "id", "is_credit", "notes", "paid_amount", "purchase_date", "quantity", "shoe_id", "size", "supplier_id", "total_cost", "unit_cost", "updated_at") SELECT "created_at", "id", "is_credit", "notes", "paid_amount", "purchase_date", "quantity", "shoe_id", "size", "supplier_id", "total_cost", "unit_cost", "updated_at" FROM "purchases";
DROP TABLE "purchases";
ALTER TABLE "new_purchases" RENAME TO "purchases";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
