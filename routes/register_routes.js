// creating Router
let express = require ('express');
const router = express.Router();

// defining the router

router.get('/',(req,res) => {
  res.render('index')
});

router.get('/addStudents',(req,res) => {
  res.render('addStudents')
});

router.get('/register',(req,res) => {
  res.render('register')
});

router.get('/login',(req,res) => {
  res.render('login')
});

router.get('/viewStudents',(req,res) => {
  res.render('viewStudents')
});


module.exports = router;