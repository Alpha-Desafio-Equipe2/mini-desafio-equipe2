export function Link(text: string, onClick: () => void): HTMLAnchorElement {
  const a = document.createElement("a");
  a.href = "#";
  a.className = "nav-link";
  a.textContent = text;
  a.onclick = (e) => {
    e.preventDefault();
    onClick();
  };
  return a;
}
