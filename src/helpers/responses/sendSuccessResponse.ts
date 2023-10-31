import { Response } from 'express'
import { StatusCodes } from '../enums/StatusCodes'

export const sendSuccessResponse = <T>(
	res: Response,
	data?: T | T[],
	status?: StatusCodes
) => {
	res.status(status ?? StatusCodes.SUCCESS).json({
		success: true,
		data,
	})
}
