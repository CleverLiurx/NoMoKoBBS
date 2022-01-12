import koaRouter from "koa-router";

import { star } from "../../../controllers";

const router = koaRouter();

router.patch("/", star.update).get("/", star.getList);

export default router;
