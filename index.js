// Green Sock Animation
import gsap from "gsap";
// import ScrollTrigger from "gsap/ScrollTrigger";

var introTimeline = gsap.timeline().pause()
introTimeline.to("#earth_planet",{y:0, duration: 2, ease:"power1"})

introTimeline.to("#intro_text_2",{opacity:1, duration: 0.5, ease:"none"},"-=1.1")
introTimeline.to("#earth_powerstations_l, #earth_powerstations_r",{opacity:1, duration: 0.5, ease:"none"},"-=0.8")
introTimeline.to("#intro_text_2",{opacity:0, duration: 0.5, ease:"none"},"+=0.8")
introTimeline.to("#intro_text_3",{opacity:1, duration: 0.5, ease:"none"},"+=0.1")
introTimeline.to("#intro_text_3",{opacity:0, duration: 0.5, ease:"none"},"+=0.8")
introTimeline.to("#intro_text_4",{opacity:1, duration: 0.5, ease:"none"},"+=0.1")
introTimeline.to("#intro_text_4",{opacity:0, duration: 0.5, ease:"none"},"+=0.8")
// Earth cuttaway transition:
introTimeline.set("#earth_scale_cutaway_r", {visibility:"visible"},"-=1.5")
introTimeline.set("#half_circle_r_clip_path", {scaleX:1},"-=1.5")
introTimeline.to("#half_circle_r_clip_path", {scaleX:0,duration: 0.5, ease:"power1.in"},"-=1.5")
introTimeline.set("#earth_powerstations_r", {visibility:"hidden"},"-=1")
introTimeline.set("#earth_scale_cutaway_l",{visibility:"visible",scaleX:0,transformOrigin:"50% 50%" },"-=1")
introTimeline.to("#earth_scale_cutaway_l",{scaleX:1,duration: 0.5,ease:"power1.out"},"-=1")
introTimeline.set("#earth_scale_cutaway_l,#earth_powerstations_l,#earth_powerstations_r", {visibility:"hidden"})

introTimeline.set("body",{backgroundColor:"#3174e6"},"-=0.8")
introTimeline.set("#miniplanet",{visibility:"visible",y:0},"-=0.8")
introTimeline.to("#earth_planet",{opacity:0, duration: 0.5, ease:"none"},"-=0.8")
introTimeline.set("#earth_planet",{visibility:"hidden"})
introTimeline.to("#miniplanet",{scale:1, duration: 1.5, ease:"power1.inOut"},"-=0.5")
introTimeline.to(".star-background",{opacity:0, duration:0.5,ease:"none"},"-=0.8")
introTimeline.set(".star-background",{visibility:"hidden"},"-=0")
introTimeline.set("#planet_surface_container",{visibility:"visible",opacity:0},"-=0")
introTimeline.to("#planet_surface_container",{opacity:1,duration: 0.5},"-=0")


// var request = null;
var mouse = { x: 0, y: 0 };
var cx = window.innerWidth / 2;
var cy = window.innerHeight / 2;
var scrollY = window.pageYOffset;
var scrollChangeFlag = true, mouseChangeFlag = true;
var animStop = 5000

function scrollHandler() {
    // Grab scroll position
    scrollY = window.pageYOffset;
    scrollChangeFlag = true;


    if (scrollY < animStop) {
        introTimeline.seek(scrollY / animStop * 10)
     } else {
        gsap.to('#planet_surface_container',0.5,{rotation: - scrollY / 200})
    }
    // cancelAnimationFrame(request);
    // request = requestAnimationFrame((e) => {

    // });
}


function resizeHandler() {
    cx = window.innerWidth / 2;
    cy = window.innerHeight / 2;
    scrollChangeFlag = true;
    mouseChangeFlag = true;
}; resizeHandler();

var pointerDown = false
var pointerPostionX = null;
var pointerPostionY = null;
var lastPointerPostionX = null;
var lastPointerPostionY = null;
function pointerMoveHandler(e) {
    if (pointerDown) {
        var deltaX = pointerPostionX - lastPointerPostionX;
        var deltaY = pointerPostionY - lastPointerPostionY;
        console.log(deltaX,deltaY)
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            e.preventDefault()
            window.scrollBy(0,-deltaX);
        }
        lastPointerPostionX = pointerPostionX
        lastPointerPostionY = pointerPostionY
    }
};

// Bind events to window
// window.onresize = resizeHandler;
window.onscroll = scrollHandler;
scrollHandler()




document.addEventListener("mousedown",function (e) {
    lastPointerPostionX = e.clientX
    pointerDown = true
});
document.addEventListener("touchstart",function (e) {
    lastPointerPostionX = e.touches[0].clientX
    pointerDown = true
});
document.addEventListener("mouseup",function () {
    pointerDown = false
});
document.addEventListener("touchend",function () {
    pointerDown = false
});
document.addEventListener("mousemove",function (e) {
    pointerPostionX = e.clientX
    pointerPostionY = e.clientY
    pointerMoveHandler(e);
},{ passive: false });
document.addEventListener("touchmove",function (e) {
    // console.log(e.touches[0])
    e.preventDefault();
    pointerPostionX = e.touches[0].clientX
    pointerPostionY = e.touches[0].clientY
    pointerMoveHandler(e);
});