/* Advanced Slide Show *\
\* A.C.A || 28/04/2019 */

// @ts-check

function encodeSlideUrl(url) {
	return url
		.split("/")
		.map((part, index) => (index === 0 ? part : encodeURIComponent(part)))
		.join("/");
}

function resolveSlideUrl(url) {
	return new URL(url, document.baseURI).href;
}

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

		this.data = JSON.parse(json_script.textContent);

		if (!Array.isArray(this.data) || this.data.length < 2) return;

		this.slide1 = document.createElement('div');
		main_div.appendChild(this.slide1);

		this.slide2 = document.createElement('div');
		main_div.appendChild(this.slide2);

		this.configureSlide(this.slide1);
		this.configureSlide(this.slide2);

		if (main_div.hasAttribute('data-slide-delay')) {
			this.delay = Number(main_div.getAttribute('data-slide-delay'));
		}

		this.preloadFirstImage();
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


	setSlideImage(div, url) {
		div.style.backgroundImage = "url('" + resolveSlideUrl(encodeSlideUrl(url)) + "')";
	};


	preloadImage(url, onLoad) {
		const img = new Image();
		let loaded = false;

		const finish = () => {
			if (loaded) {
				return;
			}

			loaded = true;
			onLoad();
		};

		img.addEventListener('load', finish);
		img.addEventListener('error', () => {
			console.warn('Slideshow image failed to load:', url);
		});

		img.src = resolveSlideUrl(encodeSlideUrl(url));

		if (img.complete) {
			finish();
		}
	};


	preloadFirstImage() {

		const first = this.data[this.index];

		if (first.hasOwnProperty('url')) {
			this.preloadImage(first.url, () => {
				this.setSlideImage(this.slide1, first.url);
				this.slide1.style.opacity = "1";
			});
		}

		this.increaseIndex();

		const second = this.data[this.index];

		if (second.hasOwnProperty('url'))
		{
			this.preloadImage(second.url, () => {
				this.setSlideImage(this.slide2, second.url);
			});
		}
	};


	start(div) {
		/// <param name='div' type='HTMLElement'></param>

		this.setSlideImage(div, this.data[this.index].url);

		div.style.opacity = 1;
	};


	next(div) {
		/// <param name='div' type='HTMLElement'></param>

		let other_div = null;

		if (div.style.opacity == 0)
		{
			this.increaseIndex();

			this.setSlideImage(div, this.data[this.index].url);

			return;
		}

		if (div === this.slide1) {

			other_div = this.slide2;
		}
		else if (div === this.slide2) {
			other_div = this.slide1;
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



if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', SlideShow.Setup);
}
else {
	SlideShow.Setup();
}
