var cubeRotation = 0.0;

var c;
var c1;
var player;
var police;
var dog;
var coin = new Array();
var track1;
var track2;
var track3;
var wall;
var jump;
var duck;
var shoe;
var jetpack = new Array();
var player_texture;
var jump_texture;
var duck_texture;
var track_texture;
var wall_texture;
var train_texture;
var shoe_texture;
var jetpack_texture;
var police_texture;
var dog_texture;
var cam_x=0,cam_y=-2,cam_z=10.0;
var score=0,num_coins=0;
var on_train=-1,in_gravity=-1;
var dead=-1;
var hit=0;
var in_shoe=-1;
var in_jump=-1;
var in_jetpack=-1;
var time_shoe;
var time_jetpack;
var count=0;
var duck_spawn=-1;
var duck_hit=-1;
// var time_
var programInfo;

main();

//
// Start here
//
function main() {
  const canvas = document.querySelector('#glcanvas');
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  
  // wall.push(new Wall(gl, [0, 0,-5]));
  wall = new Wall(gl, [1, 0,-500]);
  track1= new Track(gl ,[-6,-5,-500]);
  track2= new Track(gl ,[0,-5,-500]);
  track3= new Track(gl ,[6,-5,-500]);
  
  shoe = new Shoe(gl ,[-6,-4.2,-150]);
  jetpack.push(new Jetpack(gl ,[6,-4.2,-50]));
  jetpack.push(new Jetpack(gl ,[6,-4.2,-200]));
  
  function Coin_Spawn(){  
    console.log("INCOIN");
    var z = Math.floor(Math.random() * (10 - 5) + 10) ;  
    var x = Math.floor(Math.random() * (2));  
    var y = Math.floor(Math.random() * (2));  
    for(var t=0;t<10;t++){
      if(in_gravity == -1){
        if(x == 0)    
        coin.push(new Coin(gl ,[-6,-4,cam_z-50-2.5*t]));
        if(x == 1)    
        coin.push(new Coin(gl ,[0,-4,cam_z-50-2.5*t]));
        if(x == 2)    
        coin.push(new Coin(gl ,[6,-4,cam_z-50-2.5*t]));
      }
      else{
        if(x == 0)    
          coin.push(new Coin(gl ,[-6,6,cam_z-50-2.5*t]));
        if(x == 1)    
          coin.push(new Coin(gl ,[0,6,cam_z-50-2.5*t]));
        if(x == 2)    
          coin.push(new Coin(gl ,[6,6,cam_z-50-2.5*t]));
      }
    }
    if(y == 0){    
      jump = new Jump(gl , [6,-4.5,cam_z-40]);
    }
    else if(x==1){  
      jump = new Jump(gl , [-6,-4.5,cam_z-40]);
    }
    else{
      jump = new Jump(gl , [0,-4.5,cam_z-40]);
    }
  }
  Coin_Spawn();  
  setInterval(function(){
    Coin_Spawn()}, 3000)
    
    function Train_Spawn(){
      console.log('function is being called');
      var x = Math.floor(Math.random() * (2));  
      if(x==0)  
        train = new Train(gl, [-6 ,-3, cam_z-100]);
      else if(x==1)
        train = new Train(gl, [0 ,-3, cam_z-100]);
      else
        train = new Train(gl, [6 ,-3, cam_z-100]);
  }
  Train_Spawn();
  setInterval(function(){
    Train_Spawn()}, 30000)
  function Jump_Spawn(){    
    var y = Math.floor(Math.random() * (2));  
    if(y == 0){    
      duck = new Duck(gl , [6,-4,cam_z-40]);
    }
    else if(y==1){  
      duck = new Duck(gl , [-6,-4,cam_z-40]);
    }
    else{
      duck = new Duck(gl , [0,-4,cam_z-40]);
    }
    duck_spawn += 1;
    console.log(duck_spawn);
  }
  Jump_Spawn();
  setInterval(function(){
    Jump_Spawn()}, 5000);    
  player = new Player(gl, [-6 ,-2, -4]);
  police = new Police(gl, [-6 ,-3, -3]);
  dog = new Dog(gl, [-4 ,-4.2, -3]);


  // If we don't have a GL context, give up now

  if (!gl) {
    alert('Unable to initialize WebGL. Your browser or machine may not support it.');
    return;
  }

  // Vertex shader program

  const vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec3 aVertexNormal;
    attribute vec2 aTextureCoord;

    uniform mat4 uNormalMatrix;
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    varying highp vec2 vTextureCoord;
    varying highp vec3 vLighting;

    void main(void) {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      vTextureCoord = aTextureCoord;

      // Apply lighting effect

      highp vec3 ambientLight = vec3(0.3, 0.3, 0.3);
      highp vec3 directionalLightColor = vec3(1, 1, 1);
      highp vec3 directionalVector = normalize(vec3(0.85, 0.8, 0.75));

      highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);

      highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
      vLighting = ambientLight + (directionalLightColor * directional);
    }
  `;

  // Fragment shader program
  const fsSource = `
    varying highp vec2 vTextureCoord;
    varying highp vec3 vLighting;

    uniform sampler2D uSampler;

    void main(void) {
      highp vec4 texelColor = texture2D(uSampler, vTextureCoord);

      gl_FragColor = vec4(texelColor.rgb * vLighting, texelColor.a);
    }
  `;
  // const fsSource = `
  //   varying highp vec2 vTextureCoord;

  //   uniform sampler2D uSampler;

  //   void main(void) {
  //     precision highp float;
  //     vec4 color = texture2D(uSampler, vTextureCoord);
  //     float gray = dot(color.rgb,vec3(0.299,0.587,0.114));
  //     gl_FragColor = vec4(vec3(gray),1.0);
  //   }
  // `;

  // Initialize a shader program; this is where all the lighting
  // for the vertices and so forth is established.
  // const shaderProgram2 = initShaderProgram(gl, vsSource, fsSource2);
  const shaderProgram = initShaderProgram(gl, vsSource, fsSource);
  
  // Load texture
  track_texture = loadTexture(gl, 'track.jpg');
  wall_texture = loadTexture(gl, 'Wall.jpg');
  player_texture = loadTexture(gl, 'surfer1.png');  
  coin_texture = loadTexture(gl, 'coin.png');   
  jump_texture = loadTexture(gl, 'obstacle_jump.jpg');   
  duck_texture = loadTexture(gl, 'obstacle_jump.jpg');   
  train_texture = loadTexture(gl, 'train.png');   
  shoe_texture = loadTexture(gl, 'shoe1.png');   
  jetpack_texture = loadTexture(gl, 'jetpack.png');   
  police_texture = loadTexture(gl, 'Police1.png');   
  dog_texture = loadTexture(gl, 'dog1.png');   
  
  
  // Collect all the info needed to use the shader program.
  // Look up which attributes our shader program is using
  // for aVertexPosition, aVevrtexColor and also
  // look up uniform locations.
  programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
      vertexNormal: gl.getAttribLocation(shaderProgram, 'aVertexNormal'),
      textureCoord: gl.getAttribLocation(shaderProgram, 'aTextureCoord'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
      normalMatrix: gl.getUniformLocation(shaderProgram, 'uNormalMatrix'),
      uSampler: gl.getUniformLocation(shaderProgram, 'uSampler'),
    },
  };
  // Here's where we call the routine that builds all the
  // objects we'll be drawing.

  var then = 0;

  // Draw the scene repeatedly
  // sleep(0.5);
  function render(now) {
    now *= 0.001;  // convert to seconds
    const deltaTime = now - then;
    then = now;
    count ++;

    // Well Played Cleared
    if(player.pos[2] <= -999)
    {
      // console.log(player.pos[2]);
      document.getElementById("glcanvas").style.display="none";
      document.getElementById("wellplayed").style.display = "";
      player.speed = 0;
    }
    // Movements Function
    movements();  

    // if()
    // Collision Function  
    collision();

    // Clearing Screen When Dead
    if(dead == 1){
      player.speed = 0;
      // train.speed = 0;
      document.getElementById("glcanvas").style.display="none";
      document.getElementById("gameover").style.display = "";
    }

    drawScene(gl, programInfo, deltaTime);

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);

}

