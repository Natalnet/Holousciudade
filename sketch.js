// press keys 1 to 9 to see different filters

let img;
let imgPerua;

const words = [] // store word objects

let x=0,y=0;

let sons = []
let somAtual = 0;
let volume_atual = 1;
let analyzer;
let tempo=300;
let contador=0;


// preload is an event function called before setup
function preload() {
  img = loadImage("assets/palavras.jpeg");
  imgPerua = loadImage("assets/perua.png")
  sons[0] = loadSound("/assets/Colombia - 5s - 1.wav")
  sons[1] = loadSound("/assets/Colombia - 5s - 2.wav")
  sons[2] = loadSound("/assets/Colombia - 5s - 3.wav")
  sons[3] = loadSound("/assets/Colombia - 5s - 4.wav")
  sons[4] = loadSound("/assets/Colombia - 5s - 5.wav")
  sons[5] = loadSound("/assets/Colombia - 5s - 6.wav")
  
  sons[6] = loadSound("/assets/Goiania 5s 1.wav")
  sons[7] = loadSound("/assets/Goiania 5s 2.wav")
  sons[8] = loadSound("/assets/Goiania 5s 3.wav")
  sons[9] = loadSound("/assets/Goiania 5s 4.wav")
  sons[10] = loadSound("/assets/Goiania 5s 5.wav")
  sons[11] = loadSound("/assets/Goiania 5s 6.wav")
  sons[12] = loadSound("/assets/Goiania 5s 7.wav")
  sons[13] = loadSound("/assets/Goiania 5s 8.wav")
  sons[14] = loadSound("/assets/Goiania 5s 9.wav")
  sons[15] = loadSound("/assets/Goiania 5s 10.wav")
}

function setup() {
  createCanvas(img.width, img.height);
  background(0)
  sons[somAtual].setVolume(volume_atual);
  sons[somAtual].loop();
  
  // create a new Amplitude analyzer
  analyzer = new p5.Amplitude();

  // Patch the input to an volume analyzer
  analyzer.setInput(sons[somAtual]);
  

  const str = 'HolosCi(u)dad(e) invisible machinique écosystème ecosistema naturaleza nature corps body rituel agua water eau megáfono mégaphone ahora rythme'
  const wordsStr = str.split(' ')


  // track word position
  let x = 20
  let y = 60
  fill(255)
  // iterate over each word
  for (let i = 0; i < wordsStr.length; i++) {
      const wordStr = wordsStr[i] // get current word
      const wordStrWidth = textWidth(wordStr) // get current word width
      const word = new Word(wordStr, x, y, i)
      words.push(word)
      x = x + wordStrWidth + textWidth(' ') // update x by word width + space character
      // look ahead the next word - will it fit in the space? if not, line break
      const nextWordStrWidth = textWidth(wordsStr[i+1]) || 0
      if (x > width - nextWordStrWidth) {
          y += 40 // line height, sort of
          x = 20 // reset x position
      }
  }
  
}

function draw() {
 // background(0)
drawBackground()
  // draw image first
  //image(img, x, y);
  image(imgPerua,x,y)
   
  
  // then apply a filter
  if (key === "1") { 
    filter(INVERT);
    label("INVERT");
    x = random(-img.width/2,img.width/2)
    y = random(-img.height/2,img.height/2)
  } else if (key === "2") { 
    filter(THRESHOLD);
    label("THRESHOLD");
  } else if (key === "3") { 
    filter(GRAY);
    label("GRAY");
  } else if (key === "4") { 
    filter(DILATE);
    label("DILATE");
  } else if (key === "5") { 
    filter(ERODE);
    label("ERODE");
  } else if (key === "6") {
    filter(POSTERIZE, 2);
    label("POSTERIZE 2");
  } else if (key === "7") {
    filter(POSTERIZE, 4);
    label("POSTERIZE 4");
   } else if (key === "8") { 
    filter(BLUR, 3);
    label("BLUR 3");
  }  else if (key === "9") { 
    filter(BLUR, 12);
    label("BLUR 12");
  }
  for (let i = 0; i < words.length; i++) {
    const word = words[i] // retrieve word object
    if(mouseIsPressed && isMouseInsideText(word.word, word.x, word.y))     {
       word.fcolor=color(random(0,255)); 
       word.tsize++;
      /*if(word.mode==0)
        word.mode=1;
      else
        word.mode=0; */
    }
    word.update()
    word.display()
  }
  if(mouseIsPressed && mouseX>x && mouseX<imgPerua.width && mouseY>y && mouseY<imgPerua.height) {
    console.log("Clicou perua")
   
     if(sons[somAtual].isPlaying()) {
       sons[somAtual].stop();
     }
     somAtual=parseInt(random(0,15));
     console.log(somAtual)
     sons[somAtual].setVolume(volume_atual);
     sons[somAtual].loop();
  }
  mudancas()
}

