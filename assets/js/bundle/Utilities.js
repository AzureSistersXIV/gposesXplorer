import { FetchFactory } from "./FetchFactory";
import { ElementFactory } from "./ElementFactory";

/**
 * Utilities class provides static helper methods for navigation,
 * loading content, managing NSFW state, and UI updates in Gposes Xplorer.
 */
export class Utilities {
  /**
   * Global flag indicating if NSFW mode is enabled.
   * Set via setIsNsfw() based on URL and welcome page status.
   * @type {boolean}
   */
  static isNsfw = false;

  /**
   * Sets NSFW (Not Safe For Work) flag based on URL parameters.
   * Checks both welcome page status and "isNsfw" query parameter.
   * Modifies global `isNsfw` variable.
   * Requires `isWelcomePage()` to be true for NSFW flag activation.
   */
  static setIsNsfw() {
    const searchParams = new URLSearchParams(window.location.search);
    // Only enable NSFW if on the welcome page and query param isNsfw=true
    this.isNsfw = this.isWelcomePage() && searchParams.get("isNsfw") === "true";
  }

  static get WELCOME_TITLE() {
    return "Welcome | Gposes Xplorer";
  }

  static isWelcomePage() {
    return document.title === this.WELCOME_TITLE;
  }

  static setDocumentTitle(title = "") {
    document.title = title;
  }

  static getLinkTitle(link = "") {
    let title = "";
    if (link !== null) {
      if (
        link.split("/").pop() === "1.SFW" ||
        link.split("/").pop() === "2.NSFW"
      ) {
        title = link.split("/")[0];
      } else {
        title = link.split("/").pop();
      }
    }
    return title;
  }

  /**
   * No search params => ['Welcome', null]
   * ?folder=Gifts%2F1.SFW => ['Gifts', 'Gifts/1.SFW']
   * ?folder=Gifts%2F1.SFW%2FMiphie => ['Miphie', 'Gifts/1.SFW/Miphie']
   */
  static getFolder() {
    const searchParams = new URLSearchParams(window.location.search);
    const link = searchParams.get("folder");

    return [this.getLinkTitle(link), link];
  }

  static loadContent(host = "") {
    const content = this.getFolder();
    if (content[1] !== null) {
      document.querySelector("header ul").style.visibility = "visible";
      if (
        content[1].split("/").pop() === content[0] &&
        content[1].split("/").length > 1
      ) {
        document.querySelector("header ul li:nth-child(2)").style.display =
          "block";
      } else {
        document.querySelector("header ul li:nth-child(2)").style.display =
          "none";
      }
      this.setDocumentTitle(`${content[0]} | Gposes Xplorer`);
      this.loadFolder(host, content[1]);
    } else {
      document.querySelector("header ul").style.visibility = "hidden";
      this.setDocumentTitle(this.WELCOME_TITLE);
      this.loadSources(host);
    }
  }

  static async loadSources(host = "") {
    const repository = document.querySelector(".repository");
    repository.innerHTML = "";
    const spinner = ElementFactory.createSpinner();
    document.body.appendChild(spinner);
    await FetchFactory.fetchSources(host, this.isNsfw).then((sources) => {
      sources.forEach((source) => {
        let preview = source[1];
        if (source[1] !== "../assets/img/folder.png") {
          preview = source[1].replace("../", host);
        }

        const sourceFolder = ElementFactory.createSourceFolder(
          this.getLinkTitle(source[0]),
          source[0],
          preview
        );
        sourceFolder.addEventListener("click", () => {
          this.goToFolder(source[0]);
        });

        repository.appendChild(sourceFolder);
      });
    });
    spinner.remove();
  }

  static async loadFolder(host = "", link = "") {
    const repository = document.querySelector(".repository");
    repository.innerHTML = "";
    const spinner = ElementFactory.createSpinner();
    document.body.appendChild(spinner);
    await FetchFactory.fetchFolders(host, link).then((folders) => {
      folders.forEach((folder) => {
        let preview = folder[1];
        if (folder[1] !== "../assets/img/folder.png") {
          preview = folder[1].replace("../", host);
        }

        const folderContent = ElementFactory.createSourceFolder(
          this.getLinkTitle(folder[0]),
          link + "/" + folder[0],
          preview
        );

        folderContent.addEventListener("click", () => {
          this.goToFolder(link + "/" + folder[0]);
        });

        repository.appendChild(folderContent);
      });

      if (folders.length > 0) {
        repository.appendChild(ElementFactory.createSeparation());
      }
    });

    await FetchFactory.fetchThumbnails(host, link).then((thumbnails) => {
      thumbnails.forEach((thumbnail) => {
        repository.appendChild(
          ElementFactory.createPicture(
            host,
            thumbnail[1][0].replace("../", host),
            thumbnail[1][1].replace("../", host)
          )
        );
      });
      if (thumbnails.length === 0) {
        repository.querySelector(".separator").remove();
      }
    });
    spinner.remove();
  }

  static initMainParts(host = "") {
    FetchFactory.fetchNewSource(host).then((news) => {
      if (news.length > 0) {
        console.warn("New sources added: ", news.concat(", "));
      }
    });
    const header = ElementFactory.createHeader();
    document.body.appendChild(header);
    header.querySelector("li").addEventListener("click", () => {
      this.returnIndex();
    });
    header.querySelector("li:nth-child(2)").addEventListener("click", () => {
      this.goBack();
    });
    document.body.appendChild(ElementFactory.createRepository());
  }

  static goToFolder(link) {
    const state = { data: "optional state object" };
    const title = this.getLinkTitle(link);
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("folder", link);

    const newUrl =
      `${document.location.pathname}` +
      (searchParams.toString() === "" ? "" : "?") +
      `${searchParams.toString()}`;
    history.pushState(state, title, newUrl);
    this.setDocumentTitle(title);
  }

  static goBack() {
    const searchParams = new URLSearchParams(window.location.search);
    this.goToFolder(searchParams.get("folder").split('/').slice(0, -1).join('/'));    
  }

  static returnIndex() {
    const state = { data: "optional state object" };
    const title = this.WELCOME_TITLE;
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.delete("folder");

    const newUrl =
      `${document.location.pathname}` +
      (searchParams.toString() === "" ? "" : "?") +
      `${searchParams.toString()}`;
    history.pushState(state, title, newUrl);
    this.setDocumentTitle(title);
  }
}
