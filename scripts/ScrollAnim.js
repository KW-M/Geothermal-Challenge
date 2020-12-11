// Green Sock Animation
import gsap from "gsap";

var introTimeline = gsap.timeline()
introTimeline.to("#earth_planet", { y: 0, duration: 2, ease: "power1" })
introTimeline.to("#scale_bar", { opacity: 1 }, "-=1.6");
introTimeline.set("#intro_text_2", { display: "block" }, "-=1.1")
introTimeline.to("#intro_text_2", { opacity: 1, duration: 0.5, ease: "none" }, "-=1.1")
//Local Hotspots Image fade in
introTimeline.to("#earth_powerstations_l, #earth_powerstations_r", { opacity: 1, duration: 0.5, ease: "none" }, "-=0.8")
introTimeline.to("#scale_bar", { opacity: 0 }, "-=0.7");
introTimeline.to("#intro_text_2", { opacity: 0, display: 'none', duration: 0.5, ease: "none" }, "+=0.8")
introTimeline.set("#intro_text_3", { display: "block" })
introTimeline.to("#intro_text_3", { opacity: 1, duration: 0.5, ease: "none" }, "+=0.1")
introTimeline.to("#intro_text_3", { opacity: 0, display: 'none', duration: 0.5, ease: "none" }, "+=0.8")
introTimeline.set("#intro_text_4", { display: "block" })
introTimeline.to("#intro_text_4", { opacity: 1, duration: 0.5, ease: "none" }, "+=0.1")
introTimeline.to("#intro_text_4", { opacity: 0, display: 'none', duration: 0.5, ease: "none" }, "+=0.5")
introTimeline.to("#intro_title,#intro_text_1", { display: "none", duration: 0, ease: "none" }) // ---------
introTimeline.set("#scale_bar,#imagery_credit", { display: "none" }, "-=1")
introTimeline.set("#not_to_scale", { display: "block" })
// Earth cuttaway transition:
introTimeline.to("#earth_scale_cutaway_r", { display: "inline", duration: 0, ease: "none" }, "-=1.5") /// -----
introTimeline.set("#half_circle_r_clip_path", { scaleX: 1 }, "-=1.5")
introTimeline.to("#half_circle_r_clip_path", { scaleX: 0, duration: 0.5, ease: "power1.in" }, "-=1.5")
introTimeline.set("#earth_powerstations_r", { display: "none" }, "-=1")/// -----
introTimeline.set("#earth_scale_cutaway_l", { display: "inline", scaleX: 0, transformOrigin: "50% 50%" }, "-=1")
introTimeline.to("#earth_scale_cutaway_l", { scaleX: 1, duration: 0.5, ease: "power1.out" }, "-=1")
introTimeline.to("#earth_scale_cutaway_l,#earth_powerstations_l,#earth_powerstations_r", { display: "none", duration: 0, ease: "none" })
// fade out earth 1 & zoom
introTimeline.to("#miniplanet", { display: "block", duration: 0, ease: "none" }, "-=0.8") /// -------
introTimeline.to("#earth_planet", { opacity: 0, display: 'none', duration: 0.5, ease: "none" }, "-=0.8")
introTimeline.to("#miniplanet", { scale: 1, duration: 1.5, ease: "power1.inOut" }, "-=0.5")


introTimeline.set("#planet_surface_container", { display: "block" })
introTimeline.set("body", { className: "sky-bg" })
introTimeline.to(".star-background", { opacity: 0, duration: 0.5, ease: "none" }, "-=0.8")
introTimeline.set(".star-background", { display: "none" }, "-=0")
introTimeline.set("#planet_surface_container", { className: "visible" })
introTimeline.set("#swipe_hint", { display: "block" })
introTimeline.pause()
export { introTimeline };