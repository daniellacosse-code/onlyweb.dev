/* tslint:disable */
/* eslint-disable */
export class Universe {
  free(): void;
/**
* @param {number} width 
* @param {number} height 
* @returns {Universe} 
*/
  static new(width: number, height: number): Universe;
/**
*/
  tick(): void;
/**
* @returns {number} 
*/
  cells(): number;
/**
* @param {number} row 
* @param {number} column 
*/
  toggle_cell(row: number, column: number): void;
/**
*/
  destroy(): void;
}
