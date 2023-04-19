// server syntax
const express = require('express');
const app = express ();
const port = 5100;
// path and database syntax
const path = require('path');
const env = require('dotenv');
env.config({path: './.env'});

//server syntax
//on top
app.use(express.json());
app.use(express.urlencoded({extended: true}))

//use app.set the created HBS
app.set('view engine', 'hbs');
// defining the routes of the folder and file of the handle bar files
// requires single modules for sharing of each routes
app.use('/', require('./routes/register_routes'))
app.use('/auth', require('./routes/auth'))
// app.use('/index', require('./routes/index_routes'))

//server syntax
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
  //database syntax
  // db.connect((err) => {
  //   if (err)
  //   {
  //     console.log(`Error + ${err}`);
  //   }else
  //   {
  //     console.log(`Database Connected`)
  //   }
  // })
});