var body = document.querySelector("body");
var colors = ["red", "orange", "yellow", "green", "blue", "indigo", "violet"];
var u;

var frameSizeX = 90;
var totalXFrames = 11;
var currentXFrame = 0;
var frameSizeY = 150;
var totalYFrames = 3;
var currentYFrame = 0;
var sx = 0;
var sy = 0;
var dx = 0;
var dy = 0;

function initializeColor(){
    window.firebase.database().ref('/' + u.uid + '/color').once('value').then(function(snapshot){
        body.style.backgroundColor = snapshot.val();
    })   
}

function initializeSkeleton(){
    window.firebase.database().ref('/' + u.uid + '/skeleton').once('value').then(function(snapshot){
        var savedSkeleton = snapshot.val();
        if(savedSkeleton){
            sy = savedSkeleton.sy;
            sx = savedSkeleton.sx;
            dy = savedSkeleton.dy;
            dx = savedSkeleton.dx;
        }
        canvas.style.display = "inline";
        redraw();
    });    
}

body.addEventListener("click", function(e){
    var currentColor = body.style.backgroundColor;
    var currentColorPosition = colors.indexOf(currentColor);
    var newColorName;
    if ((currentColorPosition == -1) || (currentColorPosition == (colors.length - 1))){
        newColorName = colors[0];
    }
    else {
        newColorName = colors[currentColorPosition + 1];
    }
    window.firebase.database().ref('/' + u.uid + '/color').set(newColorName);
    body.style.backgroundColor = newColorName;

    context.filter
})

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
       u = user;
       initializeColor();
       initializeSkeleton();
    } else{
        window.location.href = "./authentication.html"
    }
});

var canvas = document.querySelector("canvas");
canvas.style.display = "none";
var context = canvas.getContext("2d");
context.canvas.height = window.innerHeight;
context.canvas.width = window.innerWidth;
//canvas.style.backgroundColor = "black";

window.addEventListener("resize", function(){
    context.canvas.height = window.innerHeight;
    context.canvas.width = window.innerWidth;
    redraw();
});

function redraw(){
    context.clearRect(0, 0, canvas.width, canvas.height);
    var skeleton = new Image();
    skeleton.src = "walkingsprite.png";

    skeleton.addEventListener("load", function(){
        context.drawImage(skeleton, sx, sy, 90, 150, dx, dy, 90, 150);
    });

    if(u){
        context.font = "16px monospace";
        context.strokeText(u.email, dx, dy);
    }
}

window.addEventListener("keydown", function(e){
    currentXFrame++;
    if(currentXFrame > totalXFrames){
        currentXFrame = 0;
    }
    currentYFrame++;
    if(currentYFrame > totalYFrames){
        currentYFrame = 0;
    }
    switch(e.key){
        case "w":{
            dy -= 10;
            sy = 3 * frameSizeY;
            sx = currentXFrame * frameSizeX;
            break;
        }
        case "a":{
            dx -= 10;
            sy = 1 * frameSizeY;
            sx = currentXFrame * frameSizeX;
            break;  
        }
        case "s":{
            dy += 10;
            sy = 0 * frameSizeY;
            sx = currentXFrame * frameSizeX;
            break;
        }
        case "d":{
            dx += 10;
            sy = 2 * frameSizeY;
            sx = currentXFrame * frameSizeX;
            break;
        }        
    }
    switch(e.keyCode){
        case 38:{
            dy -= 10;
            sy = 3 * frameSizeY;
            sx = currentXFrame * frameSizeX;
            break;
        }
        case 37:{
            dx -= 10;
            sy = 1 * frameSizeY;
            sx = currentXFrame * frameSizeX;
            break;  
        }
        case 40:{
            dy += 10;
            sy = 0 * frameSizeY;
            sx = currentXFrame * frameSizeX;
            break;
        }
        case 39:{
            dx += 10;
            sy = 2 * frameSizeY;
            sx = currentXFrame * frameSizeX;
            break;
        }       
    }
    var skeleton = {
        sx: sx, 
        sy: sy, 
        dx: dx, 
        dy: dy
    }
    window.firebase.database().ref('/' + u.uid + '/skeleton').set(skeleton);
    redraw();
})

redraw();