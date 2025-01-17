import { Exchange } from '../exchange';

export const Exchanges = {
  commands: new Exchange({
    name: 'commands',
    type: 'topic',
    createExchangeIfNotExists: true,
  }),
  events: new Exchange({
    name: 'events',
    type: 'topic',
    createExchangeIfNotExists: true,
  }),
};
