import { dataSource } from '../config/database/data-source'
import { Product } from '../entities/Product.entity'
import { StatusCodes } from '../helpers/enums/StatusCodes'
import { formatValidationErrors } from '../helpers/methods/formatValidationErrors'
import { sendErrorResponse } from '../helpers/responses/sendErrorResponse'
import { ProductValidation } from '../helpers/validations/product/product.validation'
import { updateProductValidation } from '../helpers/validations/product/update-product.validation'
import { BaseController } from './BaseController.controller'
import { Request, Response } from 'express'
class ProductController extends BaseController<Product> {
	constructor() {
		// const repo = dataSource.getRepository(Product)
		// super(repo)
		super(dataSource.getRepository(Product))
		//   console.log(this.repository);  // Move the log statement here, after the super call
	}

	getAll = async (req: Request, res: Response) => {
		return await this.findAll(req, res )
	}
	getOneProduct = async (req: Request, res: Response) => {
		return await this.findOne(req, res)
	}

	createProduct = async (req: Request, res: Response) => {
		try {
			console.log('innnnnnnnnn', req.body)
			await ProductValidation.validateAsync(req.body, {
				abortEarly: false,
			})
			console.log('in try')
			return await this.create(req, res)
		} catch (validationError: any) {
			console.log('in catch')
			sendErrorResponse(
				formatValidationErrors(validationError),
				res,
				StatusCodes.NOT_ACCEPTABLE
			)
		}
	}

	updateProduct = async (req: Request, res: Response) => {
		try {
            console.log("updateeeeeee",req.body)
			await updateProductValidation.validateAsync(req.body, {
				abortEarly: false,
			})
			return await this.update(req, res)
		} catch (validationError: any) {
			res.status(StatusCodes.BAD_REQUEST).json({
				status: 'error',
				message: validationError.details.map((detail: any) => detail.message),
			})
		}
	}

	deleteProduct = async (req: Request, res: Response) => {
		return await this.delete(req, res)
	}
}
export default new ProductController()
