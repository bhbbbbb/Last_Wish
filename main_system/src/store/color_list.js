export const COLOR_LIST = [
  '#d9c4bd',
  '#f5f4f0',
  '#f3f3f3',
  '#f0e6dc',
  '#f4e6d9',
  '#e0e0e0',
  '#d0d7d7',
  '#9aa2ab',
  '#cccdc3',
  '#e5e8dd',
  '#f0e6dc',
  '#e5ddd1',
  '#f4f1e9',
  '#f5e6e7',
  '#dfd5ca',
  '#f5f4f0',
  '#ccccca',
  '#cdd4cd',
  '#eee5d6',
  '#d8dad9',
];

export default (idx) => COLOR_LIST[hashCode(idx) % COLOR_LIST.length];

function hashCode(str) {
  var hash = 0,
    i,
    chr;
  if (str.length === 0) return hash;
  for (i = 0; i < str.length; i++) {
    chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}