function movements(){
  // Player Movements
  // console.log(player.pos[1]);
  player.pos[2] -= player.speed;
  cam_z -= player.speed;
  if(player.pos[0] > 6)
    player.pos[0] = 6;
  if(player.pos[0] < -6)
    player.pos[0] = -6;
  if(player.pos[1] > -4 && on_train==-1 && in_gravity==-1){
    player.pos[1] -= 0.2;
    in_jump = 1;
  }
  else
    in_jump = -1;
  train.pos[2] += train.speed;

  // Police and Dog
  police.pos[0] = player.pos[0];
  dog.pos[0] = police.pos[0]+2;
  police.pos[2] -= police.speed;
  dog.pos[2] -= police.speed;
  
}

function collision() {
  // Coin collision
  for(var i=0;i<coin.length;i++){
    if(Math.abs(player.pos[2]-coin[i].pos[2])<=1 && Math.abs(player.pos[0]-coin[i].pos[0])<=1.5 && Math.abs(player.pos[1]-coin[i].pos[1])<=1.0 ){  
      // player.points += 50;
      num_coins+=1;
      console.log(num_coins);
      coin.splice(i,1);
    }
  }  
  // Train Collision
  if(Math.abs(train.pos[2]-player.pos[2])<=2.5 && Math.abs(train.pos[1]-player.pos[1])<=1 && player.pos[0] == train.pos[0])
  {
    dead = 1;
    console.log("TrainCollision");
  }
  // For Above Train Movement
  if(player.pos[0] == train.pos[0] && Math.abs(Math.abs(train.pos[1]-player.pos[1])-3.0)<=0.5 && Math.abs(train.pos[2]-player.pos[2])<=2.5){
    on_train = 1;
    console.log("OnTrain");
  }
  else
    on_train = -1;  
  
  document.getElementById("score").innerHTML=5*num_coins;
  document.getElementById("coins").innerHTML=num_coins;
  // document.getElementById("glcanvas").innerHTML="coin.png";
  
  // Jump Collision
  if(Math.abs(jump.pos[2]-player.pos[2])<=1.0 && Math.abs(jump.pos[1]-player.pos[1])<=1.5 && player.pos[0] == jump.pos[0])
  {
    dead = 1;
    console.log("JumpCollision");
  }
  // Duck Collision
  if(Math.abs(duck.pos[1]-player.pos[1])<=2.0 && player.pos[0] == duck.pos[0]){
    if(Math.abs(duck.pos[2]-player.pos[2])<=1.0)
    {  
      if(duck_hit+1 == duck_spawn && duck_spawn != 0){
        // Bring Policeman  
        console.log("PoliceManFuckYou");      
        dead = 1;
      }
      console.log("HIT");
      console.log(hit);      
      console.log(duck_spawn);
      duck_hit = duck_spawn;      
      hit += 1;
      player.pos[2] -= 2; 
      police.pos[2] = player.pos[2] +2;
      dog.pos[2] = player.pos[2] +2;
    }
  } 
  // Shoe Collision
  if(Math.abs(shoe.pos[2]-player.pos[2])<=1.0 && Math.abs(shoe.pos[1]-player.pos[1])<=1.75 && player.pos[0] == shoe.pos[0] && in_shoe==-1)
  {
    in_shoe = 1;
    // var d = new Date();
    // var n = d.getSeconds();
    time_shoe = count;
    player.jump *= 2;
    console.log("HitPowerUPShoe");      
  }
  if(in_shoe == 1)
  {
    // var d = new Date();
    // var n = d.getSeconds();
    if(count-time_shoe >= 200)
    { 
      console.log("PowerUPSHOEDONE");
      player.jump /= 2;
      in_shoe = -1;
    }
  }
  
  // Jetpack Collision 
  for(var i=0;i<2;i++){  
    if(Math.abs(jetpack[i].pos[2]-player.pos[2])<=1.0 && Math.abs(jetpack[i].pos[1]-player.pos[1])<=1.75 && player.pos[0] == jetpack[i].pos[0] && in_jetpack==-1)
    {
      in_gravity = 1;
      in_jetpack = 1;
      player.pos[1] = 6;
      cam_y = 5;
      // var d = new Date();
      // var n = d.getSeconds();
      time_jetpack = count;
      console.log("HitPowerUPJetpack");      
    }
  }
  if(in_jetpack == 1)
  {
    // var d = new Date();
    // var n = d.getSeconds();
    if(count-time_jetpack >= 200)
    { 
      player.pos[1] = -4;
      console.log("PowerUPJETDONE");
      in_gravity = -1;
      in_jetpack = -1;
      cam_y = -2;
    }
  }

}

  

