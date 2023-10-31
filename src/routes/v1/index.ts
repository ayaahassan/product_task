import { Router } from "express";
import { routeModel } from "../../helpers/enums/model.type";
import UserRouter from "./user.router"
import ProductRouter from "./product.router"
import { isAuthenticated } from "../../middlewares/isAuthenticated";

const router = Router();

router.use(routeModel.PRODUCT,isAuthenticated, ProductRouter);

router.use(routeModel.AUTH,UserRouter)


export default router;
