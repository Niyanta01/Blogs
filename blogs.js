var users_obj = {};
var comments_obj = {};
var pdata = localStorage.getItem("posts");
var udata = localStorage.getItem("user");
var cdata = localStorage.getItem("comments");


if (!pdata && !udata && !cdata) {

    jQuery.ajax({
        url: "https://jsonplaceholder.typicode.com/posts",
        success: function (data) {
             post_data = localStorage.setItem("posts", JSON.stringify(data));
        },
        error: function (reject) {
            console.log(reject);
        }
    });

    jQuery.ajax({
        type: "GET",
        url: "https://jsonplaceholder.typicode.com/users",
        success: function (data) {
             user_data = localStorage.setItem("user", JSON.stringify(data));
        },
        error: function (reject) {
            console.log(reject);
        }
    });

    jQuery.ajax({
        type: "GET",
        url: "https://jsonplaceholder.typicode.com/comments",
        success: function (data) {
             comments_data = localStorage.setItem("comments", JSON.stringify(data));
        },
        error: function (reject) {
            console.log(reject);
        }
    });

}

jQuery("#get_data").click(function () {
     pdata = localStorage.getItem("posts");
     udata = localStorage.getItem("user");
     cdata = localStorage.getItem("comments");
    if (pdata && udata && cdata) {
       
        getdataposthelper();

    }
});



function getdataposthelper() {

    if (localStorage.getItem("posts") != null && localStorage.getItem("user") != null && localStorage.getItem("comments") != null) {
        
        users_from_ls = JSON.parse(localStorage.getItem("user"));
        posts_users_data = JSON.parse(localStorage.getItem("posts"));
        comments_ls = JSON.parse(localStorage.getItem("comments"));

        for (var i = 0; i < users_from_ls.length; i++) {

            var data = {
                "name": users_from_ls[i].name
            };
            users_obj[users_from_ls[i].id] = data;
        }


        for (var j = 0; j < posts_users_data.length; j++) {
                var input = users_obj[posts_users_data[j].userId];
                var post_id_data = {
                    postid: posts_users_data[j].id,
                    title: posts_users_data[j].title
                };
                if (Object.keys(input).length == 1) {
                    var arr_title = [post_id_data];
                    input['title'] = arr_title;

                    
                } else {
                    var arr_title = input['title'];
                    arr_title.push(post_id_data);
                    input['title'] = arr_title;
                }
                users_obj[posts_users_data[j].userId] = input;
        }
    }
    display(users_obj);
}

function display(a) {

    var cmt_cont = document.querySelector(".main-post-div-class");

    if (cmt_cont != null) {
        $(".main-post-div-class").remove();
    }
    if (document.getElementById("main_div") != null) {
        document.getElementById("main_div").remove();
    }
    var div_post = document.createElement("div");
    div_post.id = "main_div";

    var button_create_post = document.createElement("button");
    var button_create_post_t = document.createTextNode("Create Post");
    button_create_post.style.backgroundColor = '#008CBA';
    button_create_post.style.fontSize = '15px';
    button_create_post.style.borderRadius = '8px';
    button_create_post.onclick = createpost;

    button_create_post.appendChild(button_create_post_t);
    div_post.appendChild(button_create_post);

    document.body.appendChild(div_post);

    for (var z = 1; z < Object.keys(a).length + 1; z++) {

        var div = document.createElement("div");
        div.setAttribute("class", "main-post-div-class");

        var h3 = document.createElement("h3");
        h3.innerHTML = a[z]["name"];
        div.appendChild(h3);

        var count = 0;
        for (var m in a[z]["title"]) {

            p = document.createElement("div");

            var p_id = document.createElement("p");
            let br = document.createElement("br");

            p_id.innerHTML = a[z]["title"][m]["postid"];
            p.innerHTML = a[z]["title"][m]["title"];

            var id_p = p_id.innerHTML;

            p.setAttribute("id", id_p);
            div.appendChild(p);

            var button_delete = document.createElement("button");
            var button_delete_t = document.createTextNode("Delete");
            button_delete.style.backgroundColor = '#008CBA';
            button_delete.style.fontSize = '15px';
            button_delete.style.borderRadius = '8px';
            button_delete.id = "deletepost" + id_p;
            button_delete.onclick = deletepost;

            var button_comments = document.createElement("button");
            var button_comments_text = document.createTextNode("View comments");
            button_comments.style.backgroundColor = '#008CBA';
            button_comments.style.fontSize = '15px';
            button_comments.style.borderRadius = '8px';
            button_comments.id = id_p;
            button_comments.onclick = getcommentsbypid;

            var button_comment_edit = document.createElement("button");
            var button_comment_edit_t = document.createTextNode("create comments");
            button_comment_edit.id = "edit_cmt_btn";
            button_comment_edit.style.backgroundColor = '#008CBA';
            button_comment_edit.style.fontSize = '15px';
            button_comment_edit.style.borderRadius = '8px';
            button_comment_edit.id = "createComment" + id_p;
            button_comment_edit.onclick = createcommentsbypid;

            p.appendChild(button_comments);
            button_comments.appendChild(button_comments_text);

            p.appendChild(button_comment_edit);
            button_comment_edit.appendChild(button_comment_edit_t);

            p.appendChild(button_delete);
            button_delete.appendChild(button_delete_t);

            div.appendChild(br);

            count++;
        }
        document.body.appendChild(div);
    }
}

