/* Menu for Herne Hill Festival *\
\* A.C.A. || 10th February 2019 */

// @ts-check


class Menu
{
	constructor() {

		var menu_icon = document.getElementById('menu-icon');

		if (!menu_icon) return;

		this.nav = document.body.querySelector('nav');

		if (!this.nav) return;

		menu_icon.addEventListener('click', () => this.ToggleMenu());

		var close_button = document.createElement('a');

		close_button.id = 'close-menu';
		close_button.href = '#';
		close_button.innerHTML = '&#215;';
		close_button.addEventListener('click', () => this.CloseMenu());

		this.nav.insertBefore(close_button, this.nav.firstElementChild);
	};


	ToggleMenu() {

		if (this.nav.hasAttribute('data-visible')) {
			this.CloseMenu();
		}
		else
			this.nav.setAttribute('data-visible', true);
	};


	CloseMenu() {

		this.nav.removeAttribute('data-visible');
	};
};



if (document.readyState === 'complete') {
	new Menu();
}
else {
	window.addEventListener('load', function () { new Menu(); });
}