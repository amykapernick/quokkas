const quokkaResults = ({image, results}) => {
	const list = document.querySelector('.results'),
	quokka = results.quokka > results.negative,
	caption = quokka ? 'Quokka' : 'Not Quokka',
	percentage = quokka ? results.quokka : results.negative,
	html = `<li>
				<figure>
					<img src="${image}" alt="">
					<figcaption>${caption}<small>${(percentage* 100).toFixed(2)}%</small></figcaption>
				</figure>
			</li>`

			list.insertAdjacentHTML('afterbegin', html)
}

fetch('https://corn-oyster-5571.twil.io/sync-token')
.then(response => response.json())
.then(data => {
	const client = new Twilio.Sync.Client(data.token),
	pastResults = document.querySelectorAll('.results figure')

	client.document('image').then(doc => {
		document.querySelector('#lastSent img').src = doc.value.image

		doc.on('updated', e => {
			document.querySelector('#lastSent img').src = doc.value.image
		})
	})

	client.list('pastResults').then(list => {
		list.on('itemAdded', e => {
			quokkaResults({...e.item.data.value})
		})
		return list.getItems()
	}).then(list => {
		list.items.forEach((img, index) => {

			if(!img.data.value.results) {
				return
			}

			quokkaResults({...img.data.value})
		})
	})
});