# Database Cleanup Guide

## Current Status
- **Active Database**: `opnmart_fresh` (empty, production-ready)
- **Old Database**: `opnmart` (contains 8 seeded dummy products - no longer used)

## To Delete Old Database in the Future

When you're ready to clean up and only keep the active database:

### Option 1: Delete via MongoDB Atlas Console
1. Log into [MongoDB Atlas](https://cloud.mongodb.com)
2. Go to your cluster
3. Find the `opnmart` database
4. Click the trash icon to delete it
5. Confirm deletion

### Option 2: Delete via Node.js Script
Run this command from the backend directory:

```bash
node -e "
require('dotenv').config();
const mongoose = require('mongoose');
(async () => {
  const conn = await mongoose.connect(process.env.MONGODB_URI.replace('opnmart_fresh', 'opnmart'));
  const db = conn.connection.db;
  await db.dropDatabase();
  console.log('✅ Old opnmart database deleted');
  await mongoose.disconnect();
  process.exit(0);
})();
"
```

Or create a file:
```bash
node delete-old-database.js
```

### Current .env Configuration
The backend is now using:
```
MONGODB_DB=opnmart_fresh
```

The old `opnmart` database can be safely deleted without affecting the application.

## Why the Switch Was Necessary
The old `opnmart` database contained 8 seeded dummy products that persisted even after deletion attempts. By creating a new database name (`opnmart_fresh`), we have a guaranteed clean slate.

## Future Vendors
Vendors can now upload real products directly without any dummy data interference.
