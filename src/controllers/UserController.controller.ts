import { Request, Response } from 'express'
import { UserValidation } from '../helpers/validations/user/user.validation'
import { User } from '../entities/User.entity'
import { throws } from 'assert'
import { sendNotFoundResponse } from '../helpers/responses/404.response'
import { password } from '../helpers/util/Password'
import { ValidationError } from 'joi'
import { sendErrorResponse } from '../helpers/responses/sendErrorResponse'
import { StatusCodes } from '../helpers/enums/StatusCodes'
import { formatValidationErrors } from '../helpers/methods/formatValidationErrors'
import { sendAuthenticationResponse } from '../helpers/responses/sendAuthenticationResponse'
import jwt from 'jsonwebtoken'
import configurations from '../config/configurations'
class UserController {
	Login = async (req: Request, res: Response) => {
		try {
			await UserValidation.validateAsync(req.body, { abortEarly: false })
			const foundUser = await User.findOne({ where: { email: req.body.email } })
			if (foundUser) {
				let check = password.verify(req.body.password, foundUser.password)
				if (check) {
					sendAuthenticationResponse(foundUser, res)
				} else {
					sendNotFoundResponse(res)
				}
			} else {
				sendNotFoundResponse(res)
			}
		} catch (error) {
			if (error instanceof ValidationError) {
				res.status(400).json({
					status: 'error',
					message: error.details.map((detail) => detail.message),
				})
			} else {
				sendErrorResponse(
					formatValidationErrors(error as any),
					res,
					StatusCodes.NOT_ACCEPTABLE
				)
			}
		}
	}
	Register = async (req: Request, res: Response) => {
		try {
			await UserValidation.validateAsync(req.body, {
				abortEarly: false,
			})
			const exitUser = await User.findOne({ where: { email: req.body.email } })
			if (!exitUser) {
				const hashedPassword = password.hash(req.body.password)
				const user = User.create({
					email: req.body.email,
					password: hashedPassword,
				})
				user.save()
				sendAuthenticationResponse(user, res)
			} else {
				res.status(400).json({ success: false, data: 'email should be unique' })
			}
		} catch (error) {
			if (error instanceof ValidationError) {
				res.status(400).json({
					status: 'error',
					message: error.details.map((detail) => detail.message),
				})
			} else {
				sendErrorResponse(
					formatValidationErrors(error as any),
					res,
					StatusCodes.NOT_ACCEPTABLE
				)
			}
		}
	}
	RefreshToken = async (req: Request, res: Response) => {
		if (req.cookies?.jwt) {
			const refreshToken = req.cookies.jwt
			jwt.verify(refreshToken, configurations().secret, (err:any, decoded:any) => {
                console.log({decoded})
				if (err) {
					return res.status(StatusCodes.NOT_AUTHORIZED).json({ message: 'Unauthorized' })
				} else {
                    sendAuthenticationResponse(decoded, res)
                }
			})
		} else {
			res.status(StatusCodes.NOT_AUTHORIZED).json('Unauthorized')
		}
	}
}

export default new UserController()
