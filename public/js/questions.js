user = "Kourosh"
course = "Seng 513"
isProf = false;

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

    this.deleteQuestion = function(){
        questions.splice(questions.indexOf(question),1);
        resetView();
    }

    this.toggleComments = function(){
        showCommentList = ! showCommentList;
        commentList.toggle();
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
        row.append(upArrow);
        row.append($(`<td><h4>` + this.question +`</h4></td>`));
        

        table.append(row);

        var row = $("<tr>");
        downArrow = $(`<img id="down" height="50px">`);
    
        downArrow.attr("src",(downvotes.includes(user)?"img/downArrowVoted.svg":"img/downArrow.svg"));
        downArrow.click(this.downArrowClick);
        row.append(downArrow);
        row.append($("<td>").append($(`<div class="row">`).append($(`
                        <div class="col-md-12 col-lg-3">User: ` + author +`</div>
                        <div class="col-md-12 col-lg-3">Score: `+ this.score() +`</div> 
                        <div class="col-md-12 col-lg-3">Posted: `+ this.date + `</div>`))
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
                resetView();
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

    // this.view = function view(){
    //     var rowComment = $("<div>");
    //     rowComment.attr("class","row comment");

    //     rowComment
    //         .append($("<div>").attr("class","col-md-12 col-lg-1 author").text(author))
    //         .append($("<div>").attr("class","col-md-12 col-lg-11").text(msg)
    //         .append($(`<img class="deleteComment" height="30px" src="img/close.svg">`)));
                
    
    //     return(rowComment);
    // }
}


questions = [new question("What is life?","Kourosh","April 16th 2017",["Jake"],[user],
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





