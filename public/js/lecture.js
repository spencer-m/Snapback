socket = io();

client = null;
courseID = null;
sectionName = null;
fileName = null;
sectionFiles = [];
//regCode = null;

regCode = "3IV2WV";

/*
function course(id) {
  this.id = id;

}
*/

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

    $('#content').prepend(
        $('<div>').addClass("modal hide fade d-flex h-100 align-self-center justify-content-center")
            .attr("id", "addFileModal").attr("role", "dialog")
            .append($('<div>').addClass("modal-dialogue").attr("role", "document")
                .append((($('<div>').addClass("modal-content")
                    .append($('<div>').addClass("modal-header")
                        .append($('<h5>').addClass("modal-title").text("Upload a file!"))))
                    .append($('<div>').addClass("modal-body")
                        .append($("<input>").addClass("form-control")
                            .attr("id","fileInput").attr("type", "text").attr("placeholder", "Choose file"))))
                    .append(($("<div>").addClass("modal-footer")
                        .append($("<button>").addClass("btn btn-secondary").text("Close")
                            .attr("type", "button").attr("data-dismiss", "modal").attr("data-target", "#addFileModal").attr("z-index", "2")))
                        .append($("<button>").addClass("btn btn-primary").text("Add file")
                            .attr("type", "submit").attr("id", "addFileButton")
                            .on("click", function(){}))
                    )
                )
            )
    );

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
      addSectionButton.addEventListener("click", function(){
          let modalBody = $('#addSectionModal .modal-body');

          $('#addSectionInnerButton').show();
          modalBody.empty();
          modalBody.append($('<input>').addClass('form-control')
              .attr('id', "sectionInput").attr("type", "text").attr("placeholder", "Enter section name"));
      });
      addSectionButton.innerHTML = "Add Section";

      navBar.append(addSectionButton);

      var addSectionModal = document.createElement("div");

      addSectionModal.innerHTML = `<div class="modal fade" id="addSectionModal" tabindex="-1" aria-hidden="true">
                  <div class="modal-dialog">
                    <div class="modal-content">
                      <div class="modal-header">
                        <h5 class="modal-title" id="addSectionLabel">Add a New Section</h5>
                      </div>

                      <div class="modal-body">
                        <input type="text" class="form-control" id="sectionInput" placeholder="Enter section name">
                      </div>
                      <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        <button type="submit" class="btn btn-primary" id="addSectionInnerButton" onclick="addSection();" >Add Sections</button>
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
    lecTabLink.innerHTML = "Lecture";
    lecTab.append(lecTabLink);

    var qstTab = document.createElement("li");
    qstTab.className = "nav-item";
    var qstLink = document.createElement("a");
    qstLink.className = "nav-link";
    qstLink.setAttribute("data-toggle", "tab");
    qstLink.setAttribute("href", "#questions");
    qstLink.innerHTML = "Questions";
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

    //mine-spencer
    var fileupd = document.createElement("button");
    fileupd.className = "btn btn-secondary";
    fileupd.setAttribute("id", "uploadFileFile");
    fileupd.setAttribute("type", "button");
    fileupd.setAttribute("onclick", "mahfunction()");
    fileupd.innerHTML = "MahButton";
    content.append(fileupd);

  }

}

function mahfunction() {
  console.log('mahfunc', courseID);
  console.log('mahfunc', sectionName);
  let file = {
    name: 'testfile',
    data: 'foobar'
  };
  // file has name and data, filename is unique
  socket.emit('addFile', courseID, sectionName, file, function(response) {
    
    
    if (response.status === 'error') {
      //do Something;
    }
  });
}

let addSectionModalMessage = function(message) {
  let modalBody = $("#addSectionModal .modal-body");


  $('#addSectionInnerButton').hide();
  modalBody.empty();
  modalBody.text(message);
};

let createSection = function(sectionName) {
    // Forms the new section

    let modalID = "#" + sectionName + "UploadModal";
    let buttonID = sectionName + "UpButton";

    let newHeader = (($('<div>')
        .addClass("card-header")
        .attr("data-toggle", "collapse").attr("href", "#collapse-" + sectionName))
        .append($('<a>').addClass("card-link").html(sectionName)))
        .append($('<button>')
            .addClass('btn btn-outline-primary').text('Upload')
            .attr('id', buttonID).attr('type', 'button').attr('data-toggle', 'modal').attr('data-target', "#addFileModal")
            .on('click', function(){
              //  $('#addFileModal').show();
            }).css('float', 'right'));

    let newCollapse = $('<div>').addClass("collapse")
        .attr("id", "collapse-" + sectionName).attr("data-parent", "#accordion")
        .append(($('<div>')
                .addClass("card-body").attr("id", "body-" + sectionName))
                .append("<ul>").addClass("list-group list-group-flush").attr("id", "list-" + sectionName));

    $('#accordion').append($('<div>').addClass("card").append(newHeader).append(newCollapse));

    // Need a to create a modal for upload button
    //lecContent.append(lecUploadModal);

};

// Adds new section to the lecture contents
function addSection() {
  let sectionName = $('#sectionInput').val();

  socket.emit('addSection', courseID, sectionName, function(response) {
    if (response.status === 'exists'){
      addSectionModalMessage("Section already exists!");
    }
    else if (response.status === 'success') {
      createSection(sectionName);
      addSectionModalMessage("Section added successfully!");
    }
  });

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
    courseID = courseinfo._id;
    /*courseinfo.lectures.section.files;*/

    socket.emit('getSections', courseID, function(section) {

        for(let s of section) {
            createSection(s.name);

            for(let f of s.files) {
                let newFile = new file(s.name, f.name);
                newFile.addFile;
            }
        }
    });

  });

  // refresh section div
  socket.on('addedSection', function() {
    // what do you want the server to give you
    // ***Will need the files in that section***
    // Gets the files in all the sections

  });


// file has name and data, filename is unique
  socket.emit('addFile', courseID, sectionName, file, function(response) {
    if (response.status === 'error') {
      //do Something;
    }

  });

  /*
  socket.on('addedFile', )
  */

  // only emit when user clicks on a file
  socket.emit('getFile', sectionName, fileName, function(response) {
    if(response.status === 'success') {
      // response.filedata <decode>
    }
  });


  // TEST CLASS **************
  var seng = new course("SENG 513", true);
  seng.load();

  // TEST FILES **************
  var file1 = new file("lecture", "testFile.txt", "testFile");
  var file2 = new file("lecture", "testFile.txt", "testFile2");
  console.log(file);
  file1.addFile;
  file2.addFile;


});
