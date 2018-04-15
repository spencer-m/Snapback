clientUser = "Kourosh"
courseID = "Seng 513"
isProf = true;


question1 = [new question("What is life?","Kourosh","April 16th 2017",["Jake"],[clientUser],
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

question2 =[new question("This is the second session","Kourosh","April 16th 2017",["Jake"],[clientUser],
[new comment("Hello123sasasasassaasassa","I like you. Don't hurt me"),
new comment("Jerry","I like you."),
new comment("Swagmaster","Swag is All i care about"),
])]

sessions = [new session(123,true,"Session1",question1),new session(123,true,"Session5",question2)]
clientQuestions = null;
clientSession = null;



function session(_id,isLive,name,questions){
    this._id = _id;
    this.isLive = isLive;
    this.name = name;
    this.questions = questions;

    var session = this;

    this.expand = function(){
        clientSession = session;
        questionsView();
    }

    this.view = function(){
        var card = $("<div>").attr("class","card")

        card.append($("<h3>").text(this.name));

        card.click(this.expand);
        return (card);
    }






}

function question(_id,question,author,date,upvotes,downvotes,comments){
    this._id = _id;
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
    var scoreBox;

    this.upArrowClick = function(){
        if(upvotes.indexOf(clientUser) < 0){
            upvotes.push(clientUser);
            if(downvotes.indexOf(clientUser) >=0 ){
                downvotes.splice(downvotes.indexOf(clientUser),1);
            }
        }else{
            upvotes.splice(upvotes.indexOf(clientUser) ,1);
        }
        upArrow.attr("src",(upvotes.includes(clientUser)?"img/upArrowVoted.svg":"img/upArrow.svg"));
        scoreBox.text("Score: "+this.score());
        
    }

    this.downArrowClick = function(){
        if(downvotes.indexOf(clientUser) < 0){
            downvotes.push(clientUser);
            if(upvotes.indexOf(clientUser) >=0 ){
                upvotes.splice(upvotes.indexOf(clientUser),1);
            }
        }else{
            downvotes.splice(downvotes.indexOf(clientUser,1));
        }
        downArrow.attr("src",(downvotes.includes(clientUser)?"img/downArrowVoted.svg":"img/downArrow.svg"));
        scoreBox.text("Score: "+this.score());
    }

    this.deleteQuestion = function(){
        clientQuestions.splice(clientQuestions.indexOf(question),1);
        $("#"+question._id).remove();
    }

    this.toggleComments = function(){
        showCommentList = ! showCommentList;
        commentList.toggle();
    }

    this.reply = function(){
    
        if(replyMessage.val().trim() != ""){
            question.comments.push(new comment(clientUser,replyMessage.val().trim()));
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
        card.attr("id",this._id);

        var table = $("<table>");
       
        if(clientUser == author || isProf){
            table.append($("<tr>")
                .append($("<td>"))
                .append($(`<td align="right" >`)
                    .append($(`<img height="30px" src="img/close.svg">`).click(this.deleteQuestion))));
        }
        
        var row = $("<tr>");
        upArrow = $(`<img id="down" height="50px">`);
        upArrow.attr("src",(upvotes.includes(clientUser)?"img/upArrowVoted.svg":"img/upArrow.svg"));
        upArrow.click(this.upArrowClick);
        row.append($("<td>").attr("width","70px").append(upArrow));
        row.append($(`<td><h4>` + this.question +`</h4></td>`));
        

        table.append(row);

        var row = $("<tr>");
        downArrow = $(`<img id="down" height="50px">`);
        downArrow.attr("src",(downvotes.includes(clientUser)?"img/downArrowVoted.svg":"img/downArrow.svg"));
        downArrow.click(this.downArrowClick);
        scoreBox = $("<div>").attr("class","col-md-12 col-lg-3").text("Score: "+this.score());
        row.append($("<td>").attr("width","70px").append(downArrow));
        row.append($("<td>").append($(`<div class="row">`)
                        .append($(`<div class="col-md-12 col-lg-3">User: ` + author +`</div>`))
                        .append(scoreBox)
                        .append(`<div class="col-md-12 col-lg-4">Posted: `+ this.date + `</div>`)
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
                $("#"+comment._id).remove();
            }
        
            
            let rowComment = $("<div>").attr("class","row comment").attr("id",comment._id);
            rowComment.append($("<div>").attr("class","col-md-12 col-lg-1 author").text(comment.author));
            if(clientUser == comment.author || isProf ){
                rowComment.append($("<div>").attr("class","col-md-12 col-lg-11").text(comment.message)
                .append($(`<img class="deleteComment" height="30px" src="img/close.svg">`).click(this.deleteComment)));
            }else{
                rowComment.append($("<div>").attr("class","col-md-12 col-lg-11").text(comment.message));
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

    this.addComment = function(comment){
        
        this.deleteComment = function(){
            comments.splice(comments.indexOf(comment),1);
            $("#"+comment._id).remove();
        }
    
        
        let rowComment = $("<div>").attr("class","row comment").attr("id",comment._id);
        rowComment.append($("<div>").attr("class","col-md-12 col-lg-1 author").text(comment.author));
        if(clientUser == comment.author || isProf ){
            rowComment.append($("<div>").attr("class","col-md-12 col-lg-11").text(comment.message)
            .append($(`<img class="deleteComment" height="30px" src="img/close.svg">`).click(this.deleteComment)));
        }else{
            rowComment.append($("<div>").attr("class","col-md-12 col-lg-11").text(comment.message));
        }

        replyForm.prepend(rowComment);
    }



}

function comment(_id,author,message,){
    this._id = _id;
    this.author = author;
    this.message = message;
}


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
            clientQuestions.push(new question(replyQuestion.val().trim(),clientUser,formatDate(new Date()),[],[],[]));
        }
        questionsView();
        return false;
    });
    
    $(".questions-list").append(
        $("<div>").attr("class","card")
            .append(questionForm)
            
    );
    
    let socket = io()

    socket.emit("getSession",clientSession._id,function(questions){
        clientQuestions = [];
        for(let q in questions){
            let newQuestion = new question(q._id,q.question,q.author,q.date,q.upvotes,q.downvotes,q.comments);
            clientQuestions.append(newQuestion);
        }
        clientQuestions.sort(function(question1,question2){
            return(question2.score() - question1.score());
        })
        clientQuestions.forEach(question => {
            $(".questions-list").append(question.view());
        });
    })
    
}


function sessionsView(){
    $(".questions-list").empty();
    $(".sessions-list").empty();

    let socket = io();
    
    socket.emit("loadClass",courseID,function(classinfo){
        sessions = []
        for (let i in classinfo.sessions){
            let newSession = new session(i._id,i.isLive,i.name,i.questions);
            sessions.append(newSession);
        }

        sessions.forEach(session =>{
            $(".sessions-list").append($(`<div class="col-md-12 col-lg-4">`).append(session.view()));
        })
    })
}

$(document).ready(function(){
    let socket = io();

    socket.on("addedQuestion",function(session_id,question){
        if(session_id == clientSession._id){
            newQuestion = new question(question._id,question.question,question.author,question.date,question.upvotes,question.downvotes,question.comments)
            clientQuestions.append(newQuestion);
            $(".questions-list").append(newQuestion);
        }
    });


    socket.on("addedComment",function(question_id,comment){
        
        question = clientQuestions.find(function(question){
            return question._id == question_id;
        })

        if(question){
            newComment = new comment(comment._id,comment.author,comment.message);
            question.comments.append(newComment);
            questions.addComment(newComment);

        }        
    })


    socket.on("deletedComment",function(question_id,comment){
        question = clientQuestions.find(function(question){
            return question._id == question_id;
        })

        if(question){
            question.comments.splice(question.comments.indexOf(comment),1);
            $("#"+comment._id).remove();
        }
    })

    socket.on("upvoted",function(question_id,user){
        question = clientQuestions.find(function(question){
            return question._id == question_id;
        })
        if(question){
            if(user == clientUser){
                question.upArrowClick();
            }else{
                if(question.upvotes.indexOf(user) < 0){
                    question.upvotes.push(user);
                    if(question.downvotes.indexOf(user) >=0 ){
                        question.downvotes.splice(downvotes.indexOf(user),1);
                    }
                }else{
                    question.upvotes.splice(upvotes.indexOf(user) ,1);
                }
            }

        }        
    })


    socket.on("downvoted",function(question_id,user){
        question = clientQuestions.find(function(question){
            return question._id == question_id;
        })
        if(question){
            if(user == clientUser){
                question.downArrowClick();
            }else{
                if(question.downvotes.indexOf(user) < 0){
                    question.downvotes.push(user);
                    if(question.upvotes.indexOf(user) >=0 ){
                        question.upvotes.splice(upvotes.indexOf(user),1);
                    }
                }else{
                    question.downvotes.splice(downvotes.indexOf(user,1));
                }
            }
        }        
    })

    socket.on("deletedQuestion",function(question_id){
        question = clientQuestions.find(function(question){
            return question._id == question_id;
        })
        clientQuestions.splice(clientQuestions.indexOf(question),1);

        $("#"+question_id).remove();
    })


});







