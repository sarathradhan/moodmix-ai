/** Fisher–Yates shuffle (returns a new array) */
export function shuffle(items = []) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** Random subset of up to `count` items */
export function pickRandom(items = [], count) {
  return shuffle(items).slice(0, count);
}
