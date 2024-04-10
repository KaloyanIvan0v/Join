let x = true; 

function addDNone(){
    if (x == true) {
        document.getElementById('popup').classList.replace("dNone", "popup");
        x = false;
    } else {
        document.getElementById('popup').classList.replace("popup", "dNone");
        x = true;
    }
    console.log(x);
}