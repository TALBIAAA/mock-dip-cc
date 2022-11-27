let weatherjson = false; 
let weatherloaded = 0; 
let counter = 0; 
let yr, ukdate; 
let theta = 0.0; // speed of the waves 
let img;
let button;

function setup() {
  createCanvas(1000, 600);
  setInterval(countdown, 1200); 
  img = loadImage('temp.png'); 
  button = createButton('click me'); // interactive button element- 
                                    // need to make it more interactive
                                    // and more useful in the context of this graph.
  button.position(20, 70);
  button.mousePressed(changeBG);
}

function changeBG() {
  let val = random(100);
  background(val);
}

function countdown(){   // this is the variable 
  let m = month();
  let d = day();
  counter--; 

  if(counter<0){
    //array
    counter = 30; // seconds
    yr = int(random(1963, 2022));
    // date range
    let apidate = `${yr}-${m}-${d}`;
    ukdate = `${d}-${m}-${yr}`;
    // weather url (see https://open-meteo.com/en/docs#api_form) 
    let weatherurl = "https://archive-api.open-meteo.com/v1/era5?";
    weatherurl += `latitude=51.5002&longitude=-0.1262`;
    weatherurl += `&start_date=${apidate}&end_date=${apidate}`;
    weatherurl += "&daily=temperature_2m_max,rain_sum&timezone=auto";
    loadJSON(weatherurl, loadedweather); 
  }
}

function loadedweather(json){
  weatherjson = json; 
  weatherloaded++; 
}


function draw() {
  // for background and the timer 
  background(330,200,321);
  fill(25);
  textSize(18);
  text(frameCount, width-150, 20);
  text(counter, width-90, 20);
  text(weatherloaded, width-25, 20);

  if(weatherjson===false) return;

  // date, temperature , rain
  let temp = weatherjson.daily.temperature_2m_max;
  let rain = weatherjson.daily.rain_sum;


  let pos = map(temp, -20, 40, -1000, 10);
  image(img, 0, pos);

  // for the text of date temp and rain
  let x = 10;
  let y = 30;
  textAlign(LEFT);
  text(`  Date: ${ukdate}`, x, y);
  text(`Temp:  ${temp}°C`, x, y+15);
  text(`  Rain:  ${rain}mm`, x, y+30);

  // drawing waves
  noStroke();
  fill(140, 100, 344);
  y = height-250;   
  speed = map(rain, 0, 20, 0.10, 0.09); // rain to wave speed
  newwave(y, 9,  10.0, speed);     
  newwave(y+40, 11,  45.0, speed);  
  newwave(y+70, 13,  250.0, speed); 
}

//from:  https://p5js.org/examples/math-sine-wave.html
function newwave(ypos, xspace, freq, speed){
  let dx = (TWO_PI/freq)*xspace;        // frequency of waves 
  let w = floor((width+xspace)/xspace); 
  let yvals = new Array(w);             
  theta += speed;                       // calculate the speed of all waves

  let x = theta;
  for (let i=0; i < yvals.length; i++) {
    yvals[i] = sin(x)*18; // height of waves
    x += dx;
  }

  for (let x = 0; x<yvals.length; x++) { // drawing the wave patterns in the form of ellipses 
    ellipse(x*xspace, ypos+yvals[x], 10, 20);
  }
}