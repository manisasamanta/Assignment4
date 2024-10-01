const express = require('express')
const userController = require('../controller/apiController/userController')
const verifyToken = require('../middleware/auth')
const upload = require('../utils/image')
const blogPostController = require('../controller/apiController/blogPostController')
const Router = express.Router()


//user controller

Router.post('/signup',upload.single('profilePicture'),userController.signup)
Router.get('/verify/:token',userController.verify_token)
Router.post('/login',userController.login)

Router.get('/profile',verifyToken,userController.profile)
Router.post('/update/profile/:id',verifyToken,upload.single('profilePicture'),userController.update_profile)


//blog post controller
Router.post('/create/blog_category',verifyToken,blogPostController.create_blog_category)
Router.post('/create/new_blogPost',verifyToken,blogPostController.create_new_blogPost)
Router.get('/allCategories',verifyToken,blogPostController.get_allCategories)
Router.post('/edit/post/:id',verifyToken,blogPostController.edit_post)
Router.delete('/delete/post/:id',verifyToken,blogPostController.delete_post)

Router.post('/like/posts/:id',verifyToken,blogPostController.like_post)
Router.get('/posts/sorted/byLikes',verifyToken,blogPostController.getPosts_sorted_by_likes)









module.exports = Router