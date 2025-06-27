import { ElementFactory } from "./ElementFactory";
import { FetchFactory } from "./FetchFactory";

const host = "https://naslku.synology.me/_GposesAPI/";

document.addEventListener("DOMContentLoaded", function () {
  document.body.appendChild(ElementFactory.createHeader());
  FetchFactory.fetchFolders(host).then((folders) => {
    folders.forEach((folder) => {
      FetchFactory.fetchFolderContent(host, folder).then((folderContent) => {
        let folderElement = document.querySelector(
          `#${folder.split("/")[0]}Content`
        );
        let card;
        Object.entries(folderContent).forEach((files) => {
          if (files[0] !== "_root") {
            const subfolder = document.createElement("div");
            subfolder.classList = "subfolder";
            Array.from(files[1]).forEach((file) => {
              const links = FetchFactory.fetchThumbnail(
                `screenshots/${folder}/${file}`
              );
              card = ElementFactory.createCard(
                `${host}screenshots/${folder}/${files[0]}/${file}`,
                `${host}thumbnails/${folder}/${files[0]}/${file}`,
                file
              );
              subfolder.appendChild(card);
            });
            folderElement.appendChild(subfolder);
          } else {
            Array.from(files[1]).forEach((file) => {
              const links = FetchFactory.fetchThumbnail(
                `screenshots/${folder}/${file}`
              );
              card = ElementFactory.createCard(
                `${host}screenshots/${folder}/${file}`,
                `${host}thumbnails/${folder}/${file}`,
                file
              );
              folderElement.appendChild(card);
            });
          }
        });
      });
    });
  });
});
