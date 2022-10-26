import { Options } from "amqplib";
export interface ExchangeObject {
    name: string,
    type: 'direct' | 'topic' | 'headers' | 'fanout' | 'match' | 'x-delayed-message' | string,
    options?: Options.AssertExchange
}
export interface QueueObject {
    name: string,
    options?: Options.AssertQueue
}
