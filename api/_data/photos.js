const quokkas = [
	{
		slug: "quokka_(4).jpg"
	},
	{
		slug: "quokka_(8).jpg"
	},
	{
		slug: "quokka_(7).jpg"
	},
	{
		slug: "quokka_(10).jpg"
	},
	{
		slug: "DSC00420.jpg"
	},
	{
		slug: "DSC00396.jpg"
	},
	{
		slug: "PXL_20211130_103525929.MP.jpg"
	},
	{
		slug: "PXL_20211130_103208599.MP.jpg"
	},
	{
		slug: "DSC00410.jpg"
	},
	{
		slug: "PXL_20211103_015105791.MP.jpg",
		message: "This is technically a quokka"
	},
	{
		slug: "-rsshm9.jpg"
	},
	{
		slug: "quokka_(11).jpg"
	},
	{
		slug: "quokka_(0).jpg",
		message: "This is technically a quokka"
	},
	{
		slug: "PXL_20211129_083945125.MP.jpg"
	},
	{
		slug: "PXL_20211129_083738323.MP.jpg"
	},
	{
		slug: "quokka_(3).jpg"
	},
	{
		slug: "PXL_20211129_083808012.jpg"
	},
	{
		slug: "Snapchat-1232582035.jpg"
	},
	{
		slug: "IMG_20211129_164755_366.jpg"
	},
	{
		slug: "quokka_(2).jpg"
	},
	{
		slug: "DSC00414.jpg"
	},
	{
		slug: "quokka_(9).jpg"
	},
	{
		slug: "quokka_(6).jpg"
	},
	{
		slug: "quokka_(1).jpg"
	},
	{
		slug: "DSC_4136.jpg"
	},
	{
		slug: "quokka_(5).jpg"
	},
	{
		slug: "2j87kx.jpg"
	},
	{
		slug: "PXL_20211129_083757865.jpg"
	},
	{
		slug: "DSC00413.jpg"
	}
]

const notQuokkas = [
	{
		slug: "no-quokka-door.jpg",
		message: "This is technically not a quokka"
	},
	{
		slug: "not_quokka_(4).jpg"
	},
	{
		slug: "not_quokka_(6).jpg"
	},
	{
		slug: "not_quokka_(1).jpg"
	},
	{
		slug: "not_quokka_(5).jpg"
	},
	{
		slug: "not_quokka_(3).jpg"
	},
	{
		slug: "not_quokka_(10).gif"
	},
	{
		slug: "not_quokka_(2).jpg"
	},
	{
		slug: "DSC00338.jpg"
	},
	{
		slug: "not_quokka_(11).gif"
	},
	{
		slug: "not_quokka_(9).jpg"
	},
	{
		slug: "DSC00337.jpg"
	},
	{
		slug: "not_quokka_(8).jpg"
	},
	{
		slug: "not_quokka_(0).jpg"
	},
	{
		slug: "DSC00339.jpg"
	},
	{
		slug: "not_quokka_(7).jpg"
	}
]

const randomImage = (array) => {
	const length = array.length
	const number = Math.floor((Math.random() * length))

	return array[number]
}

module.exports = {
	quokkas,
	notQuokkas,
	randomImage
}