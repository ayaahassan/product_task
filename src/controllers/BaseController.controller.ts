import { ObjectLiteral, Repository } from 'typeorm'
import { sendSuccessResponse } from '../helpers/responses/sendSuccessResponse'
import { Request, Response } from 'express'
import { sendNotFoundResponse } from '../helpers/responses/404.response'
import { sendErrorResponse } from '../helpers/responses/sendErrorResponse'
import { formatValidationErrors } from '../helpers/methods/formatValidationErrors'
import { StatusCodes } from '../helpers/enums/StatusCodes'

export abstract class BaseController<Entity extends ObjectLiteral> {
	repository: Repository<Entity>
	constructor(repo: Repository<Entity>) {
		this.repository = repo
	}

	async findAll(req: Request | any, res: Response, relations?: string[]) {
		try {
			const userId = req.user?.id
			if (!userId) {
				return sendErrorResponse(
					['User not authenticated'],
					res,
					StatusCodes.NOT_AUTHORIZED
				)
			}
			const data: Entity[] = await this.repository.find({
				relations,
				where: { user: userId },
			})
			sendSuccessResponse<Entity[]>(res, data)
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
				where: { id: id as any, user: userId },
				relations,
			})
			if (data) {
				sendSuccessResponse<Entity>(res, data)
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

	async create(req: Request|any, res: Response) {
		console.log("in create")
		try {
			let imagePath=""
			if (req.file) {
				imagePath = req.file.path;
			}
			const entityWithUserId = {
				...req.body,
				image:imagePath,
				userId: req.user.userId 
			};
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

	protected async update(req: Request | any, res: Response) {
		try {
			const id = +req.params.id
			await this.repository.update(id, req.body)
			const userId = req.user?.id
			if (!userId) {
				return sendErrorResponse(
					['User not authenticated'],
					res,
					StatusCodes.NOT_AUTHORIZED
				)
			}
			const updatedEntity = await this.repository.findOne({
				where: { id: id as any, user: userId },
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
			const deletedEntity = await this.repository.delete(id)
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
