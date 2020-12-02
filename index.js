// Green Sock Animation
import gsap from "gsap";
import { introTimeline } from './scripts/ScrollAnim'
import { planetRotationHandler, showCurrentModal, hideCurrentModal } from './scripts/Modals'

var planetCenterX, planetCenterY = null,
    planetSizeContainer = document.getElementById("planet_size_container");

var scrollY,
    animationFinished = false,
    animTotal = introTimeline.duration(),
    animScrollStop = document.getElementById("scroll_extender").clientHeight - window.innerHeight - 300; // stop anim 200 pixels before scroll bottom
function scrollHandler() {
    // Grab scroll position
    scrollY = window.pageYOffset;
    console.log(animTotal)
    if (scrollY < animScrollStop) {
        console.log(animScrollStop)
        introTimeline.seek(scrollY / animScrollStop * animTotal)
        if (animationFinished == true) {
            animationFinished = false;
            hideCurrentModal()
            document.body.removeEventListener("touchmove", touchMoveHandler, { passive: false })
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
        document.body.addEventListener("touchmove", touchMoveHandler, { passive: false })
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
var leftPlanetStopAngle = 0, rightPlanetStopAngle = 180;
function calcPlanetPointerAngle() {
    return Math.atan2(
        pointerPostionY - planetCenterY,
        pointerPostionX - planetCenterX
    ) / (2 * Math.PI) * 360; // degrees conversion
}
function rotatePlanet(pointerDown) {
    currPointerAngle = calcPlanetPointerAngle()
    var adjstedPlanetAngle = currentPlanetAngle -= currPointerAngle - lastPointerAngle;
    lastPointerAngle = currPointerAngle;

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
        document.body.removeEventListener("mousemove", mouseMoveHandler)
        rotatePlanet(false)
        return false;
    } else {
        rotatePlanet(true)
    }
}

function mouseDownHandler(event) {
    pointerPostionX = pointerDownPostionX = event.clientX
    pointerPostionY = pointerDownPostionY = event.clientY
    lastPointerAngle = calcPlanetPointerAngle()
    document.body.addEventListener("mousemove", mouseMoveHandler)
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
        if (Math.abs(pointerPostionX - pointerDownPostionX) * 1.8 < Math.abs(pointerPostionY - pointerDownPostionY)) {
            event.preventDefault();
            event.stopPropagation();
            console.log(event.cancelable)
            document.body.removeEventListener("touchmove", touchMoveHandler)
            gestureType = 'scroll';
            return false;
        } else {
            document.body.style.overflowY = 'hidden'
            gestureType = 'rotatePlanet';
        }
    }

    rotatePlanet(true)
};

function touchEndHandler(event) {
    if (gestureType === 'scroll') document.body.addEventListener("touchmove", touchMoveHandler, { passive: false })
    gestureType = null;
    rotatePlanet(false)
    console.log('pointerup');
    document.body.style.overflowY = 'auto'
};

var scrollEndTimeout;
function scrollWheelHandler(e) {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        currentPlanetAngle += e.deltaX * 0.01
        rotatePlanet(true)
        clearTimeout(scrollEndTimeout)
        scrollEndTimeout = setTimeout(function () { rotatePlanet(false) }, 100)
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