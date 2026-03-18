import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Todo } from '@/entities/Todo';
import path from 'path';

const DB_PATH = process.env.DATABASE_PATH
  ? path.resolve(process.cwd(), process.env.DATABASE_PATH)
  : path.resolve(process.cwd(), 'database.sqlite');

let dataSource: DataSource | null = null;

export async function getDataSource(): Promise<DataSource> {
  if (dataSource && dataSource.isInitialized) {
    return dataSource;
  }

  dataSource = new DataSource({
    type: 'better-sqlite3',
    database: DB_PATH,
    synchronize: true,
    logging: false,
    entities: [Todo],
  });

  await dataSource.initialize();
  return dataSource;
}

export async function getTodoRepository() {
  const ds = await getDataSource();
  return ds.getRepository(Todo);
}
