// container HTML elements
const articlesContainer = document.getElementById('articles-container');
const firstArticle = document.getElementById('first-article');
const othersArticles = document.getElementById('others-articles');
const articleContainer = document.getElementById('article');
const backButton = document.getElementById('back-button');
const blogheader = document.getElementById('blog-header');
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const galery_posts = document.getElementById('gallery');


function showCookieBanner() {
  let cookieBanner = document.getElementById("cb-cookie-banner");
  cookieBanner.style.display = "block";
}

/* Hides the Cookie banner and saves the value to localstorage */
function hideCookieBanner() {
  localStorage.setItem("cb_isCookieAccepted", "yes");
  let cookieBanner = document.getElementById("cb-cookie-banner");
  cookieBanner.style.display = "none";
}

/* Checks the localstorage and shows Cookie banner based on it. */
function initializeCookieBanner() {
  let isCookieAccepted = localStorage.getItem("cb_isCookieAccepted");
  if (isCookieAccepted === null) {
    localStorage.setItem("cb_isCookieAccepted", "no");
    showCookieBanner();
  }
  if (isCookieAccepted === "no") {
    showCookieBanner();
  }
}

function truncateText(text, limit) {
  if (text.length > limit) {
    return text.substring(0, limit) + "...";
  }
  return text;
}

