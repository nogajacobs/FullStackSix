import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PostsPage = () => {
  const navigate = useNavigate();

  // Retrieve current user from localStorage
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const userId = currentUser.id;
  const username = currentUser.name;
  const userEmail = currentUser.email;

  // State variables
  const [posts, setPosts] = useState([]); // Holds all posts fetched from the server
  const [newPostTitle, setNewPostTitle] = useState(''); // Holds the title of a new post being added
  const [newPostContent, setNewPostContent] = useState(''); // Holds the content of a new post being added
  const [searchCriteria, setSearchCriteria] = useState({ id: '', title: '' }); // Holds the current search criteria
  const [editingPostId, setEditingPostId] = useState(null); // Holds the id of the post being edited
  const [editingPostTitle, setEditingPostTitle] = useState(''); // Holds the title of the post being edited
  const [editingPostContent, setEditingPostContent] = useState(''); // Holds the content of the post being edited
  const [selectedPostId, setSelectedPostId] = useState(null); // Holds the id of the selected post to display comments
  const [comments, setComments] = useState([]); // Holds all comments fetched for the selected post
  const [newComment, setNewComment] = useState(''); // Holds the content of a new comment being added

  // Effect to fetch posts from the server when userId or searchCriteria change
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`http://localhost:3001/posts?userId=${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        const data = await response.json();
        const filteredData = data.filter(post =>
          (!searchCriteria.id || post.id.toString().includes(searchCriteria.id)) &&
          (!searchCriteria.title || post.title.toLowerCase().includes(searchCriteria.title.toLowerCase()))
        );
        setPosts(filteredData); // Set posts state with filtered posts
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };
    fetchPosts();
  }, [userId, searchCriteria]);

// Function to fetch comments for a specific post by postId and id
const fetchComments = async (postId, commentId) => {
  try {
    const response = await fetch(`http://localhost:3001/comments?postId=${postId}&id=${commentId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch comments');
    }
    const data = await response.json();
    setComments(data); // Set comments state with fetched comments
  } catch (error) {
    console.error('Error fetching comments:', error);
  }
};



  // Function to handle change in search criteria
  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchCriteria(prevCriteria => ({ ...prevCriteria, [name]: value }));
  };

  // Function to calculate the maximum id for generating a new post or comment id
  const getMaxId = (arr) => {
    const maxId = arr.reduce((max, item) => (parseInt(item.id) > max ? parseInt(item.id) : max), 0);
    return (maxId + 10).toString(); // Return the maximum id incremented by 1 as a string
  };

  // Function to handle addition of a new post
  const handleAddPost = async (e) => {
    e.preventDefault();
    const newPost = {
      userId: parseInt(userId), // Convert userId to number if needed
      id: getMaxId(posts), // Generate a new id for the post
      title: newPostTitle,
      body: newPostContent,
    };
    try {
      const response = await fetch('http://localhost:3001/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost),
      });
      if (!response.ok) {
        throw new Error('Failed to add new post');
      }
      setPosts([...posts, newPost]); // Add the new post to the posts state
      setNewPostTitle(''); // Clear the new post title input field
      setNewPostContent(''); // Clear the new post content textarea field
    } catch (error) {
      console.error('Error adding new post:', error);
    }
  };

  // Function to handle deletion of a post by id
  const handleDeletePost = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/posts/${id}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('Failed to delete post');
      }
      setPosts(posts.filter(post => post.id !== id)); // Filter out the deleted post from posts state
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  // Function to initiate editing of a post
  const handleEditPost = (post) => {
    setEditingPostId(post.id); // Set the id of the post being edited
    setEditingPostTitle(post.title); // Set the title of the post being edited
    setEditingPostContent(post.body); // Set the content of the post being edited
  };

  // Function to handle updating a post
  const handleUpdatePost = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3001/posts/${editingPostId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editingPostTitle, body: editingPostContent }),
      });
      if (!response.ok) {
        throw new Error('Failed to update post');
      }
      setPosts(posts.map(post =>
        post.id === editingPostId ? { ...post, title: editingPostTitle, body: editingPostContent } : post
      )); // Update the posts state with the updated post data
      setEditingPostId(null); // Clear editing state for post id
      setEditingPostTitle(''); // Clear editing state for post title
      setEditingPostContent(''); // Clear editing state for post content
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  // Function to handle selection of a post to display its comments
  const handleSelectPost = (postId, userId) => {
    setSelectedPostId(postId); // Set the selected post id
    fetchComments(postId, userId); // Fetch comments for the selected post
  };

  // Function to handle addition of a new comment for a post
  const handleAddComment = async (postId) => {
    const newCommentData = {
      postId,
      id: getMaxId(comments), // Generate a new id for the comment
      name: username,
      email: userEmail,
      body: newComment,
    };
    try {
      const response = await fetch('http://localhost:3001/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCommentData),
      });
      if (!response.ok) {
        throw new Error('Failed to add comment');
      }
      setComments([...comments, newCommentData]); // Add the new comment to the comments state
      setNewComment(''); // Clear the new comment input field
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  // Function to handle deletion of a comment by id
  const handleDeleteComment = async (commentId) => {
    try {
      const response = await fetch(`http://localhost:3001/comments/${commentId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete comment');
      }
      setComments(comments.filter(comment => comment.id !== commentId)); // Filter out the deleted comment from comments state
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  // Function to handle updating a comment by id
  const handleUpdateComment = async (commentId, updatedBody) => {
    try {
      const response = await fetch(`http://localhost:3001/comments/${commentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: updatedBody }),
      });
      if (!response.ok) {
        throw new Error('Failed to update comment');
      }
      setComments(comments.map(comment =>
        comment.id === commentId ? { ...comment, body: updatedBody } : comment
      )); // Update the comments state with the updated comment data
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };

  // JSX rendering
  return (
    <div>
      <h2>Posts List</h2>
      {/* Form for searching posts by id or title */}
      <form>
        <input
          type="text"
          name="id"
          value={searchCriteria.id}
          onChange={handleSearchChange}
          placeholder="Search by ID"
        />
        <input
          type="text"
          name="title"
          value={searchCriteria.title}
          onChange={handleSearchChange}
          placeholder="Search by Title"
        />
      </form>
      {/* Form for adding a new post */}
      <form onSubmit={handleAddPost}>
        <input
          type="text"
          value={newPostTitle}
          onChange={(e) => setNewPostTitle(e.target.value)}
          placeholder="New Post Title"
          required
        />
        <textarea
          value={newPostContent}
          onChange={(e) => setNewPostContent(e.target.value)}
          placeholder="New Post Content"
          required
        />
        <button type="submit">Add Post</button>
      </form>
      {/* List of posts */}
      <ul>
        {posts.map(post => (
          <li key={post.id}>
            {/* Edit form for the post */}
            {editingPostId === post.id ? (
              <form onSubmit={handleUpdatePost}>
                <input
                  type="text"
                  value={editingPostTitle}
                  onChange={(e) => setEditingPostTitle(e.target.value)}
                  required
                />
                <textarea
                  value={editingPostContent}
                  onChange={(e) => setEditingPostContent(e.target.value)}
                  required
                />
                <button type="submit">Update Post</button>
              </form>
            ) : (
              // Display post details and actions
              <>
                <h3>{post.title}</h3>
                <p>{post.body}</p>
                <button onClick={() => handleEditPost(post)}>Edit</button>
                <button onClick={() => handleDeletePost(post.id)}>Delete</button>
                <button onClick={() => handleSelectPost(post.id, post.userId)}>View Comments</button>
              </>
            )}
          </li>
        ))}
      </ul>
      {/* Display comments for selected post */}
      {selectedPostId && (
        <div>
          <h3>Comments for Post {selectedPostId}</h3>
          <ul>
            {comments.map(comment => (
              <li key={comment.id}>
                <p><strong>{comment.name}</strong>: {comment.body}</p>
                {/* Display delete and update buttons for comments created by current user */}
                {comment.email === userEmail && (
                  <>
                    <button onClick={() => handleDeleteComment(comment.id)}>Delete</button>
                    <button onClick={() => handleUpdateComment(comment.id, prompt('Update comment:', comment.body))}>Update</button>
                  </>
                )}
              </li>
            ))}
          </ul>
          {/* Form for adding a new comment */}
          <form onSubmit={(e) => { e.preventDefault(); handleAddComment(selectedPostId); }}>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="New Comment"
              required
            />
            <button type="submit">Add Comment</button>
          </form>
        </div>
      )}
      {/* Button to navigate back to home page */}
      <button onClick={() => navigate(`/home/${currentUser.username}`)}>Return to Home</button>
    </div>
  );
};

export default PostsPage;
