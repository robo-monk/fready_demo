
//document objects
const body = document.querySelector('body');
const menu_wrapper = document.querySelector('#menu_wrapper');
const toolbar = document.querySelector('#toolbar');
const reader = document.querySelector('#reader');
const wpm_div = document.querySelector('#wpm');
const auto_div = document.querySelector('#auto');
const wpm_plus = document.querySelector('#wpm_plus')
const wpm_minus = document.querySelector('#wpm_minus')
const color_div = document.querySelector('#color')
var line_div = null;

//variables

var last_mouse_x;
var last_mouse_y;
var cursor = 0;
var line = -1;
var line_words = [];
var current_word = -1;
var cursor_word = 0;
var start = 0;


var length = 10;
var words_len = 4;
var pressedKeys = {};
var marking = false;
var wpm = 250;
var auto = false;

//constants

var color = 0;
var pointer = 0;
var cpl = 50;
const colors = ['#EEC643', '#ED254E', '#004BA8', '#0CCE6B', '#B8B8F3'];

//listeners and boring stuff
var newText = " "

var rawtxt = reader.innerHTML.replace(/\r?\n|\r/g, "");

rawtxt.split(' ').reduce((c, w, i) => {
    c += w.length;
    if (c < cpl) {
        newText += w + ' ';
    } else {
        //must generate new line 
        // newText += `± </div> <div key=${i}>${w} `
        newText += `\n${w} `
        c = w.length;
    }
    return c;
    // return `<div key=${i}>${item}\n</div>`;
}, 0);

reader.innerHTML = newText;

const newText2 = reader.textContent.split('\n').map((item, i) => {
    return `<div id=line${i}>${item} \n</div>`;
});
reader.innerHTML = newText2.join('');

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
window.addEventListener('click', clcikkk)



newLine()

function newLine() {

    $(`#reader > #line${line}`).unmark();
    line += 1;
    line_div = reader.querySelector(`#line${line}`);
    line_words = line_div.textContent.trim();
    line_div.textContent = line_words + '\n'

}

function keyDown(e) {

    mouse_moved();
    pressedKeys[e.keyCode] = true;

    if (e.keyCode == 190) {
        length += 1;
        marker();

    }

    if (e.keyCode == 188) {

        if (length > 1) {
            length -= 1;
        }
        marker();

    }


    if (e.keyCode == 32 && e.target == document.body) {
        e.preventDefault();
        autoSwitch();
    }

}

function keyUp(e) {

    setTimeout(function () { mouse_stopped(); }, 1000);


    if (e.keyCode == 65) {
        autoSwitch();
    }

    if (e.keyCode == 67) {
        colorSwitch();
    }

    if (e.keyCode == 80) {
        pointerSwitch();
    }



    pressedKeys[e.keyCode] = false;
    marker(true)

}

function clcikkk() {

    mouse_moved();
    setTimeout(function () { mouse_stopped(); }, 1000);
}

function autoSwitch() {

    if (auto) {
        auto = false;
        auto_div.style.fontWeight = "300";


    } else {

        auto = true;
        auto_div.style.fontWeight = "700";

    }
}

function colorSwitch() {

    if (color < colors.length - 1) {

        color++;

    } else {

        color = 0;
    }

    $(color_div).css("color", colors[color]);
    // $("mark").css("background", colors[color]);
    updatePointer();

}

function pointerSwitch() {

    if (pointer == 0) {
        pointer = 1;
    } else {
        pointer = 0;
    }

    updatePointer();


}

function updatePointer() {

    switch (pointer) {

        case 0:
            $("mark").css({ "background": colors[color], "border-width": "2px", "border-bottom": ("solid transparent") });
            break;
        case 1:
            $("mark").css({ "background": "transparent", "border-width": "2px", "border-bottom": ("solid" + colors[color]) });
            break;

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
var speed = (60 / (wpm * 6)) * 100; // ms TO-DO do math for the wpm shit (6 is the avg charachter in word)
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

function mouse_moved() {

    menu_wrapper.style.opacity = 100;
    body.style.cursor = 'inherit';
    toolbar.style.cursor = 'pointer';
    reader.style.cursor = 'text';

}

function mouse_stopped() {

    menu_wrapper.style.opacity = 0;
    body.style.cursor = 'none';
    toolbar.style.cursor = 'none';
    reader.style.cursor = 'none';

}



function marker(clip = false) {

    $(`#reader > #line${line}`).unmark();

    // $(`#reader > #line${line}`).markRanges([{ start: cursor, length: 1 }]);
    if (clip) {
        // dt = clipToWords();
        // console.table({ "start": cursor - dt[0] + 2, "len": dt[0] + dt[1] + 2, "cur":cursor})
        // $(`#reader > #line${line}`).markRanges([{ start: cursor - dt[0] + 2, length: dt[0] + dt[1]+2 }]);
        clipToWords();

    } else {
        $(`#reader > #line${line}`).markRanges([{ start: cursor, length: length }]);
    }

    updatePointer();

}


function runFrame() {

    if (pressedKeys[189]) {
        // mouse_moved();
        if (wpm > 10) {
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

    if (wpm < 100) {
        wpm_div.textContent = "0" + wpm;
    } else if ((wpm < 1000)) {
        wpm_div.textContent = wpm;
    }

}

function wpmPlusPlus() {

    wpm += 10;

}
function wpmMinusMinus() {

    wpm -= 10;

}

function updateFrame() {

    //ugly ass code ahead
    marking = false;
    add = 1;

    if (line_div.textContent[cursor] == "\n") {
        // length = add;
        cursor = 0;
        newLine();
    }

    if (line_div.textContent[cursor] == " ") {
        // length = add;
        add = 2;
    }

    // if (reader.textContent[cursor + length + 0] == "\n") {
    //     length-=add;
    // }else{
    //     length += add;
    // }




    if (pressedKeys[39] || auto) {
        // console.log(auto)
        cursor += add;
        marking = true;

    }

    if (pressedKeys[37]) {
        cursor -= add;
        marking = true;
    }
}


// console.log(current_word)

// if (auto){
//     cursor++;
// }


function clipToWords() {

    if (line_words[cursor] == " ") { cursor++ }

    txt = line_words;

    s = 0
    s_search = true;
    e = 0
    e_search = 0;
    breakit1 = false;
    breakit2 = false;

    c = ""
    //todo make it world count
    for (i = 0; i < txt.length; i++) {

        if (breakit1 && breakit2) {break; }
        if (s_search) {
            if (line_words[cursor + s] != " ") {
                s = -i;
            } else {
                s_search = false
            }

        } else {
            breakit1 = true;
        }

        if (e_search < words_len) {

            if (line_words[cursor + e] != " ") {

                e = i;

            } else {
                e++;
                e_search += 1;
            }

        } else {
            breakit2 = true;
            e--;
        }



        $(`#reader > #line${line}`).unmark();

        $(`#reader > #line${line}`).markRanges([{ start: cursor + s + 1, length: e - s - 1 }]);

        updatePointer();




    }




    return [s, e]

    // $(`#reader > #line${line}`).markRanges([{ start: cursor - s + 2, length: e }]);

}


function clipIt() {



}

