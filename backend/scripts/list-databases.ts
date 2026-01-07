import { Client } from 'pg';

async function listDatabases() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'postgres', // Connect to default postgres database
    user: 'postgres',
    password: '12345678',
  });

  try {
    await client.connect();
    console.log('Connected to PostgreSQL\n');

    const result = await client.query(`
      SELECT datname FROM pg_database WHERE datistemplate = false;
    `);

    console.log('Available databases:');
    result.rows.forEach((row: any) => {
      console.log(`  - ${row.datname}`);
    });
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

listDatabases();

