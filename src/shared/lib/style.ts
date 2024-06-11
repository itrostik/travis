import cx from "classnames";

/**
 * Сокращение от Style Of Condition
 * @param simple стандартные стили
 * @param active активные стили
 * @param condition условие активности
 */
export function soc(simple: string, active: string, condition: boolean) {
  return cx(simple, {
    [active]: condition,
  });
}
