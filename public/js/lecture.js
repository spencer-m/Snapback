socket = io();

client = null;
courseID = null;
sectionName = null;
fileName = null;
sectionFiles = [];
regCode = null;

function course(id) {
  this.id = id;

}

function file(section, fileName) {
  this.section = section;
  //this.filePath = filePath;
  this.fileName = fileName;


  this.addFile = function () {

    var content = document.getElementById("list-" + section);

    var listElement = document.createElement("li");
    listElement.className = "list-group-item";
    var link = document.createElement("a");
    link.setAttribute("href", "#");
    link.setAttribute("download", fileName);

    link.innerHTML = fileName;

    console.log(link);

    listElement.append(link);

    content.append(listElement);

  }

}

function course(lectureName, isProfessor) {


  this.load = function load() {
    $('#content').empty();
    console.log("asdasd");

    var navBar = document.createElement("nav");
    navBar.className = "navbar navbar-default";

    var container = document.createElement("div");
    container.className = "container-fluid";

    var navHeader = document.createElement("div");
    navHeader.className = "navbar-header";

    var headerTitle = document.createElement("div");
    headerTitle.className = "header-title";
    headerTitle.innerHTML = lectureName;

    // Connects the navbar (top bar with class name) together
    navHeader.append(headerTitle);
    container.append(navHeader);
    navBar.append(container);


    var tabContent = document.createElement("div");
    tabContent.className = "tab-content";

    var lecContent = document.createElement("div");
    lecContent.className = "tab-pane fade show active";
    lecContent.setAttribute("id", "lecture");
    var qstContent = document.createElement("div");
    qstContent.className = "tab-pane fade";
    qstContent.setAttribute("id", "questions");

    if(isProfessor) {
      var addSectionButton = document.createElement("button");
      addSectionButton.className = "btn btn-secondary";
      addSectionButton.setAttribute("id", "addSectionButton");
      addSectionButton.setAttribute("type", "button");
      addSectionButton.setAttribute("style", "position: absolute; right: 10px;");
      addSectionButton.setAttribute("data-toggle", "modal");
      addSectionButton.setAttribute("data-target", "#addSectionModal");
      addSectionButton.innerHTML = "Add Section";

      navBar.append(addSectionButton);

      var addSectionModal = document.createElement("div");

      addSectionModal.innerHTML = `<div class="modal fade" id="addSectionModal" tabindex="-1" role="dialog" aria-labelledby="uploadModalLabel" aria-hidden="true">
                  <div class="modal-dialog" role="document">
                    <div class="modal-content">
                      <div class="modal-header">
                        <h5 class="modal-title" id="addSectionLabel">Add a New Sections</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>

                      <div class="modal-body">
                        <input type="text" class="form-control" id="sectionInput" placeholder="Enter section name">
                      </div>
                      <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        <button type="submit" class="btn btn-primary" data-dismiss="modal" onclick="addSection(accordion);" >Add Sections</button>
                      </div>
                    </div>
                  </div>
                </div>`;
      lecContent.append(addSectionModal);

    }


    // Creates tab container for lecture and question tab
    var navTabs = document.createElement("ul");
    navTabs.className = "nav nav-tabs nav-justified";

    var lecTab = document.createElement("li");
    lecTab.className = "nav-item";
    var lecTabLink = document.createElement("a");
    lecTabLink.className = "nav-link active";
    lecTabLink.setAttribute("data-toggle", "tab");
    lecTabLink.setAttribute("href", "#lecture");
    lecTabLink.innerHTML = "Lecture"
    lecTab.append(lecTabLink);

    var qstTab = document.createElement("li");
    qstTab.className = "nav-item";
    var qstLink = document.createElement("a");
    qstLink.className = "nav-link";
    qstLink.setAttribute("data-toggle", "tab");
    qstLink.setAttribute("href", "#questions");
    qstLink.innerHTML = "Questions"
    qstTab.append(qstLink);


    // Connects tabs (lecture and question)
    navTabs.append(lecTab);
    navTabs.append(qstTab);



    // Forms the accordion to place all the sections
    var accordion = document.createElement("div");
    accordion.setAttribute("id","accordion");


    lecContent.append(accordion);
    tabContent.append(lecContent);
    tabContent.append(qstContent);

    // Appending all the created content to the "content" div in lecture.html
    var content = document.getElementById("content");
    content.append(navBar);
    content.append(navTabs);
    content.append(tabContent);

  }

}

