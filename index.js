// To use express Getting express module
const { Socket } = require("engine.io");
const express = require("express");
const { createServer } = require("http");
// module converted to app
const app = express();
const http = require("http");
const { type } = require("os");
// Importing path module
const path = require("path");
const { emit } = require("process");

// Set port to 80
const port = 80 || process.env.PORT;

// Setting view engin to ejs for serving static files
app.set("view engine", "ejs");

// Set the path of views folder 
app.set("views", path.join(__dirname, "views"));

// Middleware to encode url
app.use(express.urlencoded())

app.use(express.static("public"));
const server = http.createServer(app);
const socketio = require('socket.io');

// The basic funda is Socket is the main server and 
// io is the instance of that server

const io = socketio(server);

// map to store socket id ,  name as a pair
const userlist = new Map();


var username="Myname";
app.get("/", (req, res) => {

    res.render("landing");
});


app.get("/chat",(req,res)=>{
    username= req.query.name;
    res.render("chatpage");
    console.log(username.toUpperCase()  + " joined the chat");
});



io.on('connection', socket => {

    
    console.log("A user" + username.toUpperCase() +" Connection made........");


    // This is one way to send message 
    // setTimeout(function(){
    // socket.send("This is my first mesaage from socket sent after 2 sec");
    // },2000);

    // The another way to send message is using emit
    // Emit will send the message on a particular type
    // we can make aou custom events in emit we can use any word other than message in emit
    // but we have to catch on the client side with the same name

    setTimeout(function () {
        // To a single client
        userlist.set(socket.id,username);
        socket.emit('message', { msg:("Hello " + username.toUpperCase() + " Welcome to the vchat"),username:username});
    }, 2000);

    // To all clients except self
    socket.broadcast.emit('message', { msg:(username.toUpperCase() +" has joined a chat"),username:username });
    console.log(username+"has joined a chat ");

    // In general as server
    io.emit();



    // This is for recieved messages from the clients
    socket.on('chatMessage', message => {
        console.log(message);

        var id= message.id;
        var name = userlist.get(id);
        console.log("sent by " , name);
        socket.broadcast.emit('message',{msg:message.msg , username:name});
        socket.emit("self",{msg:message.msg , username:name});
    

        // io.emit('message',msg);
    })





    // This means disconnected from the server 
    socket.on('disconnect', function () {

        io.emit('message',{msg:`${userlist.get(socket.id)} has left the chat` , username:userlist.get(socket.id)});
        console.log("A user disconnects ....");

    });


});

module.exports = {
    userlist:userlist
}





server.listen(port, () => {
    console.log(`server started at localhost:${port}`);
})


