/*********************************************************************************
*  WEB322 – Assignment 03
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: _Shao Qiao____ Student ID: 145954210_ Date: 2023-03-08_
*
*  Online (Cyclic) Link: https://bewildered-long-johns-pig.cyclic.app
*
********************************************************************************/ 

var express = require("express");
var app = express();
var HTTP_PORT = process.env.PORT || 8080;
app.use(express.static('public'));
const blogService = require('./blog-service');
const { initialize } = require('./blog-service');
const path=require("path");
const multer = require("multer");
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
const { Console } = require("console");
const upload = multer();


cloudinary.config({
  cloud_name: 'dvogv4xnj',
  api_key: '372426185215898',
  api_secret: 'Yyt_I6jU5XAQofQgyFhnmaD9TBQ',
  secure: true
});

app.get('/', function(req, res) {
  res.redirect('/about');
});
app.get('/about', function(req, res) {
  res.sendFile(__dirname + '/views/about.html');
});
app.get('/blog', (req, res) => {
  const posts = blogService.getPublishedPostsSync();
  res.send(posts);
});

//app.get('/posts', (req, res) => {
  //const posts = blogService.getPosts();
 // res.send(posts);
//});
app.get('/posts', (req, res) => {
  const { category, minDate } = req.query;

  let promiseObj;
  if (category) {
    promiseObj = blogService.getPostsByCategory(parseInt(category));
  } else if (minDate) {
    promiseObj = blogService.getPostsByMinDate(minDate);
  } else {
    promiseObj = blogService.getAllPosts();
  }

  promiseObj
    .then(posts => {
      if (posts.length === 0) {
        res.status(404).json({ error: 'No posts found' });
      } else {
        res.json(posts);
      }
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
});
app.get('/post/:id', (req, res) => {
    const { id } = req.params;
  blogService.getPostById(id)
  .then(post => res.json(post))
    .catch(err => res.status(err.status || 500).json({ error: err.message }));
});

app.get('/categories', (req, res) => {
  try {
    const categories = blogService.getCategoriesSync();
    res.send(categories);
  } catch (err) {
    res.send({ message: err.message });
  }
});
app.get('/posts/add', function(req, res) {
  res.sendFile(path.join(__dirname, '/views/addPost.html'));
  });
app.get('*', (req, res) => {
  res.status(404).send('Page not found');
});

// if (req.file) {
//   console.log(req.file);
//   streamifier.createReadStream(req.file.buffer).pipe(stream);
// } else {
//   reject(new Error('No file was uploaded'));
// }
app.post('/posts/add', upload.single('featureImage'), (req, res) => {
  let streamUpload = (req) => {
    console.log("hello1");
    return new Promise((resolve, reject) => {
      let stream = cloudinary.uploader.upload_stream((error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      });
      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });
  };

  async function upload(req) {
    let result = await streamUpload(req);
    console.log(result);
    return result;
  }

  upload(req).then((uploaded) => {
    req.body.featureImage = uploaded.url;
    req.body.published = req.body.published || false;
        let postData = req.body;
    postData.id = blogService.posts.length + 1;
    if (postObject.category) {
      addPost(postObject);
    }
    res.redirect("/posts");
  })
    .catch((err) => {
    res.send(err);
  });
});
//     blogService.addPost(postData).then((post) => {
//       console.log('New post added:', post);
//       res.redirect('/posts');
//     });
//   }).catch((error) => {
//     console.log(error);
//     res.send(error.message);
//   });
// });
// app.post('/posts/add', upload.single('featureImage'), (req, res) => {
//    let streamUpload = (req) => {
//     console.log("hello1");
//     return new Promise((resolve, reject) => {
//       let stream = cloudinary.uploader.upload_stream((error, result) => {
//                 if (result) {
//           resolve(result);
//                   } else {
//           reject(error);
         
//         }
//       });
//          streamifier.createReadStream(req.file.buffer).pipe(stream);
//     });
    
//   };

//   async function upload(req) {
//     let result = await streamUpload(req);
//     console.log(result);
//     return result;
//   }

//   upload(req).then((uploaded) => {
//     req.body.featureImage = uploaded.url;
//     req.body.published = req.body.published || false;
   
//     let postData = req.body;
//     postData.id = blogService.posts.length + 1;
//     blogService.addPost(postData).then((post) => {
//      console.log('New post added:', post);
//     res.redirect('/posts');
//     });
 //   });
// });


initialize()
  .then(() => {
    app.listen(HTTP_PORT, () => {
      console.log(`Server is listening on port ${HTTP_PORT}`);
    });
  })
  .catch((error) => {
    console.log(`Failed to initialize data: ${error}`);
  });
//app.listen(HTTP_PORT, function() {
  //console.log(`Express http server listening port ${HTTP_PORT}`);
//});