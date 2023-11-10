

function showCookieBanner() {
  let cookieBanner = document.getElementById("cb-cookie-banner");
  cookieBanner.style.display = "block";
}

function hideCookieBanner() {
  localStorage.setItem("cb_isCookieAccepted", "yes");
  let cookieBanner = document.getElementById("cb-cookie-banner");
  cookieBanner.style.display = "none";
}

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


