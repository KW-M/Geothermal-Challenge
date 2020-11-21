// Green Sock Animation
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
const Modal = require('modal-js')

var request = null;
var mouse = { x: 0, y: 0 };
var cx = window.innerWidth / 2;
var cy = window.innerHeight / 2;
var scrollY = window.pageYOffset;
var scrollChangeFlag = true, mouseChangeFlag = true;

function scrollHandler() {
    // Grab scroll position
    scrollY = window.pageYOffset;
    scrollChangeFlag = true;
    cancelAnimationFrame(request);
    request = requestAnimationFrame((e) => {
        gsap.to('#planet_surface_container',0.5,{rotation: - scrollY / 200})
    });
}


function openModal(){
    console.log("Met")
    var modalEl = document.createElement('div');
    modalEl.innerHTML = '<p>The world\'s simplest modal is showing!</p><button class="close-btn">Close Modal</button>';
    var closeButton = modalEl.getElementsByClassName('close-btn')[0];
    var showButton = document.getElementsByClassName('surface-image')[0];

    // start your modal instance
    var modal = new Modal.default(modalEl, {
        containerEl: document.getElementsByClassName('modals-container')[0],
        activeClass: 'modal-active'
    });

}

function closeModal(modal){
    modal.hide();
}

// function resizeHandler() {
//     cx = window.innerWidth / 2;
//     cy = window.innerHeight / 2;
//     scrollChangeFlag = true;
//     mouseChangeFlag = true;
//     cancelAnimationFrame(request);
//     request = requestAnimationFrame(update);
// }; resizeHandler();

// Bind events to window
// window.onresize = resizeHandler;
window.onscroll = scrollHandler;
window.onclick = openModal;
console.log(document.getElementsByClassName('surface-image'))
// window.addEventListener("mousemove", mouseMoveHandler);