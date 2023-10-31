import { ProductValidation } from "./product.validation";


const keys =ProductValidation.describe()?.keys || {};
export const updateProductValidation = ProductValidation.fork(Object.keys(keys), (schema) => schema.optional());
