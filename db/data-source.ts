import { DataSource, DataSourceOptions } from 'typeorm'

export const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: 'localhost', // Assuming you set these environment variables
  port: 3307,
  username: 'root',
  password: '',
  database: 'kyanhnguyen_bloger',
  entities: ['dist/**/*.entity.{ts,js}'],
  migrations: ['dist/migrations/*.js'],
  synchronize: true,
}

const dataSource = new DataSource(dataSourceOptions)

export default dataSource
