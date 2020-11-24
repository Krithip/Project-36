var dog, happyDog, database, foodS, foodStock
var fedTime, lastFed, feed, addFood, food
var changeState, readState, gameState
var bedroom, garden, washroom
var currentTime

function preload()
{
  dogImage = loadImage("images/dogimg.png")
  happyDogImage = loadImage("images/happyDog.png")
  bedroomImage = loadImage("images/virtual pet images/Bed Room.png")
  gardenImage = loadImage("images/virtual pet images/Garden.png")
  washroomImage = loadImage("images/virtual pet images/Wash Room.png")
}

function setup() {
  createCanvas(400, 500);
  database = firebase.database()
  Dog = createSprite(800, 200, 150, 100)
  Dog.addImage(dogImage)
  Dog.scale = 0.15
  foodStock = database.ref('Food')
  foodStock.on("value", readStock)
  readState = database.ref('gameState')
  readState.on("value", function(data){
    gameState = data.val()
  })
  fedTime = database.ref('feedTime')
fedTime.on("value", function(data){
  lastFed = data.val()
})
  food = new Food()
  feed = createButton("Feed the Dog")
  feed.position(700, 95)
  feed.mousePressed(feedDog)
  addFood = createButton("Add Food")
  addFood.position(800, 95)
  addFood.mousePressed(addFoods)
}


function draw() {  
currentTime = hour()
if(currentTime == (lastFed + 1)) {
  update("Playing")
  food.garden()
}else if(currentTime == (lastFed + 2)) {
  update("Sleeping")
  food.bedroom()
}else if(currentTime > (lastFed + 2) && currentTime <= (lastFed + 4)) {
  update("Bathing")
  food.washroom()
}else {
  update("Hungry")
  food.display()
}
if(gameState != "Hungry") {
  feed.hide()
  addFood.hide()
  Dog.remove()
}else {
  feed.show()
  addFood.show()
  Dog.addImage(dogImage)
}
  drawSprites();  
}

function readStock(data) {
  foodS = data.val()
  food.updateFoodStock(foodS)
}

function feedDog() {
  Dog.addImage(happyDogImage)
  food.updateFoodStock(food.getFoodStock()-1)
  database.ref('/').update({
    Food: food.getFoodStock(),
    feedTime: hour(),
    gameState: "Hungry"
  })
}

function addFoods() {
  foodS++
  database.ref('/').update({
    Food: foodS
  })
}

function update(state) {
  database.ref('/').update({
    gameState: state
  })
}
