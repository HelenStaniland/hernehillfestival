/* Photo Gallery for HHMF *\
\* A.C.A. || 1st May 2019 */

// @ts-check

class PhotoGallery {

	constructor() {

		this.Gallery = document.getElementById('PhotoGallery');

		if (!this.Gallery) return;

		for (let i=0; i<this.Gallery.children.length; i++)
		{
			let a = this.Gallery.children.item(i);

			a.addEventListener('click', (e) => this.ClickImage(a,e));
		}
	};


	ClickImage(a, e) {
		/// <param name='a' type='HTMLElement'></param>
		/// <param name='e' type='Event'></param>
		
		e.preventDefault();

		let img = a.querySelector('img[src]');

		if (img)
		{
			let src = img.getAttribute('src');

			let overlay = document.createElement('div');

			overlay.style.position = 'fixed';
			overlay.style.top = "0";
			overlay.style.left = "0";
			overlay.style.right = "0";
			overlay.style.bottom = "0";
			overlay.style.backgroundColor = 'rgba(0,0,0,0.6)';

			document.body.appendChild(overlay);

			overlay.addEventListener('click', function (e) {
				this.parentElement.removeChild(this);
				e.stopPropagation();
			}.bind(overlay));

			overlay.style.display = 'flex';
			overlay.style.alignItems = 'center';
			overlay.style.justifyContent = 'center';
			overlay.style.flexDirection = 'column';


			let image_div = document.createElement('div');
			image_div.style.flexShrink = "1";
			image_div.style.flexBasis = "0px";

			let img_inside = document.createElement('img');
			img_inside.src = src;
			img_inside.style.maxHeight = "85vh";

			image_div.appendChild(img_inside);

			overlay.appendChild(image_div);

			if (img.hasAttribute('title'))
			{
				let title = img.getAttribute('title');

				if (title)
				{
					let h1 = document.createElement('h1');
					h1.style.color = 'white';
					h1.innerHTML = title;
					h1.style.textAlign = 'center';
					h1.style.fontSize = "20px";
					h1.style.position = 'absolute';
					h1.style.left = "0";
					h1.style.top = "0";
					h1.style.right = "0";
					h1.style.textShadow = "0px 0px 5px black";

					overlay.appendChild(h1);
				}
			}
		}
	};
};



if (document.readyState === 'complete') {
	new PhotoGallery();
}
else {
	window.addEventListener('load', function () { new PhotoGallery(); });
}