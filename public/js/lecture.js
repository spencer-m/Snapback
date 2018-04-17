socket = io();

client = null;
courseID = null;
sectionName = null;
fileName = null;
sectionFiles = [];
//regCode = null;

//regCode = "3IV2WV";

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
    link.setAttribute("href", "javascript:void(0)");
    let downloadLink = 'atDownload("' + section + '", "' + fileName + '")';
    link.setAttribute("onclick", downloadLink);

    link.innerHTML = fileName;

    listElement.append(link);

    content.append(listElement);

  }

}

function course(lectureName, isProfessor) {

  this.load = function load() {
    $('.main-content').empty();

    var tabContent = document.createElement("div");
    tabContent.className = "tab-content";

    var lecContent = document.createElement("div");
    lecContent.className = "tab-pane fade show active";
    lecContent.setAttribute("id", "lecture");
    var qstContent = document.createElement("div");
    qstContent.className = "tab-pane fade";
    qstContent.setAttribute("id", "questions");

    if(isProfessor) {

      $('#addSectionButton').show();

      var addSectionModal = document.createElement("div");

      addSectionModal.innerHTML = `<div class="modal fade" id="addSectionModal" tabindex="-1" aria-hidden="true">
                  <div class="modal-dialog h-100 d-flex flex-column justify-content-center my-0">
                    <div class="modal-content">
                      <div class="modal-header">
                        <h3 class="modal-title" id="addSectionLabel">Add a New Section</h3>
                      </div>

                      <div class="modal-body">
                        <p>Please enter the section name</p>
                        <input type="text" class="form-control" id="sectionInput" placeholder="Enter section name">
                      </div>
                      <div class="modal-footer">
                        <button type="button" class="btn btn-blue" data-dismiss="modal">Close</button>
                        <button type="submit" class="btn btn-blue" id="addSectionInnerButton" onclick="addSection();" >Submit</button>
                      </div>
                    </div>
                  </div>
                </div>`;
      lecContent.append(addSectionModal);

    }


    // Creates tab container for lecture and question tab
    let navTabs = document.createElement("ul");
    navTabs.className = "nav nav-tabs nav-justified";

    let lecTab = document.createElement("li");
    lecTab.className = "nav-item";
    let lecTabLink = document.createElement("a");
    lecTabLink.className = "nav-link active";
    lecTabLink.setAttribute("data-toggle", "tab");
    lecTabLink.setAttribute("href", "#lecture");
    lecTabLink.innerHTML = "Lecture";
    lecTab.append(lecTabLink);

    let qstTab = document.createElement("li");
    qstTab.className = "nav-item";
    let qstLink = document.createElement("a");
    qstLink.className = "nav-link";
    qstLink.setAttribute("data-toggle", "tab");
    qstLink.setAttribute("href", "#questions");
    qstLink.innerHTML = "Questions";
    qstTab.append(qstLink);


    // Connects tabs (lecture and question)
    navTabs.append(lecTab);
    navTabs.append(qstTab);



    // Forms the accordion to place all the sections
    let accordion = document.createElement("div");
    accordion.setAttribute("id","accordion");


    lecContent.append(accordion);
    tabContent.append(lecContent);
    tabContent.append(qstContent);

    // Appending all the created content to the "content" div in lecture.html
      ($('.main-content').append(navTabs).append(tabContent)).fadeIn(1000);
  }

}

// download file
function atDownload(sectionName, filename) {
  sectionName = 'test';
  filename = 'test123.pdf';
  // file has name and data, filename is unique
  socket.emit('getFile', courseID, sectionName, filename, function(file) {
    var tempElem = document.createElement('a');
    tempElem.setAttribute('href', file.data);
    tempElem.setAttribute('download', file.name);
    tempElem.style.display = 'none';
    document.body.appendChild(tempElem);
    tempElem.click();
    document.body.removeChild(tempElem);
  });
}

// upload file
function atUpload(sectionName) {
  console.log("Section name atUpload: " + sectionName);

  // fileInput <- name and id of input
  let file = document.getElementById('fileInput').files[0];

  if (file) {
    if (file.size < 10000000) {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function () {
        data = reader.result;
        let infile = {
          name: file.name,
          data: data,
          size: file.size
        };
        socket.emit('addFile', courseID, sectionName, infile, function(response) {
          
          if (response.status === 'success') {
            // TODO
            window.alert("File Upload: Success");
          } 
          else if(response.status === 'exists') {
            // TODO
            window.alert("File Upload: Sorry the file exists.");
          }
          else if (response.status === 'filetoobig') {
            // TODO
            window.alert("File Upload: Sorry the file is too big (MAX 10MB)");
          }
          document.getElementById("fileInput").value = "";
        });
      };
      reader.onerror = function (error) {
        console.log('filereader error: ', error);
      };
    }
  }
}

