
function course(id) {
  this.id = id;

}

function File(section, filePath, fileName) {
  this.section = section;
  this.filePath = filePath;
  this.fileName = fileName;
  

  this.view = function view() {
	/*
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
	*/
	var co = "body-" + section;
	console.log(co);
	var content = document.getElementById("list-" + section);

	// Creates the card-body for storing files
	//var fileList = document.createElement("ul");
	//fileList.className = "list-group list-group-flush";

	// Gets all the files and appends to fileList (card-body)
	//files.forEach(file => {
	var listElement = document.createElement("li");
	listElement.className = "list-group-item";
	var link = document.createElement("a");
	link.setAttribute("href", filePath);
	link.setAttribute("download", fileName);
	
	link.innerHTML = fileName;
	
	console.log(link);
	
	listElement.append(link);
	//fileList.append(listElement);
	//});

	content.append(listElement);

	/*
	card.append(header);
	card.append(link);

	// Appends new section and card to accordion
	document.getElementsById("accordion").append(card);
	*/
  }

}
	

var file = new File("lecture", "testFile.txt", "testFile");
var file2 = new File("lecture", "testFile.txt", "testFile2");
console.log(file);
file.view();
file2.view();
//$(".questions-list").append(question.view());