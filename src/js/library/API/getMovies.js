import axios from "axios";
import config from "config/config.json"

export default function getMovies (title, page) {

    return new Promise((resolve) => {
        axios.get(config.apiHost + '?type=movie&apikey=' + config.apiKey + '&s=' + title + '&page=' + page).then(moviesList => {
            if (moviesList.data.Response === 'True') {
                return resolve(moviesList.data);
            }
            else {
                return resolve(moviesList.data);
            }
        }).catch((error) => {
            return resolve(error);
        })
    })
}