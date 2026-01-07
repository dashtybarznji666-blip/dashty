import * as fs from 'fs';
import * as path from 'path';

const BACKUP_DIR = path.join(__dirname, '../backups');
const DB_PATH = path.join(__dirname, '../prisma/prisma/dev.db');
const DB_DIR = path.dirname(DB_PATH);

/**
 * Restore database from backup
 */
function restoreBackup(backupFilename: string): void {
  // Check if backups directory exists
  if (!fs.existsSync(BACKUP_DIR)) {
    console.error('❌ Backups directory not found:', BACKUP_DIR);
    process.exit(1);
  }

  const backupPath = path.join(BACKUP_DIR, backupFilename);

  // Check if backup file exists
  if (!fs.existsSync(backupPath)) {
    console.error(`❌ Backup file not found: ${backupFilename}`);
    console.error(`   Expected location: ${backupPath}`);
    process.exit(1);
  }

  // Create database directory if it doesn't exist
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }

  // Create a backup of current database before restoring
  if (fs.existsSync(DB_PATH)) {
    const currentBackupName = `pre-restore-${new Date().toISOString().replace(/[:.]/g, '-')}.db`;
    const currentBackupPath = path.join(BACKUP_DIR, currentBackupName);
    fs.copyFileSync(DB_PATH, currentBackupPath);
    console.log(`💾 Current database backed up as: ${currentBackupName}`);
  }

  try {
    // Restore from backup
    fs.copyFileSync(backupPath, DB_PATH);
    console.log(`✅ Database restored from: ${backupFilename}`);
    console.log(`   Location: ${DB_PATH}`);

    // Verify restore
    const stats = fs.statSync(DB_PATH);
    const sizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
    console.log(`   Size: ${sizeInMB} MB`);
    console.log(`\n⚠️  Note: You may need to restart the application for changes to take effect.`);
  } catch (error: any) {
    console.error('❌ Failed to restore backup:', error.message);
    process.exit(1);
  }
}

// Main execution
const backupFilename = process.argv[2];

if (!backupFilename) {
  console.error('❌ Usage: npm run restore <backup-filename>');
  console.error('   Example: npm run restore backup-2025-12-10T03-00-00-000Z.db');
  console.error('\n   To list available backups: npm run backup:list');
  process.exit(1);
}

restoreBackup(backupFilename);
