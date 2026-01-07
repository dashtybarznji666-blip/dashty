import Database from 'better-sqlite3';
import * as path from 'path';

async function listUsers() {
  const dbPath = path.join(__dirname, '../prisma/prisma/dev.db');
  
  try {
    const db = new Database(dbPath);
    console.log('Connected to SQLite database\n');

    const users = db.prepare(`
      SELECT email, name, role, is_active, created_at 
      FROM users 
      ORDER BY created_at DESC
    `).all();

    console.log('=== Registered Users ===\n');
    if (users.length === 0) {
      console.log('No users found in the database.');
    } else {
      console.log(`Total users: ${users.length}\n`);
      (users as any[]).forEach((user: any, index: number) => {
        console.log(`${index + 1}. ${user.email}`);
        console.log(`   Name: ${user.name}`);
        console.log(`   Role: ${user.role}`);
        console.log(`   Active: ${user.is_active ? 'Yes' : 'No'}`);
        console.log(`   Created: ${new Date(user.created_at).toLocaleString()}`);
        console.log('');
      });

      console.log('\n=== Email List ===');
      (users as any[]).forEach((user: any) => {
        console.log(user.email);
      });
    }

    db.close();
  } catch (error: any) {
    if (error.code === 'SQLITE_CANTOPEN' || error.code === 'ENOENT') {
      console.error('Database file not found. The database may not have been created yet.');
    } else {
      console.error('Error fetching users:', error);
    }
    process.exit(1);
  }
}

listUsers();

