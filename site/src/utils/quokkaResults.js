const quokkaResults = ({ image, results }) => {
	const list = document.querySelector(`ul.results`);
	const quokka = results.quokka > results.negative;
	const caption = quokka ? `Quokka` : `Not Quokka`;
	const percentage = quokka ? results.quokka : results.negative;
	const quokkaImage = new Image();
	const html = `<li><figure><img src="${image}" alt="" /><figcaption>${caption}<small>${(percentage * 100).toFixed(2)}%</small></figcaption></figure></li>`

	quokkaImage.src = image

	quokkaImage.onload = () => {
		list.insertAdjacentHTML(`afterbegin`, html)

		if (list.querySelectorAll(`li`).length > 5) {
			list.querySelector(`li:last-child`).remove()
		}
	}
}

export default quokkaResults