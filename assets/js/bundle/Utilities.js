export class Utilities {
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
