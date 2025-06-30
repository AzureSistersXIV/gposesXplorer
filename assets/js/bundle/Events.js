import { ElementFactory } from "./ElementFactory";
import { FetchFactory } from "./FetchFactory";

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
