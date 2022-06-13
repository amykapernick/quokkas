export type MenuItem = {     
	label: string,
	path: string,
	icon?: string,
	cta?: boolean,
	current?: boolean
}

export type MetaData = {
	title?: string,
	description?: string,
	image?: string
}

export type SiteData = MetaData & {
	name: string, 
	contact: {
		email: string,
		phone: { 
			label: string,
			value?: string
		}
	},
}

export type CTA = {
	label: string,
	path: string,
	colour?: string, 
	arrow?: boolean
}  

export type Testimonial = { 
	name: string,
	content: string,
	role: string,
} 
     
export type Block = {
	type?: string,
	title?: string,  
	content?: string,
	image?:	string,
	background?: string,
	cta?: CTA[], 
	subheading?: string,
	blocks?: Block[],
	testimonials?: Testimonial[], 
}

export type PageContent = MetaData & {
	layout?: Block[]
}
 
export type BlogAuthor = {
	name: string,
	url: string,
	profile_image: string
}

export type BlogTag = {
	name: string,
	id: string    
}

export type BlogPost = {
	url: string,
	title: string,
	feature_image: string,
	published_at: string,
	reading_time: number, 
	primary_author: BlogAuthor
	tags: BlogTag[]
}

export type Tweet = {
	url: string,
	html: string
}