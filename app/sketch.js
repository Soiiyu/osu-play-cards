// osu-play-cards for creating a graphic that displays information of an osu! play
// Created by Soiiyu @ https://github.com/Soiiyu

let title = 'Song Title';
let diff = 'Difficulty';
let id = 'Map ID';
let rank = '0'
let totalpp = '0'
let bgUrl = '0';
let username = 'player'
let pp = '0'

let canvas, bg, userPic, scoreUrl;

let padding = 15;
const mapSize = {
	width: 550,
	height: 130
}

const scoreID = document.getElementById('score-id')
const loadScoreButton = document.getElementById('load-score')
const loadManuallyButton = document.getElementById('load-manually')
const toggleManual = document.getElementById('toggle-manual')
const manualTab = document.getElementById('manual')

const player = document.getElementById("player");
const profilePic = document.getElementById("profile-pic");
const rankElement = document.getElementById("rank");
const totalPP = document.getElementById("total-pp");
const playPP = document.getElementById("play-pp");
const songTitle = document.getElementById("song-Title");
const difficulty = document.getElementById("difficulty");
const backgroundUrl = document.getElementById("background-url");

loadScoreButton.onclick = load
loadManuallyButton.onclick = loadManually
toggleManual.onclick = () => {
	manualTab.classList.toggle('invisible')
}

async function load() {
	console.log('loading')
	try {
		if(scoreID.value.match(/^\d+$/)) scoreID.value = `https://osu.ppy.sh/scores/osu/${scoreID.value}`
		scoreUrl = scoreID.value
		if (!scoreUrl.match(/osu.ppy.sh\/scores\/osu\/\d+/)) return console.log('invalid score url')
		const options = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ data: scoreUrl, type: 'score' })
		}

		const fetchedScore = (await fetch('/fetchData', options).then(res => res.json()))
		const { score } = fetchedScore

		username = score.user.username
		pp = score.pp
		title = score.beatmapset.title
		diff = score.beatmap.version
		id = score.beatmap_id

		player.value = username
		profilePic.value = score.user.avatar_url
		playPP.value = pp
		songTitle.value = title
		difficulty.value = diff
		backgroundUrl.value = score.beatmapset.covers.cover

		options.body = JSON.stringify({ data: score.user.id, type: 'player' })
		const fetchedUser = await fetch('/fetchData', options).then(res => res.json())

		rank = fetchedUser.rank
		totalpp = Math.round(parseFloat(fetchedUser.totalpp))

		rankElement.value = rank
		totalPP.value = totalpp

		console.log(fetchedScore, score)
		console.log(fetchedUser, rank, totalpp)
		bg = await createImg(score.beatmapset.covers.cover, "map bg", null, drawLoadedImg)
		bg.hide()

		userPic = await createImg(score.user.avatar_url, "user pfp", null, drawLoadedImg)
		userPic.hide()
		console.log('loaded')
	} catch (error) {
		console.log('Error loading score or images', error)
	}
}

async function loadManually() {
	console.log('loading manual inputs')
	try {
		username = player.value
		pp = playPP.value
		title = songTitle.value
		diff = difficulty.value
		rank = rankElement.value
		totalpp = totalPP.value

		if(backgroundUrl.value.match(/^\d+$/)) backgroundUrl.value = `https://assets.ppy.sh/beatmaps/${backgroundUrl.value}/covers/cover.jpg`
		bg = await createImg(backgroundUrl.value, "map bg", null, drawLoadedImg)
		bg.hide()

		if(profilePic.value.match(/^\d+$/)) profilePic.value = `https://a.ppy.sh/${profilePic.value}`
		userPic = await createImg(profilePic.value, "user pfp", null, drawLoadedImg)
		userPic.hide()
	} catch (error) {
		console.log('Error loading manual score or images', error)
	}
}

function preload() {
	kulimParkRegular = loadFont('assets/KulimPark-Regular.ttf');
	kulimParkBold = loadFont('assets/KulimPark-Bold.ttf');
}

function setup() {
	canvas = createCanvas(650, 300);
	drawingContext.shadowOffsetX = 0;
	drawingContext.shadowOffsetY = 0;
	drawingContext.shadowBlur = 25;
	drawingContext.shadowColor = 'black';

	// Fixes double canvas resolution, but looks worse.
	// pixelDensity(1)

	noLoop();
}

function draw() {
	if (!bg || !userPic) return
	clear()

	// Calculate background aspect ratio and trim accordingly
	let [targetWidth, targetHeight] = [bg.width, bg.height];

	let expectedWidth = (bg.height / mapSize.height) * mapSize.width;
	let expectedHeight = (bg.width / mapSize.width) * mapSize.height;

	if (expectedHeight < bg.height) targetHeight = expectedHeight;
	else if (expectedWidth < bg.width) targetWidth = expectedWidth;

	let targetY = (bg.height - targetHeight) / 2;
	let targetX = (bg.width - targetWidth) / 2;

	const [bgX, bgY] = [width - mapSize.width - 50, height - mapSize.height - 90]
	image(bg, bgX, bgY, mapSize.width, mapSize.height, targetX, targetY, targetWidth, targetHeight);

	// Darken bg image
	fill(0, 0, 0, 50)
	noStroke()
	rect(bgX, bgY, mapSize.width, mapSize.height)

	image(userPic, bgX + padding, bgY + padding, mapSize.height - padding * 2, mapSize.height - padding * 2)

	stroke('#333a8a')
	strokeWeight(2)
	fill('white')
	textFont(kulimParkBold)
	textSize(30)
	textAlign(LEFT, BOTTOM)
	text(username, bgX + mapSize.height, bgY + mapSize.height * 0.5, 250)

	textSize(48)
	textAlign(RIGHT, BOTTOM)
	text(`${Math.round(pp)}pp`, bgX + mapSize.width - padding, bgY + mapSize.height * 0.5 + 24)

	textSize(24)
	textAlign(CENTER, BOTTOM)
	const trimmedTitle = trimText(title, 24, mapSize.width)
	text(trimmedTitle, bgX, bgY + mapSize.height + 24 + padding, mapSize.width)

	fill('#c5d0e7')
	textSize(18)
	textAlign(LEFT, TOP)
	text(`#${rank} • ${totalpp}pp`, bgX + mapSize.height, bgY + mapSize.height * 0.5, 250)

	textFont(kulimParkRegular)
	textSize(18)
	textAlign(CENTER, BOTTOM)
	const trimmedDiff = trimText(diff, 18, mapSize.width)
	text(trimmedDiff, bgX, bgY + mapSize.height + 24 + 10 + padding * 2, mapSize.width)

	const filename = `${player} - ${title.replace(/[\?:\/\\\"\*\<\>]/g, '')} [${diff.replace(/[\?:\/\\\"\*\<\>]/g, '')}] ${id.toString().replace(/[\/\\]/, '')}.png`;
	
	console.log(`finished creating ${filename}`);
}

function drawLoadedImg(img) {
	draw()
	return img
}

function trimText(text, fontSize, maxWidth) {
	textSize(fontSize)
	let output = text
	if (textWidth(text) < maxWidth) return output

	const suffixLength = textWidth('...')
	while (textWidth(output) >= maxWidth - suffixLength) {
		output = output.split('')
		output.pop()
		output = output.join('').trim()
	}
	return output + '...'
}