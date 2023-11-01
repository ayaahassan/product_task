import { ProductValidation } from "./product.validation";


// const keys =ProductValidation.describe()?.keys || {};
// export const updateProductValidation = ProductValidation.fork(Object.keys(keys), (schema) => schema.optional());

export const updateProductValidation = ProductValidation.fork(
	Object.keys(ProductValidation.describe().keys),
	(schema) => schema.optional()
)