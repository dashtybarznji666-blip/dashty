import * as fs from 'fs';
import * as path from 'path';

const BACKUP_DIR = path.join(__dirname, '../backups');
const DB_PATH = path.join(__dirname, '../prisma/prisma/dev.db');
const MAX_BACKUPS = 30; // Keep last 30 backups

/**
 * Create a backup of the SQLite database
 */
function createBackup(): void {
  // Create backups directory if it doesn't exist
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }

  // Check if database exists
  if (!fs.existsSync(DB_PATH)) {
    console.error('❌ Database file not found:', DB_PATH);
    process.exit(1);
  }

  // Generate backup filename with timestamp
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupFilename = `backup-${timestamp}.db`;
  const backupPath = path.join(BACKUP_DIR, backupFilename);

  try {
    // Copy database file
    fs.copyFileSync(DB_PATH, backupPath);
    console.log(`✅ Backup created: ${backupFilename}`);
    console.log(`   Location: ${backupPath}`);

    // Clean up old backups
    cleanupOldBackups();

    // Get backup size
    const stats = fs.statSync(backupPath);
    const sizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
    console.log(`   Size: ${sizeInMB} MB`);
  } catch (error: any) {
    console.error('❌ Failed to create backup:', error.message);
    process.exit(1);
  }
}

/**
 * Clean up old backups, keeping only the most recent MAX_BACKUPS
 */
function cleanupOldBackups(): void {
  try {
    const files = fs.readdirSync(BACKUP_DIR)
      .filter(file => file.startsWith('backup-') && file.endsWith('.db'))
      .map(file => ({
        name: file,
        path: path.join(BACKUP_DIR, file),
        time: fs.statSync(path.join(BACKUP_DIR, file)).mtime.getTime(),
      }))
      .sort((a, b) => b.time - a.time); // Sort by modification time, newest first

    // Remove backups beyond MAX_BACKUPS
    if (files.length > MAX_BACKUPS) {
      const filesToDelete = files.slice(MAX_BACKUPS);
      filesToDelete.forEach(file => {
        fs.unlinkSync(file.path);
        console.log(`🗑️  Deleted old backup: ${file.name}`);
      });
    }
  } catch (error: any) {
    console.warn('⚠️  Warning: Failed to cleanup old backups:', error.message);
  }
}

/**
 * List all available backups
 */
function listBackups(): void {
  try {
    if (!fs.existsSync(BACKUP_DIR)) {
      console.log('No backups directory found.');
      return;
    }

    const files = fs.readdirSync(BACKUP_DIR)
      .filter(file => file.startsWith('backup-') && file.endsWith('.db'))
      .map(file => {
        const filePath = path.join(BACKUP_DIR, file);
        const stats = fs.statSync(filePath);
        return {
          name: file,
          size: stats.size,
          created: stats.birthtime,
          modified: stats.mtime,
        };
      })
      .sort((a, b) => b.modified.getTime() - a.modified.getTime());

    if (files.length === 0) {
      console.log('No backups found.');
      return;
    }

    console.log(`\n📦 Found ${files.length} backup(s):\n`);
    files.forEach((file, index) => {
      const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
      console.log(`${index + 1}. ${file.name}`);
      console.log(`   Size: ${sizeInMB} MB`);
      console.log(`   Created: ${file.created.toLocaleString()}`);
      console.log(`   Modified: ${file.modified.toLocaleString()}\n`);
    });
  } catch (error: any) {
    console.error('❌ Failed to list backups:', error.message);
    process.exit(1);
  }
}

// Main execution
const command = process.argv[2];

if (command === 'list') {
  listBackups();
} else {
  createBackup();
}
