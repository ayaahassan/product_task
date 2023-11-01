import { Response } from 'express'
import jwt from 'jsonwebtoken'
import configurations from '../../config/configurations'
import { User } from '../../entities/User.entity'

export const sendAuthenticationResponse = (user: User, res: Response) => {
	const userData = {
		id: user.id,
		email: user.email,
	}
	const accessToken = jwt.sign(
		{ user: userData },
		configurations().secret,
		{ expiresIn: '4h' }
		// (err: any, token: any) => {
		// 	res.status(200).json({
		// 		success: true,
		// 		data: {
		// 			access_token: token,
		// 			user: userData,
		// 		},
		// 	})
		// }
	)
	const refreshToken = jwt.sign(
		{
			user: userData,
		},
		configurations().secret,
		{ expiresIn: '1d' }
	)

	res.cookie('jwt', refreshToken, {
		httpOnly: true,
		secure: true,
		maxAge: 24 * 60 * 60 * 1000,
	})
		res.status(200).json({
				success: true,
				data: {
					access_token: accessToken,
					user: userData,
				},
			})
	// return res.json({ accessToken })
}
