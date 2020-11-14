let canvas;
const len = 784;
const total_data = 1000;

const indexs = {'cat': 0, 'train': 1, 'rainbow': 2}
let labels = {};

var all_training_data = [], all_testing_data = [], epoch = 0;
var train_btn, test_btn, guess_btn, clear_btn;

var rainbows_url = "data/rainbows1000.npy";
var cats_url = "data/cats1000.npy";
var trains_url = "data/trains1000.npy";
var rainbows, cats, trains;
var rainbows = {}, cats = {}, trains = {};
var brain;

var guess_txt;
let percent;

function preload(){
  rainbows_data = loadBytes(rainbows_url);
  cats_data = loadBytes(cats_url); 
  trains_data = loadBytes(trains_url);  
}

function setup(){
  speak("Hi");
  canvas = createCanvas(280, 280);
  background(255);
  canvas.id("canvas");
  prepareDatas();
  setupElements();
  setupLabels();
  setupTrainingData();
  setupEvents();
  brain = new Brain(784, 64, 3);
  epoch = 0;
  percent = testAll();
}

function setupTrainingData() {
  all_training_data = all_training_data.concat(cats.training);
  all_training_data = all_training_data.concat(trains.training);
  all_training_data = all_training_data.concat(rainbows.training);
  //let end_time = repeat_train(all_training_data, 1);
 
  all_testing_data = all_testing_data.concat(cats.testing);
  all_testing_data = all_testing_data.concat(trains.testing);
  all_testing_data = all_testing_data.concat(rainbows.testing);
}

function setupEvents() {
  canvas.canvas.addEventListener('touchstart', () => document.body.style.overflow = 'hidden');
  canvas.canvas.addEventListener('touchmove', () => document.body.style.overflow = 'hidden');
  canvas.canvas.addEventListener('touchend', () => document.body.style.overflow = 'scroll');

  train_btn.onclick = ()=>{
    let end_time = train(all_training_data);
    epoch++;
    percent = testAll();
    guess_txt.innerHTML = "Training complete !";
    console.log(epoch.toString()+") Training complete in",end_time,"ms"); 
  }

  test_btn.onclick = ()=>{
    percent = test(all_testing_data);
    percent *= 100;
    guess_txt.innerHTML = "Success <orangebg>"+floor(percent)+"%</orangebg>";
    console.log(percent+"%");
  }

  guess_btn.onclick = ()=>{ 
    let data = guess();

    if (data.txt != undefined && data.html_txt != undefined){
      guess_txt.innerHTML = data.html_txt;
      speak(data.txt);
    }
  }

  clear_btn.onclick = ()=>{
    guess_txt.innerHTML = "...";
    background(255);
  }
}

function setupElements() {
  guess_txt = document.getElementById("guess-text");
  document.getElementById("main").appendChild(canvas.canvas);
  train_btn = document.getElementById("train");
  test_btn = document.getElementById("test");
  guess_btn = document.getElementById("guess");
  clear_btn = document.getElementById("clear");
}

function setupLabels() {
  for (let label of Object.keys(indexs)) {
    let index = indexs[label];
    labels[index] = label;
  }
}

function mousePressed() {
  drawing();
}

function mouseDragged(){
  drawing();
}

function mouseRealed() {
  displayGuess();
}

function touchStarted() {
  drawing();
}

function touchMoved() {
  drawing();
}


function touchEnded() {
  displayGuess();
}
