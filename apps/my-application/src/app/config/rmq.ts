export const exchange = {
  name: "test-x",
  type: 'x-delayed-message',
  options: { autoDetele: false, durable: true , arguments: { "x-delayed-type": "fanout" }}
}
export const queue = {
  name: "test-q",
  options: { durable: true, deadLetterExchange: "dlx", noAck: true, messageTtl: 2000000 },
}
