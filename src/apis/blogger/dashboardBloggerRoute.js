const express = require('express');
const router = express.Router();

const controlers = require('../../contrlores/controlers');
const validatores = require('../../validatores/validatores');
const middlewares = require('../../middlewares/middlewares');
const tools=require('../../tools/tools');

const articles=require('./articles');


const uploadUpdateAvatar = tools.upload.single('updateAvatar');


//dashboardPage
router.get('/', controlers.showDashboardUser);

router.post('/update', validatores.arrOfValidateUpdateBloggerInfo(), validatores.doValidateUpdateBloggerInfo, controlers.doUpdateBloggerInfo);

router.get('/delete', controlers.doDeleteBlogger);


//articles
router.use('/articles',articles);



//avatar
router.post('/avatar/update', uploadUpdateAvatar, controlers.doUpdateAvatar);



module.exports = router;