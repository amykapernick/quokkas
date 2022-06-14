import fire
import pyperclip
import json
from os import listdir, getcwd
from os.path import isfile, join

def gen_photos():
	folder = join(getcwd(), 'site/public/img')

	quokkaFolder = join(folder, 'quokkas')
	notQuokkaFolder = join(folder, 'not_quokkas')

	quokkas = [join(quokkaFolder, f) for f in listdir(quokkaFolder) if 
	isfile(join(quokkaFolder, f))]

	notQuokkas = [join(notQuokkaFolder, f) for f in listdir(notQuokkaFolder) if 
	isfile(join(notQuokkaFolder, f))]

	quokkaPhotos = []
	notQuokkaPhotos = []

	for photo in quokkas:
		quokkaPhotos.append({
			'slug': photo.split('/')[-1],
		})

	for photo in notQuokkas:
		notQuokkaPhotos.append({
			'slug': photo.split('/')[-1],
		})

	allPhotos = {
		'quokkas': quokkaPhotos,
		'notQuokkas': notQuokkaPhotos
	}

	pyperclip.copy(json.dumps(allPhotos))

	print('Photos have been copied to clipboard')



if __name__ == "__main__":
    fire.Fire(gen_photos)