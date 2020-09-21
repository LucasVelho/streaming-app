import axios from "axios";
import config from "config/config.json"

export default function getMovieDetails (id) {

    return new Promise((resolve) => {
        axios.get(config.apiHost + '?type=movie&apikey=' + config.apiKey + '&i=' + id).then(movie => {

            if (movie.data.Response === 'True') {
                return resolve(movie.data);
            }
            else {
                return resolve(null);
            }
        }).catch(() => {
            return resolve(null);
        })
    })
}