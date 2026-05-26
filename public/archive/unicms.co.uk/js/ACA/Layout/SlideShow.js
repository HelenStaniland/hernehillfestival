/* Advanced Slide Show *\
\* A.C.A || 28/04/2019 */

// @ts-check


class SlideShow {

	/**
	 * Create a new slideshow
	 * @param {HTMLDivElement} main_div
	 */
	constructor(main_div) {

		this.main_div = main_div;

		this.id = "";
		this.data = [];
		this.slide1 = null;
		this.slide2 = null;

		this.index = 0;
		this.delay = 0;

		if (!main_div.hasAttribute('id')) return;

		this.id = main_div.getAttribute('id');

		const json_script = document.getElementById('SlideShow-' + this.id + '-data');

		if (!json_script) return;

		this.data = JSON.parse(json_script.innerHTML);

		if (!this.data) return;

		const keys = Object.keys(this.data);

		if (keys.length >= 2) {
			this.slide1 = document.createElement('div');
			main_div.appendChild(this.slide1);

			this.slide2 = document.createElement('div');
			main_div.appendChild(this.slide2);

			this.configureSlide(this.slide1);
			this.configureSlide(this.slide2);

			this.preloadFirstImage();
		}

		if (main_div.hasAttribute('data-slide-delay')) {
			this.delay = Number(main_div.getAttribute('data-slide-delay'));
		}

		console.log(this);
	};


	configureSlide(div) {
		/// <param name='div' type='HTMLElement'></param>

		div.className = 'slide';

		div.style.position = 'absolute';
		div.style.top = 0;
		div.style.left = 0;
		div.style.right = 0;
		div.style.bottom = 0;
		div.style.backgroundRepeat = 'no-repeat';

		if (this.main_div.hasAttribute('data-image-position')) {
			div.style.backgroundPosition = this.main_div.getAttribute('data-image-position');
		}

		if (this.main_div.hasAttribute('data-image-size')) {
			div.style.backgroundSize = this.main_div.getAttribute('data-image-size');
		}

		div.style.transitionDuration = "2s";
		div.style.transitionProperty = 'opacity';
		div.style.opacity = 0;

		div.addEventListener('transitionend', () => this.next(div));
	};


	preloadFirstImage() {

		const first = this.data[this.index];

		if (first.hasOwnProperty('url')) {
			let img = new Image();
			img.src = first.url;

			//console.log("Preload 1: " + img.src);

			img.addEventListener('load', () => {

				this.slide1.style.backgroundImage = "url('" + img.src + "')";
				this.slide1.style.opacity = "1";
			});
		}

		this.increaseIndex();

		const second = this.data[this.index];

		if (second.hasOwnProperty('url'))
		{
			let img = new Image();
			img.src = second.url;

			//console.log("Preload 2: " + img.src);

			this.slide2.style.backgroundImage = "url('" + this.data[this.index].url + "')";
		}
	};


	start(div) {
		/// <param name='div' type='HTMLElement'></param>

		div.style.backgroundImage = "url('" + this.data[this.index].url + "')";

		div.style.opacity = 1;
	};


	next(div) {
		/// <param name='div' type='HTMLElement'></param>

		let other_div = null;

		//console.log("Finished: " + div.style.backgroundImage);

		if (div.style.opacity == 0)
		{
			//console.log(".....and it's gone!");

			this.increaseIndex();

			div.style.backgroundImage = "url('" + this.data[this.index].url + "')";

			return;
		}

		if (div === this.slide1) {

			other_div = this.slide2;
			//console.log("slide 1 complete!");
		}
		else if (div === this.slide2) {
			other_div = this.slide1;
			//console.log("slide 2 complete!");
		}
		else throw new Error("Slideshow error!");



		window.setTimeout(() => {

			div.style.opacity = 0;
			
			this.start(other_div);

		}, this.delay * 1000);
	};


	increaseIndex() {

		this.index++;

		if (this.index >= this.data.length) this.index = 0;
	};


	static Setup() {

		/**
		 * @type NodeListOf<HTMLDivElement>
		 */
		const slideshows = document.body.querySelectorAll("div.SlideShow[id]");

		for (let i = 0; i < slideshows.length; i++) {
			new SlideShow(slideshows[i]);
		}
	};
};



if (document.readyState === 'complete') {
	SlideShow.Setup();
}
else {
	window.addEventListener('load', SlideShow.Setup);
}