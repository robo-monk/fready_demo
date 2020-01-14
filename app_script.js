
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

//variables

var last_mouse_x;
var last_mouse_y;
var cursor = 0;
var line = -1;
var line_words = [];
var current_word = -1;
var cursor_word = 0;
var start = 0;
var curr_line_max = 50;

var length = 10;
var words_len = 4;
var pressedKeys = {};
var marking = false;
var wpm = 250;
var word_count = 0;
var auto = false;

var line_div = null;


//constants(ish)

var color = 0;
var pointer = 0;
var cpl = 50;
const colors = ['#EEC643', '#ED254E', '#004BA8', '#0CCE6B', '#B8B8F3'];

//listeners and initialising stuff


//build new lines and format view accordingly
var newText = ""
var rawtxt = reader.innerHTML.replace(/\r?\n|\r/g, "");

rawtxt.split(' ').reduce((c, w, i) => {
    c += w.length;
    if (c < cpl) {
        newText += w + ' ';
    } else {
        //must generate new line 
        newText += `\n${w} `
        c = w.length;
    }
    return c;

}, 0);


reader.innerHTML = newText.split('\n').map((line, i) => {
    line_chs = 0;

    return `<div class=l id=line${i}>${line.split(' ').map((word, i) => {
        word_count++;
        line_chs++;
        return `<span class=w id=word${word_count}>${word.split('').map((c, i) => {
            line_chs++;
            return `<span class=c id=c${line_chs}>${c}</span>`;
        }).join('')}<span class=c id = c${ line_chs+1 }> </span></span>`;}).join('')}\n</div>`;
}).join('');

document.onmousemove = (function () {
    var onmousestop = function () {
        mouse_stopped();
    }, thread;
    return function () {
        mouse_moved();
        clearTimeout(thread);
        thread = setTimeout(onmousestop, 2000);
    };
})();

window.addEventListener('keydown', keyDown);
window.addEventListener('keyup', keyUp);
window.addEventListener('click', clcikkk)

line=0;

readLine(line)
function readLine(l) {
    // console.log('swithhhhhhhh')
    // line_div = reader.querySelector(`#line${l}`);
    curr_line_max =  $(`#line${line} .c`).length;
    // window.scrollBy(0, 35.2) fontsize*lineheight

    // line_words = line_div.querySelectorAll('word')
    // $(`#reader > #line${l}`).unmark();
    // $(`#reader > #line${l}`).unmark();
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
function tiktok() { runFrame();
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

function mvc() { updateFrame();

    speed = (60 / (wpm * 6)) * 1000;
    var dt = Date.now() - expected2; // the drift (positive for overshooting)
    if (dt > speed) {
        // possibly special handling to avoid futile "catch up" run
        speed = (60 / (wpm * 6)) * 1000;
        expected2 = Date.now() + speed;
        dt = Date.now() - expected2;
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



function marker(s, l, clip = false) {

    // $(`#reader > #line${line}`).unmark();
    // $(`#reader > #line${line}`).markRanges([{ start: cursor, length: length }]);
    // updatePointer();
    // console.log(reader.querySelector(`#word${cursor}`));
    // reader.querySelector(`#word${cursor}`).style.background = 'red';


    // console.log(line_div.querySelectorAll('.w')[2])

    // console.log(line_div.querySelectorAll('.c')[cursor].parentNode)
    
    // $(this).closest('div')
    // console.log(line_div)
    $(`#line${line}`).children().css("background-color", "transparent")
    $(`#line${line - 1}`).children().css("background-color", "transparent")
    $(`#line${line - 1}`).children().children().css("background-color", "transparent")
    $(`#line${line}`).children().children().css("background-color", "transparent")

    //HIGHLIGHTWORD

    // $(`#line${line-1}`).children().css("background-color", "transparent")

    

    //HIGHLIGHT CHAR


    // $(`#line${line}`).find(`#c${cursor - length}`).css("background-color", "transparent")
    // $(`#line${line}`).find(`#c${cursor}`).css("background-color", colors[color])
    
    for (i=0; i<length; i++){
        $(`#line${line}`).find(`#c${cursor-i}`).css("background-color", colors[color])
    }

    // for (i = 0; i < length*7; i++) {

    //     // $(`#line${line}`).find(`#c${cursor - 10}`).parent().css("background-color", "transparent")
    //     $(`#line${line}`).find(`#c${cursor+i}`).parent().css("background-color", colors[color])
    
    // }


    

    console.log(`#line${line} > #c${cursor}`)



    //HIGHLIGHTLINE
    
    // $(`#line${line}`).children().css("background-color", "red")

}

function clipToWords() {

    // $(`#line${line - 1}`).children().children().css("background-color", "transparent")
    // $(`#line${line}`).children().children().css("background-color", "transparent")

    
    for (i = 0; i < length; i++) {
        $(`#line${line}`).find(`#c${cursor - i}`).parent().css("background-color", colors[color])
    }


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
    temp_text = $(`#line${line}`).text();

    // $(`#line${line}`).children()

    if (cursor > curr_line_max + length/2) {
        // length = add;
        cursor = 0;
        readLine(line);
        line++;

    }

    // if (line_div.textContent[cursor] == " ") {
    //     // length = add;
    //     add = 2;
    // }

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

        if (cursor>0){
            cursor -= add;
        }else{
            line--;
            readLine(line)
        }
        marking = true;
    }

    if (marking) {
        marker();
        // clipToWords();
    }else{
        clipToWords();
    }
}


// console.log(current_word)

// if (auto){
//     cursor++;
// }



