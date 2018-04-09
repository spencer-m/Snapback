console.log("Hello world");
function session(id,isLive,duration,questions){
    this.id = id;
    this.isLive = isLive;
    this.duration = duration;
    this.questions = questions;
}

function question(question,user,date,upvotes,downvotes,comments){
    this.question = question;
    this.user = user;
    this.date = date;
    this.upvotes = upvotes;
    this.downvotes = downvotes;
    this.comments = comments;

    this.view = function view(){
        var card = document.createElement("div")
        card.className ="card";

        var table = document.createElement("table");
        
        var row = document.createElement("tr");
        row.innerHTML = `
        <td><img id="up" src="img/upArrow.svg" height="50px"></td>
        <td><h4>` + question +`</h4></td>`
        ;

        table.append(row);

        var row = document.createElement("tr");
        row.innerHTML = `   <td><img id="down" src="img/downArrow.svg" height="50px"></td>
                            <td><div class="row">
                                <div class="col-md-12 col-lg-4"><p>User: ` + user +`</p></div>
                                <div class="col-md-12 col-lg-4"><p>Score: `+ (upvotes.length - downvotes.length) +`</p></div> 
                                <div class="col-md-12 col-lg-4"><p>Posted: May 5th 2017</p></div>    
                            </div></td>`;

        table.append(row);
        card.append(table);

        var commentList = document.createElement("div");
        commentList.className = "comments-list"

        comments.forEach(comment => {
            commentList.append(comment.view())
        });
        card.append(commentList);
        return(card);
    }
}

function comment(user,msg){
    this.user = user;
    this.msg = msg;

    this.view = function view(){
        rowComment = document.createElement("div");
        rowComment.className = "row comment"

        rowComment.innerHTML = `<div class="col-md-12 col-lg-2"><p>User: `+user+`</p></div>
                                <div class="col-md-12 col-lg-10"><p>`+msg+`</p></div>`
        return(rowComment);
    }
}


var question = new question("What is life?","Kouroshb26","April 16th 2017",["Kouroshb26"],[],
    [new comment("Hello123","I like you. Don't hurt me"),
    new comment("Jerry","I like you."),
    new comment("Swagmaster","Swag is All i care about"),
    ]
);

console.log(questions);

$(".questions-list").append(question.view());





