import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from "@mui/material/Typography";
import { Container } from "@mui/material";
import { GET_ME, QUERY_CARD } from '../utils/queries'
import auth from '../utils/auth';
import { useQuery, useMutation } from '@apollo/client';
import { LOGIN_USER } from "../utils/mutations";
import '../css/style.css';
// import App from '../App';



export default function Home() {
  // const { userData } = useQuery(GET_ME);
  // console.log(userData);
  // const user = userData?.me || {};
  // console.log(user);

  const { data } = useQuery(GET_ME);
  console.log(data);
   const user = data?.me || {};
   console.log(user); 
   const [formData, setFormData] = useState({
     username: '',
     email: '',
   });



  // const [user, setUser] = useState({});
  const [userCards, setUserCards] = useState([]);
  // const [singleCard, setSingleCard] = useState(null);
  const { cardData } = useQuery(QUERY_CARD);
  const { cards } = cardData?.me || {};
  console.log(cards);




  const [loginUser, {error}] = useMutation(LOGIN_USER);
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formDataVariables = {
      email: formData.get("email"),
      password: formData.get("password")
    }
    console.log(formDataVariables);
    try {
      const { data } = await loginUser({
        variables: { 
          ...formDataVariables
        }
      })
      console.log(data);
      auth.login(data.login.token);
    } catch (e) {
      console.error(e)
    }
  };
  // Function to handle logout should go here


  return (

    <Container component="main" maxWidth="lg">
      <Box
        sx={{
          marginTop: "12vh",
        }}
      >
        {auth.loggedIn() ? (
          <div>
            < div className='welcomeMessage' >
              <Typography variant="h4"
                sx={{
                  fontSize: "3rem",
                  fontFamily: "Lucida Handwriting, Roboto, Helvetica, Arial, sans-serif",
                  marginTop: "6vh",
                  textAlign: "center",
                  textShadow: " 2px 2px 2px #a7a59e",
                }}
              >Welcome {user.username}!</Typography>
            </div >
            < div className='welcomeMessage' >
              <Typography variant="h4"
                sx={{
                  fontFamily: "Lucida Handwriting, Roboto, Helvetica, Arial, sans-serif",
                  marginTop: "2vh",
                  textAlign: "center",
                  color: "#393836",
                  '&:active': {
                    color: "inherit",
                  }
                }}
              ><Link to="/card-create" variant="body2"
                sx={{
                  textDecoration: "none",
                  '&:active': {
                    color: "inherit",
                  }
                }}
              >Let's make a card!</Link></Typography>
            </div >
            <div className="cardListStyling">
              {/* Display all cards if 'cards' is defined and is an array */}
              {Array.isArray(cards) && cards.length > 0 ? (
                cards.map((card) => (
                  <Card key={card._id}>
                    <CardContent>
                      <Typography variant="h5">{card.title}</Typography>
                      <Typography variant="body1">{card.details}</Typography>
                      {/* Add more card content as needed */}
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="empty-message">You have no cards yet.</p>
              )}
            </div>

          </div>
        ) : (
          <div>

            <Container component="main" maxWidth="lg"
              minheight="60vh"
            >
                      <Typography variant="h3"
          sx={{
            fontSize: "4rem",
            textAlign: "center",
            fontFamily: "Lucida Handwriting, Roboto, Helvetica, Arial, sans-serif",
            textShadow: " 2px 2px 2px #a7a59e",
          }}

        >Welcome to Card-X
        </Typography>
              <Box
                sx={{
                  marginTop: "4vh",
                }}
              >
                <Grid container>


                  <CssBaseline />
                  <Grid
                    item
                    xs={false}
                    sm={4}
                    md={7}
                    sx={{
                      borderRadius: "1rem 0 0 1rem",
                      backgroundImage: "url(https://source.unsplash.com/random)",
                      backgroundRepeat: "no-repeat",
                      backgroundColor: (t) =>
                        t.palette.mode === "light"
                          ? t.palette.grey[50]
                          : t.palette.grey[900],
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      minWidth: "25vh",
                      boxShadow: " 3px 3px 3px #7b8782"
                    }}
                  />
                  <Grid
                    item
                    xs={12}
                    sm={8}
                    md={5}
                    component={Paper}
                    elevation={6}
                    square
                    sx={{
                      borderRadius: "0 1rem 1rem 0",
                      opacity: 0.86,
                      background: "linear-gradient(0.625turn, rgba(203, 211, 255, 0.75), rgba(195, 214, 247, 0.75))",
                      boxShadow: " 3px 3px 3px #7b8782"
                    }}
                  >
                    <Box
                      sx={{
                        my: 8,
                        mx: 4,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <Typography component="h1" variant="h5"
                      sx={{
                        fontWeight: "400",
                        fontSize: "2.5rem",
                        fontFamily: "Calibri, Roboto, Helvetica, Arial, sans-serif",
                        marginTop: "-4vh",
                      }}>
                        Sign in
                      </Typography>
                      <Box
                        component="form"
                        noValidate
                        onSubmit={handleSubmit}
                        sx={{ mt: 1 }}
                      >
                        <TextField
                          margin="normal"
                          required
                          fullWidth
                          id="email"
                          label="Email Address"
                          name="email"
                          autoComplete="email"
                          autoFocus
                        />
                        <TextField
                          margin="normal"
                          required
                          fullWidth
                          name="password"
                          label="Password"
                          type="password"
                          id="password"
                          autoComplete="current-password"
                        />
                        <FormControlLabel
                          control={<Checkbox value="remember" color="primary" />}
                          label="Remember me"
                        />
                        <Button
                          type="submit"
                          variant="contained"
                          sx={{ mt: 3, mb: 2,
                            alignSelf: "center",
                            width: "24vh",
                            background: "linear-gradient(0.305turn, #535d9a, #9fb4d7)",
                            '&:hover': {
                              background: "linear-gradient(0.3turn, #6a77bf, #bacff2)",
                            }
                            }}
                        >
                          Sign In
                        </Button>
                        <Grid container>
                          <Grid item>
                            <Link to="/signup" variant="body2">
                              {"Don't have an account? Sign Up!"}
                            </Link>
                          </Grid>
                        </Grid>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Container>
          </div>
        )}
      </Box>
    </Container>
  );
}