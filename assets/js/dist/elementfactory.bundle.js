class ElementFactory {
  static createNavbar(links = []) {
    const nav = document.createElement('nav');
    nav.style.display = 'flex';
    nav.style.justifyContent = 'space-between';
    nav.style.padding = '1rem';
    nav.style.backgroundColor = '#333';
    nav.style.color = '#fff';

    links.forEach(link => {
      const a = document.createElement('a');
      a.href = link.href;
      a.textContent = link.text;
      a.style.color = 'white';
      a.style.margin = '0 1rem';
      nav.appendChild(a);
    });

    return nav;
  }

  static createFooter(text = '') {
    const footer = document.createElement('footer');
    footer.style.textAlign = 'center';
    footer.style.padding = '1rem';
    footer.style.backgroundColor = '#f1f1f1';
    footer.style.color = '#555';
    footer.textContent = text;

    return footer;
  }

  static createSection({ id = '', className = '', content = '', style = {} } = {}) {
    const section = document.createElement('section');
    if (id) section.id = id;
    if (className) section.className = className;
    section.innerHTML = content;

    Object.assign(section.style, style);

    return section;
  }
}

export { ElementFactory };
//# sourceMappingURL=elementfactory.bundle.js.map
