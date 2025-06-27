/**
 * ElementFactory is a utility class for creating common DOM elements
 * used in the Gposes application, such as headers, navigation bars, subheaders, and repositories.
 */
export class ElementFactory {
  /**
   * Creates the main header element for the application.
   * The header contains a navigation bar.
   * @returns {HTMLElement} The header element.
   */
  static createHeader() {
    const header = document.createElement("header");
    // Append the navigation bar to the header
    header.appendChild(this.createNavbar());

    return header;
  }

  /**
   * Creates a navigation bar element.
   * The navigation bar contains a heading with the text "Gposes".
   * @returns {HTMLElement} The nav element.
   */
  static createNavbar() {
    const nav = document.createElement("nav");
    // Assign the 'navbar' class to the nav element
    nav.classList = "navbar";
    // Set an ARIA role description for accessibility
    nav.ariaRoleDescription = "Navigation bar";

    // Create and append the heading to the nav
    const h2 = document.createElement("h2");
    h2.innerText = "Gposes";
    nav.appendChild(h2);

    return nav;
  }

  /**
   * Creates a subheader element (h3) for a folder.
   * The subheader displays the folder name and has accessibility attributes.
   * @param {string} folder - The name of the folder to display.
   * @returns {HTMLElement} The h3 element representing the subheader.
   */
  static createSubHeader(folder = "") {
    const header = document.createElement("h3");
    // Set an ARIA role description for accessibility
    header.ariaRoleDescription = `Folder header ${folder}`;
    // Set the displayed text to the folder name
    header.innerText = folder;

    return header;
  }

  /**
   * Creates a repository element containing subheaders for each folder.
   * If a folder name contains a '/', only the first part is used for the subheader.
   * @param {string[]} folders - Array of folder names to include in the repository.
   * @returns {HTMLElement} The div element representing the repository.
   */
  static createRepository(folders = []) {
    const repo = document.createElement("div");
    repo.classList = "repository";

    folders.forEach((folderName) => {
      // Create a subheader for each folder.
      // If the folder name contains '/', use only the first part.
      let folder = this.createFolder(folderName);

      if(folderName.includes('/')){
        folder = this.createFolder(folderName.split('/')[0]);
      }

      repo.appendChild(folder);
    });

    return repo;
  }

  static createFolder(folderName = ""){
    const folder = document.createElement("div");
    folder.classList = "folder";

    folder.appendChild(this.createSubHeader(folderName));
    
    const folderContent = document.createElement("div");
    folderContent.classList = "folder-content";
    folderContent.id = `${folderName}Content`
    folder.appendChild(folderContent);

    return folder;
  }

  static createCard(link = "", thumbnail = "", name = ""){
    const card = document.createElement("div");
    card.className = "card";

    const img = document.createElement("img");
    img.src = thumbnail;
    
    const anchor = document.createElement("a");
    anchor.href = link;
    anchor.target = "_blank";
    anchor.appendChild(img);

    card.appendChild(anchor);

    return card;
  }
}
