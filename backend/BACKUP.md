# Database Backup and Recovery Guide

## Overview

This application includes automated backup functionality for the SQLite database. Backups are stored in the `backend/backups/` directory.

## Backup Commands

### Create a Backup

```bash
npm run backup
```

This will:
- Create a timestamped backup of the database
- Store it in `backend/backups/`
- Automatically clean up old backups (keeps last 30)

### List Available Backups

```bash
npm run backup:list
```

This will display all available backups with their sizes and timestamps.

### Restore from Backup

```bash
npm run restore <backup-filename>
```

Example:
```bash
npm run restore backup-2025-12-10T03-00-00-000Z.db
```

**Important:** Before restoring, the current database is automatically backed up as a safety measure.

## Automated Backup Scheduling

### Windows (Task Scheduler)

1. Open Task Scheduler
2. Create Basic Task
3. Set trigger (e.g., Daily at 2 AM)
4. Set action: Start a program
5. Program: `npm`
6. Arguments: `run backup`
7. Start in: `C:\path\to\vito\backend`

### Linux/macOS (Cron)

Add to crontab (`crontab -e`):

```bash
# Daily backup at 2 AM
0 2 * * * cd /path/to/vito/backend && npm run backup
```

### Using PM2 (Recommended for Production)

If using PM2, you can use `pm2-cron`:

```bash
npm install -g pm2-cron
pm2 install pm2-cron
```

Then add to `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [
    {
      name: 'shoe-store-api',
      script: './dist/index.js',
      cron_restart: '0 2 * * *',
      // ... other config
    }
  ]
};
```

## Backup Retention Policy

- **Maximum Backups:** 30
- **Cleanup:** Automatic (oldest backups are deleted when limit is reached)
- **Location:** `backend/backups/`

To change the retention policy, edit `MAX_BACKUPS` in `backend/scripts/backup.ts`.

## Recovery Procedures

### Full Database Recovery

1. **List available backups:**
   ```bash
   npm run backup:list
   ```

2. **Stop the application** (if running)

3. **Restore from backup:**
   ```bash
   npm run restore backup-YYYY-MM-DDTHH-MM-SS-sssZ.db
   ```

4. **Verify the restore:**
   - Check database file size
   - Start the application
   - Verify data integrity

5. **If restore fails:**
   - Check backup file integrity
   - Try a different backup
   - Check file permissions

### Partial Recovery (Manual)

If you need to recover specific data:

1. Restore backup to a temporary location
2. Use Prisma Studio to inspect data:
   ```bash
   npm run prisma:studio
   ```
3. Export specific records
4. Import into current database

## Best Practices

1. **Regular Backups:** Set up automated daily backups
2. **Test Restores:** Periodically test restore procedures
3. **Offsite Storage:** Consider copying backups to external storage
4. **Monitor Disk Space:** Ensure sufficient space for backups
5. **Backup Before Updates:** Always backup before major updates or migrations

## Troubleshooting

### Backup Fails

- Check database file exists: `backend/prisma/prisma/dev.db`
- Verify write permissions on `backend/backups/` directory
- Check available disk space

### Restore Fails

- Verify backup file exists and is readable
- Check database directory permissions
- Ensure application is stopped during restore

### Disk Space Issues

- Reduce `MAX_BACKUPS` in backup script
- Manually delete old backups
- Move backups to external storage

## Production Considerations

For production environments:

1. **Use PostgreSQL or MySQL:** SQLite is not recommended for production
2. **Database-specific backup tools:** Use native backup tools (pg_dump, mysqldump)
3. **Automated backups:** Set up automated backups at the database level
4. **Backup verification:** Regularly verify backup integrity
5. **Disaster recovery plan:** Document and test full recovery procedures
