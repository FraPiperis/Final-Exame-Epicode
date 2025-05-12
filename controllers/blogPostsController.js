// controllers/blogPostsController.js
import BlogPostModel from '../models/BlogPosts.js'

export const getAllBlogPosts = async (req, res) => {
  try {
    const posts = await BlogPostModel.find().populate('author')
    res.status(200).json(posts)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getBlogPostById = async (req, res) => {
  try {
    const post = await BlogPostModel.findById(req.params.id).populate('author')
    if (!post) return res.status(404).json({ message: 'Post non trovato' })
    res.status(200).json(post)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const createBlogPost = async (req, res) => {
  try {
    const newPost = new BlogPostModel(req.body)
    const savedPost = await newPost.save()
    res.status(201).json(savedPost)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

export const updateBlogPost = async (req, res) => {
  try {
    const updatedPost = await BlogPostModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
    if (!updatedPost) return res.status(404).json({ message: 'Post non trovato' })
    res.status(200).json(updatedPost)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

export const deleteBlogPost = async (req, res) => {
  try {
    const deleted = await BlogPostModel.findByIdAndDelete(req.params.id)
    if (!deleted) return res.status(404).json({ message: 'Post non trovato' })
    res.status(204).send()
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
