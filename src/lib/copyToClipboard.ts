export function copyToClipboard(text: string) {
  if (navigator && navigator.clipboard) {
    navigator.clipboard.writeText(text);
  } else {
    // fallback para browsers antigos
    const textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
  }
}
