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
    h2.innerText = "Gposes";
    nav.appendChild(h2);

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

  static async fetchFolders(host, link) {
    return await fetch(`${host}api/folders.php`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ source: link }),
    })
      .then((res) => res.json())
      .then((folders) => {
        if (Object.entries(folders).length > 0) {
          return Object.entries(folders);
        } else {
          return [];
        }
      })
      .catch((err) => console.error("Failed to fetch folders :", err.message));
  }

  static async fetchThumbnails(host, link) {
    return await fetch(`${host}api/thumbnails.php`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ source: link }),
    })
      .then((res) => res.json())
      .then((thumbnails) => {
        if (Object.entries(thumbnails).length > 0) {
          return Object.entries(thumbnails);
        } else {
          return [];
        }
      })
      .catch((err) => console.error("Failed to fetch folders :", err.message));
  }
}

const host = "https://naslku.synology.me/gposesXplorerAPI/";

document.addEventListener("DOMContentLoaded", function () {
  // Header of the page.
  document.body.appendChild(ElementFactory.createHeader());

  const idSpinner = enableLoading();
  FetchFactory.fetchSources(host).then((sources) => {
    if (sources.length > 0) {
      const repository = ElementFactory.createRepository();
      document.body.appendChild(repository);

      Array.from(sources).forEach((source) => {
        let preview;
        if (source[1] !== "../assets/img/folder.png") {
          preview = source[1].replace("../", host);
        } else {
          preview = source[1];
        }

        let sourceFolder = ElementFactory.createSourceFolder(
          source[0].split("/")[0],
          source[0],
          preview
        );
        repository.appendChild(sourceFolder);

        addClickEvent(sourceFolder);
      });

      disableLoading(idSpinner);
    }
  });
});

async function addClickEvent(source) {
  const repository = document.querySelector(".repository");
  source.addEventListener("click", async function (event) {
    repository.innerHTML = "";
    let link = event.target.parentElement.parentElement.dataset.link;

    const idSpinner = enableLoading();
    await FetchFactory.fetchFolders(host, link).then((entries) => {
      if (entries.length > 0) {
        Array.from(entries).forEach((entry) => {
          let preview =
            entry[1] !== "../assets/img/folder.png"
              ? entry[1].replace("../", host)
              : entry[1];
          let folder = ElementFactory.createSourceFolder(
            entry[0],
            link + "/" + entry[0],
            preview
          );
          addClickEvent(folder);
          repository.appendChild(folder);
        });
      }
    });
    await FetchFactory.fetchThumbnails(host, link).then((entries) => {
      if (entries.length > 0) {
        Array.from(entries).forEach((entry) => {
          let folder = ElementFactory.createPicture(
            host,
            entry[1][0],
            entry[1][1]
          );
          repository.appendChild(folder);
        });
      }
    });
    if (isLoading(idSpinner)) disableLoading(idSpinner);
  });
}

function enableLoading() {
  if (document.querySelector(".repository") !== null)
    document.querySelector(".repository").style.visibility = "hidden";
  const spinner = ElementFactory.createSpinner();
  let id = Math.random();
  spinner.id = id;
  document.body.appendChild(spinner);

  return id;
}

function disableLoading(id) {
  if (document.querySelector(".repository") !== null)
    document.querySelector(".repository").style.visibility = "visible";
  const spinner = document.getElementById(id);
  spinner.remove();
}

function isLoading(id) {
  return (
    document.getElementById(id) !== null &&
    document.getElementById(id) !== undefined
  );
}
//# sourceMappingURL=bundle.js.map
