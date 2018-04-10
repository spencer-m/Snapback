
function course(id) {
  this.id = id;

}
function file(section, fileName, description) {
  this.section = section;
  this.fileName = fileName;
  this.description = description;

  this.view = function view() {
    // Creates the basic card (section)
    var card = document.createElement("div");
    card.className = "card";

    // Creates the card-header
    var header = document.createElement("div");
    header.className = "card-header";
    header.innerHTML = section;

    // Creates the card-link for the section name
    var link = document.createElement("a");
    link.className = "card-link";
    link.setAttribute("data-toggle", "collapse");
    link.setAttribute("href", "#collapse-" + section);
    link.innerHTML = section;

    // Creates the card-body for storing files
    var fileList = document.createElement("ul");
    fileList.className = "list-group list-group-flush";

    // Gets all the files and appends to fileList (card-body)
    fileList.forEach(file => {
      var file = document.createElement("li");
      file.className = "list-group-item";
      file.append(fileList);
    });
    card.append(header);
    card.append(link);

    // Appends new section and card to accordion
    document.getElementsById("accordion").append(card);

  }

}

function file(fileName) {

}
