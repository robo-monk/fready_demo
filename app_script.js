//document objects

const menu_wrapper = document.querySelector('#menu_wrapper');
const reader = document.querySelector('#reader');
const wpm_div = document.querySelector('#wpm');
const auto_div = document.querySelector('#auto');
//variables

var last_mouse_x;
var last_mouse_y;
var cursor = 0;
var length = 50;
var pressedKeys = {};
var marking = false;
var wpm = 250;
var auto = false;

//listeners and boring stuff

document.onmousemove = (function () {
    var onmousestop = function () {
        mouse_stopped();
    }, thread;

    return function () {
        mouse_moved()
        clearTimeout(thread);
        thread = setTimeout(onmousestop, 2000);
    };

})();

window.addEventListener('keydown', keyDown);
window.addEventListener('keyup', keyUp);

function keyDown(e) {
    mouse_moved();

    pressedKeys[e.keyCode] = true;
}

function keyUp(e) {
    
    setTimeout(function () { mouse_stopped(); }, 1000);


    if (e.keyCode == 65){
        autoSwitch();
    }
    pressedKeys[e.keyCode] = false;

}

function autoSwitch(){

    if (auto) {
        auto = false;
        auto_div.style.fontWeight = "300";


    } else {

        auto = true;
        auto_div.style.fontWeight = "700";

    }
}

// runFrame
var interval = 100; // ms TO-DO do math for the wpm shit
var expected = Date.now() + interval;
setTimeout(tiktok, interval);
function tiktok() {
    runFrame();
    var dt = Date.now() - expected; // the drift (positive for overshooting)
    if (dt > interval) {
        // possibly special handling to avoid futile "catch up" run
    }
    expected += interval;
    setTimeout(tiktok, Math.max(0, interval - dt)); // take into account drift
}

//for the mark
var speed = (60/(wpm * 6))*100; // ms TO-DO do math for the wpm shit (6 is the avg charachter in word)
var expected2 = Date.now() + speed;
setTimeout(mvc, speed);

function mvc() {

    updateFrame();
    speed = (60 / (wpm * 6)) * 1000;
    
    console.log(speed);
    var dt = Date.now() - expected2; // the drift (positive for overshooting)
    if (dt > speed) {
        // possibly special handling to avoid futile "catch up" run
    }
    if (marking) {
        marker();
    }

    expected2 += speed;
    setTimeout(mvc, Math.max(0, speed - dt)); // take into account drift
}



//actual code

// reader.innerHTML.replace(chr(10), "\n");

function mouse_moved(){

    menu_wrapper.style.opacity = 100;

}

function mouse_stopped(){

    menu_wrapper.style.opacity = 0;

}



function marker(){

    $("#reader").unmark();
    $("#reader").markRanges([{ start: cursor, length: length }]);
    // interval += 100;    


}


function runFrame(){

    if (pressedKeys[189]) {
        // mouse_moved();
        if (wpm>10){
            wpm -= 10;
        }
        
    }
    if (pressedKeys[187]) {

        wpm += 10;

    }
    //update interval in nice way

    wpm_div.textContent = wpm;

}

function updateFrame() {

    //ugly ass code ahead
    marking = false;

    if (pressedKeys[39] || auto) {
        // console.log(auto)
        cursor++;
        marking = true;
    }
    if (pressedKeys[37]) {
        cursor--;
        marking = true;

    }

    

    // if (auto){
    //     cursor++;
    // }

}