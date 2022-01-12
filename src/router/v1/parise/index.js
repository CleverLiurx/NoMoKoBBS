import koaRouter from "koa-router";

import { parise } from "../../../controllers";

const router = koaRouter();

router.patch("/", parise.update);

export default router;
