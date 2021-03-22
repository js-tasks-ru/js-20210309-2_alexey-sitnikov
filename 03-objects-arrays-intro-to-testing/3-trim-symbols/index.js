/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
  function makeCounter(char, encountered = 1) {
    return {
      char,
      encountered
    };
  }

  if (size === undefined) {
    return string;
  }

  return [...string].reduce(
    (accumulator, char) => {
      if (accumulator.length === 0) {
        return [makeCounter(char)];
      }

      const lastChar = accumulator[accumulator.length - 1].char;

      if (lastChar !== char) {
        accumulator.push(makeCounter(char));

      } else {
        accumulator[accumulator.length - 1].encountered++;
      }

      return accumulator;
    }, []
  ).map(
    (counter) => {
      const repeatCount = size < counter.encountered ? size : counter.encountered;

      return counter.char.repeat(repeatCount);
    }
  ).join("");
}
