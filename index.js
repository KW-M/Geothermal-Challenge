// Green Sock Animation
import gsap from "gsap";
import { introTimeline } from './scripts/ScrollAnim'
import { planetRotationHandler, showCurrentModal, hideCurrentModal, shrinkCurrentModal } from './scripts/Modals'

var planetCenterX, planetCenterY = null,
    planetSizeContainer = document.getElementById("planet_size_container");

var scrollY,
    animationFinished = false,
    animTotal = introTimeline.duration(),
    animScrollStop = document.getElementById("scroll_extender").clientHeight - window.innerHeight - 300; // stop anim 200 pixels before scroll bottom
function scrollHandler() {
    // Grab scroll position
    scrollY = window.pageYOffset;
    if (scrollY < animScrollStop) {
        introTimeline.seek(scrollY / animScrollStop * animTotal)
        if (animationFinished == true) {
            animationFinished = false;
            hideCurrentModal()
            planetSizeContainer.removeEventListener("touchmove", touchMoveHandler, { passive: false })
            document.body.onmousedown = null
            document.body.ontouchstart = null
            document.body.ontouchend = null;
            document.body.ontouchcancel = null;
            document.body.onwheel = null;
        }
    } else if (animationFinished == false) {
        introTimeline.seek(animTotal); // jump to the end of the animation
        animationFinished = true;
        showCurrentModal()
        planetSizeContainer.addEventListener("touchmove", touchMoveHandler, { passive: false })
        document.body.onmousedown = mouseDownHandler
        document.body.ontouchstart = touchStartHandler
        document.body.ontouchend = touchEndHandler;
        document.body.ontouchcancel = touchEndHandler;
        document.body.onwheel = scrollWheelHandler;
    }
} scrollHandler();
window.onscroll = scrollHandler;

var planetRect = null
function resizeHandler() {
    planetRect = planetSizeContainer.getBoundingClientRect();
    planetCenterX = planetRect.left + planetRect.width / 2
    planetCenterY = planetRect.top + planetRect.height / 2 + (window.innerHeight * 0.3)
}; resizeHandler();
window.onresize = throttle(resizeHandler, 100);

var pointerPostionX = null, pointerPostionY = null;
var pointerDownPostionX = null, pointerDownPostionY = null;
var currentPlanetAngle = 0;
var currPointerAngle = 0;
var lastPointerAngle = 0;
var leftPlanetStopAngle = 0, rightPlanetStopAngle = 170;
function calcPlanetPointerAngle() {
    return Math.atan2(
        pointerPostionY - planetCenterY,
        pointerPostionX - planetCenterX
    ) / (2 * Math.PI) * 360; // degrees conversion
}
var swipeHintDone = false;
function rotatePlanetByPointer() {
    var currPointerAngle = calcPlanetPointerAngle();
    var delta = currPointerAngle - lastPointerAngle;
    rotatePlanet(true, delta)
    lastPointerAngle = currPointerAngle;
}
function rotatePlanet(pointerDown, deltaAngle) {

    var adjstedPlanetAngle = currentPlanetAngle -= deltaAngle;
    // console.log(currentPlanetAngle)
    if (!swipeHintDone & adjstedPlanetAngle > 5) { swipeHintDone = true; document.getElementById("swipe_hint").remove() }
    // !! assuming minPlanetAngle is near 360 deg not zero
    if (currentPlanetAngle < leftPlanetStopAngle) {
        if (pointerDown) adjstedPlanetAngle = leftPlanetStopAngle - Math.log10(Math.abs(currentPlanetAngle - leftPlanetStopAngle))
        else adjstedPlanetAngle = currentPlanetAngle = leftPlanetStopAngle;
    }
    else if (currentPlanetAngle > rightPlanetStopAngle) { // negitive means fulther along rotation
        if (pointerDown) adjstedPlanetAngle = rightPlanetStopAngle + Math.log10(Math.abs(currentPlanetAngle - rightPlanetStopAngle))
        else adjstedPlanetAngle = currentPlanetAngle = rightPlanetStopAngle;
    }
    planetRotationHandler(adjstedPlanetAngle)
    gsap.to('#planet_surface_container', 0.5, { rotation: -adjstedPlanetAngle })
}

function mouseMoveHandler(e) {
    pointerPostionX = e.clientX
    pointerPostionY = e.clientY
    var isMouseButtonDown = e.buttons === undefined ? e.which >= 1 : e.buttons >= 1;
    if (!isMouseButtonDown) {
        planetSizeContainer.removeEventListener("mousemove", mouseMoveHandler)
        rotatePlanet(false, 0)
        return false;
    } else {
        rotatePlanetByPointer()
    }
}

function mouseDownHandler(event) {
    pointerPostionX = pointerDownPostionX = event.clientX
    pointerPostionY = pointerDownPostionY = event.clientY
    lastPointerAngle = calcPlanetPointerAngle()
    planetSizeContainer.addEventListener("mousemove", mouseMoveHandler)
}

var gestureType = null;
function touchStartHandler(event) {
    pointerPostionX = pointerDownPostionX = event.touches[0].clientX
    pointerPostionY = pointerDownPostionY = event.touches[0].clientY
    lastPointerAngle = calcPlanetPointerAngle()
    gestureType = null
}

function touchMoveHandler(event) {
    pointerPostionX = event.touches[0].clientX
    pointerPostionY = event.touches[0].clientY
    if (gestureType === null) {
        if (Math.abs(pointerPostionX - pointerDownPostionX) * 3 < pointerPostionY - pointerDownPostionY) {
            // shrinkCurrentModal()
            event.preventDefault();
            event.stopPropagation();
            document.body.removeEventListener("touchmove", touchMoveHandler)
            gestureType = 'scroll';
            return false;
        } else {
            document.body.style.overflowY = 'hidden'
            gestureType = 'rotatePlanet';
        }
    }

    rotatePlanetByPointer()
};

function touchEndHandler(event) {
    if (gestureType === 'scroll') planetSizeContainer.addEventListener("touchmove", touchMoveHandler, { passive: false })
    gestureType = null;
    rotatePlanet(false, calcPlanetPointerAngle())
    document.body.style.overflowY = 'auto'
};

var scrollEndTimeout;
function scrollWheelHandler(e) {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        rotatePlanet(true, -e.deltaX * 0.01)
        clearTimeout(scrollEndTimeout)
        scrollEndTimeout = setTimeout(function () { rotatePlanet(false, 0) }, 100)
    }
}

// Taken from https://stackoverflow.com/questions/27078285/simple-throttle-in-js
function throttle(callback, limit) {
    var waiting = false;                      // Initially, we're not waiting
    return function () {                      // We return a throttled function
        if (!waiting) {                       // If we're not waiting
            callback.apply(this, arguments);  // Execute users function
            waiting = true;                   // Prevent future invocations
            setTimeout(function () {          // After a period of time
                waiting = false;              // And allow future invocations
            }, limit);
        }
    }
}

// window.addEventListener("load", () => { scrollTo(0, 10000000) })