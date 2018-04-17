socket = io();

courseID = null;



// question1 = [new question("What is life?","Kourosh","April 16th 2017",["Jake"],[client.email.split("@")[0]],
//     [new comment("Hello123sasasasassaasassa","I like you. Don't hurt me"),
//     new comment("Jerry","I like you."),
//     new comment("Swagmaster","Swag is All i care about"),
//     ]),
//     new question("This is another question I AM FOJAFOIJEOIHJF:OAHC:HDS:IHF","Kouroshb26","April 7th 2017",["Kouroshb26"],[],
//     [new comment("Jerry","I don't like you."),
//     new comment("Jebrone","Wow such nice comments."),
//     ]),
//     new question("asfdhadfjhkanothdskjfdoaijfoewjrfoejrdsafdsa FOJAFOIJEOIHJF:OAHC:HDS:IHF","Kouroshb26","April 7th 2017",["Kouroshb26"],[],
//     [new comment("Jerry","I don't like you."),
//     new comment("Jebrone","Wow such nice comments."),
//     ]),
// ];

// question2 =[new question("This is the second session","Kourosh","April 16th 2017",["Jake"],[client.email.split("@")[0]],
// [new comment("Hello123sasasasassaasassa","I like you. Don't hurt me"),
// new comment("Jerry","I like you."),
// new comment("Swagmaster","Swag is All i care about"),
// ])]

// sessions = [new session(123,true,"Session1",question1),new session(123,true,"Session5",question2)]
client = null;
sessions = [];
clientQuestions = [];
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
        if(isLive){
            card.addClass("live");
        }
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
    var replyForm;

    this.upArrowClick = function(){
        let position = 0;
        if(upArrow.attr("src") == "img/upArrow.svg"){
            position = 1;
        }
        console.log("position: "+position);
        socket.emit("vote",courseID._id,question._id,position);
    }

    this.downArrowClick = function(){
        let position = 0;
        if(downArrow.attr("src") == "img/downArrow.svg"){
            position = -1;
        }
        console.log("position: "+position);
        socket.emit("vote",courseID._id,question._id,position);

    }
    this.vote = function(user,position){
        console.log("Position",position);
        let filterFunction = function(aUser){
            aUser != user;
        } 
        this.downvotes = this.downvotes.filter(filterFunction);
        this.upvotes = this.upvotes.filter(filterFunction);

        if(position == 1){
            this.upvotes.push(user);
        }else if(position == -1){
            this.downvotes.push(user);
        }

        console.log(this.upvotes);
        console.log(this.downvotes);
        console.log(this.score());
        upArrow.attr("src",(this.upvotes.includes(client._id)?"img/upArrowVoted.svg":"img/upArrow.svg"));
        downArrow.attr("src",(this.downvotes.includes(client._id)?"img/downArrowVoted.svg":"img/downArrow.svg"));
        scoreBox.text("Score: "+this.score());
    }

    this.deleteQuestion = function(){
        socket.emit("deleteQuestion",courseID._id,clientSession._id,question._id);
    }

    this.toggleComments = function(){
        showCommentList = ! showCommentList;
        commentList.toggle();
    }

    this.reply = function(){
    
        if(replyMessage.val().trim() != ""){

            let newComment = new comment(null,client.email.split("@")[0],replyMessage.val().trim());
            replyMessage.val("");
            socket.emit("addComment",courseID._id,question._id,newComment);
        }
        return false;
    }

    this.score = function(){
        return(this.upvotes.length - this.downvotes.length);
    }

    this.view = function view(){
        var card = $("<div>")
        card.attr("class","card");
        card.attr("id",this._id);

        var table = $("<table>");
       
        if(client.email.split("@")[0] == author || client.isProfessor){
            table.append($("<tr>")
                .append($("<td>"))
                .append($(`<td align="right" >`)
                    .append($(`<img height="30px" src="img/close.svg">`).click(this.deleteQuestion))));
        }
        
        var row = $("<tr>");
        upArrow = $(`<img id="down" height="50px">`);
        upArrow.attr("src",(upvotes.includes(client._id)?"img/upArrowVoted.svg":"img/upArrow.svg"));
        upArrow.click(this.upArrowClick);
        row.append($("<td>").attr("width","70px").append(upArrow));
        row.append($(`<td><h4>` + this.question +`</h4></td>`));
        

        table.append(row);

        var row = $("<tr>");
        downArrow = $(`<img id="down" height="50px">`);
        downArrow.attr("src",(downvotes.includes(client._id)?"img/downArrowVoted.svg":"img/downArrow.svg"));
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

                socket.emit("deleteComment",courseID._id,question._id,comment);
            }
        
            
            let rowComment = $("<div>").attr("class","row comment").attr("id",comment._id);
            rowComment.append($("<div>").attr("class","col-md-12 col-lg-1 author").text(comment.author));
            if(client.email.split("@")[0] == comment.author || client.isProfessor ){
                rowComment.append($("<div>").attr("class","col-md-12 col-lg-11").text(comment.message)
                .append($(`<img class="deleteComment" height="30px" src="img/close.svg">`).click(this.deleteComment)));
            }else{
                rowComment.append($("<div>").attr("class","col-md-12 col-lg-11").text(comment.message));
            }

            commentList.append(rowComment);

        });

        replyForm = $("<form>").attr("action","");
        
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

            socket.emit("deleteComment",courseID._id,question._id,comment);
        }
    
        
        let rowComment = $("<div>").attr("class","row comment").attr("id",comment._id);
        rowComment.append($("<div>").attr("class","col-md-12 col-lg-1 author").text(comment.author));
        if(client.email.split("@")[0] == comment.author || client.isProfessor ){
            rowComment.append($("<div>").attr("class","col-md-12 col-lg-11").text(comment.message)
            .append($(`<img class="deleteComment" height="30px" src="img/close.svg">`).click(this.deleteComment)));
        }else{
            rowComment.append($("<div>").attr("class","col-md-12 col-lg-11").text(comment.message));
        }

        replyForm.before(rowComment);
    }



}

