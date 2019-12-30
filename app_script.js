//document objects
const menu_wrapper = document.querySelector('#menu_wrapper');
//listeners
// document.addEventListener("mousemove", mouse_moved());
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
//variables
var last_mouse_x;
var last_mouse_y;

function mouse_moved(){
    menu_wrapper.style.opacity = 100;
}

function mouse_stopped(){
    menu_wrapper.style.opacity = 0;
}