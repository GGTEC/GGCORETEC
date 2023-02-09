function setCookie(name,value,days) {
  var expires = "";
  if (days) {
      var date = new Date();
      date.setTime(date.getTime() + (days*24*60*60*1000));
      expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}
function getCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for(var i=0;i < ca.length;i++) {
      var c = ca[i];
      while (c.charAt(0)==' ') c = c.substring(1,c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
  }
  return null;
}

function eraseCookie(name) {   
  document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

function cookieConsent() {
  const toastLiveExample = document.getElementById('liveToast')
  if (!getCookie('allowCookies')) {

    const toast = new bootstrap.Toast(toastLiveExample)
    toast.show()
  }
}

$('#btnDeny').click(()=>{
  eraseCookie('allowCookies')
  $('.toast').toast('hide')
})

$('#btnAccept').click(()=>{
  setCookie('allowCookies','1',7)
  $('.toast').toast('hide')
})

// load
cookieConsent()

// for demo / testing only
$('#btnReset').click(()=>{
  // clear cookie to show toast after acceptance
  eraseCookie('allowCookies')
  $('.toast').toast('show')
})


$(window).on("load", function(){
  var repoOwner = 'GGTEC'
  var repoName = 'RewardEvents'
  fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/releases`)
  .then(response => response.json())
  .then(data => {
    let releasesList = document.querySelector("#releases-list");
    let counter = 0;
    data.forEach(release => {
      if (counter === 7) {
        return;
      }
      let releaseEl = document.createElement("div");
      let truncatedBody = truncateText(release.body, 100);
      releaseEl.classList.add('version_block')
      releaseEl.setAttribute('title',`Abrir pagina da versão`)
      releaseEl.setAttribute('onclick',`window.open("${release.html_url}")`)
      releaseEl.innerHTML = `
        <p>Versão: ${release.tag_name}</p>
        <p class='version_text'>${truncatedBody}</p>
      `;
      releasesList.appendChild(releaseEl);
      counter++;
    });
  })
  .catch(error => console.error(error));

  function truncateText(text, limit) {
    if (text.length > limit) {
      return text.substring(0, limit) + "...";
    }
    return text;
  }

});