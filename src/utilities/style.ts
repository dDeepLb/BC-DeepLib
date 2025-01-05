export const Style = {
  injectInline(styleId: string, styleSource: string) {
    const isStyleLoaded = document.getElementById(styleId);

    if (isStyleLoaded) return;

    const styleElement = document.createElement('style');
    styleElement.id = styleId;
    styleElement.appendChild(document.createTextNode(styleSource));
    document.head.appendChild(styleElement);
  },

  injectEmbed(styleId: string, styleLink: string) {
    const isStyleLoaded = document.getElementById(styleId);

    if (isStyleLoaded) return;

    const styleElement = document.createElement('link');
    styleElement.id = styleId;
    styleElement.rel = 'stylesheet';
    styleElement.href = styleLink;
    document.head.appendChild(styleElement);
  },

  eject(id: string) {
    const style = document.getElementById(id);
    if (!style) return;

    style.remove();
  },

  reload(styleId: string, styleSource: string) {
    Style.eject(styleId);
    Style.injectInline(styleId, styleSource);
  },

  async fetch(link: string) {
    return fetch(link).then((res) => res.text());
  }
};
