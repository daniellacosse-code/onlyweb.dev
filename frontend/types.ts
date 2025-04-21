/**
 * Represents any valid key type for an object shape.
 */
export type AnyShapeKey = string | number | symbol;

/**
 * Represents a generic object shape where keys can be any valid type and values are unknown.
 */
export type AnyShape = Record<AnyShapeKey, unknown>;

/**
 * Represents any basic JavaScript primitive type (string, number, or boolean).
 */
export type AnyPrimitive = string | number | boolean;

/**
 * Represents the constructor function for any basic JavaScript primitive type.
 */
export type AnyPrimitiveConstructor = typeof String | typeof Number | typeof Boolean;

/**
 * Converts a primitive type (string, number, boolean) to its corresponding constructor type.
 * @template T The primitive type to convert.
 */
export type ConvertPrimitiveToConstructor<T extends AnyPrimitive> =
  T extends string ? typeof String :
  T extends number ? typeof Number :
  T extends boolean ? typeof Boolean :
  never;

/**
 * Converts a primitive constructor type (String, Number, Boolean) to its corresponding primitive type.
 * @template T The constructor type to convert.
 */
export type ConvertConstructorToPrimitive<T extends AnyPrimitiveConstructor> =
  T extends typeof String ? string :
  T extends typeof Number ? number :
  T extends typeof Boolean ? boolean :
  never;

/**
 * Represents an object shape where keys are any valid type and values are basic JavaScript primitives.
 */
export type AnyPrimitiveShape = Record<AnyShapeKey, AnyPrimitive>;

/**
 * Represents an object shape where keys are any valid type and values are primitive constructor functions.
 */
export type AnyPrimitiveConstructorShape = Record<AnyShapeKey, AnyPrimitiveConstructor>;

/**
 * Converts an object shape with primitive values to an object shape with corresponding constructor values.
 * @template S The primitive shape type to convert.
 */
export type ConvertPrimitiveShapeToConstructorShape<S extends AnyPrimitiveShape> = {
  [K in keyof S]: ConvertPrimitiveToConstructor<S[K]>;
};

/**
 * Converts an object shape with constructor values to an object shape with corresponding primitive values.
 * @template S The constructor shape type to convert.
 */
export type ConvertConstructorShapeToPrimitiveShape<S extends AnyPrimitiveConstructorShape> = {
  [K in keyof S]: ConvertConstructorToPrimitive<S[K]>;
};
