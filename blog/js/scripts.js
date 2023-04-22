// container HTML elements
const articlesContainer = document.getElementById('articles-container');
const firstArticle = document.getElementById('first-article');
const othersArticles = document.getElementById('others-articles');
const articleContainer = document.getElementById('article');
const backButton = document.getElementById('back-button');
const blogheader = document.getElementById('blog-header');
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');

// fetch posts.json
fetch('https://ggtec.github.io/GGTECApps/blog/posts/posts.json')
  .then(response => response.json())
  .then(posts => {

    // create first article HTML
    const firstPost = posts[0];

    firstArticle.innerHTML = `
      <div class="card mb-4 post-card" data-tags="${firstPost.post_tags.join(', ')}" >
        <div class="overlay">${firstPost.post_tags.join(', ')}</div>
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
    let otherPostsColumn1 = '';
    let otherPostsColumn2 = '';
    for (let i = 1; i < posts.length; i++) {
      const post = posts[i];

      const postHTML = `
        <div class="card mb-4 post-card" data-tags="${post.post_tags.join(', ')}" >
          <div class="overlay-small">${post.post_tags.join(', ')}</div>
          <img class="card-img-top card-img-isset-shadow" src="${post.post_thumb_url}" alt="..." />
          <div class="card-body">
            <div class="small text-muted">${post.post_date}</div>
            <h2 class="card-title">${post.post_title}</h2>  
            <p class="card-text">${post.post_content_preview}</p>
            <a class="btn btn-purple" href="#" data-post-index="${i}">Leia mais <i class="fa-solid fa-right-long"></i></a>
          </div>
        </div>
      `;
      if (i % 2 === 0) {
        otherPostsColumn2 += postHTML;
      } else {
        otherPostsColumn1 += postHTML;
      }
    }
    othersArticles.innerHTML = `
      <div class="row">
        <div class="col-lg-6">${otherPostsColumn1}</div>
        <div class="col-lg-6">${otherPostsColumn2}</div>
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

    const categoriesContainer = document.createElement('ul');

    // collect all tags
    const tags = [];
    posts.forEach(post => {
      post.post_tags.forEach(tag => {
        if (!tags.includes(tag)) {
          tags.push(tag);
        }
      });
    });

    // create categories HTML
    tags.forEach(tag => {
      const category = document.createElement('li');
      category.classList.add('category');
      category.textContent = tag;
      category.addEventListener('click', () => {
        FilterByTag(tag);
      });
      categoriesContainer.appendChild(category);
    });

    // append categories to widget
    document.getElementById('categories-widget').appendChild(categoriesContainer);

    function FilterByTag(tag) {
        // Obtém todos os elementos com a classe "badge" dentro do elemento com id "categories-widget"
        const tagElements = document.querySelectorAll('#categories-widget');
        
        // Percorre todos os elementos e adiciona ou remove a classe "active" dependendo se é a tag selecionada ou não
        tagElements.forEach(element => {
            if (element.textContent === tag) {
                element.classList.add('active');
            } else {
                element.classList.remove('active');
            }
        });
        
        // Obtém todos os elementos com a classe "post-card"
        const postCards = document.querySelectorAll('.post-card');
        
        // Percorre todos os elementos e exibe ou oculta dependendo se contém a tag selecionada ou não
        postCards.forEach(postCard => {
          const postTags = postCard.dataset.tags.split(',');
        
          if (postTags.some(item => item.trim() === tag)) {
            postCard.style.display = 'block';
          } else {
            postCard.style.display = 'none';
          }
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

      var visiblePosts = [];

      function searchPosts() {
        var input = document.getElementById("search-input");
        var filter = input.value.toLowerCase();
        var posts = document.getElementsByClassName("post-card");
        var sidebar = document.getElementById("sidebar");
        var maxChars = Math.floor(sidebar.offsetWidth / 8);
  
      
        visiblePosts = [];
      
        for (var i = 0; i < posts.length; i++) {
          var title = posts[i].getElementsByClassName("card-title")[0].textContent.toLowerCase();
          var body = posts[i].getElementsByClassName("card-text")[0].textContent.toLowerCase();
          var tags = posts[i].getElementsByClassName("post-tags")[0].textContent.toLowerCase();
      
          if (title.indexOf(filter) > -1 || body.indexOf(filter) > -1 || tags.indexOf(filter) > -1) {
            posts[i].style.display = "";
            visiblePosts.push(posts[i]);
          } else {
            posts[i].style.display = "none";
          }
        }
      
      var resultsSection = document.getElementById("search-results");
      resultsSection.innerHTML = "";

      var results = document.createElement('div');
      results.innerHTML = "<p class='text-muted mt-1'>Resultados : </p>"

      resultsSection.appendChild(results);
    
      for (var i = 0; i < visiblePosts.length; i++) {

        var title = visiblePosts[i].getElementsByClassName("card-title")[0].textContent;

        if (title.length > maxChars) {
          title = title.substring(0, maxChars) + "...";
        }

        var result = document.createElement("div");

        result.classList.add('search-result')
        result.innerHTML = title;
    
        result.addEventListener('click', function() {
          for (var j = 0; j < visiblePosts.length; j++) {
            if (visiblePosts[j] !== this.post) {
              visiblePosts[j].style.display = "none";
            } else {
              visiblePosts[j].style.display = "";
            }
          }
        }.bind({post: visiblePosts[i]}));
    
        resultsSection.appendChild(result);
      }
    }
    
    searchInput.addEventListener('input', searchPosts);

    const categoryLinks = categoriesContainer.querySelectorAll('a');
    for (const link of categoryLinks) {
    link.addEventListener('click', function(event) {
        event.preventDefault();
        const tag = this.textContent;
        const matchingPosts = posts.filter(post => post.post_tags.includes(tag));
        const matchingPostIndexes = matchingPosts.map(post => posts.indexOf(post));
        showArticle(matchingPostIndexes[0]);
        const otherPostCards = document.querySelectorAll('[data-post-index]');
        for (const card of otherPostCards) {
        if (!matchingPostIndexes.includes(Number(card.dataset.postIndex))) {
            card.parentElement.parentElement.style.display = 'none';
        } else {
            card.parentElement.parentElement.style.display = '';
        }
        }
    });
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