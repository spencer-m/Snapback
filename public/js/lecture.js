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
    qstLink.setAttribute("href", "#question");
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

    var accordion = document.createElement("div");
    accordion.setAttribute("id","accordion");

    var lecSection = document.createElement("div");
    lecSection.className = "card";
    var assignSection = document.createElement("div");
    assignSection.className = "card";
    var testSection = document.createElement("div");
    testSection.className = "card";

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

    lecBody.append(lecList);
    lecCollapse.append(lecBody);
    lecHeader.append(lecLink);

    lecSection.append(lecHeader);
    lecSection.append(lecCollapse);

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

    assignBody.append(assignList);
    assignCollapse.append(assignBody);
    assignHeader.append(assignLink);

    assignSection.append(assignHeader);
    assignSection.append(assignCollapse);


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

    testBody.append(testList);
    testCollapse.append(testBody);
    testHeader.append(testLink);

    testSection.append(testHeader);
    testSection.append(testCollapse);

    accordion.append(lecSection);
    accordion.append(assignSection);
    accordion.append(testSection);

    lecContent.append(accordion);
    tabContent.append(lecContent);
    tabContent.append(qstContent);


    var content = document.getElementById("content");
    content.append(navBar);
    content.append(navTabs);
    content.append(tabContent);

  }
}
var seng = new course("SENG 513");
seng.load();
var file = new File("lecture", "testFile.txt", "testFile");
var file2 = new File("lecture", "testFile.txt", "testFile2");
console.log(file);
file.view();
file2.view();




//$(".questions-list").append(question.view());
