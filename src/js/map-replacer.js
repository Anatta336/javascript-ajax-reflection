/**
 * Replacer function that can be passed to JSON.stringify to
 * convert a Map into a string representation.
 * @param {any} key 
 * @param {any} value 
 */
export default function mapReplacer(key, value) {
  if(value instanceof Map) {
    return {
      dataType: 'Map',
      value: [...value],
    };
  } else {
    return value;
  }
}
