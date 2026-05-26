//@ts-check

class ProgrammeFilter
{
	constructor()
	{
		this.div = document.getElementById('ProgrammeFilter');
		const script = document.getElementById('ProgrammeFilter-data');

		if (!this.div || !script)
			return;

		const data = JSON.parse(script.innerHTML);

		if (!data)
			return;

		const keys = Object.keys(data);

		for (let i = 0; i < keys.length; i++)
		{
			const key = keys[i];

			let button = this.div.querySelector("a[title='" + key + "']");

			if (!button) continue;

			const ids = data[key];

			button.addEventListener('click', (ev) => this.#ClickButton(ev, button, ids));
		}

		const show_all = this.div.querySelector("a[title='Show all']");

		if (show_all)
			show_all.addEventListener('click', (ev) => this.#ShowAllEvents(ev, show_all));
	};


	#ClickButton(ev, button, array)
	{
		this.#DeselectButtons();

		button.classList.add("selected");

		let all_links = document.querySelectorAll(".CustomPage .boxes > a[data-event-id]");

		for (let i = 0; i < all_links.length; i++)
		{
			var a = all_links[i];

			const event_id = Number(a.getAttribute('data-event-id'));

			if (array.includes(event_id))
				a.classList.remove("hidden");
			else
				a.classList.add("hidden");
		}
	};


	#ShowAllEvents(ev, button)
	{
		this.#DeselectButtons();

		button.classList.add("selected");

		let all_links = document.querySelectorAll(".CustomPage .boxes > a");

		for (let i = 0; i < all_links.length; i++)
		{
			var a = all_links[i];

			a.classList.remove("hidden");
		}
	};


	#DeselectButtons()
	{
		let buttons = this.div.querySelectorAll('a');

		for (let i = 0; i < buttons.length; i++)
		{
			let button = buttons[i];

			button.classList.remove("selected");
		}
	};
};


new ProgrammeFilter();