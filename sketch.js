let canvas;
const len = 784;
const total_data = 1000;

const indexs = {'cats': 0, 'trains': 1, 'rainbows': 2}
let labels = {};

var all_training_data = [], all_testing_data = [], epoch = 0;
var train_btn, test_btn, guess_btn, clear_btn;

const models_urls = {
  rainbows: 'data/rainbows1000.npy',
  cats: 'data/cats1000.npy',
  trains: 'data/trains1000.npy'
}
const models = {}
var brain;

var guess_txt;
let percent;

function preload(){
  for (model_name of Object.keys(models_urls)) {
    const model_url = models_urls[model_name];
    models[model_name] = {};
    models[model_name].data_models = {};
    models[model_name].data = loadBytes(model_url);
  } 
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
  percent = testAll();
}

function setupTrainingData() {
  for (let model_name of Object.keys(models)) {
    const model = models[model_name];
    all_training_data = all_training_data.concat(model.data_models.training);
    all_testing_data = all_testing_data.concat(model.data_models.testing);
  }
}

function setupEvents() {
  canvas.canvas.addEventListener('touchstart', () => document.body.style.overflow = 'hidden');
  canvas.canvas.addEventListener('touchmove', () => document.body.style.overflow = 'hidden');
  canvas.canvas.addEventListener('touchend', () => document.body.style.overflow = 'scroll');

  train_btn.onclick = ()=>{
    let end_time = train(all_training_data);
    epoch++;
    guess_txt.innerHTML = "Training complete !";
    console.log(epoch.toString()+") Training complete in",end_time,"ms"); 
  }

  test_btn.onclick = ()=>{
    displayPercent();
  }

  guess_btn.onclick = displayGuess;

  clear_btn.onclick = clearAll;
}

function setupElements() {
  guess_txt = document.getElementById("guess-text");
  document.getElementById("main").appendChild(canvas.canvas);
  train_btn = document.getElementById("train");
  test_btn = document.getElementById("test");
  guess_btn = document.getElementById("guess");
  clear_btn = document.getElementById("clear");
  setupDisplayModelsContainer();
}

function setupDisplayModelsContainer() {
  const displayModelsContainer = document.createElement('div');
  displayModelsContainer.id = 'display-models-container';
  const label = document.createElement('label');
  label.innerHTML = 'Display Models';
  displayModelsContainer.appendChild(label);
  const displayModels = document.createElement('div');
  displayModels.id = 'display-models'; 
  displayModels.classList.add('hide');
  displayModelsContainer.appendChild(displayModels);
  document.getElementById('control').appendChild(displayModelsContainer);
  for (let model_name of Object.keys(models)) {
    const model = models[model_name];
    const displayModelButton = document.createElement('button');
    displayModelButton.innerHTML = `Display ${model_name} models`;
    displayModelButton.onclick = () => draw_doodles(model.data);
    displayModels.appendChild(displayModelButton);
  }
  displayModelsContainer.onclick = () => displayModels.classList.toggle('hide');
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

function mouseReleased() {
  displayGuess();
}
