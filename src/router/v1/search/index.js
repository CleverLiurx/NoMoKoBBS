import koaRouter from "koa-router";

import { search } from "../../../controllers";

const router = koaRouter();

router.get("/", search.hotSearch);

export default router;
