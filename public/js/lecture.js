function course(id) {
  this.id = id;

}

function File(section, filePath, fileName) {
  this.section = section;
  this.filePath = filePath;
  this.fileName = fileName;


  this.view = function view() {

    var content = document.getElementById("list-" + section);

    var listElement = document.createElement("li");
    listElement.className = "list-group-item";
    var link = document.createElement("a");
    link.setAttribute("href", filePath);
    link.setAttribute("download", fileName);

    link.innerHTML = fileName;

    console.log(link);

    listElement.append(link);

    content.append(listElement);

  }

}

function course(lectureName) {


  this.load = function load() {
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


    var tabContent = document.createElement("div");
    tabContent.className = "tab-content";

    var lecContent = document.createElement("div");
    lecContent.className = "tab-pane fade show active";
    lecContent.setAttribute("id", "lecture");
    var qstContent = document.createElement("div");
    qstContent.className = "tab-pane fade";
    qstContent.setAttribute("id", "questions");

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

    // Upload button for lecture section
    var lecUpButton = document.createElement("button");
    lecUpButton.className = "btn btn-outline-primary";
    lecUpButton.setAttribute("id", "lecUpButton");
    lecUpButton.setAttribute("type", "button");
    lecUpButton.setAttribute("style", "float: right;");
    lecUpButton.setAttribute("data-toggle", "modal");
    lecUpButton.setAttribute("data-target", "#lecUploadModal");
    lecUpButton.innerHTML = "Upload";

    var lecModal = document.createElement("div");
    lecModal.className = "modal fade";
    lecModal.setAttribute("id", "lecUploadModal");
    lecModal.setAttribute("tabindex", "-1");
    lecModal.setAttribute("role", "dialog");
    lecModal.setAttribute("aria-labelledby", "lecUploadModalLabel");
    lecModal.setAttribute("aria-hidden", "true");

    var lecModalDialog = document.createElement("div");
    lecModalDialog.className = "modal-dialog";
    lecModalDialog.setAttribute("role", "document");
    var lecModalContent = document.createElement("div");
    lecModalContent.className = "modal-content";
    var lecModalHeader = document.createElement("div");
    lecModalHeader.className = "modal-header";
    var lecModalTitle = document.createElement("h5");
    lecModalTitle.Classes = "modal-title";
    lecModalTitle.setAttribute("id", "lecUploadModalLabel");
    lecModalTitle.innerHTML = "Upload File";
    var lecModalClose = document.createElement("button");
    lecModalClose.className = "close";
    lecModalClose.setAttribute("type","button");
    lecModalClose.setAttribute("data-dismiss","modal");
    lecModalClose.setAttribute("aria-label","Close");
    var lecModalSpan = document.createElement("span");
    lecModalSpan.setAttribute("aria-hidden", "true");
    lecModalSpan.innerHTML = "&times;";
    var lecModalBody = document.createElement("div");
    lecModalBody.className = "modal-body";
    var lecModalLabel = document.createElement("label");
    lecModalLabel.className = "custom-file-upload";
    lecModalLabel.setAttribute("for", "lecFileUpload");
    var lecModalUpload = document.createElement("i");
    lecModalUpload.className = "fa fa-cloud-upload";
    lecModalUpload.innerHTML = "Click here to upload a file";
    var lecModalInput = document.createElement("input");
    lecModalInput.setAttribute("id", "lecFileUpload");
    lecModalInput.setAttribute("type", "file");
    lecModalInput.setAttribute("onchange", "handleLecFiles();")
    var lecModalFooter = document.createElement("div");
    lecModalFooter.className = "modal-footer";
    var lecModalCloseButton = document.createElement("button");
    lecModalCloseButton.className = "btn btn-secondary";
    lecModalCloseButton.setAttribute("type","button");
    lecModalCloseButton.setAttribute("data-dismiss","modal");
    lecModalCloseButton.innerHTML = "Close";
    var lecModalSaveButton = document.createElement("button");
    lecModalSaveButton.className = "btn btn-primary";
    lecModalSaveButton.setAttribute("type","button");
    lecModalSaveButton.innerHTML = "Save";


    lecModalClose.append(lecModalSpan);
    lecModalHeader.append(lecModalTitle);
    lecModalHeader.append(lecModalClose);

    lecModalFooter.append(lecModalCloseButton);
    lecModalFooter.append(lecModalSaveButton);

    lecModalLabel.append(lecModalUpload);
    lecModalBody.append(lecModalLabel);
    lecModalBody.append(lecModalInput);

    lecModalContent.append(lecModalHeader);
    lecModalContent.append(lecModalBody);
    lecModalContent.append(lecModalFooter);

    lecModalDialog.append(lecModalContent);
    lecModal.append(lecModalDialog);
    lecContent.append(lecModal);

    // Append lecture stuff together
    lecBody.append(lecList);
    lecCollapse.append(lecBody);
    lecHeader.append(lecLink);
    lecHeader.append(lecUpButton);

    lecSection.append(lecHeader);
    lecSection.append(lecCollapse);


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


    // Upload button for assignment section
    var assignUpButton = document.createElement("button");
    assignUpButton.className = "btn btn-outline-primary";
    assignUpButton.setAttribute("id", "assignUpButton");
    assignUpButton.setAttribute("type", "button");
    assignUpButton.setAttribute("style", "float: right;");
    assignUpButton.setAttribute("data-toggle", "modal");
    assignUpButton.setAttribute("data-target", "#assignUploadModal");
    assignUpButton.innerHTML = "Upload";

    var assignModal = document.createElement("div");
    assignModal.className = "modal fade";
    assignModal.setAttribute("id", "assignUploadModal");
    assignModal.setAttribute("tabindex", "-1");
    assignModal.setAttribute("role", "dialog");
    assignModal.setAttribute("aria-labelledby", "assignUploadModalLabel");
    assignModal.setAttribute("aria-hidden", "true");

    var assignModalDialog = document.createElement("div");
    assignModalDialog.className = "modal-dialog";
    assignModalDialog.setAttribute("role", "document");
    var assignModalContent = document.createElement("div");
    assignModalContent.className = "modal-content";
    var assignModalHeader = document.createElement("div");
    assignModalHeader.className = "modal-header";
    var assignModalTitle = document.createElement("h5");
    assignModalTitle.Classes = "modal-title";
    assignModalTitle.setAttribute("id", "assignUploadModalLabel");
    assignModalTitle.innerHTML = "Upload File";
    var assignModalClose = document.createElement("button");
    assignModalClose.className = "close";
    assignModalClose.setAttribute("type","button");
    assignModalClose.setAttribute("data-dismiss","modal");
    assignModalClose.setAttribute("aria-label","Close");
    var assignModalSpan = document.createElement("span");
    assignModalSpan.setAttribute("aria-hidden", "true");
    assignModalSpan.innerHTML = "&times;";
    var assignModalBody = document.createElement("div");
    assignModalBody.className = "modal-body";
    var assignModalLabel = document.createElement("label");
    assignModalLabel.className = "custom-file-upload";
    assignModalLabel.setAttribute("for", "assignFileUpload");
    var assignModalUpload = document.createElement("i");
    assignModalUpload.className = "fa fa-cloud-upload";
    assignModalUpload.innerHTML = "Click here to upload a file";
    var assignModalInput = document.createElement("input");
    assignModalInput.setAttribute("id", "assignFileUpload");
    assignModalInput.setAttribute("type", "file");
    assignModalInput.setAttribute("onchange", "handleAssignFiles();")
    var assignModalFooter = document.createElement("div");
    assignModalFooter.className = "modal-footer";
    var assignModalCloseButton = document.createElement("button");
    assignModalCloseButton.className = "btn btn-secondary";
    assignModalCloseButton.setAttribute("type","button");
    assignModalCloseButton.setAttribute("data-dismiss","modal");
    assignModalCloseButton.innerHTML = "Close";
    var assignModalSaveButton = document.createElement("button");
    assignModalSaveButton.className = "btn btn-primary";
    assignModalSaveButton.setAttribute("type","button");
    assignModalSaveButton.innerHTML = "Save";


    assignModalClose.append(assignModalSpan);
    assignModalHeader.append(assignModalTitle);
    assignModalHeader.append(assignModalClose);

    assignModalFooter.append(assignModalCloseButton);
    assignModalFooter.append(assignModalSaveButton);

    assignModalLabel.append(assignModalUpload);
    assignModalBody.append(assignModalLabel);
    assignModalBody.append(assignModalInput);

    assignModalContent.append(assignModalHeader);
    assignModalContent.append(assignModalBody);
    assignModalContent.append(assignModalFooter);

    assignModalDialog.append(assignModalContent);
    assignModal.append(assignModalDialog);
    lecContent.append(assignModal);

    assignBody.append(assignList);
    assignCollapse.append(assignBody);
    assignHeader.append(assignLink);
    assignHeader.append(assignUpButton)

    assignSection.append(assignHeader);
    assignSection.append(assignCollapse);

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

    // Upload button for test section
    var testUpButton = document.createElement("button");
    testUpButton.className = "btn btn-outline-primary";
    testUpButton.setAttribute("id", "lecUpButton");
    testUpButton.setAttribute("type", "button");
    testUpButton.setAttribute("style", "float: right;");
    testUpButton.setAttribute("data-toggle", "modal");
    testUpButton.setAttribute("data-target", "#testUploadModal");
    testUpButton.innerHTML = "Upload";

    var testModal = document.createElement("div");
    testModal.className = "modal fade";
    testModal.setAttribute("id", "testUploadModal");
    testModal.setAttribute("tabindex", "-1");
    testModal.setAttribute("role", "dialog");
    testModal.setAttribute("aria-labelledby", "testUploadModalLabel");
    testModal.setAttribute("aria-hidden", "true");

    var testModalDialog = document.createElement("div");
    testModalDialog.className = "modal-dialog";
    testModalDialog.setAttribute("role", "document");
    var testModalContent = document.createElement("div");
    testModalContent.className = "modal-content";
    var testModalHeader = document.createElement("div");
    testModalHeader.className = "modal-header";
    var testModalTitle = document.createElement("h5");
    testModalTitle.Classes = "modal-title";
    testModalTitle.setAttribute("id", "testUploadModalLabel");
    testModalTitle.innerHTML = "Upload File";
    var testModalClose = document.createElement("button");
    testModalClose.className = "close";
    testModalClose.setAttribute("type","button");
    testModalClose.setAttribute("data-dismiss","modal");
    testModalClose.setAttribute("aria-label","Close");
    var testModalSpan = document.createElement("span");
    testModalSpan.setAttribute("aria-hidden", "true");
    testModalSpan.innerHTML = "&times;";
    var testModalBody = document.createElement("div");
    testModalBody.className = "modal-body";
    var testModalLabel = document.createElement("label");
    testModalLabel.className = "custom-file-upload";
    testModalLabel.setAttribute("for", "testFileUpload");
    var testModalUpload = document.createElement("i");
    testModalUpload.className = "fa fa-cloud-upload";
    testModalUpload.innerHTML = "Click here to upload a file";
    var testModalInput = document.createElement("input");
    testModalInput.setAttribute("id", "testFileUpload");
    testModalInput.setAttribute("type", "file");
    testModalInput.setAttribute("onchange", "handleTestFiles();")
    var testModalFooter = document.createElement("div");
    testModalFooter.className = "modal-footer";
    var testModalCloseButton = document.createElement("button");
    testModalCloseButton.className = "btn btn-secondary";
    testModalCloseButton.setAttribute("type","button");
    testModalCloseButton.setAttribute("data-dismiss","modal");
    testModalCloseButton.innerHTML = "Close";
    var testModalSaveButton = document.createElement("button");
    testModalSaveButton.className = "btn btn-primary";
    testModalSaveButton.setAttribute("type","button");
    testModalSaveButton.innerHTML = "Save";

    testModalClose.append(testModalSpan);
    testModalHeader.append(testModalTitle);
    testModalHeader.append(testModalClose);

    testModalFooter.append(testModalCloseButton);
    testModalFooter.append(testModalSaveButton);

    testModalLabel.append(testModalUpload);
    testModalBody.append(testModalLabel);
    testModalBody.append(testModalInput);

    testModalContent.append(testModalHeader);
    testModalContent.append(testModalBody);
    testModalContent.append(testModalFooter);

    testModalDialog.append(testModalContent);
    testModal.append(testModalDialog);
    lecContent.append(testModal);

    testBody.append(testList);
    testCollapse.append(testBody);
    testHeader.append(testLink);
    testHeader.append(testUpButton);

    testSection.append(testHeader);
    testSection.append(testCollapse);





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
$(document).ready(function() {

  // TEST CLASS **************
  var seng = new course("SENG 513");
  seng.load();
  // TEST FILES **************
  var file = new File("lecture", "testFile.txt", "testFile");
  var file2 = new File("lecture", "testFile.txt", "testFile2");
  console.log(file);
  file.view();
  file2.view();



  // Opens the lecture upload moda
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

});

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
