export default (idx) => COLOR_LIST[hashCode(idx) % COLOR_LIST.length];

export const color_list_by_idx = (idx) => COLOR_LIST[idx % COLOR_LIST.length];

function hashCode(str) {
  let hash = 0;

  if (str.length === 0) return hash;

  for (let i = 0; i < str.length; i++) {
    hash += str.charCodeAt(i);
  }
  return Math.abs(hash);
}

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

export const EVENT_COLOR_LIST = [
  '#D6C5BE',
  '#CED3CD',
  '#F2E6DA',
  '#E5DCD3',
  '#CCCCCA',
  '#D1D7D7',
  '#9BA2AA',
  '#E8E5E0',
];
