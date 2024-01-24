import { DataSource } from 'typeorm'

export const dataSourceOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '1234',
  database: 'bloger_db',
  entities: ['/src/entities/*.entities.ts'],
  migrations: ['/src/migrations/*.ts'],
  migrationsRun: true,
  synchronize: true,
  logging: true,
  cli: {
    migrationsDir: 'src/migration'
  },
  // migrationsTableName: 'custom_migration_table',
}

const dataSource = new DataSource(dataSourceOptions)

dataSource
  .initialize()
  .then(() => {
    console.log('Data Source has been initialized!')
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err)
  })

export default dataSource
