const quokkaResults = ({image, results}) => {
	const list = document.querySelector('ul.results'),
	quokka = results.quokka > results.negative,
	caption = quokka ? 'Quokka' : 'Not Quokka',
	percentage = quokka ? results.quokka : results.negative,
	quokkaImage = new Image(),
	html = `<li>
				<figure>
					<img src="${image}" alt="">
					<figcaption>${caption}<small>${(percentage* 100).toFixed(2)}%</small></figcaption>
				</figure>
			</li>`

	quokkaImage.src = image

	quokkaImage.onload = () => {
		list.insertAdjacentHTML('afterbegin', html)

		if(list.querySelectorAll('li').length > 5) {
			list.querySelector('li:last-child').remove()
		}	
	}	
}

fetch('https://corn-oyster-5571.twil.io/sync-token')
.then(response => response.json())
.then(data => {
	const client = new Twilio.Sync.Client(data.token)

	client.document('image').then(doc => {
		document.querySelector('#last-sent img').src = doc.value.image

		doc.on('updated', e => {
			document.querySelector('#last-sent img').src = doc.value.image
		})
	})

	client.list('pastResults').then(list => {
		list.on('itemAdded', e => {
			quokkaResults({...e.item.data.value})
		})
		return list.getItems({pageSize: 5, order: 'desc'})
	}).then(list => {
		list.items.reverse().forEach((img, index) => {

			if(!img.data.value.results) {
				return
			}

			quokkaResults({...img.data.value})
		})
	})
});