function getcommentsbypid() {

    var maindiv = document.getElementById(this.id);
    var cmt_cont = maindiv.querySelector(".cmt-view-class");

    if (cmt_cont) {
        $(".cmt-view-class").remove();
        return false;
    } else {
        getcommentsbypidhelper(this.id);
    }

}

function createcommentsbypid() {

    var maindiv = document.getElementById(this.id.slice(13));
    var cmt_cont = maindiv.querySelector(".cmt-create-class");

    if (cmt_cont) {
        $(".cmt-create-class").remove();
        return false;
    } else {

        let pid = this.id;
        pid = pid.slice(13);

        var insertDiv = document.getElementById(pid);

        var c_div = document.createElement("div");
        c_div.id = "add_comments";
        c_div.setAttribute("class", "cmt-create-class");

        var cmt_insert = document.createElement("input");
        cmt_insert.type = "text";
        cmt_insert.id = "insert_comment";
        cmt_insert.name = "insert_comment";
        cmt_insert.placeholder="insert comments here..."

        var cmt_name = document.createElement("input");
        cmt_name.type = "text";
        cmt_name.id = "insert_name";
        cmt_name.name = "insert_name";
        cmt_name.placeholder ="please enter your name here..."

        var cmt_email = document.createElement("input");
        cmt_email.type = "text";
        cmt_email.id = "insert_email";
        cmt_email.name = "insert_email";
        cmt_email.placeholder ="please enter your email here..."

        var submit_cm = document.createElement("button");
        var sub_text = document.createTextNode("submit");
        submit_cm.id = "Submit" + pid;
        submit_cm.appendChild(sub_text);
        submit_cm.onclick = addCommentTodata;

        insertDiv.appendChild(c_div);
        c_div.appendChild(cmt_insert);
        c_div.appendChild(cmt_name);
        c_div.appendChild(cmt_email);
        c_div.appendChild(submit_cm);
    }
}

function getcommentsbypidhelper(value_id) {


    var maindiv = document.getElementById(value_id);
    var cmt_cont = maindiv.querySelector(".cmt-view-class");

    $(".cmt-view-class").remove();

    let pid = value_id;

    let databypid = comments_ls.filter(value => {
        return value.postId == pid
    });
    var cmt_div = document.createElement("div");

    cmt_div.setAttribute("class", "cmt-view-class");
    var br = document.createElement("br");

    var like_new =[] ;
    if(localStorage.getItem("like_check") != null){
        like_new = JSON.parse(localStorage.getItem("like_check"));
    }

    for (var h = 0; h < databypid.length; h++) {

        var cmt_div2 = document.createElement("div");
        cmt_div2.innerHTML = databypid[h].body;
        cmt_div.appendChild(cmt_div2);

        let cmid = "c" + databypid[h].id;

        let button_delete_comm = document.createElement("button");
        let button_delete_t_comm = document.createTextNode("delete");
        cmt_div2.appendChild(button_delete_comm);
        button_delete_comm.appendChild(button_delete_t_comm);
        button_delete_comm.id = cmid;
        button_delete_comm.value = "p" + databypid[h].postId;
        button_delete_comm.onclick = deletecmtbyid;
        button_delete_comm.style.backgroundColor = '#008CBA';
        button_delete_comm.style.fontSize = '15px';
        button_delete_comm.style.borderRadius = '8px';


        var button_like = document.createElement("button");
        var button_like_t; 

        if (!like_new.includes(databypid[h].id.toString())) {
            button_like_t = document.createTextNode("like");
            button_like.style.backgroundColor = '#008CBA';
          
        } else {
            button_like_t = document.createTextNode("liked");
            button_like.style.backgroundColor = '#FFB6C1';
        }

        cmt_div2.appendChild(button_like);
        button_like.appendChild(button_like_t);
        button_like.id = "l" + databypid[h].id;
        button_like.onclick = likebutton;
        button_like.style.fontSize = '15px';
        button_like.style.borderRadius = '8px';

        cmt_div2.style.border = '1px solid black';

    }
    var all_div = document.querySelectorAll("div");

    var y = document.getElementById(pid);

    y.appendChild(cmt_div);
}

