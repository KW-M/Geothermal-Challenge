import MicroModal from 'micromodal';  // es6 module
MicroModal.init({
    disableScroll: false,
})

function expandModal(modalElem) {
    modalElem.classList.add('expanded-modal')
}

function shrinkModal(modalElem) {
    modalElem.classList.remove('expanded-modal')
}

var openModelId = null;
window.openModal = function (event, modalId) {
    if (modalId == openModelId) return;
    window.closeModal(true)

    var modalElem = document.getElementById(modalId)
    modalElem.style.visibility = 'visible';
    modalElem.onmouseenter = () => { expandModal(modalElem) }
    modalElem.onmouseleave = () => { shrinkModal(modalElem) }
    MicroModal.show(modalId); // [1]
    openModelId = modalId;
}

var hideCurrentModal = window.closeModal = function (modalTransition) {
    if (openModelId) {
        console.log(openModelId)
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

var openModalSectionIndex = 0
// format  [section end degree. 'modal key']
var planetArcSections = [
    [15, 'existing_geo_modal'],
    [20, 'gshp_modal'],
    [30, 'egs_modal'],
    [50, 'zero_co2_polution'],
    [60, 'rain_or_shine'],
    [80, 'AGS'],
    [120, 'land_use'],
    [130, 'water'],
    [150, 'alternate_uses'],
    [160, 'costs'],
    [170, 'jobs'],
    [180, 'deep_egs'],
    [190, 'new_drilling_tech'],
],
    maxAngle = planetArcSections[planetArcSections.length - 1][0]


function planetRotationHandler(planetRotationDegrees) {
    // if the
    if (planetRotationDegrees < maxAngle) {
        if (openModalSectionIndex > 0 && planetRotationDegrees < planetArcSections[openModalSectionIndex - 1][0]) {
            openModalSectionIndex--;
            console.log(openModalSectionIndex)
            showCurrentModal()
        } else if (planetRotationDegrees > planetArcSections[openModalSectionIndex][0]) {
            openModalSectionIndex++;
            console.log(openModalSectionIndex)
            showCurrentModal()
        }
    }
}
export { planetRotationHandler, showCurrentModal, hideCurrentModal, shrinkModal, expandModal }