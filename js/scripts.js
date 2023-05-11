// container HTML elements
const articlesContainer = document.getElementById('articles-container');
const firstArticle = document.getElementById('first-article');
const othersArticles = document.getElementById('others-articles');
const articleContainer = document.getElementById('article');
const backButton = document.getElementById('back-button');
const blogheader = document.getElementById('blog-header');
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');

const urlParams = new URLSearchParams(window.location.search);
const searchTerm = urlParams.get('p');



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

$(window).on("load", function () {
  initializeCookieBanner()

  var repoOwner = 'GGTEC'
  var repoName = 'RewardEvents'
  fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/releases`)
    .then(response => response.json())
    .then(data => {
      let releasesList = document.querySelector("#releases-list");
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
    })
    .catch(error => console.error(error));

  function truncateText(text, limit) {
    if (text.length > limit) {
      return text.substring(0, limit) + "...";
    }
    return text;
  }


});

// fetch posts.json
fetch('https://ggtec.github.io/GGTECApps/posts/posts.json')
  .then(response => response.json())
  .then(posts => {

    // create first article HTML
    const firstPost = posts[0];

    firstArticle.innerHTML = `
      <div class="card mb-4 post-card" data-tags="${firstPost.post_tags.join(', ')}" >
        <div class="overlay post-tags">${firstPost.post_tags.join(', ')}</div>
        <img class="card-img-top card-img-isset-shadow card-top-img" src="${firstPost.post_thumb_url}" alt="..."/>
        <div class="card-body">
          <div class="small text-muted">${firstPost.post_date}</div>
          <h2 class="card-title post-title">${firstPost.post_title}</h2>
          <p class="card-text">${firstPost.post_content_preview}</p>
          <a class="btn btn-purple" href="#" data-post-index="${0}">Leia mais <i class="fa-solid fa-right-long"></i></a>
        </div>
      </div>
    `;

    // create other articles HTML
    let otherPostsColumn = '';
    for (let i = 1; i < posts.length; i++) {
      const post = posts[i];

      const postHTML = `
      <div class="col post-card" data-tags="${post.post_tags.join(', ')}" >
        <div class="card mb-4">
          <div class="overlay-small post-tags">${post.post_tags.join(', ')}</div>
          <img class="card-img-top card-img-isset-shadow card-small-img" src="${post.post_thumb_url}" alt="..." />
          <div class="card-body">
            <div class="small text-muted">${post.post_date}</div>
            <h2 class="card-title post-title">${post.post_title}</h2>  
            <p class="card-text">${post.post_content_preview}</p>
            <a class="btn btn-purple" href="https://ggtec.netlify.app/?p=${post_title_url = post.post_title.replace(/\s+/g, "-")}" data-post-index="${i}">Leia mais <i class="fa-solid fa-right-long"></i></a>
          </div>
        </div>
      </div>
      `;

      otherPostsColumn += postHTML;

    }
    othersArticles.innerHTML = `${otherPostsColumn}
    `;

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
      document.getElementById('post-source').innerHTML = post.post_source;


      articleContainer.classList.remove("d-none");
      articleContainer.classList.add("d-block", "fade-in-out");

      articlesContainer.classList.remove("d-block", "fade-in-out");
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
      articlesContainer.classList.add("d-block", "fade-in-out");

      blogheader.classList.remove("d-none");
      blogheader.classList.add("d-block");

      articleContainer.classList.remove("fade-in-out");
    }

    const index = posts.findIndex(post => post.post_title === searchTerm);
    if (index != -1){
      showArticle(index)
    }

    // Adiciona o evento de click para o botão "Voltar"
    backButton.addEventListener('click', () => {
      hideArticle();
    });
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