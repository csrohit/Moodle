
document.addEventListener('DOMContentLoaded', function () {
    console.log(window.location.href)


});


/*  DOM MANIPULATION */
function createUserElement(parent, element, id, cls) {
    element = document.createElement(element);

    if (id)
        element.id = id;
    if(cls){
        arr = element.className.split(' ');
        if (arr.indexOf(cls) == -1) {
            element.className += " " + cls;
        }
    }
    parent.appendChild(element)
    return element;
}
function insertText(parent, text) {
    var textNode = document.createTextNode(text);
    parent.appendChild(textNode);
}
function showErr(parent, status) {
    parent = document.getElementById(parent);
    parent.innerHTML = '';
    var modal = createUserElement(parent, 'div', 'modal');
    var errBox = createUserElement(modal, 'div', 'errBox','modal-content msg err_msg');
    var msg;
    switch (status) {
        case 400:
            msg = "Opps! input data seems to be invalid..";
            break;
        case 401:
            msg = "Opps! seems you don't have enough rights to access the requested data";
            break;
        case 404:
            msg = "Opps! could not locate resourse";
            break;
    }
    var msg = insertText(errBox, msg);
}
function showSucc(parent, msg) {
    parent = document.getElementById(parent);
    parent.innerHTML = '';
    var errBox = createUserElement(parent, 'div', 'errBox','modal-content msg success_msg');
    parent.id = 'modal';
     msg = insertText(errBox, msg);
}
window.addEventListener('click', function (e) {
    if (e.target == document.getElementById('modal')) {
        document.getElementById('modal').remove();
    }
})


/*  AJAX  */
function fetchUsers(rank) {
    document.getElementById('result').innerHTML = '';
    httpAsync('GET', '/users/getUsers?rank=' + rank, '', function (data, status) {
        switch (status) {
            case 401:
            case 400:
            case 404:
                {
                    showErr('result', status);
                    break;
                }
            case 200:
                {
                    if (IsJsonString(data)) {
                        data = JSON.parse(data);
                        if (data.length != 0) {
                            var table = createUserElement(document.getElementById('result'), 'table', 'user-Table');
                            var tr = createUserElement(table, 'tr');
                            var td = createUserElement(tr, 'th');
                            insertText(td, "Sr.");
                            td = createUserElement(tr, 'th');
                            insertText(td, "Username");
                            for (var i = 0; i < data.length; i++) {
                                tr = createUserElement(table, 'tr');
                                td = createUserElement(tr, 'td');
                                insertText(td, i + 1 + '.');
                                td = createUserElement(tr, 'td');
                                var link = "<a href='/users/user/" + data[i].profile_id + "' >" + data[i].username + "</a>";
                                td.innerHTML = link;
                            }
                        } 
                    } else
                        window.location = "/users/login";
                    break;
                }
        }
    })
}
var addSubject = {
    fetch: function () {
        // httpAsync('Get', '/resources/ajax/subject.txt', '', function (data, status) {
        //     var parent = document.getElementById('result');
        //     parent.innerHTML = '';
        //     parent.innerHTML = data;
        // });
        var parent = document.getElementById('result');
            parent.innerHTML = '';
            var d = new Date();
            parent.innerHTML = d.toString();
        var f = new Date('Tue Jan 09 2018 11:29:48');
        parent.innerHTML +="<br>"+ f.toString();
        if(d.toDateString() === f.toDateString())
        {
            console.log("hghjhgjgfhg");
        }
    },
    add: function () {
        var form = document.querySelector('form');
        var da = '',
            i = 0;
        while (i < form.elements.length) {
            if (i == 0)
                da += form.elements[i].name + '=' + form.elements[i].value;
            else
                da += "&" + form.elements[i].name + '=' + form.elements[i].value;
            i++;
        }
        httpAsync('POST', '/users/subjects', da, function (response, status) {
        })
    }
}
var addUser = {
    fetchTemplate: function () {
        httpAsync('GET','/resources/ajax/register.txt','', function (data, status) {
            document.getElementById('result').innerHTML = '';
            document.getElementById('result').innerHTML = data;
            checkRank();
        });
    },
    add: function () {
        console.log(document.querySelector('form').elements)
    }
}
var password = {
    fetch: function () {
        httpAsync('GET','/resources/ajax/password.txt','', function (data, status) {
            document.getElementById('result').innerHTML = '';
            document.getElementById('result').innerHTML = data;/*
            if(user.rank==0){
                document.getElementById('changePassword').setAttribute('action','/users/pwd');
            }*/
        });

    },
    changePassword: function () {
        httpAsync('POST', '/users/pwd', fData('changePassword'), function (response,status) {
            document.getElementById('modal').innerHTML="";
            var box = createUserElement(document.getElementById('modal'), 'div', 'modal-success', 'modal-content msg success_msg');
            box.innerHTML = "<p>Password changed successfully.</p>";
        })

    },
    reset:function(username){
        var data =fData('changePassword');
        data+='&username='+username;
        httpAsync('POST','/users/pwd',data,function(response,status){
             document.getElementById('modal').innerHTML="";
            var box = createUserElement(document.getElementById('modal'), 'div', 'modal-success','modal-content msg success_msg');
            box.innerHTML = "<p>"+response+"</p>";
        });
    }
}
var profile = {
    fetch : function(){
        alert("This feature is under testing....");
            
/*        var name = document.getElementById('name');
        console.log(name);
        name.removeAttribute('disabled');
                
        var editProfile = document.getElementById('edit_profile'),
            resetPassword = document.getElementById('reset_password'),
            parent = editProfile.parentElement;
        editProfile.style.display = 'none';
        resetPassword.style.display = 'none';
        var cancel = createUserElement(parent,'button','cancel'),
        submit = createUserElement(parent,'button','submit');
        cancel.innerHTML = "Cancel";
        submit.innerHTML = "submit";
        addClass('cancel','white');
        addClass('submit','white');
        cancel.style.color = 'red';
        submit.style.color = '#227ce6';
        cancel.setAttribute('onclick','profile.cancel()');*/
    },
    cancel: function(){
        document.getElementById('cancel').parentElement.removeChild(document.getElementById('cancel'));
        document.getElementById('submit').parentElement.removeChild(document.getElementById('submit'));
        document.getElementById('edit_profile').style.display = 'inline-block';
        document.getElementById('reset_password').style.display = 'inline-block';
    }
}
var notice = {
    fetch : function(){
        httpAsync('GET','/resources/ajax/notice.txt','',function(response, status){
                var parent = document.getElementById('result');
                parent.innerHTML = '';
                parent.innerHTML = response;
        });
    },
    post : function(){
        var data= fData('notice-form');
        httpAsync('POST','/users/notice',data,function(response,status){
            var parent = document.getElementById('result');
            var card = createUserElement(parent, 'div','','card');
            let title = createUserElement(card,'div','','title')
            card.innerHTML = response;
            
        });
    },
    list:function(){
        httpAsync('Get','/users/ajax?op=notice','',function(response,status){
                document.getElementById('notice-board').innerHTML= response;
        })
    }
}
var comments = {
    show: (id)=>{
        var footer = document.getElementById('card[' + id + ']').parentNode,
            card = footer.parentNode;
            
        httpAsync('GET','/users/ajax?data=comments&id='+card.id,'',(data, status)=>{
            console.log(data);
            if(IsJsonString(data)){
                data = JSON.parse(data);
                var comment;
                if(data.length!=0){
                    for(var i=0; i<data.length; i++){
                        console.log(data.length);
                        comment = document.createElement('div');
                        comment.innerHTML = data[i].author_name + data[i].txt;
                        footer.appendChild(comment);
                    }
                }
                else{
                    console.log("No comments");
                }
            }
            else{
                console.log("Invalid response");
            }
                
            })
       },
       add: (id)=>{

           var comment_body = document.getElementById('comment_body').value,
               card = document.getElementById('card[' + id + ']').parentNode.parentNode;
           httpAsync('POST', '/users/ajax?action=add_comment&id=' + card.id, 'comment_body='+comment_body, (response, status) => {
               console.log(response);
           })
       }
}

