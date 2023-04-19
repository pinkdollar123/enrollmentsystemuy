const newAdmin = require('bcrypt');
const mySql = require('mysql2');
const db = mySql.createConnection //Used to create connection to database
  (
    {
      host: process.env.DATABASE_HOST,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE,
      port: process.env.DATABASE_PORT
    }
  );

  //adding an account start
  exports.addAccount = (req,res) => {

    const {
      first_name: first_name, 
      last_name: last_name, 
      email: email, 
      course_id: course_id} = req.body;
    
          db.query('insert into students set ?',
          {
            first_name: first_name,
            last_name: last_name,
            email: email,
            course_id: course_id,
          },
          (error,result) => {
            if (error)
            {
              console.log(`Error message select add:` + error);
            }
            else
            {
              console.log(result)
              return res.render('addStudents',{message: 'A student has been added'})
            }
          })
        }

  //end of add account

  exports.registerUser = (req,res) =>{
    const {
      user_admin: user_admin,
      adminPass: adminPass,
      confirmPassword: confirmPassword} = req.body;

  if (adminPass !== confirmPassword){
    return res.render('register',
            {
              message: 'Passwords do not match'
            })
  }

  db.query('Select user_admin from users where user_admin = ?', user_admin,
  async (error,result) => {
    if (error)
    {
      console.log('Error' + error);
    }
    else 
    {
      if (result.length>0)
      {
        console.log('The admin name already exist');
        return res.render('register',{message: 'The admin name already exist. Please use a different admin name'})
      }
      else{
        const hashPassword = await newAdmin.hash(adminPass, 8);
        console.log(hashPassword)
        console.log('An admin account has been added')

    
          db.query('insert into users set ?',
          {
            user_admin: user_admin,
            adminPass: hashPassword,
          },
          (error,result) => {
            if (error)
            {
              console.log(`Error message select add:` + error);
            }
            else
            {
              console.log(result)
              return res.render('register',{message: 'User account has been added'})
            }
          })
        }}
      })
    }
// exporting logging in account

exports.adminAccount = async (request, response) => {
  try {
    const {user_admin, adminPass} = request.body

    if (user_admin == '' || adminPass == '')
    {
      return response.render('index',{message: 'Fields should not be empty'})
    }
    else
    {
      db.query('Select user_admin, adminPass from users where user_admin = ?', user_admin, async (error,result) =>{
        if (!result[0]){
          response.render('index', {message: 'Incorrect admin'});
        }else if(!(await newAdmin.compare(adminPass,result[0].adminPass)))
        { 
          console.log(adminPass)
          response.render('index', {message: 'Incorrect password'})
        }else{
          // return response.render('index', {message: 'Login Successfully'})
          console.log(adminPass)
          db.query('select s.student_id, s.first_name, s.last_name, s.email, c.course_name from students as s inner join courses as c on s.course_id = c.course_id', (error,result) =>{
            if (error){
              console.log('Error message' + error);
            }
            else if(!result){
              response.render('viewStudents',{message: 'No results found'});
            }
            else{
              response.render('viewStudents',
              { title: 'Add a Student',
                data: result
              })
            }
          })
        }
      })
    }
  } catch (error) {
    console.log('Error in login' + error)
  }
}

// Updating data function
exports.updateForm = (request, response) =>
{
  // the field id on the data base
  const student_id = request.params.student_id;
  console.log(student_id)
  // query
  db.query('select * from students where student_id =?', student_id,
  (error, data) => {
    if (error){
      console.log('Error Message:' + error)
    }else{
      response.render('updateStudents',{
        title: 'Update Student Info',
        data: data[0]
      });
    }
  }
  )
}

//deleting data function

exports.updateUser = (request, response) =>
{
  const {first_name, last_name, student_id, course_id} = request.body;
  console.log(first_name,last_name)

  db.query('Update students set first_name = ?, last_name = ?, course_id = ? where student_id = ?',
  [
    first_name,
    last_name,
    student_id,
    course_id
  ],
    (error, data) => 
  {
    if (error)
    {
      console.log(`Error ${error}`)
    }
    else
    {
      db.query('select s.student_id, s.first_name, s.last_name, s.email, c.course_name from students as s inner join courses as c on s.course_id = c.course_id order by student_id asc', (error,data) =>
      {
        if (error)
        {
          console.log(`Error Message: ${error}`)
        }
        else if(!data)
        {
          response.render('viewStudents',{message: 'No results found'})
        }
        else{
            response.render('viewStudents',
            {
              title: 'List of Students',
              data: data
            })
        }
      })
    }
  } )
}

exports.deleteUser = (request, response) =>{
  const student_id = request.params.student_id;
  db.query('Delete from students where student_id = ?',
  [student_id],
  (error,result) => {
    if (error) {
      console.log(`Error Message ${error}`);
    }else{
      db.query('select * from students', (error,data)=>{
        if (error){
          console.log(`Error message ${error}`);
        }else if(!data[0]){
          response.render('viewStudents',{
            message: "No result found!"
          });
        }else{
          console.log('test')
          response.render('viewStudents',
          {
            title: 'List of updated Students',
            data: data
          });
        }
      })
    }
})
}

exports.viewList = (request,response) => {
  const {
    student_id: student_id,
    first_name: first_name, 
    last_name: last_name, 
    email: email, 
    course_name: course_name,
    date_created: date_created} = request.body;

    db.query('select s.student_id, s.first_name, s.last_name, s.email, c.course_name, s.date_created from students as s inner join courses as c on s.course_id = c.course_id', [student_id,first_name,last_name,email,course_name,date_created],
  (error,data) =>{
    if (error){
      console.log(`Error message ${error}`);
    }else if(!data[0]){
      response.render('viewStudents',{
        message: "No result found!"
      });
    }else{
      console.log('test')
      response.render('viewStudents',
      {
        title: 'List of updated Students',
        data: data
      });
    }
  })
}