

// This is client side
const socket = io();

const chatform = document.getElementById('input_form');
const chatdiv = document.getElementById('cont'); 
const submitbutton=document.getElementById("submit_btn");
const audio = new Audio('./audio/ping.mp3');

// All the messages comming to the client can be handled from ths side

function createMessage(s,cl,username)
{
    var ele = document.createElement("div");
    var cur_date = (new Date()).toDateString();
    var cur_time = (new Date()).toLocaleTimeString();
    var newStr = cur_time.substring(0,6 - 1) + cur_time.substring(8, cur_time.length);



    ele.innerHTML=`<div class="upper">
    <span id="username">${username}</span>
    <span id="time">${newStr}</span>
</div>

<div class="lower"> ${s}</div>`;
    ele.classList.add(cl);

    if(cl=="left")
    audio.play();

    return ele;
   
}

 socket.on('message',message=>{
    // document.write(message);

    var ele = createMessage(message.msg,"left",message.username);
    console.log(message); 
    document.getElementById("cont").appendChild(ele);
    chatdiv.scrollTop = chatdiv.scrollHeight;

    
});

socket.on('self',message=>{
    // document.write(message);

    var ele = createMessage(message.msg,"right",message.username);
    console.log(message); 
    document.getElementById("cont").appendChild(ele);
    chatdiv.scrollTop = chatdiv.scrollHeight;


    
});

chatform.addEventListener('submit',(e)=>{
    e.preventDefault();

    

    const msg=e.target.elements.chat.value;

    console.log(msg  + "by " + socket.id);



    socket.emit('chatMessage',{msg:msg , id:socket.id });
    e.target.elements.chat.value="";
    e.target.elements.chat.focus();
});






