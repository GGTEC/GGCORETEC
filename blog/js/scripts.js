// container HTML elements
const articlesContainer = document.getElementById('articles-container');
const firstArticle = document.getElementById('first-article');
const othersArticles = document.getElementById('others-articles');
const articleContainer = document.getElementById('article');
const backButton = document.getElementById('back-button');
const blogheader = document.getElementById('blog-header');

// fetch posts.json
fetch('https://ggtec.github.io/GGTECApps/blog/posts/posts.json')
  .then(response => response.json())
  .then(posts => {

    // create first article HTML
    const firstPost = posts[0];
    firstArticle.innerHTML = `
      <div class="card mb-4">
        <img class="card-img-top card-img-isset-shadow" src="${firstPost.post_thumb_url}" alt="..." />
        <div class="card-body">
          <div class="small text-muted">${firstPost.post_date}</div>
          <h2 class="card-title">${firstPost.post_title}</h2>
          <p class="card-text">${firstPost.post_content_preview}</p>
          <a class="btn btn-purple" href="#" data-post-index="${0}">Leia mais <i class="fa-solid fa-right-long"></i></a>
        </div>
      </div>
    `;

    // create other articles HTML
    let otherPosts = '';
    for (let i = 1; i < posts.length; i++) {
      const post = posts[i];
      otherPosts += `
        <div class="card mb-4">
        <img class="card-img-top card-img-isset-shadow" src="${post.post_thumb_url}" alt="..." />
          <div class="card-body">
            <div class="small text-muted">${post.post_date}</div>
            <h2 class="card-title">${post.post_title}</h2>
            <p class="card-text">${post.post_content_preview}</p>
            <a class="btn btn-purple" href="#" data-post-index="${i}">Leia mais <i class="fa-solid fa-right-long"></i></a>
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
    
    const readMoreButtons = document.querySelectorAll("[data-post-index]");
    for (const button of readMoreButtons) {
    button.addEventListener("click", function(event) {
      event.preventDefault();
      const postIndex = this.dataset.postIndex;
      showArticle(postIndex);
    });
    }
    function showArticle(postIndex) {
        // Oculta a seção com as prévias dos artigos
        articlesContainer.style.display = 'none';
      
        // Preenche o post completo
        const post = posts[postIndex];
        document.getElementById('header-post-title').textContent = post.post_title;
        document.getElementById('header-post-date').textContent = post.post_date;
        const categoriesContainer = document.getElementById('header-post-categories');
        categoriesContainer.innerHTML = '';
        post.post_tags.forEach(tag => {
          const category = document.createElement('a');
          category.classList.add('badge', 'bg-secondary', 'text-decoration-none', 'link-light');
          category.href = '#!';
          category.textContent = tag;
          categoriesContainer.appendChild(category);
          categoriesContainer.appendChild(document.createTextNode(' '));
        });
        
        document.getElementById('post-content').innerHTML = post.post_content;
      

        articleContainer.classList.remove("d-none");
        articleContainer.classList.add("d-block", "fade-in-out");
        
        articlesContainer.classList.remove("d-block","fade-in-out");
        articlesContainer.classList.add("d-none");
      
        blogheader.classList.remove("d-block");
        blogheader.classList.add("d-none");

        

      }
      
      function hideArticle() {

        articleContainer.classList.remove("d-block");
        articleContainer.classList.add("d-none", "fade-in-out");
        
        articlesContainer.classList.remove("d-none");
        articlesContainer.classList.add("d-block","fade-in-out");
      
        blogheader.classList.remove("d-none");
        blogheader.classList.add("d-block");

        articleContainer.classList.remove("fade-in-out");
      }
      
      
      // Adiciona o evento de click para o botão "Voltar"
      backButton.addEventListener('click', () => {
        hideArticle();
      });
  })
  .catch(error => console.error(error));