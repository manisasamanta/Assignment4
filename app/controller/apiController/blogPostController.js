const Category = require("../../model/category");
const Post = require("../../model/post");



class blogPostController {

    // Add a new blog category
    create_blog_category = async (req, res) => {
        try {
            const { name, description } = req.body;
            const category = new Category({
                name,
                description
            });
            await category.save();

            res.status(201).json({
                status: true,
                data: category,
                message: 'Category added'
            })
        } catch (error) {
            res.status(500).json({
                status: false,
                message: error.message
            });
        }
    }


    // Create a new blog post
    create_new_blogPost = async (req, res) => {
        try {
            const { title, content, category, tags } = req.body;
            const post = new Post({
                title,
                content,
                category,
                tags,
                author: req.user.userId
            });
            await post.save();

            res.status(201).json({
                status: true,
                data: post,
                message: 'Post created'
            })
        } catch (error) {
            res.status(500).json({
                status: false,
                message: error.message
            });
        }
    }



    // Get all categories with post counts
    get_allCategories = async (req, res) => {
        try {
            const categories = await Category.aggregate([
                {
                    $lookup: {
                        from: 'posts',
                        localField: '_id',
                        foreignField: 'category',
                        as: 'posts'
                    }
                },
                {
                    $project: {
                        name: 1,
                        description: 1,
                        totalPosts: { $size: '$posts' },
                        posts: 1
                    }
                }
            ]);

            res.status(201).json({
                status: true,
                data: categories,
                message: 'all categories fetched'
            })
        } catch (error) {
            res.status(500).json({
                status: false,
                message: error.message
            });
        }
    }


    // Edit a post
    edit_post = async (req, res) => {
        try {
            const { title, content, category, tags } = req.body;
            const update = { title, content, category, tags };

            // Find the post by ID
            const post = await Post.findById(req.params.id);

            // Check if the post exists and if the current user is the author
            if (!post || !post.author.equals(req.user.userId)) {
                return res.status(403).send('Not authorized');
            }

            await Post.findByIdAndUpdate(req.params.id, update);

            res.status(201).json({
                status: true,
                message: 'Post updated'
            })
        } catch (error) {
            res.status(500).json({
                status: false,
                message: error.message
            });
        }
    }



    // Delete a post
    delete_post = async (req, res) => {
        try {
            const post = await Post.findById(req.params.id);

            // Check if the post exists and if the current user is the author
            if (!post || !post.author.equals(req.user.userId)) {
                return res.status(403).send('Not authorized');
            }
            await Post.findByIdAndDelete(req.params.id);

            res.status(200).json({
                status: true,
                message: 'Post deleted'
            })
        } catch (error) {
            res.status(500).json({
                status: false,
                message: error.message
            });
        }
    }

    // Like a post
    like_post = async (req, res) => {
        const postId = req.params.id;
      
        // Find the post by ID and increment the likes field
        try {
          const post = await Post.findById(postId);
          if (!post) {
            return res.status(404).send('Post not found');
          }
      
          // Increment the likes count
          post.likes += 1;
          await post.save();
      
          res.status(201).json({
            status: true,
            message: 'Post liked successfully'
        })
        } catch (error) {
            res.status(500).json({
                status: false,
                message: error.message
            });
        }
      }




    // Get posts sorted by likes
    getPosts_sorted_by_likes = async (req, res) => {
        try {
            const posts = await Post.find().sort({ likes: -1 });
           
            res.status(200).json({
                status: true,
                data:posts
            })
        } catch (error) {
            res.status(500).json({
                status: false,
                message: error.message
            });
        }
    }

}

module.exports = new blogPostController()