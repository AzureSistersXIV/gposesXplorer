// Import the ElementFactory module for creating DOM elements
import { ElementFactory } from "./ElementFactory";
import { Utilities } from "./Utilities";

/**
 * FetchFactory is responsible for handling API requests related to sources
 * and updating the DOM with the fetched data.
 */
export class FetchFactory {
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
