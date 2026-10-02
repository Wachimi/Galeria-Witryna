/** Łączy polskie jednoliterowe słowa z następnym słowem przy wyświetlaniu tekstu. */
export function formatPolishText(text: string | null | undefined): string {
  return (text ?? "").replace(
    /(?<![\p{L}\p{N}_])([aiouwz])([ \t\r\n]+)/giu,
    (match: string, word: string, whitespace: string) => {
      // Pojedynczy enter w opisie nie tworzy akapitu; puste wiersze zachowujemy.
      return /\r?\n[ \t]*\r?\n/.test(whitespace) ? match : `${word}\u00a0`;
    },
  );
}
