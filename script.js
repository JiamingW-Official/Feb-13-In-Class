// Updated Demo Code for letters "J, I, A, M, I, N, G" using Skia.ttf,
// with faster animation, full letter details, and centering in the middle

let skiaFont;
let g; // current set of points (starting with "J")
let j, iLetter, aLetter, mLetter, nLetter, gLetter;
let counter = 0; // 0: J, 1: I, 2: A, 3: M, 4: I, 5: N, 6: G
let speed = 5; // Speed multiplier for animation

function preload() {
  skiaFont = loadFont("Skia.ttf");
}

function setup() {
  // Create canvas and attach it to the container
  let canvas = createCanvas(400, 400);
  canvas.parent('canvas-container');
  
  // Generate text points for each letter.
  // The x and y values here are arbitrary since we'll recenter them.
  j = skiaFont.textToPoints("J", 50, 130, 150, { sampleFactor: 0.4 });
  g = skiaFont.textToPoints("J", 50, 130, 150, { sampleFactor: 0.4 });
  iLetter = skiaFont.textToPoints("I", 50, 130, 150, { sampleFactor: 0.4 });
  aLetter = skiaFont.textToPoints("A", 50, 130, 150, { sampleFactor: 0.41 });
  mLetter = skiaFont.textToPoints("M", 50, 130, 150, { sampleFactor: 0.4 });
  nLetter = skiaFont.textToPoints("N", 50, 130, 150, { sampleFactor: 0.4 });
  gLetter = skiaFont.textToPoints("G", 50, 130, 150, { sampleFactor: 0.406 });
  
  // Center each letter on the canvas
  j = centerPoints(j);
  iLetter = centerPoints(iLetter);
  aLetter = centerPoints(aLetter);
  mLetter = centerPoints(mLetter);
  nLetter = centerPoints(nLetter);
  gLetter = centerPoints(gLetter);
  g = centerPoints(g);
  
  // Resample all letter arrays so they have the same number of points.
  equalizeAllPoints();
}

function draw() {
  background(0);
  noStroke();
  fill(255);
  
  // Draw and morph each point.
  for (let i = 0; i < g.length; i++) {  
    ellipse(g[i].x, g[i].y, 2, 2);
    
    // Morph the current letter to the target letter based on the counter.
    switch(counter) {
      case 0: 
        letterMorph(i, j);
        break;
      case 1: 
        letterMorph(i, iLetter);
        break; 
      case 2: 
        letterMorph(i, aLetter);
        break;
      case 3: 
        letterMorph(i, mLetter);
        break; 
      case 4: 
        letterMorph(i, iLetter);
        break;
      case 5: 
        letterMorph(i, nLetter);
        break;
      case 6: 
        letterMorph(i, gLetter);
        break; 
    }
  }
}

/* 
   Moves the current point g[i] toward its target by up to "speed" pixels.
*/
function letterMorph(i, targetLetter) {
  if (!targetLetter[i]) return;
  
  if (g[i].x < targetLetter[i].x) {
    g[i].x = min(g[i].x + speed, targetLetter[i].x);
  }
  if (g[i].x > targetLetter[i].x) {
    g[i].x = max(g[i].x - speed, targetLetter[i].x);
  }
  
  if (g[i].y < targetLetter[i].y) {
    g[i].y = min(g[i].y + speed, targetLetter[i].y);
  }
  if (g[i].y > targetLetter[i].y) {
    g[i].y = max(g[i].y - speed, targetLetter[i].y);
  }
}

function mousePressed(){
  // Cycle through the letters on each mouse press.
  counter = (counter < 6) ? counter + 1 : 0;
}

/* 
   Resamples an array of points to have exactly targetCount points.
   It evenly distributes the original points over the new array.
*/
function resamplePoints(points, targetCount) {
  let newPoints = [];
  for (let i = 0; i < targetCount; i++) {
    let idx = floor(map(i, 0, targetCount, 0, points.length));
    newPoints.push(points[idx]);
  }
  return newPoints;
}

/*
   Ensures that all letter arrays have the same number of points (maxCount).
*/
function equalizeAllPoints() {
  let arrays = [j, iLetter, aLetter, mLetter, nLetter, gLetter];
  let maxCount = 0;
  
  // Determine the maximum point count.
  arrays.forEach(arr => {
    if (arr.length > maxCount) maxCount = arr.length;
  });
  
  // Resample each array to have exactly maxCount points.
  j = resamplePoints(j, maxCount);
  iLetter = resamplePoints(iLetter, maxCount);
  aLetter = resamplePoints(aLetter, maxCount);
  mLetter = resamplePoints(mLetter, maxCount);
  nLetter = resamplePoints(nLetter, maxCount);
  gLetter = resamplePoints(gLetter, maxCount);
  g = resamplePoints(g, maxCount);
}

/*
   Centers an array of points on the canvas by computing its bounding box and shifting it.
*/
function centerPoints(points) {
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (let p of points) {
    if (p.x < minX) minX = p.x;
    if (p.x > maxX) maxX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.y > maxY) maxY = p.y;
  }
  let centerX = (minX + maxX) / 2;
  let centerY = (minY + maxY) / 2;
  let offsetX = width / 2 - centerX;
  let offsetY = height / 2 - centerY;
  return points.map(p => ({ x: p.x + offsetX, y: p.y + offsetY }));
}
