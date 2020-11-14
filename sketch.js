let canvas;
const len = 784;
const total_data = 1000;

const indexs = {'cat': 0, 'train': 1, 'rainbow': 2}
let labels = {};
//const labels = {indexs.cat: 'Cat', indexs['train']: 'Train', indexs['rainbow']: 'Rainbow'}

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

function prepareData(category, data, label){
  category.training = [];
  category.testing = [];
  for (let i = 0; i < total_data; i++){
    let offset = i * len;
    let slice_size = floor(0.8 * total_data);
    if (i < slice_size){
      category.training[i] = data.bytes.subarray(offset, offset + len);
      category.training[i].label = label;
    }else{
      category.testing[i - slice_size] = data.bytes.subarray(offset, offset + len);  
      category.testing[i - slice_size].label = label;
    }
  }
}

function train(training){
  var start = Date.now();
  shuffle(training, true);

  for (let i = 0; i < training.length;i++){
    let inputs = [];
    let input = training[i];
    inputs = input.map(x => x/255);
    var label = training[i].label;
    var targets = [0, 0, 0];
    targets[label] = 1;
    
    brain.train(inputs, targets);
  }
  return Date.now() - start;
}


function repeat_train(training, repeat_time){
  var start = Date.now();
  for (let n=0;n<repeat_time;n++){
    train(training);
  }
  return Date.now() - start;
}

function test(testing){
  let correct = 0, percent = 0;
  for (let i = 0; i < testing.length;i++){
    let input = testing[i];
    let inputs = input.map(x => x/255);
    var label = testing[i].label;
    var guess = brain.predict(inputs);
    var m = max(guess);
    var classification = guess.indexOf(m);
    if (classification == label){
      correct++;
    }
    percent = correct / testing.length;
  }

  return percent;
}

function testAll(){
  let all_testing_data = [];
  all_testing_data = all_testing_data.concat(cats.testing);
  all_testing_data = all_testing_data.concat(trains.testing);
  all_testing_data = all_testing_data.concat(rainbows.testing);
  
  return test(all_testing_data);
}

function guess(){
  var guess = "...";
  var percent_txt = "I don't know, maybe It is a ";
  var html_txt;
  var txt;
  var data;
  let inputs = [];
  let img = get();
  img.resize(28, 28);
  img.loadPixels();
  for (let i = 0;i< len;i++) {
    let bright = img.pixels[i * 4];
    inputs[i] = (255 - bright) / 255;
  }
  if (array_elements(inputs, 0)){
    guess_txt.innerHTML = "You didn't draw any thing !";
    return "You didn't draw any thing !";
  } 

  var guess = brain.predict(inputs);
  var m = max(guess);
  var classification = guess.indexOf(m);

  if (labels[classification]) guess = labels[classification];

  if (m >= 0.5){
    percent_txt = "I'am sure It is an";
  }
  else if (m < 0.5){
    percent_txt = "May be It is a";
  }

  if (percent < 0.5){
    percent_txt = "I am confuse, did you draw a";  
  }

  txt = percent_txt+" "+guess;
  html_txt = percent_txt+" <orangebg>"+guess+"</orangebg>";
  data = {txt: txt, html_txt: html_txt, percent_txt: percent_txt, guess: guess};

  return data;
}

function speak(txt){ 
  var engine = window.speechSynthesis;    

  // get all voices that browser offers
  var available_voices = engine.getVoices();

  // this will hold an english voice
  var english_voice = '';

  // find voice by language locale "en-US"
  // if not then select the first voice
  available_voices = engine.getVoices();
  for(var i=0; i<available_voices.length; i++) {
    if(available_voices[i].lang == 'en-US') {
      english_voice = available_voices[i];
      break;
    }
  }
  if(english_voice == ''){
    english_voice = available_voices[0];
  }
  var utter = new SpeechSynthesisUtterance();
  utter.rate = 1;
  utter.pitch = 0.5;
  utter.text = txt;
  utter.voice = english_voice;

  window.speechSynthesis.speak(utter);
}

function array_elements(arr, target){
  for (let i = 0;i< arr.length;i++) {
    if (arr[i] != target){
      return false;
    }
  }
  return true;
}

function setupLabels() {
  for (let label of Object.keys(indexs)) {
    let index = indexs[label];
    labels[index] = label;
  }
}

function setup(){
  speak("Hi");

  canvas = createCanvas(280, 280);
  background(255);
  canvas.id("canvas");
  guess_txt = document.getElementById("guess-text");
  document.getElementById("main").appendChild(canvas.canvas);
  prepareData(cats, cats_data, indexs['cat']);
  prepareData(trains, trains_data, indexs['train']);
  prepareData(rainbows, rainbows_data, indexs['rainbow']);

  setupLabels();
  brain = new Brain(784, 64, 3);

  let all_training_data = [];
  all_training_data = all_training_data.concat(cats.training);
  all_training_data = all_training_data.concat(trains.training);
  all_training_data = all_training_data.concat(rainbows.training);
  //let end_time = repeat_train(all_training_data, 1);
 
  let all_testing_data = [];
  all_testing_data = all_testing_data.concat(cats.testing);
  all_testing_data = all_testing_data.concat(trains.testing);
  all_testing_data = all_testing_data.concat(rainbows.testing);

  let epoch = 0;

  var train_btn = document.getElementById("train");
  var test_btn = document.getElementById("test");
  var guess_btn = document.getElementById("guess");
  var clear_btn = document.getElementById("clear");

  percent = testAll();

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

function mousePressed(){
   drawing();
}

function mouseDragged(){
  drawing();
}

function mouseReleased(){
  let data = guess();
  guess_txt.innerHTML = data.html_txt;
}

function drawing(){
  strokeWeight(8);
  stroke(0);
  line(pmouseX, pmouseY, mouseX, mouseY);
}

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

function draw_doodles(doodles){
  let total = 100;
  var bytes = [];
  for (let n=0;n<total;n++){
    let img = createImage(28, 28);
    let offset = n * len;
    img.loadPixels();

    for (let i=0;i<784;i++){
      var val = 255 - doodles.bytes[i + offset];
      img.pixels[i * 4 + 0] = val;
      img.pixels[i * 4 + 1] = val;
      img.pixels[i * 4 + 2] = val;
      img.pixels[i * 4 + 3] = 255;
    } 

    img.updatePixels();
    let x = (n % 10) * 28;
    let y = floor((n / 10)) * 28;
    image(img, x, y);
  }
}

function get_bytes(doodles){
  let total = 100;
  var bytes = [];
  for (let n=0;n<total;n++){
    let img = createImage(28, 28);
    let offset = n * 784;
    img.loadPixels();

    for (let i=0;i<784;i++){
      var val = 255 - doodles.bytes[i + offset];
      bytes.push(val);
    } 
  }
  return bytes;
}
