import koaRouter from "koa-router";
import { file } from "../../../controllers";

const router = koaRouter();

router.post("/", file.upload);

export default router;
