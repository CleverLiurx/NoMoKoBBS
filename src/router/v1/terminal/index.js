import koaRouter from "koa-router";

import { terminal } from "../../../controllers";

const router = koaRouter();

router.get("/", terminal.getList).post("/", terminal.add);

export default router;
