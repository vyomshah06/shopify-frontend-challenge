//import logo from './logo.svg;
import './App.css';
import { Search } from 'react-bootstrap-icons';
import {useState} from 'react';
import { Grid, Paper } from '@material-ui/core';
import { Alert } from '@material-ui/lab'

function App() {

  const [moviename, setMovieName] = useState();
  const [flag, setFlag] = useState(false);
  const [movies, setMovies] = useState([]);
  const [nominations, setNominations] = useState({});  
  const [nominate, setNominate] = useState(false);
  const [count, setCount] = useState(0);
  const [error, setError] = useState(false);

  const handleChange = ({target}) => {    
    setMovieName(target.value);    
  }

  const handleNomination=(val) => {                    
    if(!nominations[val]) {
      setCount(count + 1);
      setNominations((prev) => ({
        ...prev,
        [val]: true
      }));
      setNominate(true);
    }
    else {
      setCount(count - 1);
      setNominations((prev) => ({
        ...prev,
        [val]: false
      }));
    }        
  }

  const handleSubmit=(event) => {    
    event.preventDefault();        
    if(moviename) {
      setFlag(true);
      setNominations({});
      setCount(0);
    }
    else {
      setFlag(false);
    }    
    fetch(`http://www.omdbapi.com/?type=movie&s=${moviename}&apikey=ec2d23f3`)
    .then((success) => { return success.json(); })
    .then((result) => { 
      if(result.Response === "True"){
        setMovies(result.Search);
        setError(false);
      }
      else {
        setError(true);
      } 
    })
    .catch((error) => { console.log(error); });    
    document.getElementById("myForm").reset();
  }

  return (
    <div className="App">            
      <Grid container spacing={2} className="container">          
        <Grid item xs={12}>
          <h2>The Shoppies</h2>
        </Grid>
        {
          (count >= 5) && <Alert severity="info" className="alert"> You have selected {count} movie nominations!</Alert>
        }                                
        <Grid item xs={12}> 
          <Paper className="searchPaper">
            <form id="myForm">
              <label>                  
                Movie Title:                                      
              </label>
              <div className="search">
                <Search />
                <input type="text" className="searchbar" onChange={handleChange} placeholder="Search"/>
                <button onClick={handleSubmit}>Search</button>                                             
              </div>
            </form>                
          </Paper>                
        </Grid>              
        <Grid container className="resultsContainer">
          <Grid item xs={6}>
            {
             (flag && moviename && !error) &&                     
              <Paper className="resultsPaper">
                <b>Results for "{moviename}"</b>
                <ul>
                  {   
                    movies.map(movie => {
                      return (                  
                        <li key={movie.imdbID}>  
                          {movie.Title} ({movie.Year}) 
                          <button onClick={() => handleNomination(movie.imdbID)} 
                            disabled={nominations[movie.imdbID]} >Nominate</button>        
                        </li>
                      );
                    })
                  }
                </ul>
              </Paper>                     
            }
            {
              (error === true) &&
                <Paper className="resultsPaper">              
                  <b>Movie not found!</b>              
                </Paper>
            }
          </Grid>                            
          <Grid item xs={6}>
            { nominate &&                      
              <Paper className="nominatePaper">                
                <b>Nominations</b>
                <ul>                  
                  {                    
                    movies.map(movie => {                  
                      if(nominations[movie.imdbID] === true) {
                        return (
                          <li key={movie.imdbID}> 
                            {movie.Title} ({movie.Year})
                            <button onClick={() => handleNomination(movie.imdbID)}>Remove</button>
                          </li>
                          );
                      }
                      return null;                      
                    })
                  }
                </ul>              
              </Paper>                      
            }         
          </Grid> 
        </Grid>                  
      </Grid>
    </div>
  );
}

export default App;