function comment(_id,author,message){
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
    checkBox.attr("type","checkbox").attr("id","isLive");
    
  
    toggleLive = function(){
        socket.emit("toggleSession",courseID._id,clientSession._id,this.checked);
    }

    if(clientSession.isLive){
        checkBox.prop('checked', true);
        $(".questions-list").addClass("live");
    }

    checkBox.click(toggleLive);
    if(client.isProfessor){
        $(".questions-list").append($("<div>").attr("class","row navigation")
            .append($(`<div class="col-6">`)
                .append($(`<button class="btn btn-dark btn-sm">Back</button>`).click(sessionsView)))
            .append($(`<div class="col-6">`)
                .append($("<label>").attr("class","switch").append(checkBox)
                    .append($("<span>").attr("class", "slider round"))
                )
            )
        );
    }else{
        $(".questions-list").append($("<div").attr("class","row navigation")
            .append($(`<div class="col-6">`)
                .append($(`<button class="btn btn-dark btn-sm">Back</button>`).click(sessionsView))));
    }

    
    var questionForm = $("<form>").attr("action","");
    var replyQuestion = $("<input>");
    replyQuestion.attr("placeholder","Ask a new question!");
    questionForm.append(replyQuestion);
    questionForm.append($(`<button class="btn btn-dark btn-sm">New Question</button>`));
    
    
    questionForm.submit(function(){
        if(replyQuestion.val().trim() != ""){


            let newQuestion = new question(null,replyQuestion.val().trim(),client.email.split("@")[0],formatDate(new Date()),[],[],[]);
            replyQuestion.val("");
            socket.emit("addQuestion",courseID._id,clientSession._id,newQuestion);   
        }
        return false;
    });
    
    $(".questions-list").append(
        $("<div>").attr("class","card")
            .append(questionForm)
            
    );
    


    socket.emit("getSession",clientSession._id,function(questions){
        clientQuestions = [];
        for(let q of questions){
            let newQuestion = new question(q._id,q.question,q.author,q.date,q.upvotes,q.downvotes,q.comments);
            console.log(q);
            clientQuestions.push(newQuestion);
        }
        clientQuestions.sort(function(question1,question2){
            return(question2.score() - question1.score());
        })
        clientQuestions.forEach(question => {
            $(".questions-list").append(question.view());
        });
    })
    

}


