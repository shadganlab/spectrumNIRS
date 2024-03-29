import { createConnection } from 'typeorm';
import Experiments from './entity/Experiments';
import Patients from './entity/Patients';
import Recordings from './entity/Recordings';
import RecordingsData from './entity/RecordingsData';
import Probes from './entity/Probes';

import path from 'path';
process.env.TZ = 'America/Vancouver'; // here is the magical line

// Paths
import { databasePath } from '../main/paths';

const createDBConnection = async () => {
  const connection = await createConnection({
    type: 'better-sqlite3',
    database: path.join(databasePath, 'mydb.db'),
    synchronize: true,
    logging: false,
    entities: [Experiments, Patients, Recordings, RecordingsData, Probes],
    migrations: ['src/db/migration/**/*.ts'],
    subscribers: ['src/db/subscriber/**/*.ts'],
  });

  connection.query('PRAGMA auto_vacuum = INCREMENTAL');
  connection.query('PRAGMA main.cache_size = 32000');
  connection.query('PRAGMA synchronous = normal');
  connection.query('PRAGMA temp_store = memory');
  connection.query('PRAGMA mmap_size = 30000000000');
};

export default createDBConnection;
