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

  static createSpinner() {
    // Loading Indicators
    // Accessible status messages
    const spinnerLoad = document.createElement("div");
    spinnerLoad.id = "spinnerLoad";
    spinnerLoad.className = "loading-text";
    spinnerLoad.setAttribute("role", "status");
    spinnerLoad.setAttribute("aria-live", "polite");
    spinnerLoad.innerHTML = "Loading<div id='progressMore'></div>";

    const spinnerNumber = document.createElement("div");
    spinnerNumber.id = "spinnerNumber";
    spinnerNumber.className = "loading-text";
    spinnerNumber.setAttribute("aria-live", "polite");

    const spinnersContainer = document.createElement("div");
    spinnersContainer.id = "spinner";
    spinnersContainer.className = spinnersContainer.id + " loading";
    spinnersContainer.appendChild(spinnerLoad);
    spinnersContainer.appendChild(spinnerNumber);

    return spinnersContainer;
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
    h2.innerText = "Gposes Xplorer";
    nav.appendChild(h2);

    const ul = document.createElement("ul");
    ul.innerHTML = "<li>Index</li><li>Back</li>";
    nav.appendChild(ul);

    const options = document.createElement("ul");
    options.innerHTML = "<li><input type='radio' id='isNsfwFalse' name='isNSFW' value='false'><label for='isNsfwFalse'>SFW</label></li>"
    + "<li><input type='radio' id='isNsfwTrue' name='isNSFW' value='true'><label for='isNsfwTrue'>NSFW</label></li>";
    nav.appendChild(options);

    return nav;
  }

  static createRepository() {
    const repo = document.createElement("div");
    repo.classList = "repository";
    return repo;
  }

  static createSourceFolder(name = "", link = "", preview = "") {
    const folder = document.createElement("div");
    folder.dataset.title = name;
    folder.dataset.link = link;
    folder.id = `source_${name.replace(" ", "")}`;
    folder.className = "card";

    const container = document.createElement("div");
    container.classList = "img-div";
    folder.append(container);

    const img = document.createElement("img");
    img.src = preview;
    if (preview === "../assets/img/folder.png") img.classList = "folder";
    container.appendChild(img);

    img.onload = function () {
      if (img.naturalHeight < 250) {
        img.classList = "fullheight";
        container.style.display = "flex";
        container.style.justifyContent = "center";
      }
    };

    const overlay = document.createElement("div");
    overlay.classList = "overlay";
    container.appendChild(overlay);

    return folder;
  }

  static createPicture(host = "", link = "", preview = "") {
    const folder = document.createElement("div");
    folder.dataset.title = link.split("/").pop();
    folder.id = `picture_${link.split("/")[0].replace(" ", "")}`;
    folder.className = "card";

    const container = document.createElement("a");
    container.classList = "img-div";
    container.href = link.replace("../", host);
    container.target = "_blank";
    folder.append(container);

    const img = document.createElement("img");
    img.src = preview.replace("../", host);
    img.loading = "lazy";
    container.appendChild(img);

    img.onload = function () {
      if (img.naturalHeight < 250) {
        img.classList = "fullheight";
        container.style.display = "flex";
        container.style.justifyContent = "center";
      }
    };

    return folder;
  }

  static createSeparation(){
    const hr = document.createElement("hr");
    hr.classList = "separator";
    return hr;
  }
}
