/**
 * ElementFactory is a utility class for creating common DOM elements
 * used in the Gposes application, such as headers, navigation bars, subheaders, and repositories.
 */
class ElementFactory {
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

  static createRepository() {
    const repo = document.createElement("div");
    repo.classList = "repository";
    return repo;
  }

  static createSourceFolder(name = "", preview = "") {
    const folder = document.createElement("div");
    folder.dataset.title = name.split("/")[0].replace(" ", "");
    folder.id = `source_${name.split("/")[0]}`;
    folder.className = "card";

    const container = document.createElement("div");
    container.classList = "img-div";
    folder.append(container);

    const img = document.createElement("img");
    img.src = preview;
    if(preview === "../assets/img/folder.png") img.classList = "folder";
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
}

class Utilities {
  static isNsfw = false;

  /**
   * Sets NSFW (Not Safe For Work) flag based on URL parameters.
   * @function setIsNsfw
   * @description Checks both welcome page status and "isNsfw" query parameter.
   * Modifies global `isNsfw` variable.
   * @note Requires `isWelcomePage()` to be true for NSFW flag activation
   */
  static setIsNsfw() {
    const searchParams = new URLSearchParams(window.location.search);
    this.isNsfw = this.isWelcomePage() && searchParams.get("isNsfw") === "true";
  }

  /**
 * Determines if current page is the welcome page.
 * @function isWelcomePage
 * @returns {boolean} True if document title matches welcome page title
 * @example
 * // When title is "Welcome | ComEx"
 * isWelcomePage();  // Returns true
 */
static isWelcomePage() {
  return document.title === "Welcome | Gposes Xplorer";
}
}

// Import the ElementFactory module for creating DOM elements

/**
 * FetchFactory is responsible for handling API requests related to sources
 * and updating the DOM with the fetched data.
 */
class FetchFactory {
  
  static async fetchSources(host) {
    Utilities.setIsNsfw();
    
    return await fetch(`${host}api/sources.php?isNsfw=${Utilities.isNsfw}`)
      .then((res) => res.json())
      .then((sources) => {
        if (Object.entries(sources).length > 0) {
          return Object.entries(sources);
        } else {
          throw new Exception("No folder available !");
        }
      })
      .catch((err) => console.error("Failed to fetch sources :", err.message));
  }
}

const host = "https://naslku.synology.me/gposesXplorerAPI/";

document.addEventListener("DOMContentLoaded", function () {
  // Header of the page.
  document.body.appendChild(ElementFactory.createHeader());

  FetchFactory.fetchSources(host).then((sources) => {
    if (sources.length > 0) {
      const repository = ElementFactory.createRepository();
      document.body.appendChild(repository);

      Array.from(sources).forEach((source) => {
        let preview = source[1] !== "../assets/img/folder.png" ? source[1].replace("../", host) : "../assets/img/folder.png";
        repository.appendChild(
          ElementFactory.createSourceFolder(source[0], preview)
        );
      });
    }
  });
});
//# sourceMappingURL=bundle.js.map
