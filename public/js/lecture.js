
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

function lectureStart(lectureName) {


  this.load = function load() {
    var mainNavBar = document.createElement("nav");
    mainNavBar.className = "navbar navbar-default";

    var container = document.createElement("div");
    container.className = "container-fluid";

    var navHeader = document.createElement("div");
    navHeader.className = "navbar-header";

    var headerTitle = document.create("div");
    headerTitle.className = "header-title";
    headerTitle.innerHTML = lectureName;


  }
}


var file = new File("lecture", "testFile.txt", "testFile");
var file2 = new File("lecture", "testFile.txt", "testFile2");
console.log(file);
file.view();
file2.view();
//$(".questions-list").append(question.view());
