
class Matrix{  
  constructor(rows, cols){
    this.rows = rows;
    this.cols = cols;
    this.data = [];
    for (let i=0;i<this.rows;i++){
      this.data[i] = [];
      for (let j=0;j<this.cols;j++){
        this.data[i][j] = 0;
      }
    }
  }
  
  static fromArray(arr){
    let m = new Matrix(arr.length, 1);
    for (let i=0;i<arr.length;i++){
      m.data[i][0] = arr[i];
    }
    return m;
  }

  toArray(){
    let arr = [];
    for (let i=0;i<this.rows;i++){
      for (let j=0;j<this.cols;j++){  
        arr.push(this.data[i][j]); 
      }
    } 
    return arr;
  }

  print(){
    console.table(this.data);
  } 

  randomize(min, max){
    if (max == null || max == "") {max=10}
    if (min == null || min == "") {min=0}
    for (let i=0;i<this.rows;i++){
      for (let j=0;j<this.cols;j++){
        this.data[i][j] = Math.floor(Math.random() * (max - min) ) + min;
      }
    }
  }

  floatRandomize(min, max){
    if (max == null || max == "") {max=1}
    if (min == null || min == "") {min=-1}
    for (let i=0;i<this.rows;i++){
      for (let j=0;j<this.cols;j++){
        this.data[i][j] = Math.random() * (max - min) + min;
      }
    }
  }
  
  transpose(){
    let result = new Matrix(this.cols, this.rows);
    for (let i=0;i<result.rows;i++){
      for (let j=0;j<result.cols;j++){
        result.data[i][j] = this.data[j][i];
      }     
    } 
    this.data = result.data;
  }

  static transpose(matrix){
    if (matrix instanceof Matrix == false){
      console.error("The multiply function must contain two Matrix !");
      return;
    }
    let result = new Matrix(matrix.cols, matrix.rows);
    for (let i=0;i<result.rows;i++){
      for (let j=0;j<result.cols;j++){
        result.data[i][j] = matrix.data[j][i];
      }     
    } 
    return result;
  }

  map(func){
    for (let i=0;i<this.rows;i++){
      for (let j=0;j<this.cols;j++){
        const val = this.data[i][j];
        this.data[i][j] = func(val);
      }
    }
  }

  static map(matrix, func){
    let result = new Matrix(matrix.rows, matrix.cols);
    for (let i=0;i<result.rows;i++){
      for (let j=0;j<result.cols;j++){
        const val = matrix.data[i][j];
        result.data[i][j] = func(val);
      }
    }
    return result;
  }

  add(a){
    //console.log(a);
    if (a instanceof Matrix){
      for (let i=0;i<this.rows;i++){
        for (let j=0;j<this.cols;j++){
          this.data[i][j] += a.data[i][j];
        }
      }
    }else{
      for (let i=0;i<this.rows;i++){
        for (let j=0;j<this.cols;j++){
          this.data[i][j] += a;
        }
      }
    }
  }
  
  static sub(a, b){
      // Return a new Matrix a-b
      let result = new Matrix(a.rows, a.cols);
      for (let i=0;i<result.rows;i++){
        for (let j=0;j<result.cols;j++){
          result.data[i][j] = a.data[i][j] - b.data[i][j];
        }
      }
      return result;
  }
  
  dot(a) {
    if (a instanceof Matrix) {
      for (let i=0;i<this.rows;i++){
        for (let j=0;j<this.cols;j++){
          this.data[i][j] *= a.data[i][j];
        }
      }
    } else {
      for (let i=0;i<this.rows;i++){
        for (let j=0;j<this.cols;j++){
          this.data[i][j] *= a;
        }
      }
    }
  }

  static dot(a, b){
    //console.log("A:",a,"B:",b);
    if (a instanceof Matrix == false || b instanceof Matrix == false){
      console.error("The multiply function must contain two Matrix !");
      return;
    }
    if (a.cols != b.rows){
      console.error("The first matrix cols must match the second matrix rows !");
      return;
    }
    var result = new Matrix(a.rows, b.cols);  
    for (let i=0;i<result.rows;i++){
      for (let j=0;j<result.cols;j++){
        //Dot product of values in col
        let sum = 0;
        for (let k=0; k < a.cols; k++){
          sum += a.data[i][k] * b.data[k][j];
        }
        result.data[i][j] = sum;
      }
    }  
    return result;
  }
 

  copy(){
    let m = new Matrix(this.rows, this.cols);
    for (let i=0;i<this.rows;i++){
      for (let j=0;j<this.cols;j++){  
        m.data[i][j] = this.data[i][j];
      }
    }  
    return m;
  }
}