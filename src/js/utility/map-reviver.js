/**
 * Reviver function that can be passed to JSON.parse to
 * convert a string into a Map object, provided that Map
 * was stringified using the matching mapReplacer.
 * @param {any} key 
 * @param {any} value 
 */
export default function mapReviver(key, value) {
  if(typeof value === 'object' && value !== null) {
    if (value.dataType === 'Map') {
      return new Map(value.value);
    }
  }
  return value;
}