function deletecmtbyid() {

    let cvalue = this.value;
    cvalue = cvalue.slice(1);

    let cid = this.id;
    cid = cid.slice(1);

    let databycid = comments_ls.filter(value => {
        return value.id != cid
    });

    comments_ls = databycid;

    console.log(databycid);
    localStorage.setItem("comments", JSON.stringify(comments_ls));

    getcommentsbypidhelper(cvalue);

}

function likebutton() {
 
    let likeid = this.id;
    likeid = likeid.slice(1);
    var lid = document.getElementById(this.id);
    if (lid.innerHTML == "liked") {
        lid.innerHTML = "like";
        lid.style.backgroundColor = '#008CBA';
        lid.style.fontSize = '15px';
        lid.style.borderRadius = '8px';
    } else {
        lid.innerHTML = "liked";
        lid.style.backgroundColor = '#FFB6C1';
        lid.style.fontSize = '15px';
        lid.style.borderRadius = '8px';

    }
    var like_new =[] ;
    if(localStorage.getItem("like_check") != null){
        like_new = JSON.parse(localStorage.getItem("like_check"));
    }
    if(like_new.includes(likeid)){
        like_new.pop(likeid);
    }
    else{
        like_new.push(likeid);
    }
    
    localStorage.setItem("like_check", JSON.stringify(like_new));


}

function addCommentTodata() {

    var cm_data_body = document.getElementById("insert_comment").value;
    var cm_data_name = document.getElementById("insert_name").value;
    var cm_data_email = document.getElementById("insert_email").value;
    console.log(this.id + " comment =  " + cm_data_body);

    var last_cmt = comments_ls[comments_ls.length - 1];

    var data_cm_insert = {
        "postId": this.id.slice(6),
        "id": last_cmt.id + 1,
        "name": cm_data_name,
        "email": cm_data_email,
        "body": cm_data_body
    };

    comments_ls.push(data_cm_insert);

    localStorage.setItem("comments", JSON.stringify(comments_ls));

    getcommentsbypidhelper(this.id.slice(6));

    var maindiv = document.getElementById(this.id.slice(6));
    var cmt_cont = maindiv.querySelector(".cmt-create-class");

    if (cmt_cont) {
        $(".cmt-create-class").remove();
        return false;
    }
}

function deletepost() {

    let pidData = this.id.slice(10);

    let commentdatabypid = comments_ls.filter(value => {
        return value.postId != pidData
    });

    let postdatabypid = posts_users_data.filter(value => {
        return value.id != pidData
    });

    localStorage.setItem("comments", JSON.stringify(commentdatabypid));
    localStorage.setItem("posts", JSON.stringify(postdatabypid));

    getdataposthelper();
}

function createpost() {

    var maindiv = document.getElementById("main_div");
    var cmt_cont = maindiv.querySelector(".post-create-class");

    if (cmt_cont) {
        $(".post-create-class").remove();
        return false;
    } else {


        var insertDiv = document.getElementById("main_div");
     
        var p_div = document.createElement("div");
        p_div.id = "add_post";
        p_div.setAttribute("class", "post-create-class");

        var post_insert = document.createElement("input");
        post_insert.type = "text";
        post_insert.id = "insert_userid";
        post_insert.name = "insert_userid";
        post_insert.placeholder = "enter your userID here..."


        var post_body = document.createElement("input");
        post_body.type = "text";
        post_body.id = "insert_body";
        post_body.name = "insert_body";
        post_body.placeholder="enter your post data here..."
     
        var post_title = document.createElement("input");
        post_title.type = "text";
        post_title.id = "insert_title";
        post_title.name = "insert_title";
        post_title.placeholder ="enter title for your post here.."

        var submit_cm = document.createElement("button");
        var sub_text = document.createTextNode("submit Post");
        submit_cm.id = "Submit_post";
        submit_cm.appendChild(sub_text);
        submit_cm.onclick = addPostTodata;

        insertDiv.appendChild(p_div);
        p_div.appendChild(post_insert);
        p_div.appendChild(post_body);
        p_div.appendChild(post_title);
        p_div.appendChild(submit_cm);

    }
}

function addPostTodata() {

    console.log(this.id);

    var post_data_userid = document.getElementById("insert_userid").value;
    var post_data_body = document.getElementById("insert_body").value;
    var post_data_title = document.getElementById("insert_title").value;
   
    var last_post = posts_users_data[posts_users_data.length - 1];
    
    var data_cm_insert = {
        "userId": post_data_userid,
        "id": last_post.id + 1,
        "title": post_data_title,
        "body": post_data_body
    };

    posts_users_data.push(data_cm_insert);
   
    localStorage.setItem("posts", JSON.stringify(posts_users_data));

    getdataposthelper();

    var maindiv = document.getElementById("main_div");
    var cmt_cont = maindiv.querySelector(".post-create-class");

    if (cmt_cont) {
        $(".post-create-class").remove();
        return false;
    }
}