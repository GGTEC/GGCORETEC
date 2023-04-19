// container HTML elements
const articlesContainer = document.getElementById('articles-container');
const firstArticle = document.getElementById('first-article');
const othersArticles = document.getElementById('others-articles');

// fetch posts.json
fetch('https://ggtec.github.io/GGTECApps/blog/posts/posts_json/posts.json')
  .then(response => response.json())
  .then(posts => {

    // create first article HTML
    const firstPost = posts[0];
    firstArticle.innerHTML = `
      <div class="card mb-4">
        <a href="${firstPost.post_url}">
          <img class="card-img-top card-img-isset-shadow" src="${firstPost.post_thumb_url}" alt="..." />
        </a>
        <div class="card-body">
          <div class="small text-muted">${firstPost.post_date}</div>
          <h2 class="card-title">${firstPost.post_title}</h2>
          <p class="card-text">${firstPost.post_content_preview}</p>
          <a class="btn btn-purple" href="${firstPost.post_url}">Leia mais →</a>
        </div>
      </div>
    `;

    // create other articles HTML
    let otherPosts = '';
    for (let i = 1; i < posts.length; i++) {
      const post = posts[i];
      otherPosts += `
        <div class="card mb-4">
          <a href="${post.post_url}">
            <img class="card-img-top card-img-isset-shadow" src="${post.post_thumb_url}" alt="..." />
          </a>
          <div class="card-body">
            <div class="small text-muted">${post.post_date}</div>
            <h2 class="card-title">${post.post_title}</h2>
            <p class="card-text">${post.post_content_preview}</p>
            <a class="btn btn-purple" href="${post.post_url}">Leia mais →</a>
          </div>
        </div>
      `;
    }
    othersArticles.innerHTML = `
      <div class="row">
        <div class="col-lg-6">${otherPosts.slice(0, Math.ceil(posts.length / 2))}</div>
        <div class="col-lg-6">${otherPosts.slice(Math.ceil(posts.length / 2))}</div>
      </div>
    `;
    
  })
  .catch(error => console.error(error));