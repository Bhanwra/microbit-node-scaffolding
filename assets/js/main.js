const socket = io()

let block = document.getElementById("block")

socket.on("action", (arg) => {

    if ( arg.indexOf("up") == 0 ) {
        block.style.transform = "translateY(-15rem)"
    } 

    if ( arg.indexOf("down") == 0 ) {
        block.style.transform = "translateY(15rem)"
    } 

    if ( arg.indexOf("left") == 0 ) {
        block.style.transform = "translateX(-25rem)"
    } 

    if ( arg.indexOf("right") == 0 ) {
        block.style.transform = "translateX(25rem)"
    } 

    if ( arg.indexOf("center") == 0 ) {
        block.style.transform = ""
    } 
})