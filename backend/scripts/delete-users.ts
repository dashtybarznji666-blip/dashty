import Database from 'better-sqlite3';
import * as path from 'path';

function deleteUsers() {
  const dbPath = path.join(__dirname, '../prisma/prisma/dev.db');
  
  try {
    const db = new Database(dbPath);
    console.log('Connected to SQLite database\n');

    // List of emails to delete
    const emailsToDelete = [
      'bakobako@gmail.com',
      'fatih@gmail.com',
      'aram@gmail.com',
      'akoako@gmail.com',
    ];

    console.log('Deleting users with the following emails:');
    emailsToDelete.forEach((email) => console.log(`  - ${email}`));
    console.log('');

    // Prepare delete statement
    const deleteStmt = db.prepare('DELETE FROM users WHERE email = ?');
    
    let totalDeleted = 0;
    emailsToDelete.forEach((email) => {
      const result = deleteStmt.run(email);
      if (result.changes > 0) {
        console.log(`✓ Deleted: ${email}`);
        totalDeleted += result.changes;
      } else {
        console.log(`✗ Not found: ${email}`);
      }
    });

    console.log(`\nTotal users deleted: ${totalDeleted}`);

    // Show remaining users
    const remainingUsers = db.prepare('SELECT email, name FROM users').all() as Array<{ email: string; name: string }>;

    console.log(`\nRemaining users: ${remainingUsers.length}`);
    if (remainingUsers.length > 0) {
      remainingUsers.forEach((user) => {
        console.log(`  - ${user.email} (${user.name})`);
      });
    }

    db.close();
  } catch (error: any) {
    if (error.code === 'SQLITE_CANTOPEN' || error.code === 'ENOENT') {
      console.error('Database file not found. The database may not have been created yet.');
    } else {
      console.error('Error deleting users:', error);
    }
    process.exit(1);
  }
}

deleteUsers();

