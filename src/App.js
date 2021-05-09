//import logo from './logo.svg;
import './App.css';
import { Search } from 'react-bootstrap-icons';
import {useState} from 'react';
import { Grid, Paper, Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';

function App() {

  const [moviename, setMovieName] = useState();
  const [flag, setFlag] = useState(false);
  const [movies, setMovies] = useState([]);
  const [nominations, setNominations] = useState([]);  
  const [nominate, setNominate] = useState(false);
  const [count, setCount] = useState(0);
  const [error, setError] = useState(false);
  const [openDialog, setOpenDialog] = useState(true);

  const handleChange = ({target}) => {    
    setMovieName(target.value);    
  }

  const addNomination=(val) => {     
    setNominations(nominations.concat(movies[val])); 
    setNominate(true);
    setCount(count + 1); 
    setOpenDialog(true);
  }

  const removeNomination=(val) => {
    const removeList = nominations.filter((item) => item.imdbID !== val);

    setNominations(removeList);
    setCount(count - 1);    
    setOpenDialog(true);
  }  

  const checkNomination=(movie) => { 
    if(count === 5) {
      return true;
    }    
    let b = nominations.some(item => {
        if(item.imdbID === movie.imdbID) {
         return true;
        } 
        else {
          return false;
        }
    });           
    return b;
  }
  
  const handleSubmit=(event) => {    
    event.preventDefault();        
    if(moviename) {
      setFlag(true);            
    }
    else {
      setFlag(false);
    }                 
    fetch(`https://www.omdbapi.com/?type=movie&s=${moviename}&apikey=ec2d23f3`)
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
                    movies.map((movie, index) => {
                      return (                  
                        <li key={index}>  
                          {movie.Title} ({movie.Year}) 
                          <button onClick={() => addNomination(index)} 
                            disabled={checkNomination(movie)} >Nominate</button>        
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
                    nominations.map(movie => {                                        
                      return (
                        <li key={movie.imdbID}> 
                          {movie.Title} ({movie.Year})
                          <button onClick={() => removeNomination(movie.imdbID)}>Remove</button>
                        </li>
                      );                      
                    })
                  }
                </ul>              
              </Paper>                      
            }         
          </Grid> 
        </Grid>                  
      </Grid>

      {
          (count === 5) &&
          <Dialog  open={openDialog}>
            <DialogTitle>
              Thank You for Nominations!
            </DialogTitle>
            <DialogContent dividers>
              <p> You have selected maximum {count} movie nominations.</p>
            </DialogContent>    
            <DialogActions>   
              <button onClick={() => {setOpenDialog(false)}}> OK </button>               
            </DialogActions>
          </Dialog>       
        }

    </div>
  );
}

export default App;
