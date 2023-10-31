import { DataSource } from 'typeorm'
import { createDatabase } from 'typeorm-extension'
import { dbOptions } from './database-options'

class DataBase {
	dataSource: DataSource
	constructor(dataSource: DataSource) {
		this.dataSource = dataSource
	}
	async connect() {
        try {
            await createDatabase({
              options:dbOptions
            })
            await this.dataSource.initialize();
            console.log('Connected to database');
          } catch (error) {
            console.log(
              'error',
              'Error connecting to database: ' + JSON.stringify(error)
            )
          }
	}
}
export const dataSource = new DataSource(dbOptions)
export const dataBase = new DataBase(dataSource)
