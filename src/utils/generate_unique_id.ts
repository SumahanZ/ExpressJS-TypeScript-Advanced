export const customAlphabet = (alphabet: string, defaultSize: number = 21) => {
  let id = "";
  let i = defaultSize;
  while (i--) {
    id += alphabet[(Math.random() * alphabet.length) | 0];
  }
  return id;
};
