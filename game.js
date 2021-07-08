window.addEventListener("load", function(){

    const startBtn = document.getElementById("start");
    const soundBtn = document.getElementById("sound");
    const xmasBtn = document.getElementById("xmas");
    const score = document.getElementById("score");
    const hScore = document.getElementById("hScore");
    const level = document.getElementById("level");    
    const pacman = document.getElementById("pacman");
    const pacImg = document.getElementById("pacImg");
    const uWon = document.getElementById("uWon");
    const gameOver = document.getElementById("gameOver");
    const timeDiv = document.getElementById("time");
    let scoreCt;
    let hScoreCt = 0;
    let foodCt;
    // let levelCt = 1;
    let started = false;
    let xmasMode = false;
    let f;
    // >
    let interval;
    const step = 25;
    
    // level.addEventListener("change", function(){
    //     f = document.getElementById("level").getElementsByTagName("option").value;
    //     console.log(f);
    // });
    

    function initGame() {

        pacman.style.left = "0px";
        pacman.style.top = "0px";
        pacImg.style.imageOrientation = "none";
        pacImg.style.transform = "scaleX(1)";
        startBtn.textContent = "RESTART";
        gameOver.style.visibility = "hidden";
        uWon.style.visibility = "hidden";
        scoreCt = 0;
        foodCt = 0;
        score.textContent = scoreCt;
        //score.className = "";
        timeDiv.textContent = "0:30";
        // >
        window.clearInterval(interval);
        
    }

    startBtn.addEventListener("click", function(){
        
        //const brd = document.querySelector("#board");
        
        initGame();
        startBtn.textContent = "RESTART";
        
        let startTime = new Date();
        interval = window.setInterval(timer, 1000);
        
        // --- CLEARING UP ---

        let foods = document.querySelectorAll(".food");
        //if(foods.length) for(f of foods) brd.removeChild(f);
        for (let i = 0; i < foods.length; i++) {
            foods[i].remove();
        }
        
        
        // --- MAKING FOOD ---

        // board: 600px * 600px / 3*3* 200px * 200px
        // pacman: 25px * 25px, food: 15px * 15px 
        // f: hányszor hányas a tábla
        // const f = 3;    //f lehet 2-6 között és 8 (7 nem)

        f = document.getElementById("level").selectedOptions[0].value;
        //const w = f!==5?600:625;
        
        function randomPos(factor){
            //return factor * (w/f) - Math.floor(Math.random() * (w/f/step) + 1) * step + 5;
            return (factor * (600/f)) - (Math.floor(Math.random() * (600/f/step) + 1) * step) + 5;
        }

        // for (let i = 1; i < f*f+1; i++) {
            
        //     let leftFactor = i % f ? i % f : f;
        //     let foodLeft = randomPos(leftFactor);
    
        //     let topFactor = i % f ? parseInt(i / f) + 1 : i / f;
        //     let foodTop = randomPos(topFactor);
    
        //     if (i<2 && foodLeft<30 && foodTop<30) foodLeft += step;
    
        //     let newFood = document.createElement("div");
        //     newFood.setAttribute("class", "food");
            
        //     newFood.style.left = foodLeft + "px";
        //     newFood.style.top = foodTop + "px";

        //     document.getElementById("board").appendChild(newFood);

        //     foodCt = i;
        // }

        for (let i = 1; i < f*f+1; i++) {
            
            let leftFactor = i % f?i % f:f;
            let posLeft = randomPos(leftFactor);
            let topFactor = i % f ? parseInt(i / f) + 1 : i / f;
            let posTop = randomPos(topFactor);

            if (i < 2) {
                if(posLeft < 30) posLeft += step;        
                if(posTop < 30) posLeft += step;
            }

            let newFood = document.createElement("DIV");
            newFood.setAttribute("class", "food");
            
            newFood.style.left = posLeft + "px";
            newFood.style.top = posTop + "px";

            document.getElementById("board").appendChild(newFood);

            console.log(newFood.style.left + ", " + newFood.style.top);

            foodCt = i;
            // console.log(foodCt);
        }
        
        // --- MOVING PacMan ---

        function movePac(e){

            switch (e.key){
                case "ArrowRight": 
                    if (parseInt(pacman.style.left) < 574){
                        pacman.style.left = parseInt(pacman.style.left) + step + "px"; //right
                        pacImg.style.transform = "scaleX(1)";
                    }
                break;
                case "ArrowDown": 
                    if (parseInt(pacman.style.top) < 574){
                        pacman.style.top = parseInt(pacman.style.top) + step + "px"; //down
                        pacImg.style.transform = "rotate(.25turn)";
                    }
                break;
                case "ArrowLeft": 
                    if (parseInt(pacman.style.left) > 0){
                        pacman.style.left = parseInt(pacman.style.left) - step + "px"; //left
                        pacImg.style.transform = "scaleX(-1)";
                    }
                break;
                case "ArrowUp": 
                    if (parseInt(pacman.style.top) > 0){
                        pacman.style.top = parseInt(pacman.style.top) - step + "px"; //up
                        pacImg.style.transform = "rotate(.75turn)";
                    }
                break;
            };

            // console.log(step);
            // console.log(pacman.style.left);
            // console.log(pacman.style.top);
            // console.log("-------");

            // --- EATING & counting food ---

            foods = document.querySelectorAll(".food");
            // let foods = document.querySelectorAll(".food");
            
            for (let i = 0, len = foods.length; i < len; i++){
                if (((parseInt(pacman.style.left) + 5) == parseInt(foods[i].style.left)) && ((parseInt(pacman.style.top) + 5) == parseInt(foods[i].style.top))){
                    // foods[i].style.visibility = "hidden";
                    // ehelyett törölni
                    foods[i].remove();
                    scoreCt++;  //+= 1
                    score.textContent = scoreCt;
                    if (scoreCt > hScoreCt){
                        hScoreCt = scoreCt;
                        hScore.textContent = hScoreCt;
                    } 

                    // --- blink ---
                    // score.style.background = "gold";
                    //setTimeout(function(){ score.style.backgroundColor = "gold"; }, 100);
                    

                    // --- all food eaten ---
                    if(scoreCt === foodCt){
                        uWon.style.visibility = "visible";
                        window.removeEventListener("keydown", movePac);
                        started = false;
                        window.clearInterval(interval);
                    }
                }
            }
            // timer();
        }

        // --- TIMER ---
        function timer() {
            let endTime = new Date();
            let timeDiff = endTime - startTime; //in ms
            // strip the ms
            timeDiff /= 1000;
                
            // get seconds 
            let seconds = Math.round(timeDiff);
            // console.log(seconds + " seconds");

            timeDiv.innerText = "0:" + (30 - seconds);

            if (seconds > 29){
                window.clearInterval(interval);
                // console.log("vége");
                gameOver.style.visibility = "visible";
                window.removeEventListener("keydown", movePac);
                started = false;
            }
        }

        if (started === false){
            window.addEventListener("keydown", movePac);
            started = true;
        }

    });
    
    // --- SOUND ---
    const sound = document.createElement("audio");
    sound.src = "./sound/PacManThemeRemix.mp3";
    sound.setAttribute("preload", "auto");
    sound.setAttribute("controls", "none");
    sound.volume = 0.05;
    sound.style.display = "none";
    document.body.appendChild(sound);
    let soundStatus = false;

    soundBtn.addEventListener("click", function(){
        if (soundStatus === false){
            soundBtn.textContent = "SOUND OFF";
            soundStatus = true;
            sound.play();
        } else {
            soundBtn.textContent = "SOUND ON";
            soundStatus = false;
            sound.pause();
        }
    });

    // --- XMAS mode ---
    let title = document.getElementById("title__h1");
    let board = document.getElementById("board");
    let panel = document.getElementById("panel");

    xmasBtn.addEventListener("click", function(){
        if(xmasMode === false){
            document.body.style.backgroundImage = "url('./img/game_bg_xmas.jpg')";
            title.classList.remove("default");
            title.classList.add("xmas");
            board.classList.remove("default");
            board.classList.add("xmas");
            panel.classList.remove("default");
            panel.classList.add("xmas");
            time.classList.remove("default");
            time.classList.add("xmas");     
            score.classList.remove("default");
            score.classList.add("xmas");     
            hScore.classList.remove("default");
            hScore.classList.add("xmas");     
            level.classList.remove("default");
            level.classList.add("xmas");   
            soundBtn.classList.remove("default");
            soundBtn.classList.add("xmas");
            startBtn.classList.remove("default");
            startBtn.classList.add("xmas");
            xmasBtn.classList.remove("default");
            xmasBtn.classList.add("xmas");
            xmasBtn.textContent = "XMAS OFF";
            // let foods = document.querySelectorAll(".food");
            // for (let i = 0; i < foods.length; i++) {
            //     foods[i].
            // }
            xmasMode = true;
        } else {
            document.body.style.backgroundImage = "url('./img/game_bg.jpg')";
            title.classList.remove("xmas");
            title.classList.add("default");   
            board.classList.remove("xmas");
            board.classList.add("default"); 
            panel.classList.remove("xmas");
            panel.classList.add("default");     
            time.classList.remove("xmas");
            time.classList.add("default");     
            score.classList.remove("xmas");
            score.classList.add("default");     
            hScore.classList.remove("xmas");
            hScore.classList.add("default");     
            level.classList.remove("xmas");
            level.classList.add("default");     
            soundBtn.classList.remove("xmas");
            soundBtn.classList.add("default");            
            startBtn.classList.remove("xmas");
            startBtn.classList.add("default");            
            xmasBtn.classList.remove("xmas");
            xmasBtn.classList.add("default");            
            xmasBtn.textContent = "XMAS ON";
            xmasMode = false;
        }
    });
    
});