let addSectionModalMessage = function(message) {
  let modalBody = $("#addSectionModal .modal-body");

  $('#addSectionInnerButton').hide();
  modalBody.empty();
  modalBody.text(message);
};

// creates individual sections
let createSection = function(sectionName) {
    // Forms the new section

    console.log("hello");

    let buttonID = sectionName + "UpButton";

    // contains a section's parts, including the button which triggers their particular modal
    let newHeader = (($('<div>')
        .addClass("card-header")
        .attr("data-toggle", "collapse").attr("href", "#collapse-" + sectionName))
        .append($('<a>').addClass("card-link").html(sectionName)))
        .append($('<button>')
            .addClass('btn btn-blue').text('Upload')
            .attr('id', buttonID).attr('type', 'button').attr('data-toggle', 'modal').attr('data-target', "#-" + sectionName + "-addFileModal")
            .css('float', 'right'));

    let newCollapse = $('<div>').addClass("collapse")
        .attr("id", "collapse-" + sectionName).attr("data-parent", "#accordion")
        .append(($('<div>')
                .addClass("card-body").attr("id", "body-" + sectionName))
                .append("<ul>").addClass("list-group list-group-flush").attr("id", "list-" + sectionName));

    $('#accordion').append($('<div>').addClass("card").append(newHeader).append(newCollapse));


    // Need a to create a modal for upload button
    ($('.main-content').append(
        $('<div>').addClass("modal fade").attr("id", "-" + sectionName + "-addFileModal")
            .append($('<div>').addClass("modal-dialog h-100 d-flex flex-column justify-content-center my-0")
                .append(($("<div>").addClass("modal-content")
                    .append($('<div>').addClass("modal-header")
                        .append($("<h5>").addClass("modal-title").text("Upload a file!"))))
                    .append($("<div>").addClass("modal-body")
                        .append($("<label>").addClass("section-file-upload").attr("for", "fileInput")
                            .text("Choose the files you want!").css("text-align", "center")
                            .append($("<i>").addClass("fa fa-upload").css("width", "100%")))
                        .append($("<input>").addClass("form-control-file")
                            .attr("id", "fileInput").attr("type", "file").attr("name", "fileInput")))
                    .append($("<div>").addClass("modal-footer")
                        .append($("<button>").addClass("btn btn-blue").attr("data-dismiss", "modal").text("Close"))
                        .append($("<button>").addClass("btn btn-blue").text("Add File!")
                            .attr("type", "submit").attr("id", "addFileButton").attr("data-dismiss", "modal")
                            .on("click", function(){          // GO HERE FOR THE BUTTON FUNCTIONALITY OF ADD-FILE

                                let buttonID = ($(this).closest(".modal")).attr("id");
                                let sectionName = buttonID.split("-")[1];

                                atUpload(sectionName);
                            })
                        ))
                )
            )
    )).fadeIn(1000);

};

// Adds new section to the lecture contents
function addSection() {
  let sectionName = $('#sectionInput').val();

  socket.emit('addSection', courseID, sectionName, function(response) {
    if (response.status === 'exists'){
      addSectionModalMessage("Section already exists!");
    }
    else if (response.status === 'success') {
        console.log("yay");
      createSection(sectionName);
      addSectionModalMessage("Section added successfully!");
    }
  });

}

function createLectureQuestionView(regCode){

  let info = {};
  let courseInfo = {};

  socket.emit('loadClass', regCode, function(userinfo, courseinfo) {
    info = userinfo;
    courseInfo = courseinfo;

    //userInfo.isProfessor;
    client = userinfo;
    courseID = courseinfo._id;
    /*courseinfo.lectures.section.files;*/

    socket.emit('getSections', courseID, function(section) {

        let view = new course(courseInfo.code, info.isProfessor);
        view.load();

        for(let s of section) {
            console.log(s.name);

            createSection(s.name);

            for(let f of s.files) {
                let newFile = new file(s.name, f.name);
                newFile.addFile();
            }
        }
    });

  });
}
