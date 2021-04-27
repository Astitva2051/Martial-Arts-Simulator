let c = document.getElementById("myCanvas");
let b = document.getElementById("mybackground");
let ctx1 = b.getContext("2d");
let ctx2 = c.getContext("2d");

var background = new Image();
background.src = "/images/background.jpg";

background.onload = () => {
    ctx1.drawImage(background,0,0,1450,595);   
};


let loadImage = (src, callback) =>{
    let img = document.createElement("img");
    img.onload = () => callback(img);
    img.src = src;
};

let imagePath = (frameNumber, animation) => {
    return "/images/" + animation + "/" + frameNumber + ".png";
};

let frames = {
    idle : [1, 2, 3, 4, 5, 6, 7, 8],
    kick : [1, 2, 3, 4, 5, 6, 7],
    punch : [1, 2, 3, 4, 5, 6, 7],
    block : [1, 2, 3, 4, 5, 6, 7, 8, 9],
    backward : [1, 2, 3, 4, 5, 6],
    forward : [1, 2, 3, 4, 5, 6]
};

let loadImages = (callback) => {
    let images = {idle : [], kick : [], punch : [], block : [], backward : [], forward : []};
    let imagesToLoad = 0; 

    ["idle", "kick", "punch", "block", "backward", "forward"].forEach((animation) => {
        let animationframes = frames[animation];
        imagesToLoad = imagesToLoad + animationframes.length;
        

        animationframes.forEach((frameNumber) => {
            let path = imagePath(frameNumber, animation);

            loadImage(path, (image) => {
                images[animation][frameNumber - 1] = image;
                imagesToLoad = imagesToLoad - 1;    
    
                if(imagesToLoad === 0){
                    callback(images);
                }
            });
        });
        
    });
};


let animate = (ctx2, images, animation, callback) => {
    images[animation].forEach((image, index) => {
        setTimeout(()=>{
            ctx2.clearRect(100, 330, 300, 270);
            ctx2.drawImage(image, 100, 300, 300, 300);
        }, index * 100);
    });

    setTimeout(callback, images[animation].length * 100);
};

loadImages((images) => {
    
    let queuedAnimation = [];
    let aux = () =>{
        let selectedAnimation;
        if(queuedAnimation.length === 0)
         selectedAnimation = "idle";
        else{
            selectedAnimation = queuedAnimation.shift();
        }
        animate(ctx2, images, selectedAnimation, aux);
    };

    aux();

    document.getElementById("kick").onclick = () =>{
        queuedAnimation.push("kick");
    };
    document.getElementById("punch").onclick = () =>{
        queuedAnimation.push("punch");
    };
    document.getElementById("block").onclick = () =>{
        queuedAnimation.push("block");
    };
    document.getElementById("backward").onclick = () =>{
        queuedAnimation.push("backward");
    };
    document.getElementById("forward").onclick = () =>{
        queuedAnimation.push("forward");
    };

    document.addEventListener('keyup', (event) => {
        const key = event.key; // "ArrowRight", "ArrowLeft", "ArrowUp", or "ArrowDown"

        if(key === "ArrowLeft")
         queuedAnimation.push("backward");
        else if(key === "ArrowRight")
         queuedAnimation.push("forward");
        else if(key === "ArrowUp")
         queuedAnimation.push("punch");
        else if(key === "ArrowDown")
         queuedAnimation.push("kick");
        else if(key === "s")
         queuedAnimation.push("block");
    });
});
