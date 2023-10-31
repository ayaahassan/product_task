import { Router } from "express";
import V1Routes from "./v1"
import { ApiVersion } from "../helpers/enums/apiVersion.type";
const router = Router();

router.use(ApiVersion.v1, V1Routes);


export default router;
