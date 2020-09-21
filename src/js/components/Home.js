import React from "react";
import { Link } from 'react-router-dom';
import axios from 'axios';
import { withStyles } from '@material-ui/core/styles';

import { TextField, Grid, CircularProgress, Typography, Button } from "@material-ui/core";
import { ExpandMore } from '@material-ui/icons';

import getMovies from 'js/library/API/getMovies';

import posterPlaceholder from 'styles/assets/posterPlaceholder.png';

const styles = theme => ({
    specialOutlineOn: {
        borderColor: "white !important",
        borderWidth: 1,
        '&:hover:not($disabled):not($error):not($focused):before': {
            borderWidth: 10,
        },
    },
    labelProps: {
        color: 'white !important',
        marginTop: '10px'
    }
});

class Home extends React.Component {

    constructor() {
        super();

        this.state = {
            moviesList: null,
            moviesListBank: [],
            searchInput: '',
            loadingList: false,

            page: 1,
            localPage: 1
        };
    };

    handleSubmit = () => {
        const searchInput = document.getElementById("search-input");
        searchInput.style.top = '10%';

        this.setState({ moviesList: 'loading' });

        getMovies(this.state.searchInput, 1).then((moviesList) => {

            this.setState({
                moviesList: moviesList.Response === 'True'
                    ? [moviesList.Search[0], moviesList.Search[1], moviesList.Search[2], moviesList.Search[3], moviesList.Search[4], moviesList.Search[5]] : moviesList.Error, moviesListBank: moviesList.Search,
                hasMore: moviesList.Response === 'True' ? moviesList.Search.length < moviesList.totalResults : false, page: 1, localPage: 1
            })
        })
    };

    handleList = () => {

        if (this.state.moviesList !== null && this.state.hasMore && !this.state.loadingList && this.state.moviesListBank.length !== 0 && (this.state.moviesListBank.length - this.state.moviesList.length) < 6) {
            const page = this.state.page + 1;
            const localPage = this.state.localPage + 1;

            this.setState({ loadingList: true, page, localPage });

            getMovies(this.state.searchInput, page).then((moviesList) => {
                const moviesListBank = this.state.moviesListBank.concat(moviesList.Search);

                this.setState({
                    moviesList: this.state.moviesList.concat([
                        moviesListBank[((localPage - 1) * 6)],
                        moviesListBank[((localPage - 1) * 6) + 1],
                        moviesListBank[((localPage - 1) * 6) + 2],
                        moviesListBank[((localPage - 1) * 6) + 3],
                        moviesListBank[((localPage - 1) * 6) + 4],
                        moviesListBank[((localPage - 1) * 6) + 5]]),
                    moviesListBank, hasMore: moviesListBank.length < moviesList.totalResults, loadingList: false
                })
            });
        }
        else if (this.state.moviesList !== null && this.state.hasMore && !this.state.loadingList && this.state.moviesListBank.length !== 0) {

            this.setState({
                moviesList: this.state.moviesList.concat(
                    this.state.moviesListBank[(this.state.localPage * 6)],
                    this.state.moviesListBank[(this.state.localPage * 6) + 1],
                    this.state.moviesListBank[(this.state.localPage * 6) + 2],
                    this.state.moviesListBank[(this.state.localPage * 6) + 3],
                    this.state.moviesListBank[(this.state.localPage * 6) + 4],
                    this.state.moviesListBank[(this.state.localPage * 6) + 5]),
                localPage: this.state.localPage + 1
            })
        };
    };

    preventImageError = index => {
        const moviesList = this.state.moviesList;

        axios.get(moviesList[index].Poster).then((img) => {
            moviesList[index].downloadedPoster = moviesList[index].Poster;
            this.setState({ moviesList })
        }).catch(() => {
            moviesList[index].downloadedPoster = posterPlaceholder;
            this.setState({ moviesList })
        })
    }

    render() {
        const { classes } = this.props;

        return (
            <div className="container">

                <Grid container className="search-input" id="search-input" >
                    <Grid item xs={false} sm={3} md={4}></Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <form onSubmit={e => { e.preventDefault(); this.handleSubmit() }}>
                            <TextField style={{ color: 'white' }} fullWidth placeholder="Procure seu filme" value={this.state.searchInput} onChange={event => this.setState({ searchInput: event.target.value })} autoFocus variant="outlined"
                                InputProps={{
                                    classes: { notchedOutline: classes.specialOutlineOn },
                                    className: classes.labelProps
                                }}
                                InputLabelProps={{ className: classes.labelProps }} />

                            <Button id="search-button" disabled={this.state.searchInput.length === 0} style={{ textTransform: 'none', marginTop: '5px' }} variant="contained" type="submit" fullWidth color="primary">Buscar</Button>
                        </form>
                    </Grid>
                    <Grid item xs={false} sm={3} md={4}></Grid>
                </Grid>

                <div className="movie-list">
                    {this.state.moviesList === 'loading'
                        ? <div className="center-loading">
                            <CircularProgress />
                        </div>
                        : this.state.moviesList === null
                            ? null
                            : <Grid container spacing={2} className="padding-40">
                                {Array.isArray(this.state.moviesList)
                                    ? this.state.moviesList.map((item, i) => {

                                        if (item === undefined) {
                                            return null;
                                        }
                                        else {
                                            return (
                                                <Grid item xs={12} sm={4} md={2} key={item.imdbID}>

                                                    <div className="tooltip">
                                                        <img width="100%" src={item.downloadedPoster === undefined ? posterPlaceholder : item.downloadedPoster} alt="Poster" onLoad={() => this.preventImageError(i)} />
                                                        <span className="tooltiptext">
                                                            <Typography variant="body1">{item.Title}</Typography>
                                                            <Typography variant="body1">{item.Year}</Typography>

                                                            <Link to={'/detalhes/' + item.imdbID}><Typography variant="caption">+ info</Typography></Link>
                                                        </span>
                                                    </div>
                                                </Grid>
                                            )
                                        }
                                    })
                                    : this.state.moviesList === 'Movie not found!'
                                        ? <div className="center-div">
                                            <Typography variant="h6" className="light-font">Nada foi encontrado.<br />Por favor, realize a busca novamente.</Typography>
                                        </div>
                                        : this.state.moviesList === 'Too many results.'
                                            ? <div className="center-div">
                                                <Typography variant="h6" className="light-font">Muitos resultados encontrados. <br />Por favor insira mais caracteres e clique em buscar.</Typography>
                                            </div>
                                            : <div className="center-div">
                                                <Typography variant="h6" className="light-font">Ocorreu um erro.<br />Por favor, realize a busca novamente.</Typography>
                                            </div>}
                            </Grid>
                    }

                    {this.state.loadingList
                        ? <div align="center" className="padding-40">
                            <CircularProgress />
                        </div>
                        : Array.isArray(this.state.moviesList)
                            ? <div align="center" className="padding-40">
                                <Typography variant="h6" color="primary" style={{ fontWeight: 'bolder' }}><span onClick={() => this.handleList()} style={{ cursor: 'pointer' }}>Ver mais<br /><ExpandMore color="primary" /></span></Typography>
                            </div>
                            : null
                    }
                </div>


            </div>
        )
    }
}

export default withStyles(styles)(Home);