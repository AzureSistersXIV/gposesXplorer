/**
 * FetchFactory is responsible for handling API requests related to sources
 * and updating the DOM with the fetched data.
 */
class FetchFactory {
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

  static async fetchLast(host, isNsfw = false, folder = false) {
    return await fetch(`${host}api/last.php?isNsfw=${isNsfw}&folder=${folder}`)
    .then((res) => res.json())
    .then((contents) => {      
      if(contents.length > 24){
        return Array.from(contents).slice(0,24);
      } else if (contents.length > 0){
        return Array.from(contents);
      } else {
        throw new Exception("No recent addition!");
      }
    });
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
      .catch((err) => console.error("Failed to fetch thumbnails :", err.message));
  }

  static async fetchZipStatus(host, link) {
    return await fetch(`${host}api/zip.php?folder=${link}`)
    .then((res) => res.json())
    .then((contents) => {      
      return contents.success;
    });
  }
}

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
   * Creates a loading spinner element with accessible status messages.
   * @returns {HTMLElement} The spinner container element.
   */
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
   * The navigation bar contains a heading, navigation links, and NSFW/SFW radio options.
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

    // Navigation links (Index, Back)
    const ul = document.createElement("ul");
    ul.innerHTML = `<li title="Index"><span class="material-symbols-outlined">home</span></li>`
    +`<li title="Back"><span class="material-symbols-outlined">subdirectory_arrow_left</span></li>`;
    nav.appendChild(ul);

    // NSFW/SFW radio options
    const options = document.createElement("ul");
    options.innerHTML =
      "<li><input type='radio' id='isNsfwFalse' name='isNSFW' value='false'><label for='isNsfwFalse'>SFW</label></li>" +
      "<li><input type='radio' id='isNsfwTrue' name='isNSFW' value='true'><label for='isNsfwTrue'>NSFW</label></li>";
    nav.appendChild(options);

    return nav;
  }

  /**
   * Creates the main repository container element.
   * @returns {HTMLElement} The repository div.
   */
  static createRepository() {
    const repo = document.createElement("div");
    repo.classList = "repository";
    return repo;
  }

  /**
   * Creates a folder card element for a source folder.
   * @param {string} name - The folder name.
   * @param {string} link - The folder path.
   * @param {string} preview - The preview image path.
   * @returns {HTMLElement} The folder card element.
   */
  static createSourceFolder(name = "", link = "", preview = "") {
    const folder = document.createElement("div");
    folder.dataset.title = name;
    folder.dataset.link = link;
    folder.className = "card";
    folder.title = `Open the "${name}" folder`;

    // Image container
    const container = document.createElement("div");
    container.classList = "img-div";
    folder.append(container);

    // Folder preview image
    const img = document.createElement("img");
    img.src = preview;
    if (preview === "./assets/img/folder.png") img.classList = "folder";
    img.alt = preview.split("/").pop();
    container.appendChild(img);

    // Adjust image style if image is short
    img.onload = function () {
      if (img.naturalHeight < 250) {
        img.classList = "fullheight";
        container.style.display = "flex";
        container.style.justifyContent = "center";
      }
    };

    // Overlay for hover effects or additional info
    const overlay = document.createElement("div");
    overlay.classList = "overlay";
    container.appendChild(overlay);

    return folder;
  }

  /**
   * Creates a card element for a picture/thumbnail.
   * @param {string} host - The host URL prefix.
   * @param {string} link - The image link.
   * @param {string} preview - The preview image path.
   * @returns {HTMLElement} The picture card element.
   */
  static createPicture(host = "", link = "", preview = "") {
    const folder = document.createElement("div");
    folder.dataset.title = link.split("/").pop();
    folder.className = "card";
    folder.title = `Show the "${folder.dataset.title}" picture`;

    // Image anchor container
    const container = document.createElement("a");
    container.classList = "img-div";
    container.href = link.replace("../", host);
    container.target = "_blank";
    folder.append(container);

    // Preview image
    const img = document.createElement("img");
    img.src = preview.replace("../", host);
    img.loading = "lazy";
    img.alt = preview.split("/").pop();
    container.appendChild(img);

    // Adjust image style if image is short
    img.onload = function () {
      if (img.naturalHeight < 250) {
        img.classList = "fullheight";
        container.style.display = "flex";
        container.style.justifyContent = "center";
      }
    };

    return folder;
  }

  static createDownloadButton(){
    const container = document.createElement("div");
    container.classList = "download";
    container.title = "Download pictures as zip file";

    const anchor = document.createElement("div");
    anchor.classList = "anchor";
    anchor.innerHTML = `<span class="material-symbols-outlined">folder_zip</span>`;
    container.appendChild(anchor);

    return container;
  }

  /**
   * Creates a horizontal separator element.
   * @returns {HTMLElement} The separator hr element.
   */
  static createSeparation() {
    const hr = document.createElement("hr");
    hr.classList = "separator";
    return hr;
  }

  /**
   * Updates the visibility of carousel navigation buttons based on scroll position.
   */
  static updateCarouselButton() {
    const tolerance = 600;
    const container = document.querySelector(".carousel-container");
    // Hide right button if scrolled to the end
    if (
      container.scrollLeft - (container.scrollWidth - container.clientWidth) >
        -tolerance &&
      !document.querySelector(".btnRight").classList.contains("hidden")
    ) {
      document.querySelector(".btnRight").classList.add("hidden");
    } else if (
      container.scrollLeft - (container.scrollWidth - container.clientWidth) <
      -tolerance
    ) {
      document.querySelector(".btnRight").classList.remove("hidden");
    }

    // Hide left button if scrolled to the start
    if (
      container.scrollLeft < tolerance &&
      !document.querySelector(".btnLeft").classList.contains("hidden")
    ) {
      document.querySelector(".btnLeft").classList.add("hidden");
    } else if (container.scrollLeft > tolerance) {
      document.querySelector(".btnLeft").classList.remove("hidden");
    }
  }

  /**
   * Scrolls the carousel container left or right.
   * @param {number} direction - -1 for left, 1 for right.
   */
  static scrollCarousel(direction) {
    const container = document.querySelector(".carousel-container");
    const scrollAmount = container.offsetWidth;
    container.scrollBy({
      left: direction * scrollAmount,
      behavior: "smooth",
    });

    // Update button visibility after scrolling
    setTimeout(() => {this.updateCarouselButton();}, 500);
  }

  /**
   * Creates a carousel element with navigation buttons and a tracker.
   * @returns {HTMLElement} The carousel element.
   */
  static createCarousel() {
    const carousel = document.createElement("div");
    carousel.classList = "carousel";

    // Main container for carousel items
    const container = document.createElement("div");
    container.classList = "carousel-container";
    carousel.appendChild(container);

    // Tracker for carousel position (optional)
    const tracker = document.createElement("div");
    tracker.classList = "carousel-tracker";
    container.appendChild(tracker);

    // Left navigation button
    const btnLeft = document.createElement("button");
    btnLeft.innerHTML = `<span class="material-symbols-outlined">arrow_back</span>`;
    btnLeft.classList = "btn btnLeft";
    btnLeft.title = "Nextly added";
    btnLeft.addEventListener("click", () => {
      this.scrollCarousel(-1);
    });
    carousel.appendChild(btnLeft);

    // Right navigation button
    const btnRight = document.createElement("button");
    btnRight.innerHTML = `<span class="material-symbols-outlined">arrow_forward</span>`;
    btnRight.classList = "btn btnRight";
    btnRight.title = "Previously added";
    btnRight.addEventListener("click", () => {
      this.scrollCarousel(1);
    });
    carousel.appendChild(btnRight);

    return carousel;
  }

  /**
   * Creates a carousel populated with recent items.
   * @param {string} host - The host URL prefix.
   * @param {Array} recentArray - Array of recent item objects.
   * @returns {HTMLElement} The carousel element with recent items.
   */
  static createRecentCarousel(host, recentArray = []) {
    const carousel = this.createCarousel();
    Array.from(recentArray).forEach((addition) => {
      const link = `${addition.folder}/${addition.name}`;
      const preview =
        addition.preview !== "./assets/img/folder.png"
          ? encodeURI(`${host}${addition.preview}`)
          : "./assets/img/folder.png";
      // Add each recent item as a source folder card to the carousel
      carousel.firstChild.firstChild.appendChild(
        this.createSourceFolder(addition.name, link, preview)
      );
    });
    return carousel;
  }
}