/* HEL*/
function fData(id) {
    var form = document.getElementById(id);
    var da = '',
        i = 0;
    while (i < form.elements.length - 1) {
        if (i == 0)
            da += form.elements[i].name + '=' + form.elements[i].value;
        else
            da += "&" + form.elements[i].name + '=' + form.elements[i].value;
        i++;
    }
    return da;
} /* returns a key value pairs string of form data */
function httpAsync(method, theUrl, data, callback) {
    var req = new XMLHttpRequest();
    req.onreadystatechange = function () {
        if (req.readyState == 4){
            switch(req.status){
                case 200:
                    callback(req.responseText, req.status);
                    break;/*
                case 308:
                    window.location = '/users/logout';
                    break;*/
                default:
                    showErr('result', req.status);                    
            }        
        }
    }
    req.open(method, theUrl, true);
    if (method.toLowerCase() == 'post') {
        req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        req.send(data);
    } else req.send();
}



/*  ABSTRACT FUNCTIONS  */
function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}
function checkRank() {
    var role = document.querySelector('input[name="rank"]:checked').value;
    var teacher_field = document.getElementsByClassName('teacher');
    var student_field = document.getElementsByClassName('student');
    if (role == '0') {
        teacher_field[0].style.display = 'none';
        student_field[0].style.display = 'block';
        student_field[1].style.display = 'block';
        student_field[2].style.display = 'block';
    } else {
        student_field[0].style.display = 'none';
        student_field[1].style.display = 'none';
        student_field[2].style.display = 'none';
        teacher_field[0].style.display = 'block';
    }
}
function addClass(element, cls) {
    element = document.getElementById(element);
    arr = element.className.split(' ');
    if (arr.indexOf(cls) == -1) {
        element.className += " " + cls;
    }
}
function toggleClass(element, cls) {
    element = document.getElementById(element);
    var arr = element.className.split(' ');
    if (arr.indexOf(cls) == -1) {
        element.className += " " + cls;
    } else {
        arr[arr.indexOf(cls)] = "";
        element.className = arr.join('');
    }
}
