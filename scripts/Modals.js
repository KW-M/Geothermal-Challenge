import MicroModal from 'micromodal';  // es6 module
MicroModal.init({
    disableScroll: false,
    disableFocus: true
})

var openModelId = null;
var hintDone = false;
var swipeHintShown = false;
function expandModal(modalElem) {
    if (!hintDone) { document.getElementById('modals_container').className = ""; hintDone = true; }
    document.body.style.overflowY = "hidden"
    modalElem.classList.add('expanded-modal')
}

function shrinkModal(modalElem) {
    console.log(modalElem, planetArcSections[openModalSectionIndex])
    if (!swipeHintShown && openModelId != null) { swipeHintShown = true; var sw = document.getElementById('swipe_hint'); if (sw) sw.style.display = 'block'; }
    document.body.style.overflowY = "scroll"
    modalElem.classList.remove('expanded-modal')
}


window.openModal = function (event, modalId) {
    if (modalId == openModelId) return;

    window.closeModal(true)

    var modalElem = document.getElementById(modalId)

    modalElem.style.visibility = 'visible';
    modalElem.onmouseenter = () => {

        expandModal(modalElem)
    }
    modalElem.onmouseleave = () => {
        shrinkModal(modalElem)
    }
    MicroModal.show(modalId); // [1]
    openModelId = modalId;
}

var hideCurrentModal = window.closeModal = function (modalTransition) {
    if (openModelId) {
        MicroModal.close(openModelId);
        var modalElem = document.getElementById(openModelId)
        modalElem.onmouseleave = null
        modalElem.onmouseenter = null
        shrinkModal(modalElem)
        var lastModalId = openModelId;
        setTimeout(function () {
            if (lastModalId != openModelId) {
                modalElem.style.visibility = 'hidden';

            }
        }, 500)
        openModelId = null;
    }
}

function showCurrentModal() {
    openModal(null, planetArcSections[openModalSectionIndex][1])
}

function shrinkCurrentModal() {
    shrinkModal(document.getElementById(planetArcSections[openModalSectionIndex][1]))
} window.shrinkCurrentModal = shrinkCurrentModal;

var openModalSectionIndex = 0
// format  [section end degree. 'modal key']
var planetArcSections = [
    [15, 'existing_geo_modal'],
    [47, 'egs_modal'],
    [58, 'zero_co2_polution'],
    [71, 'rain_or_shine'],
    [85, 'AGS'],
    [99, 'land_use'],
    [112, 'water'],
    [126, 'gshp_modal'],
    [135, 'alternate_uses'],
    [145, 'deep_egs'],
    [154, 'jobs'],
    [160, 'costs'],
    [180, 'barrier_to_progress'],
],
    maxAngle = planetArcSections[planetArcSections.length - 1][0]


function planetRotationHandler(planetRotationDegrees) {
    // if the
    if (planetRotationDegrees < maxAngle) {
        if (openModalSectionIndex > 0 && planetRotationDegrees < planetArcSections[openModalSectionIndex - 1][0]) {
            openModalSectionIndex--;
            showCurrentModal()
        } else if (planetRotationDegrees > planetArcSections[openModalSectionIndex][0]) {
            openModalSectionIndex++;
            showCurrentModal()
        }
    }
}
export { planetRotationHandler, showCurrentModal, hideCurrentModal, shrinkCurrentModal }