/**
 * Utilities class provides static helper methods for navigation,
 * loading content, managing NSFW state, and UI updates in Gposes Xplorer.
 */
class Utilities {
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
    this.setIsNsfw();
    const content = this.getFolder();
    if (content[1] !== null) {
      document.querySelector("header ul:nth-child(3)").style.visibility =
        "hidden";
      document.querySelector("header ul:nth-child(2)").style.visibility =
        "visible";
      if (
        content[1].split("/").pop() === content[0] &&
        content[1].split("/").length > 1
      ) {
        document.querySelector(
          "header ul:nth-child(2) li:nth-child(2)"
        ).style.display = "block";
      } else {
        document.querySelector(
          "header ul:nth-child(2) li:nth-child(2)"
        ).style.display = "none";
      }
      this.setDocumentTitle(`${content[0]} | Gposes Xplorer`);
      this.loadFolder(host, content[1]);
    } else {
      const searchParams = new URLSearchParams(window.location.search);
      document.querySelector(
        `header ul input[name='isNSFW'][value='${this.isNsfw}']`
      ).checked = true;
      document.querySelector("header ul:nth-child(3)").style.visibility =
        searchParams.get("isNsfw") === null ? "hidden" : "visible";
      document.querySelector("header ul:nth-child(2)").style.visibility =
        "hidden";
      this.setDocumentTitle(this.WELCOME_TITLE);
      this.loadSources(host);
    }
  }

  static async loadSources(host = "") {
    const repository = document.querySelector(".repository");
    repository.innerHTML = "<span></span>";

    const spinner = ElementFactory.createSpinner();
    document.body.appendChild(spinner);

    repository.innerHTML += "<h3>Last addition</h3>";
    await FetchFactory.fetchLast(host, this.isNsfw, true)
      .then((additions) => {
        const carousel = ElementFactory.createRecentCarousel(host, additions);
        repository.appendChild(carousel);

        Array.from(carousel.querySelectorAll(".card")).forEach((card, idx) => {
          card.addEventListener("click", () => {
            this.goToFolder(card.dataset.link);
          });
        });

        repository.appendChild(ElementFactory.createSeparation());
      })
      .catch((err) => console.error(err.message));

      const h3 = document.createElement('h3');
      h3.innerHTML = 'Sources';
      repository.appendChild(h3);

    const collator = new Intl.Collator("en", {
      numeric: true,
      sensitivity: "base",
    });
    await FetchFactory.fetchSources(host, this.isNsfw).then((sources) => {
      sources.sort((a, b) =>
        collator.compare(a[0], b[0])
      );
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

      const maxItems = Math.max(...this.itemsPerFlexRow(repository));
      Array.from(document.querySelectorAll('.carousel .card')).forEach((card) => {
        card.style = `--max-items: ${maxItems}`;
      });
      ElementFactory.updateCarouselButton();
    });
    
    spinner.remove();
  }

  static async loadFolder(host = "", link = "") {
    const repository = document.querySelector(".repository");
    repository.innerHTML = "";

    const spinner = ElementFactory.createSpinner();
    document.body.appendChild(spinner);

    const collator = new Intl.Collator("en", {
      numeric: true,
      sensitivity: "base",
    });
    await FetchFactory.fetchFolders(host, link).then((folders) => {
      const sortedFolders = folders.sort((a, b) =>
        collator.compare(a[0], b[0])
      );
      sortedFolders.forEach((folder) => {
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
      const sortedThumbnails = thumbnails.sort((a, b) =>
        collator.compare(a[1][0], b[1][0])
      );
      sortedThumbnails.forEach((thumbnail) => {
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
    
    const downloadButton = ElementFactory.createDownloadButton(host, link);
    repository.appendChild(downloadButton);
    downloadButton.addEventListener("click", function(){
      const spinner = ElementFactory.createSpinner();
      document.body.appendChild(spinner);
      FetchFactory.fetchZipStatus(host, link)
      .then((success) => {
        if(!success){
          console.error("Error when creating ZIP file.");
        }else {
          const anchor = document.createElement('a');
          anchor.style.display = "none";
          anchor.href = `${host}api/download.php?folder=${link}`;
          console.debug(`Downloading ${link}`);
          anchor.click();
          anchor.remove();
        }
      })
      .catch(err => console.error(err.message))
      .finally(() => {
        spinner.remove();
      });
    });
  }

  static initMainParts(host = "") {
    FetchFactory.fetchNewSource(host).then((news) => {
      if (news.length > 0) {
        console.warn("New sources added: ", news.concat(", "));
      }
    });

    const header = ElementFactory.createHeader();
    document.body.appendChild(header);
    header.querySelector("ul:nth-child(2) li").addEventListener("click", () => {
      this.returnIndex();
    });
    header
      .querySelector("ul:nth-child(2) li:nth-child(2)")
      .addEventListener("click", () => {
        this.goBack();
      });

    Array.from(
      document.querySelectorAll("header ul:nth-child(3) li label")
    ).forEach((label) => {
      label.addEventListener("click", (event) => {
        this.changeNsfwPart(event.currentTarget.previousElementSibling.value);
      });
    });

    const bumper = document.createElement("div");
    bumper.classList = "bumper";
    document.body.appendChild(bumper);

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
    const folder = searchParams.get("folder");
    this.goToFolder(folder.split("/").slice(0, -1).join("/"));
    setTimeout(
      () =>
        {
          document
          .querySelector(`[data-link="${folder}"]`)
          .scrollIntoView({ behavior: "smooth", block: "nearest" });
          document.querySelector(".bumper").scrollIntoView({behaviour: "instant", block: "start"});
        },
      500
    );
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

  static changeNsfwPart(value) {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("isNsfw", value);
    const state = { data: "optional state object" };
    const title = this.WELCOME_TITLE;

    const newUrl =
      `${document.location.pathname}` +
      (searchParams.toString() === "" ? "" : "?") +
      `${searchParams.toString()}`;
    history.pushState(state, title, newUrl);
    this.setDocumentTitle(title);
  }

  static itemsPerFlexRow(container) {
    const children = Array.from(container.children);
    const rows = {};

    children.forEach((child) => {
      const top = child.offsetTop;
      if (!rows[top]) {
        rows[top] = [];
      }
      rows[top].push(child);
    });

    return Object.values(rows).map((rowItems) => rowItems.length);
  }
}

// Host URL for API requests
const host = "https://naslku.synology.me/gposesXplorerAPI/";

// Main entry point: runs when DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  handleInitialLoad();
});

async function handleInitialLoad() {
  Utilities.setIsNsfw();
  Utilities.initMainParts(host);

  addNavigateSuccess(() => Utilities.loadContent(host));
  Utilities.loadContent(host);
}

function addNavigateSuccess(f) {
  if (window.navigation) {
    window.navigation.removeEventListener("navigatesuccess", f);
    window.navigation.addEventListener("navigatesuccess", f);
  } else {
    // Initialize fallback with robust guard
    if (!window._navigationFallback) {
      Object.defineProperty(window, "_navigationFallback", {
        value: {
          handlers: new Set(),
          setup() {
            // Avoid double-patching
            if (history.pushState._isMonkeyPatched) return;

            // Patch pushState/replaceState
            const originalPushState = history.pushState;
            history.pushState = function (...args) {
              originalPushState.apply(this, args);
              window.document.title = args[1];
              window.dispatchEvent(
                new CustomEvent("fallbacknavigate", {
                  detail: { url: window.location.href, state: args[0] },
                })
              );
            };
            history.pushState._isMonkeyPatched = true;

            history.replaceState = function (...args) {
              originalPushState.apply(this, args);
              window.document.title = args[1];
              window.dispatchEvent(
                new CustomEvent("fallbacknavigate", {
                  detail: { url: window.location.href, state: args[0] },
                })
              );
            };
            history.replaceState._isMonkeyPatched = true;

            // Unified event handler
            const handler = () => {
              const event = {
                destination: { url: window.location.href },
                state: history.state,
              };
              window._navigationFallback.handlers.forEach((cb) => cb(event));
            };
            window.addEventListener("popstate", handler);
            window.addEventListener("hashchange", handler);
            window.addEventListener("fallbacknavigate", handler);
          },
        },
        writable: false,
        configurable: false,
      });
      window._navigationFallback.setup();
    }

    // Register handler
    window._navigationFallback.handlers.delete(f);
    window._navigationFallback.handlers.add(f);
  }
}
//# sourceMappingURL=bundle.js.map
