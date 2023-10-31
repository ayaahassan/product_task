import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import configurations from '../config/configurations'
import { sendErrorResponse } from '../helpers/responses/sendErrorResponse'
import { formatValidationErrors } from '../helpers/methods/formatValidationErrors'
import { StatusCodes } from '../helpers/enums/StatusCodes'

const isAuthenticated = async (
	req: any,
	res: Response,
	next: () => void
) => {
	const bearerHeader = req.headers['authorization']

	if (bearerHeader !== undefined && bearerHeader.includes('Bearer ')) {
		const Token = bearerHeader.split(' ')[1]

		jwt.verify(Token, configurations().secret, (error: any, user: any) => {
			if (error) {
				sendErrorResponse(
					formatValidationErrors(error),
					res,
					StatusCodes.NOT_AUTHORIZED
				)
			}
			req['user'] = user
			next()
		})
	} else {
		sendErrorResponse(['Not Authorized'], res, StatusCodes.NOT_AUTHORIZED)
	}
}

export { isAuthenticated }
