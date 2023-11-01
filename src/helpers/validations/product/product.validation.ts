import Joi from 'joi'

export const ProductValidation = Joi.object().keys({
	title: Joi.string().min(3).required(),
    price: Joi.number().min(0).required(),
    // image: Joi.required(),

})