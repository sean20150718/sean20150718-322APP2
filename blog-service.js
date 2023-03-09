const fs = require('fs');
const blogService = require('./blog-Service');
const data = [
  {
    id: 1,
    title: 'First post',
    category: 1,
    postDate: '2022-02-25',
    content: 'This is the first post on my blog.'
  },]
const getPosts = () => {
  const postsData = fs.readFileSync('./data/posts.json');
  return JSON.parse(postsData);
};

const getPublishedPostsSync = () => {
  const postsData = getPosts();
 return postsData.filter(post => post.published === true);
};

const getCategoriesSync = () => {
  const categoriesData = fs.readFileSync('./data/categories.json');
  return JSON.parse(categoriesData);
};

let posts = [];
let categories = [];

function initialize() {
  return new Promise((resolve, reject) => {
    fs.readFile('./data/posts.json', 'utf8', (err, data) => {
      if (err) {
        reject('Unable to read posts.json');
      } else {
        try {
          posts = JSON.parse(data);
          fs.readFile('./data/categories.json', 'utf8', (err, data) => {
            if (err) {
              reject('Unable to read categories.json');
            } else {
              try {
                categories = JSON.parse(data);
                resolve();
              } catch (err) {
                reject('Error parsing categories.json');
              }
            }
          });
        } catch (err) {
          reject('Error parsing posts.json');
        }
      }
    });
  });
}

function getAllPosts() {
  return new Promise((resolve, reject) => {
    if (posts.length > 0) {
      resolve(posts);
    } else {
      reject('No results returned');
    }
  });
}

function getPublishedPosts() {
  return new Promise((resolve, reject) => {
    const publishedPosts = posts.filter(post => post.published === true);
    if (publishedPosts.length > 0) {
      resolve(publishedPosts);
    } else {
      reject('No results returned');
    }
  });
}

function getCategories() {
  return new Promise((resolve, reject) => {
    if (categories.length > 0) {
      resolve(categories);
    } else {
      reject('No results returned');
    }
  });
}
function addPost(postData) {
  return new Promise((resolve, reject) => {
    console.log("hello5")
    console.log(postData);
    if (postData.published === undefined) {
      postData.published = false;
    } else {
      postData.published = true;
    }
    postData.id = posts.length + 1;
    posts.push(postData);
    resolve(postData);
  });
 }
// async function addPost(postData) {
//   postData.published = !!postData.published;
//   postData.id = posts.length + 1;
//   posts.push(postData);
//   return postData;
// }
//function getPostsByCategory(category) {
  //  return posts.filter(post => post.category === category);
//}
function getPostsByCategory(category) {
  return new Promise((resolve, reject) => {
    fs.readFile('./data/posts.json', 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        try {
          const posts = JSON.parse(data);
          const filteredPosts = posts.filter(post => post.category === category);
          if (filteredPosts.length > 0) {
            resolve(filteredPosts);
          } else {
            reject(new Error('No posts found for category'));
          }
        } catch (err) {
          reject(err);
        }
      }
    });
  });
}
//function getPostsByMinDate(minDateStr) {
  //const minDate = new Date(minDateStr);
  //  return posts.filter(post => new Date(post.postDate) >= minDate);
//}
function getPostsByMinDate(minDateStr) {
  return new Promise((resolve, reject) => {
    const minDate = new Date(minDateStr);
    const minDatePosts = posts.filter(post => new Date(post.postDate) >= minDate);
    if (minDatePosts.length > 0) {
      resolve(minDatePosts);
    } else {
      reject('No results returned');
    }
  });
}
//function getPostById(id) {
   // return posts.find(post => post.id ===parseInt(id));
//}
function getPostById(id) {
  return new Promise((resolve, reject) => {
      const post = posts.find(post => post.id === parseInt(id));
          if (post) {
      resolve(post);
    } else {
      reject('No result returned with the id of ${req.parmas.id}');
    }
  });
}
module.exports = {
initialize,
 getAllPosts,
getPublishedPosts,
 getCategories,
getPosts, 
getPublishedPostsSync, 
getCategoriesSync,
addPost,
getPostsByCategory,
getPostsByMinDate,
getPostById,
  };
