//document objects
const body = document.querySelector('body');
const menu_wrapper = document.querySelector('#menu_wrapper');
const toolbar = document.querySelector('#toolbar');
const reader = document.querySelector('#reader');
const wpm_div = document.querySelector('#wpm');
const auto_div = document.querySelector('#auto');
const wpm_plus = document.querySelector('#wpm_plus')
const wpm_minus = document.querySelector('#wpm_minus')

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
    
    var dt = Date.now() - expected2; // the drift (positive for overshooting)
    if (dt > speed) {
        // possibly special handling to avoid futile "catch up" run
        speed = (60 / (wpm * 6)) * 1000;
        expected2 = Date.now() + speed;
        dt = Date.now() - expected2;
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
    body.style.cursor = 'inherit';
    toolbar.style.cursor = 'pointer';
    reader.style.cursor = 'text';


}

function mouse_stopped(){

    menu_wrapper.style.opacity = 0;
    body.style.cursor = 'none';
    toolbar.style.cursor = 'none';
    reader.style.cursor = 'none';

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

            wpm_minus.style.fontWeight = "700";
            wpm -= 10;
            setTimeout(function () { wpm_minus.style.fontWeight = "300"; }, 50);

            

        }
        
    }
    if (pressedKeys[187]) {
        wpm_plus.style.fontWeight = "700";
        wpm += 10;
        setTimeout(function () { wpm_plus.style.fontWeight = "300"; }, 50);

    }
    //update interval in nice way

    wpm_div.textContent = wpm;

}

function wpmPlusPlus(){

    wpm += 10;

}
function wpmMinusMinus() {

    wpm -= 10;

}

function updateFrame() {

    //ugly ass code ahead
    marking = false;
    add = 1;
    if (reader.textContent[cursor+1]==" "){
        add = 2;
    }
    if (pressedKeys[39] || auto) {
        // console.log(auto)
        cursor+=add;
        marking = true;
    }
    if (pressedKeys[37]) {
        cursor-= add;
        marking = true;

    }

    

    // if (auto){
    //     cursor++;
    // }

}