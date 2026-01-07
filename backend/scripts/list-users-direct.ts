import { Client } from 'pg';

async function listUsers() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'vito_db',
    user: 'postgres',
    password: '12345678',
  });

  try {
    await client.connect();
    console.log('Connected to PostgreSQL database\n');

    const result = await client.query(`
      SELECT email, name, role, is_active, created_at 
      FROM users 
      ORDER BY created_at DESC
    `);

    console.log('=== Registered Users ===\n');
    if (result.rows.length === 0) {
      console.log('No users found in the database.');
    } else {
      console.log(`Total users: ${result.rows.length}\n`);
      result.rows.forEach((user: any, index: number) => {
        console.log(`${index + 1}. ${user.email}`);
        console.log(`   Name: ${user.name}`);
        console.log(`   Role: ${user.role}`);
        console.log(`   Active: ${user.is_active ? 'Yes' : 'No'}`);
        console.log(`   Created: ${new Date(user.created_at).toLocaleString()}`);
        console.log('');
      });

      console.log('\n=== Email List ===');
      result.rows.forEach((user: any) => {
        console.log(user.email);
      });
    }
  } catch (error) {
    console.error('Error fetching users:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

listUsers();

