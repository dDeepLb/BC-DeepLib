export function elementCreateTooltip() {
  const element = ElementCreate({
    tag: 'div',
    classList: ['deeplib-tooltip'],
    attributes: {
      id: 'deeplib-tooltip'
    },
    style: {
      display: 'none'
    }
  });

  return element;
}

export function elementGetTooltip() {
  return document.getElementById('deeplib-tooltip') ?? undefined;
}

export function elementSetTooltip(text: string) {
  const element = document.getElementById('deeplib-tooltip');

  if (!element) return false;
  
  element.innerHTML = text;
  if (text === '') element.style.display = 'none';
  else element.style.display = '';

  return true;
}
