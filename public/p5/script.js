const string = "."; //words to be displayed
const string2 = "."; //words to be displayed
const string3 = "."; //words to be displayed
const size = 200; //font size
const fontFile = "Replica-Bold.ttf";
const showText = false; //whether or not to have an overlay of the original text (in the background color)
const textAlpha = 1; //the alpha of the text if displayed (low value will make it slowly fade in)
const backgroundColor = 255; //kinda self-explanatory
const strokeAlpha = 200; //the alpha of the lines (lower numbers are more transparent)
const strokeColor = 0; //the line color


const fontSampleFactor = 0.2; //How many points there are: the higher the number, the closer together they are (more detail)

const noiseZoom = 0.001; //how zoomed in the perlin noise is
const noiseOctaves = 2; //The number of octaves for the noise
const noiseFalloff = 1.8; //The falloff for the noise layers

const zOffsetChange = 0; //How much the noise field changes in the z direction each frame
const individualZOffset = 1.5; //how far away the points/lines are from each other in the z noise axies (the bigger the number, the more chaotic)

const lineSpeed = 10.5; //the maximum amount each point can move each frame

const newPointsCount = 1; //the number of new points added when the mouse is dragged


var font;
var points = [];
var startingPoints;

var points2 = [];
var startingPoints2;

var points3 = [];
var startingPoints3;

function preload() {
	font = loadFont(fontFile);
}

function setup() {
	createCanvas(windowWidth, windowHeight);
	background(backgroundColor);
	textFont(font);
	textSize(size);
	textAlign(CENTER);
	fill(strokeColor, textAlpha);
	stroke(strokeColor, strokeAlpha);
	noiseDetail(noiseOctaves, noiseFalloff);

	startingPoints = font.textToPoints(string, width / 2 - textWidth(string) / 2 , 100 , size, {"sampleFactor": fontSampleFactor});
	for (let p = 0; p < startingPoints.length; p++) {
		points[p] = startingPoints[p];
		points[p].zOffset = random();
	}
	
	startingPoints2 = font.textToPoints(string2, 0 , 0 , size, {"sampleFactor": fontSampleFactor});
	for (let p = 0; p < startingPoints2.length; p++) {
		points2[p] = startingPoints2[p];
		points2[p].zOffset = random();
	}
	
	startingPoints3 = font.textToPoints(string3, 0 , 0 , size, {"sampleFactor": fontSampleFactor});
	for (let p = 0; p < startingPoints3.length; p++) {
		points3[p] = startingPoints3[p];
		points3[p].zOffset = random();
	}
	
	
}

function draw() {
	stroke(strokeColor, strokeAlpha);
	for (let pt = 0; pt < points.length; pt++) {
		let p = points[pt];
		let noiseX = p.x * noiseZoom * 1.5;
		let noiseY = p.y * noiseZoom * 1.5;
		let noiseZ = frameCount * zOffsetChange * random() + p.zOffset*individualZOffset;
		let newPX = p.x + map(noise(noiseX, noiseY, noiseZ), 0, 1, -lineSpeed, lineSpeed);
		let newPY = p.y + map(noise(noiseX, noiseY, noiseZ + 214), 0, 1, -lineSpeed, lineSpeed);
		line(p.x + random(), p.y + random(), newPX, newPY);
		p.x = newPX;
		p.y = newPY;
	}
	
	push();
		translate(100, height - 50);
		rotate(radians(-90))
		for (let pt = 0; pt < points2.length; pt++) {
			let p = points2[pt];
			let noiseX = p.x * noiseZoom * 1.5;
			let noiseY = p.y * noiseZoom * 1.5;
			let noiseZ = frameCount * zOffsetChange * random() + p.zOffset*individualZOffset;
			let newPX = p.x + map(noise(noiseX, noiseY, noiseZ), 0, 1, -lineSpeed, lineSpeed);
			let newPY = p.y + map(noise(noiseX, noiseY, noiseZ + 214), 0, 1, -lineSpeed, lineSpeed);
			line(p.x + random(), p.y + random(), newPX, newPY);
			p.x = newPX;
			p.y = newPY;
		}
	pop();
	
	push();
	  translate(width - 100, height - 100);
		rotate(radians(140))
		for (let pt = 0; pt < points3.length; pt++) {
			let p = points3[pt];
			let noiseX = p.x * noiseZoom * 1.5;
			let noiseY = p.y * noiseZoom * 1.5;
			let noiseZ = frameCount * zOffsetChange * random() + p.zOffset*individualZOffset;
			let newPX = p.x + map(noise(noiseX, noiseY, noiseZ), 0, 1, -lineSpeed, lineSpeed);
			let newPY = p.y + map(noise(noiseX, noiseY, noiseZ + 214), 0, 1, -lineSpeed, lineSpeed);
			line(p.x + random(), p.y + random(), newPX, newPY);
			p.x = newPX;
			p.y = newPY;
		}
	pop();
	
	fill(strokeColor);
	textSize(40);
	noStroke();
	text('Foreningen Ekko', width / 2 , 100 );
	text('Østre', 25 + textWidth('Østre')/2 , height - 70 );
	text('Ekko Festival', width - textWidth('Ekko Festival')/2 - 25 , height - 70 );
}