// Import the ElementFactory module for creating DOM elements
import { ElementFactory } from "./ElementFactory";
import { Utilities } from "./Utilities";

/**
 * FetchFactory is responsible for handling API requests related to folders
 * and updating the DOM with the fetched data.
 */
export class FetchFactory {
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
