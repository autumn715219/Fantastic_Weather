function sidebarSlide() {
	const hamburger = document.querySelector(".hamburger");
	const blockSB = document.querySelector(".blockSB");
	const close = document.querySelector(".close");
	const main = document.querySelector(".main");

	hamburger.addEventListener("click", () => {
		blockSB.style.animation = "slideIn 0.5s both";
	});

	close.addEventListener("click", () => {
		blockSB.style.animation = "slideOut 0.5s both";
	});

	if (window.innerWidth < 600) {
		main.addEventListener(
			"click",
			() => {
				blockSB.style.animation = "slideOut 0.5s both";
			},
			true
		);
	}
}
sidebarSlide();
