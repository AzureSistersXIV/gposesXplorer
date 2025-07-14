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
    img.loading = "lazy";
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
      const link = addition.folder.search(addition.name) > -1 ? `${addition.folder}` : `${addition.folder}/${addition.name}`;
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
