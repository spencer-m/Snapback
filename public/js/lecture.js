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
                        <button type="submit" class="btn btn-primary" data-dismiss='modal' onclick="addSection(accordion);" >Add Sections</button>
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

    // Forms the sections
    var lecSection = document.createElement("div");
    lecSection.className = "card";
    var assignSection = document.createElement("div");
    assignSection.className = "card";
    var testSection = document.createElement("div");
    testSection.className = "card";

    // Lecture section content
    var lecHeader = document.createElement("div");
    lecHeader.className = "card-header";
    lecHeader.setAttribute("data-toggle", "collapse");
    lecHeader.setAttribute("href", "#collapse-lecture");
    var lecLink = document.createElement("a");
    lecLink.className = "card-link";
    lecLink.innerHTML = "Lecture Notes";
    var lecCollapse = document.createElement("div");
    lecCollapse.className = "collapse";
    lecCollapse.setAttribute("id", "collapse-lecture");
    lecCollapse.setAttribute("data-parent", "#accordion");
    var lecBody = document.createElement("div");
    lecBody.className = "card-body";
    lecBody.setAttribute("id", "body-lecture");
    var lecList = document.createElement("ul");
    lecList.className = "list-group list-group-flush";
    lecList.setAttribute("id", "list-lecture");

    // Checks that the user is a professor before creating upload buttons
    if(isProfessor) {
      // Upload button for lecture section
      var lecUpButton = document.createElement("button");
      lecUpButton.className = "btn btn-outline-primary";
      lecUpButton.setAttribute("id", "lecUpButton");
      lecUpButton.setAttribute("type", "button");
      lecUpButton.setAttribute("style", "float: right;");
      lecUpButton.setAttribute("data-toggle", "modal");
      lecUpButton.setAttribute("data-target", "#lecUploadModal");
      lecUpButton.innerHTML = "Upload";

      // Modal for lecture notes upload
      var lecUploadModal = document.createElement("div");
      lecUploadModal.innerHTML = `<div class="modal fade" id="lecUploadModal" tabindex="-1" role="dialog" aria-labelledby="uploadModalLabel" aria-hidden="true">
                  <div class="modal-dialog" role="document">
                    <div class="modal-content">
                      <div class="modal-header">
                        <h5 class="modal-title" id="lecUploadModalLabel">Upload File to Lecture Notes</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>
                      <div class="modal-body">
                        <label for="lecFileUpload" class="custom-file-upload">
                          <i class="fa fa-cloud-upload"></i> Click here to upload a file
                        </label>
                        <input id="lecFileUpload" type="file"/>
                      </div>
                      <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary">Save changes</button>
                      </div>
                    </div>
                  </div>
                </div>`;

      lecContent.append(lecUploadModal);
      lecHeader.append(lecUpButton);

    }
    // Append lecture note stuff together
    lecBody.append(lecList);
    lecCollapse.append(lecBody);
    lecHeader.append(lecLink);

    lecSection.append(lecHeader);
    lecSection.append(lecCollapse);

    socket.emit('addSection', courseID, "Lecture Notes", function(response) {
      if (response.status === 'exists'){
        window.alert("Section already exists!");
      }
      else if (respose.status === 'success') {
        //section created (MAY NOT NEED)
      }
    });


    // Assignment section content
    var assignHeader = document.createElement("div");
    assignHeader.className = "card-header";
    assignHeader.setAttribute("data-toggle", "collapse");
    assignHeader.setAttribute("href", "#collapse-assignment");
    var assignLink = document.createElement("a");
    assignLink.className = "card-link";
    assignLink.innerHTML = "Assignments";
    var assignCollapse = document.createElement("div");
    assignCollapse.className = "collapse";
    assignCollapse.setAttribute("id", "collapse-assignment");
    assignCollapse.setAttribute("data-parent", "#accordion");
    var assignBody = document.createElement("div");
    assignBody.className = "card-body";
    assignBody.setAttribute("id", "body-assignment");
    var assignList = document.createElement("ul");
    assignList.className = "list-group list-group-flush";
    assignList.setAttribute("id", "list-assignment");

    if(isProfessor) {
      // Upload button for assignment section
      var assignUpButton = document.createElement("button");
      assignUpButton.className = "btn btn-outline-primary";
      assignUpButton.setAttribute("id", "assignUpButton");
      assignUpButton.setAttribute("type", "button");
      assignUpButton.setAttribute("style", "float: right;");
      assignUpButton.setAttribute("data-toggle", "modal");
      assignUpButton.setAttribute("data-target", "#assignUploadModal");
      assignUpButton.innerHTML = "Upload";

      // Modal for assignment upload
      var assignUploadModal = document.createElement("div");
      assignUploadModal.innerHTML = `<div class="modal fade" id="assignUploadModal" tabindex="-1" role="dialog" aria-labelledby="uploadModalLabel" aria-hidden="true">
                  <div class="modal-dialog" role="document">
                    <div class="modal-content">
                      <div class="modal-header">
                        <h5 class="modal-title" id="AssignUploadModalLabel">Upload File to Assignments</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>
                      <div class="modal-body">
                        <label for="assignFileUpload" class="custom-file-upload">
                          <i class="fa fa-cloud-upload"></i> Click here to upload a file
                        </label>
                        <input id="assignFileUpload" type="file"/>
                      </div>
                      <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary">Save changes</button>
                      </div>
                    </div>
                  </div>
                </div>`;

      lecContent.append(assignUploadModal);
      assignHeader.append(assignUpButton);
    }

    assignBody.append(assignList);
    assignCollapse.append(assignBody);
    assignHeader.append(assignLink);

    assignSection.append(assignHeader);
    assignSection.append(assignCollapse);

    socket.emit('addSection', courseID, "Assignments", function(response) {
      if (response.status === 'exists'){
        window.alert("Section already exists!");
      }
      else if (respose.status === 'success') {
        //section created (MAY NOT NEED)
      }
    });

    // Test section content
    var testHeader = document.createElement("div");
    testHeader.className = "card-header";
    testHeader.setAttribute("data-toggle", "collapse");
    testHeader.setAttribute("href", "#collapse-test");
    var testLink = document.createElement("a");
    testLink.className = "card-link";
    testLink.innerHTML = "Test Material";
    var testCollapse = document.createElement("div");
    testCollapse.className = "collapse";
    testCollapse.setAttribute("id", "collapse-test");
    testCollapse.setAttribute("data-parent", "#accordion");
    var testBody = document.createElement("div");
    testBody.className = "card-body";
    testBody.setAttribute("id", "body-test");
    var testList = document.createElement("ul");
    testList.className = "list-group list-group-flush";
    testList.setAttribute("id", "list-test");


    if(isProfessor) {
      // Upload button for test section
      var testUpButton = document.createElement("button");
      testUpButton.className = "btn btn-outline-primary";
      testUpButton.setAttribute("id", "lecUpButton");
      testUpButton.setAttribute("type", "button");
      testUpButton.setAttribute("style", "float: right;");
      testUpButton.setAttribute("data-toggle", "modal");
      testUpButton.setAttribute("data-target", "#testUploadModal");
      testUpButton.innerHTML = "Upload";

      // Modal for test material upload
      var testUploadModal = document.createElement("div");
      testUploadModal.innerHTML = `<div class="modal fade" id="testUploadModal" tabindex="-1" role="dialog" aria-labelledby="uploadModalLabel" aria-hidden="true">
                  <div class="modal-dialog" role="document">
                    <div class="modal-content">
                      <div class="modal-header">
                        <h5 class="modal-title" id="uploadModalLabel">Upload File to Test Material</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>
                      <div class="modal-body">
                        <label for="testFileUpload" class="custom-file-upload">
                          <i class="fa fa-cloud-upload"></i> Click here to upload a file
                        </label>
                        <input id="testFileupload" type="file"/>
                      </div>
                      <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary">Save changes</button>
                      </div>
                    </div>
                  </div>
                </div>`;

      lecContent.append(testUploadModal);
      testHeader.append(testUpButton);
    }

    testBody.append(testList);
    testCollapse.append(testBody);
    testHeader.append(testLink);


    testSection.append(testHeader);
    testSection.append(testCollapse);

    socket.emit('addSection', courseID, "Test Material", function(response) {
      if (response.status === 'exists'){
        window.alert("Section already exists!");
      }
      else if (respose.status === 'success') {
        //section created (MAY NOT NEED)
      }
    });


    accordion.append(lecSection);
    accordion.append(assignSection);
    accordion.append(testSection);

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
    else if (respose.status === 'success') {
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


  // Opens the lecture upload modal
  $('#lecUpButton').bind('click', function(e) {
    $('#lecUploadModal').modal("show");
    e.stopPropagation();
  });
  // Opens the assignment upload modal
  $('#assignUpButton').bind('click', function(e) {
    $('#assignUploadModal').modal("show");
    e.stopPropagation();
  });
  // Opens the test upload modal
  $('#testUpButton').bind('click', function(e) {
    console.log("asd");
    $('#testUploadModal').modal("show");
    e.stopPropagation();
  });

  // Closes modal upon submitting section
  $('#submitSection').submit(function(e) {
    e.preventDefault();
    $('#addSectionModal').modal('hide');
  });

});
