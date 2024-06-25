const birdImageSrc = './sprites/bluebird-midflap.png'
const pipeImageSrc = './sprites/pipe-green.png'
const pipeImageRotatedSrc = './sprites/pipe-green-rotated.png'

const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

// set height and width
canvas.width = window.innerWidth
canvas.height = window.innerHeight
const halfCanvasWidth = canvas.width / 2
const halfCanvasHeight = canvas.height / 2

// gravity factor for bird
const gravity = 0.2

// function to create images
function createImage(src){
    const image = new Image()
    image.src = src
    return image
}

const birdimg = createImage(birdImageSrc)
const pipeimg = createImage(pipeImageSrc)
const pipeimgrotated = createImage(pipeImageRotatedSrc)

// bird initialisation
class Bird{
    constructor(){
        this.position = {
            x: halfCanvasWidth,
            y: halfCanvasHeight
        }
        this.velocity = {
            x: 0,
            y: 0
        }
        this.width = 20
        this.height = 20
    }

    draw(){
        ctx.fillStyle = 'red'
        if((this.position.y + this.height + this.velocity.y >= canvas.height)){
            this.velocity.y = 0
        }else{
            this.velocity.y += gravity
        }

        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        ctx.drawImage(birdimg, this.position.x, this.position.y)
        // ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}

// pillar initialisation
class Pillar{
    constructor({x, y, height, reverse}){
        this.position = {
            x,
            y
        }
        this.velocity = {
            x: 5
        }

        this.height = height
        this.width = 50
        this.reverse = reverse
    }

    draw(){
        ctx.fillStyle = 'green'
        this.position.x -= this.velocity.x
        if(this.reverse){
            ctx.drawImage(pipeimgrotated, this.position.x, this.position.y, this.width, this.height)
        }else{
            ctx.drawImage(pipeimg, this.position.x, this.position.y, this.width, this.height)
        }
        // ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}

// add objects on scene
// pillar factors
let xfactor = 400
let counter = 1

const bird = new Bird()
let pillars = []

for(let i = 0; i<=5; i++){
    addPillar()
}

// function which continuously updates to add animation
function animate(){
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    pillars.forEach(pillar => {
        pillar.draw()
    })
    bird.draw()

    pillars.forEach(pillar => {
        console.log(bird.position.x + bird.width + bird.velocity.x, pillar.position.x);
        if(bird.position.x + bird.width + bird.velocity === pillar.position.x){
            console.log('game over');
        }
    })

    requestAnimationFrame(animate)
}

animate()

function addPillar(){
    const {y1, y2} = generateCoords()
    pillars.push(new Pillar({x: xfactor * counter, y: 0, height: y1, reverse: true}))
    pillars.push(new Pillar({x: xfactor * counter, y: canvas.height - y2, height: y2}))
    counter += 1
}

setInterval(() => {
    addPillar()
}, 500)

function generateCoords(){
    const y1 = Math.floor(Math.random() * (canvas.height - 100))
    const y2 = canvas.height - y1 - 100

    return {y1, y2}
}

// add key events
window.addEventListener('keydown', (e) => {
    console.log(e.key);
    switch (e.key){
        case 'ArrowUp':
            bird.velocity.y -= 10
            break
        case 'ArrowDown':
            bird.velocity.y += 10
            break
    }
})

window.addEventListener('keyup', (e) => {
    switch (e.key){
        case 'ArrowUp':
        case 'ArrowDown':
            bird.velocity.y = 0
            break
    }
})