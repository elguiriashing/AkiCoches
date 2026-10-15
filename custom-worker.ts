// @ts-expect-error OpenNext generates the entry point during packaging.
import handler from "./.open-next/worker.js";
const worker = {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    return handler.fetch(request, env, ctx);
  },
};

export default worker;
