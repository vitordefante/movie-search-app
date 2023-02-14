let movieNameRef = document.getElementById("search-text");
let searchButton = document.getElementById("search-button");
let infoSection = document.getElementById("movie-info");

function roundedToFixed(input, digits){
    var rounder = Math.pow(10, digits);
    return (Math.round(input * rounder) / rounder).toFixed(digits);
  }



//function to fetch data from the API

let getMovieData = () => {

    let movieName = movieNameRef.value;
    let url = `http://www.omdbapi.com/?t=${movieName}&apikey=${mykey}`;

    if (movieName == "") {
        infoSection.innerHTML = "<p class='error'>Please enter a valid movie name.</p>";
    } else {
        fetch(url).then((resp) => resp.json()).then((data) => {
            console.log(data);

            const outOfFive = (rating = data.imdbRating) => {
                if (rating === "N/A") {
                    return "No rating availabe.";
                } else {
                    return data.imdbRating / 2;
                }
            };
            
            let castGoogleLinks;
            if (data.Response == "True") {
                castGoogleLinks = data.Actors.split(",")
                .map(actor => `<a target=”_blank” class="actor-link" href="https://www.google.com/search?q=${actor}">${actor}</a>`).join(", ");
            }

            const directorAndWriter = (director = data.Director, writer = data.Writer) => {
                if (director == "N/A" || writer == "N/A") {
                    return "";
                } else if (director == writer) {
                    return `Wrote and directed by <a target=”_blank” class="actor-link" href="https://www.google.com/search?q=${director}">${director}.</a>`
                } else {
                    return `Wrote by <a target=”_blank” class="actor-link" href="https://www.google.com/search?q=${writer}">${writer}</a> and directed by <a target=”_blank” class="actor-link" href="https://www.google.com/search?q=${director}">${director}.</a>`
                }
            };

            const awards = () => {
                if (data.Awards == "N/A") {
                    return "This movie has no registred awards.";
                } else {
                    return data.Awards;
                }
            }
            
            if (data.Response == "True"){
                infoSection.innerHTML = `
                <div id="info">
                    <div id="poster"> <img id="poster-img" src='${data.Poster}' alt="">
                    </div>

                    <div id="info-text">
                        <h2 id="title">${data.Title} <span id="year">(${data.Year})</span> </h2>

                        <div id="genre-duration">
                            <p id="genre">${data.Genre}<span id="bulletpoint">•</span>${data.Runtime}</p>
                        </div>

                        <div id="rating">
            
                        <span id="ratingStars">${"🤍".repeat(Math.floor(data.imdbRating / 2))}</span>${outOfFive()}/5
                        </div>

                        <div id="plot">
                            <div class="subtitle">Plot</div>
                            <p id="plot-text">${data.Plot}</p>
                        </div>

                        <div id="cast">
                            <div class="subtitle">Cast</div>
                            <p>${castGoogleLinks}.<br>${directorAndWriter()}</p>
                        </div>

                        <div id="awards">
                            <div class="subtitle">Awards</div>
                            <p>${awards()}.</p>
                        </div>
                    </div>
                </div>
                `; if (data.imdbRating == "N/A") {
                    document.getElementById("rating").innerHTML = "";
                    document.getElementById("rating").innerHTML = "No rating available.";
                    
                }
            } else {
                infoSection.innerHTML = "<p class='error'>Movie not found. Please try again.</p>";
            }
        })
    }

}