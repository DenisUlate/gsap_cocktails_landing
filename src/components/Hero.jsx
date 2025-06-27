import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger, SplitText } from "gsap/all";
import { useRef } from "react";
import { useMediaQuery } from "react-responsive";

const Hero = () => {
	const videoRef = useRef();

	const isMobile = useMediaQuery({ maxWidth: 767 });

	useGSAP(() => {
		const heroSplit = new SplitText(".title", { type: "chars, words" });
		const paragraphSplit = new SplitText(".subtitle", { type: "lines" });

		heroSplit.chars.forEach((char) => char.classList.add("text-gradient"));

		gsap.from(heroSplit.chars, {
			yPercent: 100,
			duration: 1.6,
			opacity: 0,
			stagger: 0.06,
			ease: "expo.out",
		});

		gsap.from(paragraphSplit.lines, {
			opacity: 0,
			yPercent: 100,
			duration: 1.6,
			stagger: 0.06,
			ease: "expo.out",
			delay: 1,
		});

		gsap
			.timeline({
				scrollTrigger: {
					trigger: "#hero",
					start: "top top",
					end: "bottom top",
					scrub: true,
				},
			})
			.to(".right-leaf", { y: 200 }, 0)
			.to(".left-leaf", { y: -200 }, 0);

		const startValue = isMobile ? "top 50%" : "center 60%";
		const endValue = isMobile ? "120% top" : "bottom top";

		// Video scroll animation timeline
		gsap
			.timeline({
				scrollTrigger: {
					trigger: "video",
					start: startValue,
					end: endValue,
					scrub: true,
					pin: true,
					onUpdate: (self) => {
						if (videoRef.current) {
							const video = videoRef.current;
							const progress = self.progress;

							// Calculate video time based on scroll progress
							const videoDuration = video.duration || 0;
							const targetTime = progress * videoDuration;

							// Set video currentTime to match scroll progress
							if (!isNaN(targetTime)) {
								video.currentTime = targetTime;
							}

							// Pause the video to prevent auto-play
							if (!video.paused) {
								video.pause();
							}
						}
					},
					onEnter: () => {
						// Ensure video is loaded when entering trigger area
						if (videoRef.current) {
							videoRef.current.load();
						}
					},
				},
			})
			.fromTo(
				".video",
				{
					scale: 1,
					opacity: 0.5,
				},
				{
					scale: 1.2,
					opacity: 1,
					duration: 1,
					ease: "power2.out",
				}
			)
			.to(".video", {
				scale: 1.2,
				opacity: 0.5,
				duration: 1,
				ease: "power2.inOut",
			});
	}, []);
	return (
		<>
			<section id="hero" className="noisy">
				<h1 className="title">MOJITO</h1>

				<img src="/images/hero-left-leaf.png" alt="left-leaf" className="left-leaf" />
				<img src="/images/hero-right-leaf.png" alt="right-leaf" className="right-leaf" />

				<div className="body">
					<div className="content">
						<div className="space-y-5 hidden md:block">
							<p>Cool. Crisp. Classic</p>
							<p className="subtitle">
								Sip the Spirit <br /> of Summer
							</p>
						</div>

						<div className="view-cocktails">
							<p className="subtitle">
								Every cocktail on our menu is a blend of premium ingredients, creative flair, and timeless recipes —
								designed to delight your senses.
							</p>
							<a href="#cocktails">View Cocktails</a>
						</div>
					</div>
				</div>
			</section>

			<div className="video absolute inset-0">
				<video ref={videoRef} src="/public/videos/output.mp4" muted playsInline preload="auto" />
			</div>
		</>
	);
};
export default Hero;
