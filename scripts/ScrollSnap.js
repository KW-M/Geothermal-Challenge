
function easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
}

var timeout = 100,
    animDuration = 600,
    threshold = 0.2,
    listenerElement = window,
    animating = false,
    scrollHandlerTimer,
    scrollSpeedTimer,
    scrollStart,
    speedDeltaY,
    lastScrollValue = 0,
    animationFrame;

function checkScrollSpeed(value) {
    var newValue = value
    let delta

    if (lastScrollValue !== null) {
        delta = newValue - lastScrollValue
    } else {
        delta = 0
    }

    lastScrollValue = newValue;
    scrollSpeedTimer && clearTimeout(scrollSpeedTimer)
    scrollSpeedTimer = window.setTimeout(() => {
        lastScrollValue = null
    }, 100)

    return delta
}

function startAnimation() {
    speedDeltaY = checkScrollSpeed(document.documentElement.scrollTop)
    if (animating || speedDeltaY === 0) {
        return
    }

    handler()
}
listenerElement.addEventListener('scroll', startAnimation, false);

/**
 * scroll handler
 * this is the callback for scroll events.
 */
function handler() {
    // if currently animating, stop it. this prevents flickering.
    if (animationFrame) {
        clearTimeout(animationFrame)
    }

    // if a previous timeout exists, clear it.
    if (scrollHandlerTimer) {
        // we only want to call a timeout once after scrolling..
        clearTimeout(scrollHandlerTimer)
    } else {
        scrollStart = document.documentElement.scrollTop;
    }

    scrollHandlerTimer = window.setTimeout(animationHandler, timeout)
}

function animationHandler() {
    // if we don't move a thing, we can ignore the timeout: if we did, there'd be another timeout added for scrollStart+1.
    if (scrollStart === document.documentElement.scrollTop) {
        // ignore timeout
        return
    }

    // detect direction of scroll. negative is up, positive is down.
    var direction = speedDeltaY > 0 ? 1 : -1;

    // get the next snap-point to snap-to
    var snapPoint = getNextSnapPoint(direction)

    listenerElement.removeEventListener('scroll', startAnimation, false)

    animating = true

    // smoothly move to the snap point
    smoothScroll(snapPoint, () => {
        // after moving to the snap point, rebind the scroll event handler
        animating = false
        listenerElement.addEventListener('scroll', startAnimation, false)
        // onAnimationEnd()
    })

    // we just jumped to the snapPoint, so this will be our next scrollStart
    if (!isNaN(snapPoint)) {
        scrollStart = snapPoint
    }
}

var snapSectionIndex = 0
// format  [section end distance, other stuff...]
var snapSections = [
    [0, 'existing_geo_modal'],
    [400, 'existing_geo_modal'],
    [1500, 'existing_geo_modal'],
    [4118, 'existing_geo_modal'],
    [5200, 'existing_geo_modal'],
    [7500]
];

function changeSnapSection(number) {
    snapSectionIndex += number;

}

function getNextSnapPoint(direction) {

    // get snap length
    var top = document.documentElement.scrollTop;

    // calc current and initial snappoint
    var distFromSnap = Math.abs(top - snapSections[snapSectionIndex][0]);
    console.log(distFromSnap, snapSectionIndex)

    if (distFromSnap > 50) {
        snapSectionIndex += direction;
        if (direction === 1) {
            while (top > snapSections[snapSectionIndex][0] && snapSectionIndex < snapSections.length - 1) snapSectionIndex += 1;
        } else {
            while (top < snapSections[snapSectionIndex][0] && snapSectionIndex > 0) snapSectionIndex -= 1;
        }
        if (snapSectionIndex < 0) snapSectionIndex = 0;
        else if (snapSectionIndex >= snapSections.length) snapSectionIndex = snapSections.length - 1;
    }

    // /**
    //  * Set target and bounds by direction,
    //  * if threshold has not been reached, scroll back to currentPoint
    //  **/
    // if (isAboveThreshold(direction, currentPoint)) {
    //     nextPoint = roundByDirection(direction, currentPoint)
    // } else {
    //     nextPoint = roundByDirection(direction * -1, currentPoint)
    // }

    // // calculate where to scroll
    // var scrollTo = nextPoint * snapLength

    // stay in bounds (minimum: 0, maxmimum: absolute height)
    scrollTo = stayInBounds(0, 9000, snapSections[snapSectionIndex][0])
    console.log(
        "scrollto", scrollTo)

    return scrollTo;
}

function isAboveThreshold(direction, currentPoint) {
    return direction > 0
        ? currentPoint % 1 > threshold
        : 1 - (currentPoint % 1) > threshold
}

function roundByDirection(direction, currentPoint) {
    if (direction === -1) {
        // when we go up, we floor the number to jump to the next snap-point in scroll direction
        return Math.floor(currentPoint)
    }
    // go down, we ceil the number to jump to the next in view.
    return Math.ceil(currentPoint)
}

function stayInBounds(min, max, destined) {
    return Math.max(Math.min(destined, max), min)
}

function isEdge(coords) {
    return coords === 0
}

function smoothScroll(end, callback) {
    var position = (start, end, elapsed, duration) => {
        if (elapsed > duration) {
            return end
        }

        return start + (end - start) * easeInOutQuad(elapsed / duration)
    }

    var start = document.documentElement.scrollTop;

    // get animation frame or a fallback
    var requestAnimationFrame =
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        function (fn) {
            return window.setTimeout(fn, 15)
        }
    var duration = isEdge(start) ? 0 : animDuration;
    console.log(duration)
    let startTime

    // setup the stepping function
    function step(timestamp) {
        if (!startTime) {
            startTime = timestamp
        }
        var elapsed = timestamp - startTime

        // change position on y-axis if result is a number.
        if (!isNaN(end)) {
            document.documentElement.scrollTop = position(start, end, elapsed, duration)
        }

        // check if we are over due;
        if (elapsed < duration) {
            requestAnimationFrame(step)
        } else {
            // is there a callback?
            if (typeof callback === 'function') {
                // stop execution and run the callback
                return callback(end)
            }
        }
    }
    animationFrame = requestAnimationFrame(step)
}

export { };