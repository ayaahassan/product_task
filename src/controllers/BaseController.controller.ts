import { ObjectLiteral, Repository } from 'typeorm'
import { sendSuccessResponse } from '../helpers/responses/sendSuccessResponse'
import { Request, Response } from 'express'
import { sendErrorResponse } from '../helpers/responses/sendErrorResponse'
import { formatValidationErrors } from '../helpers/methods/formatValidationErrors'
import { StatusCodes } from '../helpers/enums/StatusCodes'
import { sendNotFoundResponse } from '../helpers/responses/404.response'
import { unlink } from 'fs'

export abstract class BaseController<Entity extends ObjectLiteral> {
	repository: Repository<Entity>
	constructor(repo: Repository<Entity>) {
		this.repository = repo
	}

	async findAll(req: Request | any, res: Response, relations?: any) {
		try {
			const userId = req.user?.id
			console.log({ userId: req.user })
			if (!userId) {
				return sendErrorResponse(
					['User not authenticated'],
					res,
					StatusCodes.NOT_AUTHORIZED
				)
			}
			const data: Entity[] = await this.repository.find({
				relations,
				where: { 'user.id': userId },
			})
			const dataWithImageLinks = data.map((item: any) => {
				if (item.image) {
					return {
						...item,
						image: `${process.env.WEBSITE_URL}/public${item.image}`,
					}
				}
				return item
			})
			sendSuccessResponse<Entity[]>(res, dataWithImageLinks)
		} catch (error: any) {
			sendErrorResponse(
				formatValidationErrors(error),
				res,
				StatusCodes.NOT_ACCEPTABLE
			)
		}
	}

	async findOne(req: Request | any, res: Response, relations?: string[]) {
		try {
			const id: number | undefined = +req.params.id
			const userId = req.user?.id
			if (!userId) {
				return sendErrorResponse(
					['User not authenticated'],
					res,
					StatusCodes.NOT_AUTHORIZED
				)
			}
			const data = await this.repository.findOne({
				where: { id: id as any, 'user.id': userId },
				relations,
			})
			if (data?.image) {
				const dataWithImageLinks = {
					...data,
					image: `${process.env.WEBSITE_URL}/public${data.image}`,
				}

				sendSuccessResponse<Entity>(res, dataWithImageLinks)
			} else {
				sendNotFoundResponse(res)
			}
		} catch (error: any) {
			sendErrorResponse(
				formatValidationErrors(error),
				res,
				StatusCodes.NOT_ACCEPTABLE
			)
		}
	}

	async create(req: Request | any, res: Response) {
		console.log('in create,')
		try {
			let imagePath = ''
			if (req.file) {
				// imagePath = req.file.path;
				imagePath = `/uploads/${req.file.filename}`
			}
			const entityWithUserId = {
				...req.body,
				image: imagePath,
				user: req.user.id,
			}
			const entity = this.repository.create(entityWithUserId)
			const savedEntity = await this.repository.save(entity)
			sendSuccessResponse<Entity>(res, savedEntity)
		} catch (error: any) {
			sendErrorResponse(
				formatValidationErrors(error),
				res,
				StatusCodes.NOT_ACCEPTABLE
			)
		}
	}

	async update(req: Request | any, res: Response) {
		try {
			const id = +req.params.id
			let updateData = { ...req.body }
			const userId = req.user?.id
			if (!userId) {
				return sendErrorResponse(
					['User not authenticated'],
					res,
					StatusCodes.NOT_AUTHORIZED
				)
			}
			const data = await this.repository.findOne({
				where: { id: id as any, 'user.id': userId },
			})
			if (data && req.file) {
				updateData.image = `/uploads/${req.file.filename}`

				unlink(data?.image, (err) => {
					if (err) {
						console.error('Error deleting old image:', err)
					}
				})
			}

			const updateResult = await this.repository.update(id, updateData)

			const updatedEntity = await this.repository.findOne({
				where: { id: id as any, 'user.id': userId },
			})
			if (updatedEntity) {
				sendSuccessResponse<Entity>(res, updatedEntity)
			} else {
				sendNotFoundResponse(res)
			}
		} catch (error: any) {
			sendErrorResponse(
				formatValidationErrors(error),
				res,
				StatusCodes.NOT_ACCEPTABLE
			)
		}
	}

	async delete(req: Request | any, res: Response) {
		try {
			const id = req.params.id
			const userId = req.user?.id

			const entity = await this.repository.findOne(id)

			if (!entity) {
				return sendNotFoundResponse(res)
			}

			if (entity.user.id !== userId) {
				return sendErrorResponse(
					['Not authorized to delete this entity'],
					res,
					StatusCodes.NOT_AUTHORIZED
				)
			}
			const data = await this.repository.findOne({
				where: { id: id as any, 'user.id': userId },
			})
			
			const deletedEntity = await this.repository.delete(id)
			if (data ) {
				unlink(data?.image, (err) => {
					if (err) {
						console.error('Error deleting old image:', err)
					}
				})
			}
			if (deletedEntity.affected && deletedEntity.affected > 0) {
				sendSuccessResponse(res, { message: 'Entity deleted successfully' })
			} else {
				sendNotFoundResponse(res)
			}
		} catch (error: any) {
			sendErrorResponse(
				formatValidationErrors(error),
				res,
				StatusCodes.NOT_ACCEPTABLE
			)
		}
	}
}
