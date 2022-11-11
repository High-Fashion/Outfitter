export default function capitalize(string, capitalizeEachWord = false) {
  if (capitalizeEachWord) {
    let words = string.split(" ");
    let newWords = [];
    words.map((word) => newWords.push(capitalize(word)));
    return newWords.join(" ");
  }
  return string.charAt(0).toUpperCase() + string.slice(1);
}
