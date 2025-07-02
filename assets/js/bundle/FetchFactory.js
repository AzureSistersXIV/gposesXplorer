/**
 * FetchFactory is responsible for handling API requests related to sources
 * and updating the DOM with the fetched data.
 */
export class FetchFactory {
  static async fetchNewSource(host) {
    return await fetch(`${host}api/new.php`)
      .then((res) => res.json())
      .then((sources) => {
        return Object.entries(sources);
      })
      .catch((err) =>
        console.error("Failed to fetch new sources :", err.message)
      );
  }

  static async fetchSources(host, isNsfw) {
    return await fetch(`${host}api/sources.php?isNsfw=${isNsfw}`)
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
