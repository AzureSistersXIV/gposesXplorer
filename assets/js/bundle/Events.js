import { ElementFactory } from "./ElementFactory";
import { FetchFactory } from "./FetchFactory";

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
