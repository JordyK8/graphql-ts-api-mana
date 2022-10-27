import { connectRmq } from "../utils/rmq/rmq";

export const start = async () => {
  await connectRmq();
};
