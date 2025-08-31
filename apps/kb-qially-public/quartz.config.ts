import { makeBaseConfig } from "../../packages/quartz-config/base.quartz.config";
import clients from "../../packages/quartz-config/clients/clients.json" assert { type: "json" };
const cfg = makeBaseConfig({ title: clients["qially"].title });
export default cfg;
