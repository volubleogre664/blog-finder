// Setting up the google client
window.onload = function loadClient() {
  gapi.client.setApiKey("API_KEY");
  return gapi.client.load("LOAD_GAPI_LINK").then(
    function () {
      console.log("GAPI client loaded for API");
    },
    function (err) {
      console.error("Error loading GAPI client for API", err);
    }
  );
};

window.onresize = function () {
  const temp = isMobile;
  isMobile = window.innerWidth < 768;

  if (isMobile !== temp) {
    emptyDivs();
    printBlogs(blogs);
  }
};

window.onscroll = function () {
  const isOnScreen = isInViewport(document.getElementById("search__form"));

  if (!isOnScreen) {
    document.querySelector(".header__logo").style.display = "none";
    document.querySelector(".search__bar").style.display = "flex";
  } else {
    document.querySelector(".header__logo").style.display = "block";
    document.querySelector(".search__bar").style.display = "none";
    document.querySelector(".search__bar > input").value = searchStr;
  }
};

// Make sure the client is loaded before calling this method.
function execute(search) {
  return gapi.client.search.cse
    .list({
      cx: "ENGINE",
      q: `${search.filter} ${search.query}`,
      start: search.start,
    })
    .then(
      function (response) {
        if (response.status === 200) {
          const result = response?.result;
          let _blogs = [];
          totalResults = +result?.queries?.request[0]?.totalResults;

          // console.log(result);
          if (result.spelling) {
            document.querySelector(
              ".search__fixedTypo"
            ).innerHTML = `Showing results for ${result.spelling.htmlCorrectedQuery}`;
          }

          // console.log(result);

          result.items?.forEach((item, i) => {
            let dt = undefined;

            if (item?.pagemap?.metatags) dt = item?.pagemap?.metatags[0];
            else return;

            let blog = {
              author: dt["twitter:data1"] ?? dt["twitter:creator"] ?? "",
              title: dt["og:title"] ?? item?.title,
              description: dt["og:description"] ?? item.snippet,
              url: dt["og:url"] ?? item?.link,
              img: validURL(dt["og:image"])
                ? dt["og:image"]
                : item?.pagemap?.cse_thumbnail
                ? item?.pagemap?.cse_thumbnail[0]?.src
                : dt["forem:logo"] ?? "./pexels-miguel-á-padriñán-1591056.jpg",
            };

            _blogs.push(blog);
          });

          printBlogs(_blogs);
          blogs = blogs.concat(_blogs);
          // input.map((item) => (item.value = searchStr));
          // console.log(blogs);
        }
      },
      function (err) {
        console.error("Execute error", err);
      }
    );
}

// Adding blogs to dom
function printBlogs(_blogs) {
  _blogs.forEach((item, i) => {
    const blogHTML = `<div class="search__resultsBlog">
    <h2>${item.title}</h2>
    <img src="${item.img}" alt="article banner">
    <p style="-webkit-box-orient: vertical;">${item.description}</p>
    <div class="info">
      <h4><b><i>by: </i></b>${item.author}</h4>
      <a href="${item.url}">Read</a>
    </div>
  </div>`;

    const right = document.querySelector(".search__resultsRight");
    const left = document.querySelector(".search__resultsLeft");
    const mobile = document.querySelector(".search__resultsMobile");

    if (window.innerWidth < 768) {
      mobile.innerHTML += blogHTML;
    } else {
      i % 2 === 0
        ? (left.innerHTML += blogHTML)
        : (right.innerHTML += blogHTML);
    }
  });
}

// Validating url
function validURL(str) {
  var pattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // fragment locator
  return !!pattern.test(str);
}

//check if element is visible on-screen
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

//Filter results based on url selected by user
// If prev filter == current filter then just remove filter and show results
const applyFilter = (filter, pos) => {
  start = 1;
  const i = pos - 1;
  let isNewFilter = filter === prevFilter;
  searchFiltter = isNewFilter ? "" : `cite:${filter} `;

  document.querySelectorAll(".search__filters > span").forEach((item, _i) => {
    item.classList.contains("active") &&
      _i !== i &&
      item.classList.toggle("active");

    _i === i && item.classList.toggle("active");
  });

  if (!isNewSearch) {
    emptyDivs();
    execute({
      query: searchStr,
      filter: searchFiltter,
      start: 1,
    });
    blogs = new Array();
  }

  document.querySelector("summary").innerText =
    "Filter Search: " + searchFiltter?.substr(5);
  searchFiltter === "" ? (prevFilter = searchFiltter) : (prevFilter = filter);
};

// Remove content for new results to be shown
const emptyDivs = () => {
  document.querySelector(".search__resultsLeft").innerHTML = "";
  document.querySelector(".search__resultsRight").innerHTML = "";
  document.querySelector(".search__resultsMobile").innerHTML = "";
};

// Loading the google google api
gapi.load("client");

// Global variables
let searchStr = "";
let isNewSearch = true;
let blogs = [];
let searchFiltter = "";
let start = 1;
let prevFilter = "";
let totalResults = 0;
let isMobile = false;

const input = document.querySelectorAll(".search__form > input");
input.forEach((item) => {
  item.addEventListener("change", (e) => {
    searchStr = e.target.value;
  });
});

document.querySelectorAll(".search__form > .submit__search").forEach((item) => {
  item.addEventListener("click", async function (e) {
    e.preventDefault();
    start = 1;
    isNewSearch = true;
    let regex = / /gi;
    const str = searchStr.replace(regex, "");
    if (str !== "") {
      regex = /</gi;

      searchStr = searchStr.replace(regex, " ");

      if (isNewSearch) {
        setTimeout(() => {
          !document
            .querySelector(".search__pages")
            .classList.contains("visible") &&
            document
              .querySelector(".search__pages")
              .classList.toggle("visible");
        }, 3000);

        document.querySelector(".search__fixedTypo").innerHTML = "";
        emptyDivs();
        blogs = new Array();
        isNewSearch = false;
      }

      // console.log("Yey or nay");
      document.querySelector(
        ".search > .search__form > input"
      ).value = searchStr;

      await execute({ query: searchStr, filter: searchFiltter, start });
    }
  });
});

document
  .querySelector(".search__form > .clear__input")
  .addEventListener("click", (e) => {
    e.preventDefault();
    input.value = "";

    isNewSearch = true;
    blogs = [];
    start = 1;
    prevFilter = "";
    totalResults = 0;
  });

document
  .querySelector(".search__pages")
  .addEventListener("click", function (e) {
    e.preventDefault();

    if (start < totalResults) {
      start = start + 10;
      execute({
        query: searchStr,
        filter: searchFiltter,
        start: start,
      });
    }
  });
