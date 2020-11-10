// Green Sock Animation
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

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
// window.addEventListener("mousemove", mouseMoveHandler);