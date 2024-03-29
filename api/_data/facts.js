const facts = [
	`Quokkas can survive a long time without food and water`,
	`Quokkas are peceful with each other`,
	`They look cute, but they're pretty annoying.\nQuokkas are known to wander inter restaurants and shops and have to be shooed away!`,
	`Quokkas look teeny tiny in photos, but they’re actually roughly the size of a small cat – especially when they get on their hind legs and have a biiiig streeeetch!`,
	`Quokkas are such show-stealers, their entire home is named after them - Eylandt Rottenest (Rat’s Nest Island)`,
	`Quokkas move around by hopping and bounding, or moving forward using their hands`,
	`Quokkas can climb trees if they need to – with heights of up to 2 metres!`,
	`Quokkas store fat in their chubby lil’ tails as a means of surviving when food supplies are low, and they can also go months without water. `,
	`Quokkas are not territorial and are very happy to share space, food and shelter!`,
	`Quokka mothers will have no more than two babies a year`,
	`Quokka reach maturity at about one and a half to two years of age, and the average lifespan is 10 years`,
	`Quokkas are nocturnal and spend most of the day sleeping and resting, but are also active during the day`,
	`Touching the quokkas is strictly prohibited as it could make you both sick`,
	`Quokkas have sharp claws and teeth they will use against you if they feel threatened`,
	`Though they’re known as the happiest animal on earth, their “smiles” are mainly due to the shape of their mouths`,
	`Quokkas comes from the name given to them by the Aboriginal people living in south-west Western Australia`,
	`Quokkas are a vulnerable species`,
	`Yes, Quokkas do smile, but we don't know if they're happy.`,
	`The correct way to pronounce Quokkas according to the Cambridge Dictionary is “kwok-uh`,
	`Quokkas climb trees mainly to get food.`,
	`Quokkas have the ability to swim, but you won't find them doing the butterfly stroke very often.`,
	'Quokkas Occupy Only a Small Portion of Australia.',
	'Quokkas Eat Their Food Twice.',
	`Quokkas move around by hopping and bounding, or moving forward using their hands.`,
	`The word "quokka" is derived from a Nyungar word, which was probably gwaga.`,
	`Quokka come from same family as kangaroos, except these little guys only grow to be about the size of a domestic cat.`,
	`Quokka carry their babies in their pouch just like kangaroos.`,
	`Adult quokkas when threatened, are known to sometimes sacrifice their babies by throwing out of their pouches to serve as a distraction, allowing them to get enough time to run.`,
	`Watching Quokka has been proven to reduce stress among viewers of footage of the little creature`,
	`Quokkas live in trees, shrubs, swamps and other areas with dense vegetation. They don't like the exposure of wide and open spaces.`
]

const randomFacts = (array) => {
	const length = array.length
	const number = Math.floor((Math.random() * length))

	return `Fun Quokka Fact #${Math.floor((Math.random() * 1000))}: ${array[number]}`
}

module.exports = {
	facts,
	randomFacts
}