function mudancas() {
  contador++;
  if(contador>tempo) {
    contador=0;
     if(sons[somAtual].isPlaying()) {
       sons[somAtual].stop();
       somAtual++
       if(somAtual>15)
          somAtual=0;
        sons[somAtual].setVolume(volume_atual);
        sons[somAtual].loop();
        analyzer = new p5.Amplitude();
     }  
   //console.log("Mudou"+somAtual)
  }
  
  let rms = analyzer.getLevel();
 if(rms>0.06) {
     for (let word of words) word.spread()
  }
  if(rms>0.12) {
      x=x+random(-1,1);
       y=y+random(-1,1);
   }
  //console.log(contador)
}

  function keyPressed() {
      if (key === 'r') {
          for (let word of words) word.spread()
      } else if (key === ' ') {
          for (let word of words) word.reset()
      }
  }

   class Word {
            constructor(word, x, y, idx) {
                this.word = word
                this.x = x
                this.y = y
                // target position is the same as current position at start
                this.tx = this.x
                this.ty = this.y
                // original position
                this.origx = this.x
                this.origy = this.y
                this.idx = idx
                this.fcolor = color(255)
                this.tsize=48;
                this.mode=0;
            }

            reset() {
                this.tx = this.origx
                this.ty = this.origy
            }

            spread() {
                this.tx = random(width)
                this.ty = random(height)
            }

            update() {
                // move towards the target by 10% each time
                this.x = lerp(this.x, this.tx, 0.1)
                this.y = lerp(this.y, this.ty, 0.1)
            }

            display() {
                fill(this.fcolor)
                noStroke()
                textSize(this.tsize)
                if(this.mode==0) {
                   text(this.word, this.x, this.y)
                }else {
                  let txtH = this.tsize;
                  let txtW = textWidth(this.word);
                  let spacing = txtW / this.word.length;

                  for(let i = 0; i < this.word.length; i++){
                    let c = this.word.charAt(i);

                    let offsetX = random(-spacing / 10.0, spacing / 10.0);
                    let offsetY = random(-spacing / 10.0, spacing / 10.0);

                    let startX = (this.x - txtW) / 2 + spacing / 2;
                    let y = this.y / 2; //  + textHeight / 2;
                    text(c, startX + i * spacing + offsetX, y + offsetY);
                }
              }
            }
        }

function isMouseInsideText(message, messageX, messageY) {
  const messageWidth = textWidth(message);
  const messageTop = messageY - textAscent();
  const messageBottom = messageY + textDescent();

  return mouseX > messageX && mouseX < messageX + messageWidth &&
    mouseY > messageTop && mouseY < messageBottom;
}

function drawBackground() {
  for (var i = 0; i < width; i++) {
    if(somAtual==0||somAtual==6||somAtual==12)
       stroke(i - 255, 30, 50);
    else if(somAtual==1||somAtual==7||somAtual==13)
       stroke(30, i - 255, 50);
    else if(somAtual==2||somAtual==8||somAtual==14)
       stroke(30,50 , i - 255);
    else if(somAtual==3||somAtual==9||somAtual==15)
       stroke(50, i - 255, 30);
    else if(somAtual==4||somAtual==10)
       stroke(i - 255, 50, 30);
    else if(somAtual==5||somAtual==11)
       stroke(i - 255, 50, i - 255);
    line(0, i, width, i);
  }
}