//
// Draw the scene.
//
function drawScene(gl, programInfo,  deltaTime) {
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  // gl.clearColor(135/256,206/256,250/256,1.0);  // Clear to black, fully opaque
  gl.clearColor(0,0,0,0.5);  // Clear to black, fully opaque
  gl.clearDepth(1.0);                 // Clear everything
  gl.enable(gl.DEPTH_TEST);           // Enable depth testing
  gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

  // Clear the canvas before we start drawing on it.

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Create a perspective matrix, a special matrix that is
  // used to simulate the distortion of perspective in a camera.
  // Our field of view is 45 degrees, with a width/height
  // ratio that matches the display size of the canvas
  // and we only want to see objects between 0.1 units
  // and 100 units away from the camera.

  const fieldOfView = 45 * Math.PI / 180;   // in radians
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const zNear = 0.1;
  const zFar = 100.0;
  const projectionMatrix = mat4.create();

  // note: glmatrix.js always has the first argument
  // as the destination to receive the result.
  mat4.perspective(projectionMatrix,
                   fieldOfView,
                   aspect,
                   zNear,
                   zFar);

  // Set the drawing position to the "identity" point, which is
  // the center of the scene.
  var cameraMatrix = mat4.create();
  mat4.translate(cameraMatrix, cameraMatrix, [cam_x, cam_y, cam_z]);
  var cameraPosition = [
    cameraMatrix[12],
    cameraMatrix[13],
    cameraMatrix[14],
  ];
  var up = [0, 1, 0];

  mat4.lookAt(cameraMatrix, cameraPosition, [cam_x,cam_y,cam_z-10], up);

  var viewMatrix = cameraMatrix;//mat4.create();

  //mat4.invert(viewMatrix, cameraMatrix);

  var viewProjectionMatrix = mat4.create();

  mat4.multiply(viewProjectionMatrix, projectionMatrix, viewMatrix);

  // for (var i=0;i<100;i+=1){  
    // track1[i].drawCube(gl, viewProjectionMatrix, programInfo, deltaTime);
    // track2[i].drawCube(gl, viewProjectionMatrix, programInfo, deltaTime);
    // track3[i].drawCube(gl, viewProjectionMatrix, programInfo, deltaTime);
    // wall[i].drawCube(gl, viewProjectionMatrix, programInfo, deltaTime);
    // for(var t=0;t<10;t++)
      // coin[i+t].drawCube(gl, viewProjectionMatrix, programInfo, deltaTime);
      // }
  if(dead != 1){
    track1.drawCube(gl, viewProjectionMatrix, programInfo, deltaTime);
    track2.drawCube(gl, viewProjectionMatrix, programInfo, deltaTime);
    track3.drawCube(gl, viewProjectionMatrix, programInfo, deltaTime);
    for(var i=0;i<coin.length;i++)
      coin[i].drawCube(gl, viewProjectionMatrix, programInfo, deltaTime);
    wall.drawCube(gl, viewProjectionMatrix, programInfo, deltaTime);
    player.drawCube(gl, viewProjectionMatrix, programInfo, deltaTime);
    train.drawCube(gl, viewProjectionMatrix, programInfo, deltaTime);
    jump.drawCube(gl, viewProjectionMatrix, programInfo, deltaTime);
    duck.drawCube(gl, viewProjectionMatrix, programInfo, deltaTime);
    shoe.drawCube(gl, viewProjectionMatrix, programInfo, deltaTime);
    for(var i=0;i<2;i++)
      jetpack[i].drawCube(gl, viewProjectionMatrix, programInfo, deltaTime);
    police.drawCube(gl, viewProjectionMatrix, programInfo, deltaTime);
    dog.drawCube(gl, viewProjectionMatrix, programInfo, deltaTime);
    // coin.drawCube(gl, viewProjectionMatrix, programInfo, deltaTime);
  }

}

