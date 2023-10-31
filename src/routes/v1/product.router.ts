import { Router } from "express";
import multer  from 'multer'
import ProductController from "../../controllers/ProductController.controller"
const router = Router();
const upload = multer({ dest: 'uploads/' })

router.get('/',ProductController.getAll)
router.post('/',upload.single('image'),ProductController.create)
router.get('/:id',ProductController.getOneProduct)
router.patch('/:id',ProductController.updateProduct)
router.delete('/:id',ProductController.deleteProduct)



export default router