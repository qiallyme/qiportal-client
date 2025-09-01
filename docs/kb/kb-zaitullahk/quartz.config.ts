import { makeBaseConfig } from "../../../quartz-config/base.quartz.config";
import clients from "../../../quartz-config/clients/clients.json" assert { type: "json" };
const cfg = makeBaseConfig({ title: clients["zaitullahk"].title });
export default cfg;
