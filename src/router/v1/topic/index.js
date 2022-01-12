import koaRouter from "koa-router";

import { topic } from "../../../controllers";

const router = koaRouter();

router
  .post("/", topic.add)
  .get("/:id", topic.detail)
  .get("/", topic.getList)
  .delete("/:id", topic.del)
  .patch("/hide/:id", topic.hide);

export default router;