// Adds new section to the lecture contents
function addSection(accordion) {
  var sectionName = document.getElementById("sectionInput").value;

  socket.emit('addSection', courseID, sectionName, function(response) {
    if (response.status === 'exists'){
      window.alert("Section already exists!");
      return;
    }
    else if (response.status === 'success') {


    }
  });

  // Forms the new section

  var newSection = document.createElement("div");
  newSection.className = "card";


  // New section content
  var newHeader = document.createElement("div");
  newHeader.className = "card-header";
  newHeader.setAttribute("data-toggle", "collapse");
  newHeader.setAttribute("href", "#collapse-" + sectionName);
  var newLink = document.createElement("a");
  newLink.className = "card-link";
  newLink.innerHTML = sectionName;
  var newCollapse = document.createElement("div");
  newCollapse.className = "collapse";
  newCollapse.setAttribute("id", "collapse-" + sectionName);
  newCollapse.setAttribute("data-parent", "#accordion");
  var newBody = document.createElement("div");
  newBody.className = "card-body";
  newBody.setAttribute("id", "body-" + sectionName);
  var newList = document.createElement("ul");
  newList.className = "list-group list-group-flush";
  newList.setAttribute("id", "list-" + sectionName);

  newBody.append(newList);
  newCollapse.append(newBody);
  newHeader.append(newLink);

  newSection.append(newHeader);
  newSection.append(newCollapse);

  accordion.append(newSection);

  // New upload file button for section
  var newUpButton = document.createElement("button");
  var modalID = "#" + sectionName + "UploadModal";
  var buttonID = sectionName + "UpButton";
  console.log(buttonID);
  newUpButton.className = "btn btn-outline-primary";
  newUpButton.setAttribute("id", buttonID);
  newUpButton.setAttribute("type", "button");
  newUpButton.setAttribute("style", "float: right;");
  newUpButton.setAttribute("data-toggle", "modal");
  newUpButton.setAttribute("data-target", "#" + sectionName + "UploadModal");
  newUpButton.setAttribute("onclick", "event.stopPropagation(); $(modalID).modal('show');");
  newUpButton.innerHTML = "Upload";


  // Need a to create a modal for upload button
  //lecContent.append(lecUploadModal);
  newHeader.append(newUpButton);

  window.alert("Successfully added section!");



}


// Handles files from lecture upload modal
function handleLecFiles() {
  file = document.getElementById("lecFileUpload").files[0];
  console.log(file.name);
}
// Handles files from assignment upload modal
function handleAssignFiles() {
  file = document.getElementById("assignFileUpload").files[0];
  console.log(file.name);
}
// Handles files from test upload modal
function handleTestFiles() {
  file = document.getElementById("testFileUpload").files[0];
  console.log(file.name);
}

$(document).ready(function() {

  socket.emit('loadClass', regCode, function(userinfo, courseinfo) {
    //userInfo.isProfessor;
    client = userinfo;
    this.regCode = regcode;
    courseID = courseInfo._id;
    courseinfo.lectures.section.files;
  });


  // refresh section div
  socket.on('addedSection', function() {
    // what do you want the server to give you
    // ***Will need the files in that section***
    // Gets the files in all the sections
    socket.emit('getSections', courseID, function(section) {
      for(let s of section) {
        for(let f of s.files) {
          let newFile = new file(s.name, f.name);
          newFile.addFile;
        }
      }
    });
  });


// file has name and data, filename is unique
  socket.emit('addFile', courseID, sectionName, file, function(response) {
    if (response.stastus === error) {
      //do Something;
    }

  });

  socket.on('addedFile', )

  // only emit when user clicks on a file
  socket.emit('getFile', sectionName, fileName, function(response) {
    if(response.status === success) {
      // response.filedata <decode>
    }
  });


  // TEST CLASS **************
  var seng = new course("SENG 513", "professor");
  seng.load();
  // TEST FILES **************
  var file1 = new file("lecture", "testFile.txt", "testFile");
  var file2 = new file("lecture", "testFile.txt", "testFile2");
  console.log(file);
  file.addFile;
  file2.addFile;


});
