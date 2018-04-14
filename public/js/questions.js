user = "Kourosh"
course = "Seng 513"
isProf = true;
sessions = null;


function session(id,isLive,name,questions){
    this.id = id;
    this.isLive = isLive;
    this.name = name;
    this.questions = questions;

    var session = this;

    this.expand = function(){
        clientSession = session;
        clientQuestions = questions;
        questionsView();
    }

    this.view = function(){
        var card = $("<div>").attr("class","card")

        card.append($("<h3>").text(this.name));

        card.click(this.expand);
        return (card);
    }






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
    var commentList;
    var showCommentList = false;

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
        questionsView();
        
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
        questionsView();
    }

    this.deleteQuestion = function(){
        clientQuestions.splice(clientQuestions.indexOf(question),1);
        questionsView();
    }

    this.toggleComments = function(){
        showCommentList = ! showCommentList;
        commentList.toggle();
    }

    this.reply = function(){
    
        if(replyMessage.val().trim() != ""){
            question.comments.push(new comment(user,replyMessage.val().trim()));
        }
        questionsView();
        return false;
    }

    this.score = function(){
        return(upvotes.length - downvotes.length);
    }

    this.view = function view(){
        var card = $("<div>")
        card.attr("class","card");

        var table = $("<table>");
       
        if(user == author || isProf){
            table.append($("<tr>")
                .append($("<td>"))
                .append($(`<td align="right" >`)
                    .append($(`<img height="30px" src="img/close.svg">`).click(this.deleteQuestion))));
        }
        
        var row = $("<tr>");
        upArrow = $(`<img id="down" height="50px">`);
        upArrow.attr("src",(upvotes.includes(user)?"img/upArrowVoted.svg":"img/upArrow.svg"));
        upArrow.click(this.upArrowClick);
        row.append($("<td>").attr("width","70px").append(upArrow));
        row.append($(`<td><h4>` + this.question +`</h4></td>`));
        

        table.append(row);

        var row = $("<tr>");
        downArrow = $(`<img id="down" height="50px">`);
    
        downArrow.attr("src",(downvotes.includes(user)?"img/downArrowVoted.svg":"img/downArrow.svg"));
        downArrow.click(this.downArrowClick);
        row.append($("<td>").attr("width","70px").append(downArrow));
        row.append($("<td>").append($(`<div class="row">`).append($(`
                        <div class="col-md-12 col-lg-3">User: ` + author +`</div>
                        <div class="col-md-12 col-lg-2">Score: `+ this.score() +`</div> 
                        <div class="col-md-12 col-lg-4">Posted: `+ this.date + `</div>`))
                        .append($("<div>").attr("class","col-md-12 col-lg-3").append($(`<span class="commentCollapse">`).text("Comments").click(this.toggleComments)))));   
                        
                            

        table.append(row);
        card.append(table);

        commentList = $("<div>").attr("class","comments-list");
        if(!showCommentList){
            commentList.toggle();
        }

        comments.forEach(comment => {

            this.deleteComment = function(){
                comments.splice(comments.indexOf(comment),1);
                questionsView();
            }
        
            
            let rowComment = $("<div>").attr("class","row comment");
            rowComment.append($("<div>").attr("class","col-md-12 col-lg-1 author").text(comment.author));
            if(user == comment.author || isProf ){
                rowComment.append($("<div>").attr("class","col-md-12 col-lg-11").text(comment.msg)
                .append($(`<img class="deleteComment" height="30px" src="img/close.svg">`).click(this.deleteComment))); 
            }else{
                rowComment.append($("<div>").attr("class","col-md-12 col-lg-11").text(comment.msg));
            }

            commentList.append(rowComment);

        });

        var replyForm = $("<form>").attr("action","");
        
        replyMessage = $("<input>");  
        replyMessage.attr("placeholder","Reply to comments above here!");  
        replyForm.append(replyMessage);
        replyForm.append($(`<button class="btn btn-dark btn-sm">Reply</button>`));
        replyForm.submit(this.reply);
        

        commentList.append(replyForm);
        card.append(commentList);
        return(card);
    }

}

function comment(author,msg){
    this.author = author;
    this.msg = msg;
}


question1 = [new question("What is life?","Kourosh","April 16th 2017",["Jake"],[user],
    [new comment("Hello123sasasasassaasassa","I like you. Don't hurt me"),
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


question2 =[new question("This is the second session","Kourosh","April 16th 2017",["Jake"],[user],
[new comment("Hello123sasasasassaasassa","I like you. Don't hurt me"),
new comment("Jerry","I like you."),
new comment("Swagmaster","Swag is All i care about"),
])]

sessions = [new session(123,true,"Session1",question1),new session(123,true,"Session5",question2)]
clientQuestions = null;
clientSession = null;





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

function questionsView(){
    $(".sessions-list").empty();
    $(".questions-list").empty();

    clientQuestions.sort(function(question1,question2){
        return(question2.score() - question1.score());
    })



    var checkBox;
    checkBox = $("<input>");
    checkBox.attr("type","checkbox");
    

    if(clientSession.isLive){
        checkBox.prop('checked', true);
    }
    

    toggleLive = function(){
        clientSession.isLive = this.checked;
    }

    checkBox.click(toggleLive);
    $(".questions-list").append($("<div>").attr("class","row")
        .append($(`<div class="col-6">`)
            .append($(`<button class="btn btn-dark btn-sm">Back</button>`).click(sessionsView)))
        .append($(`<div class="col-6">`)
            .append($("<label>").attr("class","switch").append(checkBox)
                .append($("<span>").attr("class", "slider round"))
            )
        )
    );


    var questionForm = $("<form>").attr("action","");
    var replyQuestion = $("<input>");
    replyQuestion.attr("placeholder","Ask a new question!");
    questionForm.append(replyQuestion);
    questionForm.append($(`<button class="btn btn-dark btn-sm">New Question</button>`));
    
    
    questionForm.submit(function(){
        if(replyQuestion.val().trim() != ""){
            clientQuestions.push(new question(replyQuestion.val().trim(),user,formatDate(new Date()),[],[],[]));
        }
        questionsView();
        return false;
    });
    
    $(".questions-list").append(
        $("<div>").attr("class","card")
            .append(questionForm)
            
    );
    
    clientQuestions.forEach(question => {
        $(".questions-list").append(question.view());
    });
    
}


function sessionsView(){
    $(".questions-list").empty();
    $(".sessions-list").empty();


    sessions.forEach(session =>{
        $(".sessions-list").append($(`<div class="col-md-12 col-lg-4">`).append(session.view()));
    })

}

$( document ).ready(function(){
    sessionsView();
});





