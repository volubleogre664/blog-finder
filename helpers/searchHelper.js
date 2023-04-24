import { printBlogs } from "../index.js";

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

function execute(search) {
  return gapi.client.search.cse
    .list({
      cx: "e0314ea6d6e98739c",
      q: `${search.filter} ${search.query}`,
      start: search.start,
    })
    .then(
      function (response) {
        if (response.status === 200) {
          const result = response?.result;
          let _blogs = [];
          //   totalResults = +result?.queries?.request[0]?.totalResults;

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

          return _blogs;
        }
      },
      function (err) {
        console.error("Execute error", err);
      }
    );
}

function prepareSearchQuery(searchStr, isNewSearch, start) {
  start = isNewSearch ? 1 : start + 10;
  let regex = / /gi;
  const str = searchStr.replace(regex, "");

  if (str === "") {
    return;
  }

  regex = /</gi;

  searchStr = searchStr.replace(regex, " ");

  if (isNewSearch) {
    setTimeout(() => {
      !document.querySelector(".search__pages").classList.contains("visible") &&
        document.querySelector(".search__pages").classList.toggle("visible");
    }, 3000);

    document.querySelector(".search__fixedTypo").innerHTML = "";
    // emptyDivs();

    // this.blogs = [];
    // this.isNewSearch = false;
  }

  document.querySelector(".search > .search__form > input").value = searchStr;

  return { start, isNewSearch: false };
}

export { execute, prepareSearchQuery };
