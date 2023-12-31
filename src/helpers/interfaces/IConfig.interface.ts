
interface IDataSourceOptions {
	host?: string
	port: number
	username?: string
	password?: string
	name?: string
}
export interface IConfigInterface {
	port: string | number
	database: IDataSourceOptions
	secret:string
	websiteUrl: string
}
