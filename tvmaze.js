"use strict";

const $showsList = $("#shows-list");
const $episodesArea = $("#episodes-area");
const $searchForm = $("#search-form");

const $episodesList = $("#episodes-list");

/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */


// ADD: Remove placeholder & make request to TVMaze search shows API.


async function getShowsByTerm(term) {
  const searchText = document.querySelector('#search-query');
  searchText.value = '';

  const res = await axios.get('http://api.tvmaze.com/search/shows?', {
    params: {
      q: term
    }
  })
  const newArray = []
  for (let i = 0; i < res.data.length; i++) {
    const id = res.data[i].show.id;
    const name = res.data[i].show.name;
    const summary = res.data[i].show.summary;
    const altImage = "https://store-images.s-microsoft.com/image/apps.65316.13510798887490672.6e1ebb25-96c8-4504-b714-1f7cbca3c5ad.f9514a23-1eb8-4916-a18e-99b1a9817d15?mode=scale&q=90&h=300&w=300";

    let image;
    if (res.data[i].show.image) {
      image = res.data[i].show.image.medium;
    }
    else {
      image = altImage;
    }

    newArray.push({
      id,
      name,
      summary,
      image
    });
  }
  return newArray;
}

async function getEpisodes(showId) {
  const res = await axios.get(`https://api.tvmaze.com/shows/${showId}/episodes`);
  const newArray = []

  for (let i = 0; i < res.data.length; i++) {
    const id = res.data[i].id;
    const name = res.data[i].name;
    const season = res.data[i].season;
    const number = res.data[i].number;

    newArray.push({ id, name, season, number });
  }
  return newArray;
}

/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
  $showsList.empty();

  for (let show of shows) {
    const $show = $(
      `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img 
              src="${show.image}" 
              alt="${show.name}" 
              class="w-25 mr-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-secondary btn-sm get-episodes">
               Episodes
             </button>
           </div>
         </div>  
       </div>
      `);

    $showsList.append($show);
  }
}

function populateEpisodes(episodes) {
  $episodesList.empty();

  for (let episode of episodes) {
    const $episode = $(
      `<li>${episode.name}, season ${episode.season}, number ${episode.number}</li>`
    );

    $episodesList.append($episode);
  }
  $("#episodes-area").show();
}

// I would like to refactor this next part without JQuery:
$("#shows-list").on("click", ".get-episodes", async function handleEpisodeClick(evt) {
  let showId = $(evt.target).closest(".Show").data("show-id");
  let episodes = await getEpisodes(showId);
  populateEpisodes(episodes);
});

/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
  const term = $("#search-query").val();
  // const term = $("#searchForm-term").val(); - THIS IS AN ERROR!! This id does not exist!
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});


/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

// async function getEpisodesOfShow(id) { }

/** Write a clear docstring for this function... */

// function populateEpisodes(episodes) { }
