const express = require('express');
const router = express.Router();
const register_controller = require('../controller/auth_account')

//This leads to register page after clicking on button on index
router.post('/addStudents', register_controller.addAccount);

router.post('/register', register_controller.registerUser);

//leads to logging in to the account form
router.post('/login', register_controller.adminAccount);
//Shows a page for updating user data in a form after clicking the edit button from updateForm
router.get('/updateStudents/:student_id',register_controller.updateForm);
//leads to updating the user data after clicking the submit button on the form from update form
router.post('/updateUser',register_controller.updateUser);

router.get('/deleteUser/:student_id',register_controller.deleteUser);

router.post('/viewList',register_controller.viewList);

module.exports = router;