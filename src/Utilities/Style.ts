export class Style {
  static inject(id: string, styleSource: string) {
    const isStyleLoaded = !!document.getElementById(id);

    if (isStyleLoaded) return;

    const styleElement = document.createElement('style');
    styleElement.id = id;
    styleElement.appendChild(document.createTextNode(styleSource));
    document.head.appendChild(styleElement);
  }

  static eject(id: string) {
    const style = document.getElementById(id);
    if (!style) return;

    style.remove();
  }

  static reload(id: string, styleSource: string) {
    Style.eject(id);
    Style.inject(id, styleSource);
  }
}
