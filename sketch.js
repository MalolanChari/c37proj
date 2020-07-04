var database;
var drawing=[];
var currentPath = [];
isDrawing = false;

function setup(){
   var canvas = createCanvas(800,400);
   canvas.mousePressed(startPath);
    canvas.parent('canvascontainer')
   canvas.mouseReleased(endPath);

   var saveButton = select('#saveButton');
   saveButton.mousePressed(saveDrawing);
   var clearButton = select('#clearButton');
  clearButton.mousePressed(clearDrawing);
    var firebaseConfig = {
        apiKey: "AIzaSyDBDoCecesqOyDz8Wg4hrj682MQVbxqFw0",
        authDomain: "paint-game-52a39.firebaseapp.com",
        databaseURL: "https://paint-game-52a39.firebaseio.com",
        projectId: "paint-game-52a39",
        storageBucket: "paint-game-52a39.appspot.com",
        messagingSenderId: "473048792786",
        appId: "1:473048792786:web:9dc84237d57cc05f87770b"
      };
      // Initialize Firebase
      firebase.initializeApp(firebaseConfig);
      database= firebase.database();

      var ref = database.ref('drawing');
      ref.on('value',gotData,errdata);
}
function startPath(){
    isDrawing = true;
    currentPath = [];
    drawing.push(currentPath);
}
function endPath(){
  isDrawing = false; 
}

function draw(){
    background(0);

    if(isDrawing){
       var point = {
           x:mouseX,
           y:mouseY
       }

        currentPath.push(point);
    }

    
    stroke(255);
    strokeWeight(4);
    noFill()
    for(i = 0; i < drawing.length;i++){

        var path = drawing[i];

        beginShape();

            for(j = 0; j < path.length;j++){
                vertex(path[j].x,path[j].y);
            }

        endShape();

    }
   

}

function saveDrawing(){
    ref = database.ref('drawing');
    var data= {
        name : name,
        drawing: drawing
    }
    var result = ref.push(data,dataSent);
    console.log(result.key);
    function dataSent(status){
        console.log(status);
    }
}

function gotData(data){
    //clear list

    var clear = selectAll('.listing');
    for(var i =0 ; i<clear.lenght;i++){
       clear[i].remove(); 
    }


    var drawings = data.val();
    var keys= Object.keys(drawings);
    for(var i = 0 ; i<keys.length;i++){
        var key = keys[i];
        console.log(key);
       var li = createElement('li','');
       //giving it a class
       li.class('listing')
       var ahref=createA('#',key) ;
       ahref.mousePressed(showDrawing);
       ahref.parent(li);

       
        
        li.parent('drawinglist')
    }

}
function errdata(err){
console.log(err)
}

function showDrawing(){
    var key= this.html();

    var ref = database.ref('drawing/'+key);
    ref.once('value',oneDrawing,errdata)

    function oneDrawing(data){
      var dbdrawing= data.val();
      drawing= dbdrawing.drawing;
      //console.log(drawing)  
    }

}

function clearDrawing(){
    drawing=[]
}
