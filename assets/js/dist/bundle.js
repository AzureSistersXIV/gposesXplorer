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
    folderContent.id = `${folderName}Content`;
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
  return document.title === "Welcome | Gposes";
}
}

// Import the ElementFactory module for creating DOM elements

/**
 * FetchFactory is responsible for handling API requests related to folders
 * and updating the DOM with the fetched data.
 */
class FetchFactory {
  /**
   * Fetches the list of folders from the server and appends them to the DOM.
   * @param {string} host - The base URL of the API endpoint.
   * @returns {Promise<Array<string>|undefined>} - Resolves to an array of folder names or undefined if none found.
   */
  static async fetchFolders(host) {
    Utilities.setIsNsfw();
    // Send a GET request to the folders API endpoint
    return await fetch(`${host}api/folders.php?isNsfw=${Utilities.isNsfw}`)
      .then((res) => res.json()) // Parse the response as JSON
      .then((folders) => {
        // Check if any folders were returned
        if (Object.keys(folders).length > 0) {
          // Create and append the repository element to the document body
          document.body.appendChild(
            ElementFactory.createRepository(Object.keys(folders))
          );
          // Return the list of folder names
          return Object.keys(folders);
        } else {
          // Log an error if no folders are available
          console.error("No folder available !");
        }
      })
      // Handle any errors that occur during the fetch operation
      .catch((err) => console.error("Failed to fetch folders :", err.message));
  }

  /**
   * Fetches the content of a specific folder (and optional subfolder) from the server.
   * Groups files by subfolder and returns a structured object.
   * @param {string} host - The base URL of the API endpoint.
   * @param {string} folder - The folder path (may include subfolder).
   * @returns {Promise<Object|null>} - Resolves to an object grouping files by subfolder, or null on error.
   */
  static async fetchFolderContent(host, folder) {
    // Determine main folder and subfolder if present
    let mainFolder = folder;
    let subFolder = "";
    if (mainFolder.includes("/")) {
      mainFolder = folder.split("/")[0];
      subFolder = folder.split("/")[1];
    }

    try {
      // Send a POST request to fetch folder content
      const res = await fetch(`${host}api/content.php`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ folder: mainFolder, subfolder: subFolder }),
      });

      // Parse the response as JSON
      const files = await res.json();

      // Group files by subfolder or root
      const grouped = {};

      files.folder.forEach((fullPath) => {
        // Remove the common prefix "../screenshots/${folder}/"
        const prefix = `../screenshots/${folder}/`;
        const relativePath = fullPath.startsWith(prefix)
          ? fullPath.substring(prefix.length)
          : fullPath;

        // Split relativePath by '/' to see if there's a subfolder
        const parts = relativePath.split("/");

        if (parts.length > 1) {
          // It's inside a subfolder
          const subfolderName = parts[0];
          const filename = parts.slice(1).join("/"); // join back if nested deeper

          if (!grouped[subfolderName]) {
            grouped[subfolderName] = [];
          }
          grouped[subfolderName].push(filename);
        } else {
          // No subfolder, file directly in the main folder
          if (!grouped._root) {
            grouped._root = [];
          }
          grouped._root.push(parts[0]);
        }
      });

      return grouped;
    } catch (err) {
      // Handle errors during fetch or parsing
      console.error(`Failed to fetch folder "${folder}" content:`, err.message);
      return null;
    }
  }

  static async fetchThumbnail(link){
    console.warn(link);
  }
}

const host = "https://naslku.synology.me/_GposesAPI/";

document.addEventListener("DOMContentLoaded", function () {
  document.body.appendChild(ElementFactory.createHeader());
  FetchFactory.fetchFolders(host).then((folders) => {
    folders.forEach((folder) => {
      FetchFactory.fetchFolderContent(host, folder).then((folderContent) => {
        let folderElement = document.querySelector(
          `#${folder.split("/")[0]}Content`
        );
        let card;
        Object.entries(folderContent).forEach((files) => {
          if (files[0] !== "_root") {
            const subfolder = document.createElement("div");
            subfolder.classList = "subfolder";
            Array.from(files[1]).forEach((file) => {
              FetchFactory.fetchThumbnail(
                `screenshots/${folder}/${file}`
              );
              card = ElementFactory.createCard(
                `${host}screenshots/${folder}/${files[0]}/${file}`,
                `${host}thumbnails/${folder}/${files[0]}/${file}`,
                file
              );
              subfolder.appendChild(card);
            });
            folderElement.appendChild(subfolder);
          } else {
            Array.from(files[1]).forEach((file) => {
              FetchFactory.fetchThumbnail(
                `screenshots/${folder}/${file}`
              );
              card = ElementFactory.createCard(
                `${host}screenshots/${folder}/${file}`,
                `${host}thumbnails/${folder}/${file}`,
                file
              );
              folderElement.appendChild(card);
            });
          }
        });
      });
    });
  });
});
//# sourceMappingURL=bundle.js.map
