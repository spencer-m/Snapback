user = "Kourosh"
course = "Seng 513"

sessions = null;


function session(id,isLive,name,questions){
    this.id = id;
    this.isLive = isLive;
    this.name = name;
    this.questions = questions;
}

function question(question,author,date,upvotes,downvotes,comments){
    this.question = question;
    this.author = author;
    this.date = date;
    this.upvotes = upvotes;
    this.downvotes = downvotes;
    this.comments = comments;

    var question = this;
    var replyMessage;
    var upArrow;
    var downArrow;

    this.upArrowClick = function(){
        if(upvotes.indexOf(user) < 0){
            upvotes.push(user);
            if(downvotes.indexOf(user) >=0 ){
                downvotes.splice(downvotes.indexOf(user),1);
            }
        }else{
            upvotes.splice(upvotes.indexOf(user) ,1);
        }
        console.log(question);
        resetView();
        
    }

    this.downArrowClick = function(){
        if(downvotes.indexOf(user) < 0){
            downvotes.push(user);
            if(upvotes.indexOf(user) >=0 ){
                upvotes.splice(upvotes.indexOf(user),1);
            }
        }else{
            downvotes.splice(downvotes.indexOf(user,1));
        }
        console.log(question);
        resetView();
    }



    this.reply = function(){
    
        if(replyMessage.val().trim() != ""){
            question.comments.push(new comment(user,replyMessage.val().trim()));
        }
        resetView();
        return false;
    }

    this.score = function(){
        return(upvotes.length - downvotes.length);
    }

    this.view = function view(){
        var card = $("<div>")
        card.attr("class","card");

        var table = $("<table>");
        
        var row = $("<tr>");
        upArrow = $(`<img id="down" height="50px">`);
        upArrow.attr("src",(upvotes.includes(user)?"img/upArrowVoted.svg":"img/upArrow.svg"));
        upArrow.click(this.upArrowClick);
        row.append(upArrow);
        row.append($(`<td><h4>` + this.question +`</h4></td>`));
        

        table.append(row);

        var row = $("<tr>");
        downArrow = $(`<img id="down" height="50px">`);
    
        downArrow.attr("src",(downvotes.includes(user)?"img/downArrowVoted.svg":"img/downArrow.svg"));
        downArrow.click(this.downArrowClick);
        row.append(downArrow);
        row.append($(`<td><div class="row">
                        <div class="col-md-12 col-lg-4"><p>User: ` + author +`</p></div>
                        <div class="col-md-12 col-lg-4"><p>Score: `+ this.score() +`</p></div> 
                        <div class="col-md-12 col-lg-4"><p>Posted: May 5th 2017</p></div>    
                        </div></td>`));
                            

        table.append(row);
        card.append(table);

        var commentList = $("<div>");
        commentList.attr("class","comments-list");

        comments.forEach(comment => {
            commentList.append(comment.view())
        });
        card.append(commentList);


        var replyForm = $("<form>").attr("action","");
        
        replyMessage = $("<input>");  
        replyMessage.attr("placeholder","Reply to comments above here!");  
        replyForm.append(replyMessage);
        replyForm.append($(`<button class="btn btn-dark btn-sm">Reply</button>`));
        replyForm.submit(this.reply);
        

        $(card).append(replyForm);
        return(card);
    }

}

function comment(author,msg){
    this.author = author;
    this.msg = msg;

    this.view = function view(){
        rowComment = $("<div>");
        rowComment.attr("class","row comment");

        rowComment.html(`<div class="col-md-12 col-lg-2"><p>User: `+author+`</p></div>
                                <div class="col-md-12 col-lg-10"><p>`+msg+`</p></div>`);
        return(rowComment);
    }
}


questions = [new question("What is life?","Kouroshb26","April 16th 2017",["Jake"],[user],
    [new comment("Hello123","I like you. Don't hurt me"),
    new comment("Jerry","I like you."),
    new comment("Swagmaster","Swag is All i care about"),
    ]),
    new question("This is another question I AM FOJAFOIJEOIHJF:OAHC:HDS:IHF","Kouroshb26","April 7th 2017",["Kouroshb26"],[],
    [new comment("Jerry","I don't like you."),
    new comment("Jebrone","Wow such nice comments."),
    ]),
    new question("asfdhadfjhkanothdskjfdoaijfoewjrfoejrdsafdsa FOJAFOIJEOIHJF:OAHC:HDS:IHF","Kouroshb26","April 7th 2017",["Kouroshb26"],[],
    [new comment("Jerry","I don't like you."),
    new comment("Jebrone","Wow such nice comments."),
    ]),
];

function formatDate(time){
    let year = time.getFullYear();
    let month = time.getMonth();
    let day = time.getDate();
    let h = time.getHours();
    let m = time.getMinutes();
    
    // These lines the seconds are two digits
    if (h < 10) {h = "0"+h;};
    if (m < 10) {m = "0"+m;};
    // This formats your string to Year/Month/Day hh:mm
    return(year+"/"+month+"/"+day+" "+h+":"+m);
}

function resetView(){
    questions.sort(function(question1,question2){
        return(question2.score() - question1.score());
    })
    $(".questions-list").empty();

   
    var questionForm = $("<form>").attr("action","");
    var replyQuestion = $("<input>");
    replyQuestion.attr("placeholder","Ask a new question!");
    questionForm.append(replyQuestion);
    questionForm.append($(`<button class="btn btn-dark btn-sm">New Question</button>`));
    
    
    questionForm.submit(function(){
        if(replyQuestion.val().trim() != ""){
            questions.push(new question(replyQuestion.val().trim(),user,formatDate(new Date()),[],[],[]));
        }
        resetView();
        return false;
    });
    
    $(".questions-list").append(
        $("<div>").attr("class","card").append(
            questionForm
        )
    );
    
    questions.forEach(question => {
        $(".questions-list").append(question.view());
    });
    
}

$( document ).ready(function(){
    resetView();

});





