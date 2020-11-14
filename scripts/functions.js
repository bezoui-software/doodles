const displayGuess = () => guess_txt.innerHTML = guess().html_txt;

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

function prepareDatas() {
  console.log
  for (let model_name of Object.keys(models)) {
    prepareData(models[model_name].data_models, models[model_name].data, indexs[model_name]);    
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
  all_testing_data = [];
  for (let model_name of Object.keys(models)) {
    const model = models[model_name];
    all_testing_data = all_testing_data.concat(model.data_models.training);
  }
  
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
