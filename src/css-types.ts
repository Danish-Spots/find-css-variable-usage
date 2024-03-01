export interface CssVariable {
  /**
   * Value of css variable, eg #fff
   */
  value: string;
  /**
   * Name of css variable, eg --name-of-var
   */
  name: string;
  /**
   * Replacement suggestion, eg var(--name-of-var)
   */
  replacement: string;
}
/**
 * Represents a mapping of CSS values from the css variable file to their corresponding CSS variables objects.
 */
export type CssVariableMapping = Record<string, CssVariable>;

/**
 * Represents a mapping of CSS property names to their corresponding value mappings found in the css variable file.
 * @interface
 * @example
 * // Example Usage:
 * const cssVariables: AllCssVariableMappings = {
 *   "background": {
 *     "fff": {
 *       value: "fff",
 *       name: "--color-1",
 *       replacement: "var(--color-1)"
 *     }
 *   },
 *   "text-color": {
 *     "000": {
 *       value: "000",
 *       name: "--text-color",
 *       replacement: "var(--text-color)"
 *     },
 *     "333": {
 *       value: "333",
 *       name: "--secondary-text-color",
 *       replacement: "var(--secondary-text-color)"
 *     }
 *   },
 *   // ...additional components
 * };
 */
export interface AllCssVariableMappings {
  [key: string]: CssVariableMapping | undefined;
}