//
// Initialize a shader program, so WebGL knows how to draw our data
//
function initShaderProgram(gl, vsSource, fsSource) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  // Create the shader program

  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  // If creating the shader program failed, alert

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
    return null;
  }

  return shaderProgram;
}

  //
  // Initialize a texture and load an image.
  // When the image finished loading copy it into the texture.
  //
  function loadTexture(gl, url) {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
  
    // Because images have to be download over the internet
    // they might take a moment until they are ready.
    // Until then put a single pixel in the texture so we can
    // use it immediately. When the image has finished downloading
    // we'll update the texture with the contents of the image.
    const level = 0;
    const internalFormat = gl.RGBA;
    const width = 1;
    const height = 1;
    const border = 0;
    const srcFormat = gl.RGBA;
    const srcType = gl.UNSIGNED_BYTE;
    const pixel = new Uint8Array([255, 255, 255, 1]);  // opaque blue
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                  width, height, border, srcFormat, srcType,
                  pixel);
  
    const image = new Image();
    image.onload = function() {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                    srcFormat, srcType, image);
  
      // WebGL1 has different requirements for power of 2 images
      // vs non power of 2 images so check if the image is a
      // power of 2 in both dimensions.
      if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
         // Yes, it's a power of 2. Generate mips.
         gl.generateMipmap(gl.TEXTURE_2D);
      } else {
         // No, it's not a power of 2. Turn off mips and set
         // wrapping to clamp to edge
         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      }
    };
    image.src = url;
  
    return texture;
  }
  
  function isPowerOf2(value) {
    return (value & (value - 1)) == 0;
  }


//
// creates a shader of the given type, uploads the source and
// compiles it.
//
function loadShader(gl, type, source) {
  const shader = gl.createShader(type);

  // Send the source to the shader object

  gl.shaderSource(shader, source);

  // Compile the shader program

  gl.compileShader(shader);

  // See if it compiled successfully

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}
