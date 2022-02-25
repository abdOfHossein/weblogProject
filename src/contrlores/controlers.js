const Blogger = require('../../module/blogger');
const Article = require('../../module/articles');


const bcrypt = require('bcrypt');
const multer = require('multer');
const tools = require('../tools/tools');
const session = require('express-session');
const path = require('path');
const { log } = require('console');
const { upload } = require('../tools/tools');





module.exports = new class {



    async showBloggers(req, res) {
        try {

            console.log(req.session.blogger);
            if (req.session.blogger) {
                if (req.session.blogger.role === 'admin') {
                    const users = await Blogger.find({ role: 'blogger' });
                    res.render('adminDashboard', { users });
                }

            }
            else {
                res.render('loginPage', { msg: 'something is wrong!!!' })
            }

        }
        catch (err) {
            console.log(`err of show bloggers :${err}`);
        }

    }
    // blogger/dashboard

    showDashboardBlogger(req, res) {

        res.render('dashboard', { blogger: req.session.blogger, err: '', srcImgBlogger: req.session.blogger.avatar });

    }

    async doUpdateBloggerInfo(req, res) {

        try {

            const updatedData = req.body;
            const salt = await bcrypt.genSalt(5);
            const hashedPass = await bcrypt.hash(req.body.password, salt);
            updatedData.password = hashedPass;

            const user = await Blogger.findByIdAndUpdate(req.session.blogger._id, req.body);
            const result = await user.save();
            const articles = await Article.findOneAndUpdate({ writer: req.session.blogger.userName }, { writer: req.body.userName });
            req.session.blogger = result;
            res.render('dashboard', { blogger: updatedData, err: '', srcImgBlogger: req.session.blogger.avatar });


        } catch (err) {

            console.log(`err of update blogger :${err}`);
        }
    }


    async doDeleteBlogger(req, res) {
        try {

            const blogger = await Blogger.findByIdAndRemove(req.session.blogger._id);
            const articles = await Article.deleteMany({ writer: blogger.userName });
            console.log(articles);
            res.clearCookie('user_side');
            req.session.destroy(err => {
                if (err) {
                    return console.log(`can not destroy session err:${err}`);
                };
            });

            res.render('loginPage', { msg: ' user deleted successfully ' });


        } catch (err) {

            console.log(`can not findByIdAndDelete err:${err}`);
        }
    }


    showLoginPage(req, res) {
        res.render('loginPage', { msg: null });
    }


    async doLogin(req, res) {

        try {

            const blogger = await Blogger.findOne({ userName: req.body.userName });

            if (!blogger) {
                return res.render('loginPage', { msg: 'something is wrong!!!' });
            } else {



                const validatePass = await bcrypt.compare(req.body.password, blogger.password);

                if (!validatePass) {
                    return res.render('loginPage', { msg: 'something is wrong!!!' });
                }
                blogger.password = req.body.password;
                res.cookie('user_side', blogger._id);
                req.session.blogger = blogger;
                if (blogger.role == 'admin') {

                    const users = await Blogger.find({ role: 'blogger' });
                    res.render('adminDashboard', { users });
                    return

                };
                console.log(req.session.blogger.avatar);
                res.redirect('/blogger/dashboard');
                // res.render('dashboard', { blogger, err: '', srcImgBlogger: req.session.blogger["avatar"] });

            }

        } catch (err) {
            console.log(`not found err:${err}`);
        }
    }

    doLogout(req, res) {
        res.clearCookie('user_side');
        console.log(req.session.blogger);
        req.session.destroy(err => {
            if (err) {
                return console.log(`can not destroy session err:${err}`);
            };
        });
        res.render('loginPage', { msg: 'you logOut successfully' });
    }


    showRegisterPage(req, res) {

        res.render('registerPage', { error: null });
    }



    async doRegister(req, res, next) {

        try {
            console.log(req.body);

            const salt = await bcrypt.genSalt(5);
            const hashedPass = await bcrypt.hash(req.body.password, salt);
            const user = new Blogger(req.body);
            user.password = hashedPass;

            if (req.file) {

                user.avatar = req.file.filename;
            }

            const result = await user.save();
            return res.render('loginPage', { msg: 'you register succussfully' })


        } catch (err) {

            console.log(`err of do register:${err}`);
        }


    }


    async doUpdateAvatar(req, res, next) {

        try {

            req.session.blogger.avatar = req.file.filename;
            const user = await Blogger.findByIdAndUpdate(req.session.blogger._id, { avatar: req.file.filename });
            res.render('dashboard', { blogger: user, err: '', srcImgBlogger: req.session.blogger.avatar });
        }
        catch (err) {

            console.log(`err of doUpdateAvatar:${err}`);
        }

    }



    async creatNewArticle(req, res, next) {

        try {

            const newArticle = await new Article({
                title: req.body.titleArticle,
                text: req.body.textArticle,
            });
            newArticle.writer = req.session.blogger.userName;
            if (req.file) {

                newArticle.image = req.file.filename;
            }

            console.log(newArticle);
            const result = await newArticle.save();

            res.render('dashboard', { blogger: req.session.blogger, err: 'article created successfuuly', srcImgBlogger: req.session.blogger.avatar });

        } catch (err) {

            console.log(`err of creatNewArticle:${err}`);
        }

    }


    async showArticlesOfBlogger(req, res) {
        try {
            console.log(req.session.blogger);
            const writer = req.session.blogger.userName;
            const articles = await Article.find({ writer });
            console.log(articles);
            res.render('bloggerArticles', { msg: 'wellcome to your articlesPage', articles: articles });

        } catch (err) {

            console.log(`err of showArticlesOfBlogger:${err}`);
        }

    }


    async showWholeArticles(req, res) {


        try {
            console.log(req.session.blogger);
            const writer = req.session.blogger.userName;
            const articles = await Article.find({}).sort({ createdAt: 1 });
            res.render('wholeArticles', { msg: 'wellcome articlesPage', articles: articles });

        } catch (err) {

            console.log(`err of showArticlesOfBlogger:${err}`);
        }

    }



  async  doUpdateArticle(req,res){


        try {
            
const article=await Article.find()

        } catch (err) {
            
        }
    }

}