function sessionsView(regcode){
    $(".questions-list").empty();
    $(".sessions-list").empty();
    $(".questions-list").removeClass("live");

    let savedregcode;
    if(typeof regcode === 'string'){
        savedregcode = regcode;
    }else{
        savedregcode = courseID.regcode;
    }

    $(".sessions-list").append($(`<div class="col-12 navigation">`)
        .append($("<button>").attr("class","btn btn-dark btn-sm")
                            .text("Add Session")
                            .attr("type","button")
                            .attr("data-toggle","modal")
                            .attr("data-target","#add-session-modal")));

    $(".sessions-list").append($(`
    <div class="modal fade" id="add-session-modal">
        <div class="modal-dialog h-100 d-flex flex-column justify-content-center my-0">

            <div class="modal-content">

                <div class="modal-header">
                <h3 class="modal-title">Make New Session</h3>
                </div>

                <div class="modal-body">
                <div>
                    <p>Please Enter Session Name</p>
                    <input class="form-control" id="session-name" placeholder="eg. Session #1">
                </div>
                <div>
                    <p>Make session live?</p>
                    <select class="form-control" id="session-isLive" name="semesters" form="semesterForm">
                    <option value="true">true</option>
                    <option value="false">false</option>
                    </select>
                </div>
                </div>

                <div class="modal-footer">
                <button type="button" id="session-submit-button" class="btn btn-blue">Submit</button>
                <button type="button" id="session-cancel-button" class="btn btn-blue" data-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>`));

    $("#session-submit-button").click(function(){
        let newSession = new session(null,$("#session-isLive").val(),$('#session-name').val(),[]);
        socket.emit("addSession",courseID._id,session,function(state){
            if(state ==="succes"){

            }else{

            }
        });
 
    })
    socket.emit("loadClass",savedregcode,function(userinfo,classinfo){
        client = userinfo;
        courseID = classinfo;
        sessions = [];

        for (let i of classinfo.sessions){
            let newSession = new session(i._id,i.isLive,i.name,i.questions);
            sessions.push(newSession);
        }

        sessions.forEach(session =>{
            $(".sessions-list").append($(`<div class="col-md-12 col-lg-4">`).append(session.view()));
        })
    })
}

$(document).ready(function(){


    socket.on("addedQuestion",function(session_id,addQuestion){
        console.log(addQuestion._id);
        if(session_id == clientSession._id){
            let newQuestion = new question(addQuestion._id,addQuestion.question,addQuestion.author,addQuestion.date,addQuestion.upvotes,addQuestion.downvotes,addQuestion.comments)
            clientQuestions.push(newQuestion);
            $(".questions-list").append(newQuestion.view());
        }
    });


    socket.on("addedComment",function(question_id,addcomment){
        
        var question = clientQuestions.find(function(question){
            return question._id == question_id;
        })

        if(question){
            newComment = new comment(addcomment._id,addcomment.author,addcomment.message);
            question.comments.push(newComment);
            question.addComment(newComment);

        }        
    })


    socket.on("deletedComment",function(question_id,comment){
        var question = clientQuestions.find(function(question){
            return question._id == question_id;
        })

        if(question){
            question.comments.splice(question.comments.indexOf(comment),1);
            $("#"+comment._id).remove();
        }
    })

    socket.on("voted",function(question_id,user,position){
        var question = clientQuestions.find(function(question){
            return question._id == question_id;
        })

        if(question){
            question.vote(user,position);
        }        
    })


    socket.on("deletedQuestion",function(session_id,question_id){
        if(session_id == clientSession._id){
            var question = clientQuestions.find(function(question){
                return question._id == question_id;
            })
            clientQuestions.splice(clientQuestions.indexOf(question),1);
            $("#"+question_id).remove();

        }

    })

    socket.on("toggledSession",function(session_id,bool){
        if(clientSession._id = session_id){
            clientSession.isLive = bool;
            $("#isLive").prop('checked', bool);
        }
        if(bool){
            $(".questions-list").addClass("live");
        }else{
            $(".questions-list").removeClass("live");
        }

    });
    sessionsView("RW91C3");

});


//Impelement add session

