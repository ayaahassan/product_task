import { Router } from "express";
import multer  from 'multer'
import ProductController from "../../controllers/ProductController.controller"
import path from "path";
const router = Router();
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function(req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  });
const upload = multer({ storage })

router.get('/',ProductController.getAll)
router.post('/',upload.single('image'),ProductController.createProduct)
router.get('/:id',ProductController.getOneProduct)
router.patch('/:id',upload.single('image'),ProductController.updateProduct)
router.delete('/:id',ProductController.deleteProduct)



export default router