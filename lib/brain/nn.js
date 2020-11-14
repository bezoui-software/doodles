//This Neural Network Lib is created by Walid Bezoui
//copyright - 2020
//lib version : 1
var author_name = "Walid Bezoui";

function sigmoid(x){
  return 1/(1+Math.exp(-x));
}

function dsigmoid(x){
  return  1 * (1 - x);
}

function random(a, b){
  var min, max;
  if (a instanceof Array){
    arr = a;
    min = 0;
    max = arr.length;
    return arr[floor(random(min, max))];
  }
  min = a;
  max = b;
  return Math.random() * (max - min) + min;
}

function floor(x){
  return Math.floor(x);
}

class Brain{
  
  
  constructor (a, b, c){
    this.author = "Walid Bezoui";
    if (this.check_author() == false){console.error("The author name is incorrect !");return;}
    if (a instanceof Brain){
      paste(a);
    }else{
      this.input_nodes = a;
      this.hidden_nodes = b;
      this.output_nodes = c;

      this.weights_ih = new Matrix(this.hidden_nodes, this.input_nodes);
      this.weights_ih.floatRandomize();
      this.weights_ho = new Matrix(this.output_nodes, this.hidden_nodes);
      this.weights_ho.floatRandomize();

      this.bias_h = new Matrix(this.hidden_nodes, 1);
      this.bias_h.floatRandomize();
      this.bias_o = new Matrix(this.output_nodes, 1);
      this.bias_o.floatRandomize();

      this.learning_rate = 0.1;
    }
  }

  predict(inputs){
    inputs = Matrix.fromArray(inputs);
 
    //Create the hidden layer
    var hidden = Matrix.dot(this.weights_ih, inputs);
    hidden.add(this.bias_h);
    hidden.map(sigmoid);

    //Create the output layer
    var outputs = Matrix.dot(this.weights_ho, hidden);
    outputs.add(this.bias_o);
    outputs.map(sigmoid);

    return outputs.toArray();
  }

  train(inputs, targets){

    inputs = Matrix.fromArray(inputs);

    //Create the hidden layer
    var hidden = Matrix.dot(this.weights_ih, inputs);
    hidden.add(this.bias_h);
    hidden.map(sigmoid);

    //Create the output layer
    var outputs = Matrix.dot(this.weights_ho, hidden);
    outputs.add(this.bias_o);
    outputs.map(sigmoid);

    var targets = Matrix.fromArray(targets);
    //Calc all errors
    var output_error = Matrix.sub(targets, outputs);
    var weights_ho_T = Matrix.transpose(this.weights_ho);
    var hidden_error = Matrix.dot(weights_ho_T, output_error); 
    
    //Calculate the output adjustment
    var output_gradient = Matrix.map(outputs, dsigmoid);
    output_gradient.dot(output_error);
    output_gradient.dot(this.learning_rate);

    //Adjust the weight between hidden and output and the output bias
    var hidden_T = Matrix.transpose(hidden);
    var weights_ho_delatas = Matrix.dot(output_gradient, hidden_T);
    this.weights_ho.add(weights_ho_delatas);
    this.bias_o.add(output_gradient);

    //Calculate the hidden adjustment
    var hidden_gradient = Matrix.map(hidden, dsigmoid);
    hidden_gradient.dot(hidden_error);
    hidden_gradient.dot(this.learning_rate);

    //Adjust the weight between input and hidden and the hidden layer bias
    var inputs_T = Matrix.transpose(inputs);
    var weights_ih_deltas = Matrix.dot(hidden_gradient, inputs_T);
    this.weights_ih.add(weights_ih_deltas);
    this.bias_h.add(hidden_gradient);
  }

  repeat_training(inputs, targets, repeat_count){
    for (let i=0;i<=repeat_count;i++){
      this.train(inputs, targets);
    }
  }

  paste(brain){
    //Paste all brain parametrs to this
    this.input_nodes = brain.input_nodes;
    this.hidden_nodes = brain.hidden_nodes;
    this.output_nodes = brain.output_nodes;

    this.weights_ih = brain.weights_ih;
    this.weights_ho = brain.weights_ho;

    this.bias_h = brain.bias_h;
    this.bias_o = brain.bias_o;

    this.learning_rate = brain.learning_rate;
  }

  static __test__(){
    var training_data = [
      {
        inputs: [1, 1, 1, 1, 1],
        targets: [0, 0, 0, 0, 0]
      },
      {
        inputs: [0, 0, 0, 0, 0],
        targets: [1, 1, 1, 1, 1]
      },
    ];
    var brain = new Brain(5, 5, 5);

    //Training the brain
    console.log("Start training...");
    for (let i=0;i<20000;i++){
      //console.log("Training...");
      var ti = random(training_data);
      brain.train(ti.inputs, ti.targets);
    }
    alert("Trainig complete !");  
    console.log("Trainig complete !");  

    //Testing data
    var inputs = [[1, 1, 1, 1, 1], [0, 0, 0, 0, 0]];
    for (let input of inputs){
      var outputs = brain.predict(input);
      console.table(outputs); 
    }
    return ("Library created by Bezoui Software");
  }
  static __author__(){
    console.log("Brain lib is created by ", author_name);
    return "Walid Bezoui";
  }
  check_author(){
    return (this.author == "Walid Bezoui" && Brain.__author__() == this.author);
  }
}
