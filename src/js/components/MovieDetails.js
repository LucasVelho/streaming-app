import React from "react";
import { Link } from 'react-router-dom';
import axios from "axios";

import getMovieDetails from 'js/library/API/getMovieDetails';
import { Button, CircularProgress, Grid, Typography } from "@material-ui/core";

import imdbIcon from "styles/assets/imdbIcon.svg";
import metacriticIcon from "styles/assets/metacriticIcon.png";
import posterPlaceholder from 'styles/assets/posterPlaceholder.png';

class App extends React.Component {

    constructor(props) {
        super(props);

        getMovieDetails(this.props.match.params.id).then((result) => {
            if (result !== null) {
                result.downloadedPoster = posterPlaceholder;

                axios.get(result.Poster).then((img) => {
                    const moviedata = result;
                    moviedata.downloadedPoster = moviedata.Poster;
                    this.setState({ moviedata })
                });
            };

            this.setState({ movieData: result });
        })

        this.state = {
            movieData: false
        }
    }

    render() {
        
        return (
            <div className="container">
                <Link to="/" className="default-link">
                    <Button variant="contained" color="primary" className="default-button">
                        Voltar
                    </Button>
                </Link>

                <Grid container spacing={2} style={{ padding: '20px' }}>
                    {this.state.movieData === false
                        ? <Grid item xs={12} sm={12} md={12} className="central-container">
                            <CircularProgress />
                        </Grid>
                        : this.state.movieData === null
                            ? <Grid item xs={12} sm={12} md={12} className="central-container">
                                <Typography variant="h6" className="light-font">
                                    Ops...Não encontramos o filme que você estava buscando. Clique no botão abaixo para fazer uma nova busca.
                                </Typography>
                                <Link to="/" className="default-link">
                                    <Button fullWidth variant="contained" color="primary" className="default-button">
                                        Voltar
                                    </Button>
                                </Link>
                            </Grid>
                            : <>
                                <Grid item xs={12} sm={6} md={4}>
                                    <img width="100%" alt="poster" src={this.state.movieData.downloadedPoster} />
                                </Grid>

                                <Grid item xs={12} sm={6} md={4}>
                                    <Typography variant="h6" color="primary">{this.state.movieData.Title}</Typography>

                                    <Typography className="light-font" variant="subtitle1" color="primary">{this.state.movieData.Country} {this.state.movieData.Rated !== "N/A" ? <span className="rated-badge">{this.state.movieData.Rated}</span> : null}</Typography>

                                    <Typography className="light-font" variant="subtitle1" color="primary">{this.state.movieData.Year} | {this.state.movieData.Runtime} | {this.state.movieData.Genre}</Typography>

                                    <Typography className="light-font" variant="subtitle1" style={{ paddingTop: '20px' }}>{this.state.movieData.Plot}</Typography>

                                    <Typography className="light-font" variant="body2" style={{ paddingTop: '20px' }}>Diretor: {this.state.movieData.Director}</Typography>

                                    <Typography className="light-font" variant="body2">Elenco: {this.state.movieData.Actors}</Typography>

                                    <Typography className="light-font" variant="body2">Escrito por: {this.state.movieData.Writer}</Typography>

                                    <Typography className="light-font" variant="body2">Idioma original: {this.state.movieData.Language}</Typography>

                                    <Typography className="light-font" variant="body2">Estréia: {this.state.movieData.Released}</Typography>
                                </Grid>

                                <Grid item xs={12} sm={6} md={4}>
                                    <img src={imdbIcon} width="60" alt="imdb" /><Typography style={{ fontSize: '20px', paddingLeft: '5px', verticalAlign: 'super' }} className="light-font" variant="caption">{this.state.movieData.imdbRating} ({this.state.movieData.imdbVotes} votos)</Typography>
                                    <br />

                                    {this.state.movieData.Metascore !== "N/A"
                                        ? <><img src={metacriticIcon} width="60" alt="imdb" /><Typography style={{ fontSize: '20px', paddingLeft: '5px', verticalAlign: 'super' }} className="light-font" variant="caption">{this.state.movieData.Metascore}</Typography></>
                                        : null}

                                    {this.state.movieData.Awards !== "N/A"
                                        ? <Typography className="light-font" variant="subtitle1">Prêmios: {this.state.movieData.Awards}</Typography>
                                        : null}

                                </Grid>
                            </>
                    }
                </Grid>
            </div>
        )
    }
}

export default App;