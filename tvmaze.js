"use strict";

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");
const BASE_TVMAZE_URL = "https://api.tvmaze.com/";

/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

//TODO: refactor to follow object format defined in docstring (map)
async function getShowsByTerm(term) {
  // ADD: Remove placeholder & make request to TVMaze search shows API.

  //FIXED: style- params each line
  const response = await axios.get(`${BASE_TVMAZE_URL}search/shows`, {
    params: { q: term },
  });

  const filteredResponse = response.data.map(function (obj) {
    return {
      id: obj.show.id,
      name: obj.show.name,
      summary: obj.show.summary,
      image: obj.show.image,
    };
  });

  return filteredResponse;
}

/** Given list of shows, create markup for each and append to DOM.
 *
 * A show is {id, name, summary, image}
 * */

//TODO: refactor with updated show
async function displayShows(shows) {
  $showsList.empty();

  for (const show of shows) {
    //TODO: rename variable name
    let imageURL = show.image;

    //TODO: update to falsy value
    if (!imageURL) {
      imageURL = "https://tinyurl.com/tv-missing";
    } else {
      imageURL = show.image.medium;
    }

    const $show = $(`
        <div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img
              src="${imageURL}"
              alt="Bletchly Circle San Francisco"
              class="w-25 me-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>
       </div>
      `);

    $showsList.append($show);
  }
}

/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchShowsAndDisplay() {
  const term = $("#searchForm-term").val();
  const shows = await getShowsByTerm(term);

  let episodes = await getEpisodesOfShow(shows[0].id)
  displayEpisodes(episodes)

  $episodesArea.hide();
  displayShows(shows);
}

$searchForm.on("submit", async function handleSearchForm(evt) {
  evt.preventDefault();
  await searchShowsAndDisplay();
});

/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

async function getEpisodesOfShow(id) {
  const episodes = await axios.get(`${BASE_TVMAZE_URL}shows/${id}/episodes`)
  let filterEpisodes = episodes.data.map(function (obj) {
    return {
      "id": obj.id,
      "name": obj.name,
      "season": obj.season,
      "number": obj.number,
    }
  })

  return filterEpisodes
}

/** Write a clear docstring for this function... */

function displayEpisodes(episodes) {
  for (let episode of episodes) {
    let episodeLI = $("<li>").text(`${episode.name} (season ${episode.season}, 
    number ${episode.number})`)
    $("#episodesList").append(episodeLI)
  }
}

// add other functions that will be useful / match our structure & design
