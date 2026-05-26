//@ts-check

/**
 * Event details page
 * @author ACA
 * @since 21st April 2019
 */
class Details
{
	constructor()
	{
		const verifyable_form = document.body.querySelector("[itemtype$='MusicEvent'] .VerifyableForm");

		if (verifyable_form)
		{
			if (!document.body.querySelector("[itemprop='performer']"))
			{
				const details = document.body.querySelector("[itemtype$='MusicEvent'] .main .details");

				if (details)
				{
					verifyable_form.parentNode.removeChild(verifyable_form);

					details.appendChild(verifyable_form);
				}
			}
		}

		const ics_link = document.body.querySelector("#Details a[href*='ics']");

		if (ics_link)
		{
			const times = document.body.querySelector("[itemtype$='MusicEvent'] div.times");

			if (times)
			{
				times.appendChild(ics_link);
			}
		}

		const quicklinks = document.body.querySelector("[itemtype$='MusicEvent'] .quicklinks");

		if (!quicklinks) return;

		const start = document.body.querySelector("[itemtype$='MusicEvent'] time[itemprop='startDate'][datetime][data-D][data-j][data-S][data-M][data-short-time]");

		let isEventPast = false;

		if (start)
		{
			const start_time = start.getAttribute('data-D').toUpperCase() +' '+start.getAttribute('data-j')+'<sup>'+start.getAttribute('data-S')+'</sup> '+start.getAttribute('data-M').toUpperCase() + ' '+start.getAttribute('data-short-time');

			const div = document.createElement('div');

			div.className = 'start-time';
			div.innerHTML = start_time;

			quicklinks.appendChild(div);

			const startDateTime = new Date(start.getAttribute('datetime'));
			const now = new Date(Date.now());

			if (startDateTime < now) {
				isEventPast = true;
			}
		}

		const tickets = document.body.querySelector("[itemtype$='MusicEvent'] [itemprop='offers'] a[itemprop='url'][href]");

		if (tickets && !isEventPast)
		{
			const a = document.createElement('a');

			a.className = 'tickets';
			a.innerHTML = "BUY TICKETS";
			a.href = tickets.getAttribute('href');
			a.target = '_blank';

			quicklinks.appendChild(a);
		}
		else
		{
			const prices = document.body.querySelectorAll("[itemtype$='MusicEvent'] [itemprop='offers'] [itemprop='price'][data-number]");
			const sold_out = document.body.querySelectorAll('[itemtype$="MusicEvent"] [itemprop="availability"][href="http://schema.org/SoldOut"');

			if (sold_out && sold_out.length > 0) {

				let div = document.createElement('div');

				div.className = 'tickets';
				div.innerHTML = "SOLD OUT";

				quicklinks.appendChild(div);
			}
			else if (prices)
			{
				let div = document.createElement('div');

				div.className = 'tickets';
				div.innerHTML = "TICKETS ";

				let showArrow = false;

				for (let i=0; i<prices.length; i++)
				{
					let price = prices[i].getAttribute('data-number');

					if (/.00$/.test(price)) price = price.substr(0, price.length-3);

					if (i > 0) div.innerHTML += " / ";

					if (Number(price) == 0)
					{
						if (i===0)
						{
							div.innerHTML = "FREE";

							showArrow = true;

							break;
						}

						div.innerHTML += "FREE";
					}

					else div.innerHTML += "&pound;" + price;
				}

				if (showArrow || isEventPast) {
					quicklinks.appendChild(div);
				}
			}
		}
	};
};

new Details();