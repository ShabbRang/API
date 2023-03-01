// getting-started.js
const mongoose = require('mongoose');
const express = require('express');

const app = express();
const port = 80;  

// Connectiong to the database
main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/test');
}

const db = mongoose.connection

db.on('error', (error) => {
  console.error(error);
})

db.once('open', () => {
  console.log('Database is connected');
})

app.use(express.json())

const Todo = new mongoose.Schema({
  task: String,
  priority: String
});

Todo.methods.rem = function speak() {
  const greeting = this.task
    ? "You have to do " + this.task
    : "You haven't added it yet ";
  console.log(greeting);
};

const list = mongoose.model('list', Todo);

// const one = new list({ task: 'Sleeping', priority: '10'});
// console.log(one.task); 

app.get('/',(req, res) =>{
  return res.status(200).send('Hey there how you doin??');
})

// Adding values 
app.post('/add', async (req, res) => {
  const kit = new list({
    task: req.body.task,
    priority: req.body.priority
  })
  try{
    const nekit = await kit.save();
    res.status(201).json(nekit);
  }
  catch{
    res.status(400).json({message: err.message});
  }
})

//  Getting Values
app.get('/see', async (req, res) => {
  try{
    const kit = await list.find()
    res.json(kit);
    }
  catch{
    res.status(500).json({message: err.message})
  }
});

// Getting a Single Value
app.get('/seeone', async (req, res) => {
  try{
    const kit = await list.findOne()
    res.json(kit);
    }
  catch{
    res.status(500).json({message: err.message})
  }
});


// Deleting Values
app.delete('/del',async (req, res) => {
  try{
    const deltask = await list.find({task: req.body.task})
  if(deltask == null){
    res.status(404).json({message: 'This task is not added'})
  }
  else{
    // res.json(deltask);
    // res.remove(deltask);
    list.deleteOne({task: req.body.task}, function(err, t_name) {
      if (err) return console.log(err);
    });
    res.status(200).send('The task has been completed');
  }
  }
  catch{
    res.status(500).json({message: err.message})
  }
})

// Updating One Values
app.patch('/update', async (req, res) =>{
  try{
    const u_task = await list.find({task: req.body.task})
    if (u_task == null){
      res.status(404).json({message: "This task is not added"})
    }
    else{
      list.updateOne({task: req.body.task}, {priority: req.body.priority}, function(err) {
        if (err) return res.json({message: err})
      })
      res.json({message: 'The priority has been updated'})
    }
  }
  catch (err){
    res.status(500).json({message: err.message});
  }
})

// Updating Many Values
app.patch('/updatemany', async (req, res) =>{
  try{
    const u_task = await list.find({task: req.body.task})
    if (u_task == null){
      res.status(404).json({message: "This task is not added"})
    }
    else{
      list.updateMany({task: req.body.task}, {priority: req.body.priority}, function(err) {
        if (err) return res.json({message: err})
      })
      res.json({message: 'The priority of all tasks has been updated'})
    }
  }
  catch (err){
    res.status(500).json({message: err.message});
  }
})

app.listen(port, ()=>{
  console.log(`The application started on port ${port}`);
})


