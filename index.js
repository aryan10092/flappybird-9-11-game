let sheet;
let sheetwidth=420
let sheetheight=640
let context; 

let planewidth=60
let planeheight=38
let planex=sheetwidth/8
let planey=sheetheight/2
let planeimage

let plane={
    x:planex,
    y:planey,
    width:planewidth,
    height:planeheight
}

let buildarray=[]
let buildwidth=130
let buildheight=512
let buildx=sheetwidth
let buildy=0

let topbuildimg
let bottombuildimg

let speedx=-3
let speedy=0
let gravityspeed=0.4

let over=false
let scores=0

let planesound=new Audio("./tap.mp3")
let crashsound=new Audio("./explosion.mp3")
let bgmusic=new Audio("./background.mp3")
bgmusic.loop=true

let explosion
let explosionwidth=150
let explosionheight=80
let explosionx=sheetwidth/8
let explosiony=plane.y

window.onload=function(){
 sheet=document.getElementById("home")
 sheet.height=sheetheight
 sheet.width=sheetwidth

 context=sheet.getContext("2d")

//  context.fillStyle="red"
//  context.fillRect(plane.x,planey,planewidth,planeheight)
planeimage=new Image()
planeimage.src="./plane.png"
planeimage.onload=function(){
context.drawImage(planeimage,planex,planey,planewidth,planeheight)
}

topbuildimg=new Image()
topbuildimg.src="./building.png"

bottombuildimg=new Image()
bottombuildimg.src="./building.png"

explosion=new Image()
explosion.src="./explosion.png"

requestAnimationFrame(updating)
setInterval(plaebuild,1500)
document.addEventListener("keydown",flyplane)

}


function updating(){
requestAnimationFrame(updating)
if(over){
    return
}

context.clearRect(0,0,sheetwidth,sheetheight)

console.log(speedy)
speedy+=gravityspeed
plane.y=Math.max(plane.y+speedy,0)
console.log(plane.y)

context.drawImage(planeimage,plane.x,plane.y,plane.width,plane.height)
if(plane.y>sheetheight){
    over=true
}

for(let x=0;x<buildarray.length;x++){
    let building=buildarray[x]
    building.x+=speedx
    context.drawImage(building.img,building.x,building.y,building.width,building.height)
    
    if(!building.pass && plane.x>building.x+building.width){
        scores+=1/2
        building.pass=true
    } 

    if( collision(plane,building)){
        
        context.clearRect(plane.x,plane.y-1,plane.width,plane.height)
        context.drawImage(explosion,plane.x-15,plane.y-13,explosionwidth,explosionheight)
      //  context.clearRect(plane.x-15,plane.y-13,plane.width,plane.height)
        crashsound.play()

    over=true
    }

}

while(buildarray.length>0 && buildarray[0].x<-buildwidth){
    buildarray.shift()
}
context.fillStyle="white"
context.font="45px sans-serif"
context.fillText(scores,5,45)

if(over){
    bgmusic.pause()
    bgmusic.currentTime=0
    context.fillStyle="black"
    context.fillText("GAME OVER",50,320)
    context.fillText("SCORE:",80,390)
    context.fillText(scores,260,390)

}
}

function plaebuild(){
    if(over){
        return
    }
    let randombuildy=buildy-buildheight/4-Math.random()*(buildheight/2)
    let topbuild={
        img:topbuildimg,
        x:buildx,
        y:randombuildy,
        width:buildwidth,
        height:buildheight,
        pass:false
    }
    buildarray.push(topbuild)
    let space=sheetheight/3

    let bottombuild={
        img:bottombuildimg,
        x:buildx,
        y:(randombuildy+space+buildheight),
        width:buildwidth,
        height:buildheight,
        pass:false
    }
    buildarray.push(bottombuild)

}
function flyplane(x){
 if(x.code=="Space"||x.code=="ArrowUp"||x.code=="KeyX"){
    if(bgmusic.paused){
    bgmusic.play()}
    planesound.currentTime=0
    planesound.play()
    console.log(x.code)
    speedy= -6
 
 if(over){
    plane.y=planey
    buildarray=[]
    scores=0
    over=false
 }}
}

function collision(p,q){
    return p.x<q.x+q.width&&
            p.x+p.width>q.x &&
            p.y<q.y+q.height &&
            p.y+p.height>q.y
}