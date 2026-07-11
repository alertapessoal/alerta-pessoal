/**
 * logger.ts — wrapper de console para o app em produção.
 *
 * Em desenvolvimento (__DEV__ = true) os logs aparecem normalmente.
 * Em produção (__DEV__ = false) todos os métodos viram no-ops,
 * evitando vazar informações sensíveis em builds públicos.
 */

const noop = () => {};

export const logger = __DEV__
    ? {
          log: console.log.bind(console),
          warn: console.warn.bind(console),
          error: console.error.bind(console),
      }
    : {
          log: noop,
          warn: noop,
          error: noop,
      };
