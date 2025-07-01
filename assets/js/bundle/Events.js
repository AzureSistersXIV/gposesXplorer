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
          preview = "../assets/img/folder.png";
        }

        let sourceFolder = ElementFactory.createSourceFolder(
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

function addClickEvent(source) {
  const repository = document.querySelector(".repository");
  source.addEventListener("click", function (event) {
    repository.innerHTML = "";
    const idSpinner = enableLoading();
    FetchFactory.fetchFolders(host, event.currentTarget).then((entries) => {
      if (entries.length > 0) {
        Array.from(entries).forEach((entry) => {
          let folder = ElementFactory.createSourceFolder(entry[0], entry[1]);
          addClickEvent(folder);
          repository.appendChild(folder);
        });
      }
    });
    FetchFactory.fetchThumbnails(host, event.currentTarget).then((entries) => {
      if (entries.length > 0) {
        Array.from(entries).forEach((entry) => {
          let folder = ElementFactory.createPicture(host, entry[1][0], entry[1][1]);
          repository.appendChild(folder);
        });
        disableLoading(idSpinner);
      }
    });
  });
}

function enableLoading(){
  const spinner = ElementFactory.createSpinner();
  let id = Math.random();
  spinner.id = id;
  document.body.appendChild(spinner);
  
  return id;
}

function disableLoading(id){
  const spinner = document.getElementById(id);
  spinner.remove();
}