$(window).on("load", function () {
  initializeCookieBanner()

  var repoOwner = 'GGTEC'
  var repoName = 'RewardEvents'
  
  fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/releases`)
    .then(response => response.json())
    .then(data => {

      let releasesList = document.querySelector("#releases-list");

      if (releasesList != undefined){
        let counter = 0;
        let totalDownloads = 0;
        data.forEach(release => {
          release.assets.forEach(asset => {
            totalDownloads += asset.download_count;
          });
          if (counter === 7) {
            return;
          }
          let releaseEl = document.createElement("div");
          let truncatedBody = truncateText(release.body, 100);
          releaseEl.classList.add('version_block')
          releaseEl.setAttribute('title', `Abrir pagina da versão`)
          releaseEl.setAttribute('onclick', `window.open("${release.html_url}")`)
          releaseEl.innerHTML = `
          <p>Versão: ${release.tag_name}</p>
          <p class='version_text'>${truncatedBody}</p>
        `;
          releasesList.appendChild(releaseEl);
          counter++;
        });
        let totalDownloadsEl = document.getElementById("total-downloads");
        totalDownloadsEl.innerHTML = `
        <h2>Total de Downloads: ${totalDownloads}</h2>
      `;
      }
      
    })
    .catch(error => console.error(error));

});

// fetch posts.json
fetch('https://ggtec.github.io/GGCORETEC/posts/posts.json')
  .then(response => response.json())
  .then(posts => {

    // create first article HTML
    const firstPost = posts[0];

    
    var date_dir = firstPost.post_date.replace(/\//g, "_");


    firstArticle.innerHTML = `
      <div class="card mb-4 post-card" data-tags="${firstPost.post_tags.join(', ')}" >
        <div class="overlay post-tags">${firstPost.post_tags.join(', ')}</div>
        <img class="card-img-top card-img-isset-shadow card-top-img" src="${firstPost.post_thumb_url}" alt="..."/>
        <div class="card-body">
          <div class="small text-muted">${firstPost.post_date}</div>
          <h2 class="card-title post-title"><a href="https://ggtec.netlify.app/posts/${date_dir}/${firstPost.post_id}" data-post-index="${0}">${firstPost.post_title}</a></h2>  
          <p class="card-text">${firstPost.post_content_preview}</p>
          <a class="btn btn-purple" href="https://ggtec.netlify.app/posts/${date_dir}/${firstPost.post_id}" data-post-index="${0}">Leia mais <i class="fa-solid fa-right-long"></i></a>
        </div>
      </div>
    `;

    // create other articles HTML
    let otherPostsColumn = '';

    for (let i = 1; i < posts.length; i++) {
      const post = posts[i];

      var date_dir = post.post_date.replace(/\//g, "_");

      const postHTML = `
      <div class="col post-card" data-tags="${post.post_tags.join(', ')}" >
        <div class="card mb-4">
          <div class="overlay-small post-tags">${post.post_tags.join(', ')}</div>
          <img class="card-img-top card-img-isset-shadow card-small-img" src="${post.post_thumb_url}" alt="..." />
          <div class="card-body">
            <div class="small text-muted">${post.post_date}</div>
            <h2 class="card-title post-title"><a href="https://ggtec.netlify.app/posts/${date_dir}/${post.post_id}" data-post-index="${i}">${post.post_title}</a></h2>  
            <p class="card-text">${post.post_content_preview}</p>
            <a class="btn btn-purple" href="https://ggtec.netlify.app/posts/${date_dir}/${post.post_id}" data-post-index="${i}">Leia mais <i class="fa-solid fa-right-long"></i></a>
          </div>
        </div>
      </div>
      `;

      otherPostsColumn += postHTML;

    }

    let posts_galery = '';

    for (let i = 1; i < posts.length; i++) {

      const post_g = posts[i];

      var date_dir = post_g.post_date.replace(/\//g, "_");
      var text_trunc = truncateText(post_g.post_title,50)

      const postHTML_g = `
      <div class="post-card me-2" data-tags="${post_g.post_tags.join(', ')}" >
        <div class="card">
          <img class="card-img" src="${post_g.post_thumb_url}" alt="..." />
          <div class="card-body text-white">
            <h2 class="card-title post-title"><a href="https://ggtec.netlify.app/posts/${date_dir}/${post_g.post_id}" title="${post_g.post_title}" data-post-index="${i}">${text_trunc}</a></h2>  
            <p class="card-subtitle">${post_g.post_date}</p>
            </div>
        </div>
      </div>
      `;

      posts_galery += postHTML_g;
    }

    othersArticles.innerHTML = `${otherPostsColumn}`;

    if (galery_posts != undefined){
      galery_posts.innerHTML = `${posts_galery}`;
    }


    const categoriesContainer = document.createElement('ul');

    var tags = [];
    posts.forEach(post => {
      post.post_tags.forEach(tag => {
        var trimmedTag = tag.trim(); // remove espaços extras da tag
        if (!tags.includes(trimmedTag)) {
          tags.push(trimmedTag);
        }
      });
    });

    // create categories HTML
    tags.forEach(tag_item => {
      const category = document.createElement('li');
      category.classList.add('category');
      category.textContent = tag_item;
      category.addEventListener('click', () => {
        FilterByTag(tag_item);
      });
      categoriesContainer.appendChild(category);
    });

    // append categories to widget
    document.getElementById('categories-widget').appendChild(categoriesContainer);

    
    function FilterByTag(tag) {

      if (articlesContainer.classList.contains('d-none')) {
        articlesContainer.classList.remove('d-none')
        articleContainer.classList.add('d-none')
      }

      // Obtém todos os elementos com a classe "badge" dentro do elemento com id "categories-widget"
      const tagElements = document.querySelectorAll('#categories-widget .badge');

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

      // Variável que indica se já foi encontrado um card visível
      let foundVisibleCard = false;

      // Percorre todos os elementos e exibe ou oculta dependendo se contém a tag selecionada ou não
      postCards.forEach(postCard => {
        const postTags = postCard.dataset.tags.split(',');

        if (postTags.some(item => item.trim() === tag)) {
          postCard.hidden = false; // exibe o elemento
          if (!foundVisibleCard) {
            postCard.classList.add('full-width'); // adiciona a classe full-width ao primeiro elemento visível encontrado
            foundVisibleCard = true;
          } else {
            postCard.classList.remove('full-width'); // remove a classe full-width do elemento que está sendo exibido, mas não é o primeiro visível
          }
        } else {
          postCard.hidden = true; // oculta o elemento
          if (postCard.classList.contains('full-width')) {
            postCard.classList.remove('full-width'); // remove a classe full-width do elemento que está sendo ocultado
          }
        }
      });
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
          posts[i].removeAttribute("hidden");
          visiblePosts.push(posts[i]);
        } else {
          posts[i].setAttribute("hidden", "");
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
    
        result.addEventListener('click', function () {
                        
          if (articlesContainer.classList.contains('d-none')) {
            articlesContainer.classList.remove('d-none')
            articleContainer.classList.add('d-none')
          }

          for (var j = 0; j < visiblePosts.length; j++) {

            if (visiblePosts[j] !== this.post) {
              visiblePosts[j].setAttribute("hidden", "");
              visiblePosts[j].classList.remove("full-width");
            } else {
              visiblePosts[j].removeAttribute("hidden");
              visiblePosts[j].classList.add("full-width");
            }
          }
        }.bind({ post: visiblePosts[i] }));
    
        resultsSection.appendChild(result);
      }
    }

    searchInput.addEventListener('input', searchPosts);

    const categoryLinks = categoriesContainer.querySelectorAll('a');
    for (const link of categoryLinks) {
      link.addEventListener('click', function (event) {
        if (articlesContainer.classList.contains('d-none')) {
          articlesContainer.classList.remove('d-none')
          articleContainer.classList.add('d-none')
        }
        event.preventDefault();
        const tag = this.textContent;
        const matchingPosts = posts.filter(post => post.post_tags.includes(tag));
        const matchingPostIndexes = matchingPosts.map(post => posts.indexOf(post));

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

  })
  .catch(error => console.error(error));

const posts_cards = document.querySelectorAll('.post-card');


function start_table() {
  table = $('#table').DataTable({
    scrollX: true,
    ordering: true,
    retrieve: false,
    processing: true,
    responsive: false,
    language: {
      url: 'https://cdn.datatables.net/plug-ins/1.13.1/i18n/pt-BR.json'
    }
  });
}