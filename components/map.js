import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import MobileStepper from '@material-ui/core/MobileStepper';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  form: {
    width: '100%',
    marginTop: '1rem',
  },
  field: {
    marginLeft: '2rem',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    height: 50,
    paddingLeft: theme.spacing(4),
    color: 'white',
    backgroundColor: 'black',
  },
  button: {
    display: 'flex',
    alignItems: 'center',
    height: 50,
    color: 'white',
    backgroundColor: 'black',
  },
}));

export default function Map({ courseData }) {
  const classes = useStyles();
  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);
  const [totalThrows, settotalThrows] = React.useState(0);
  const [throws, setThrows] = React.useState();
  const [holeDistance, setHoleDistance] = React.useState(0);

  const maxSteps = courseData.holes.length;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleThrowChange = (event) => {
    settotalThrows(+event.target.value + totalThrows);
    setThrows('');
  };

  let map;

  React.useEffect(() => {
    if (!!google) {
      const icons = {
        basket: {
          icon: {
            url: '/images/yelllow-basket.png',
            labelOrigin: new google.maps.Point(20, 50),
            scaledSize: new google.maps.Size(20, 20),
          },
        },
        tee: {
          icon: {
            url: '/images/red-thrower.png',
            labelOrigin: new google.maps.Point(20, 30),
            scaledSize: new google.maps.Size(20, 20),
          },
        },
        minion: {
          icon: {
            url: '/images/minion.png',
            labelOrigin: new google.maps.Point(20, 30),
          },
        },
      };

      let currentPosition, playerPosition, playerDistance;
      const activeTeePosition = {
        lat: courseData.holes[activeStep].tee[0],
        lng: courseData.holes[activeStep].tee[1],
      };
      const activeBasketPosition = {
        lat: courseData.holes[activeStep].basket[0],
        lng: courseData.holes[activeStep].basket[1],
      };

      const activeTeeMarker = new google.maps.Marker({
        position: activeTeePosition,
        icon: icons.tee.icon,
        map: map,
        label: new google.maps.Marker({
          text: `${activeStep} - ${Math.round(distance / 0.3048)} ft`,
          color: 'white',
          fontWeight: 'bold',
        }),
        animation: google.maps.Animation.DROP,
      });

      const activeBasketMarker = new google.maps.Marker({
        position: activeBasketPosition,
        icon: icons.basket.icon,
        map: map,
        animation: google.maps.Animation.DROP,
      });

      if (!map) {
        map = new google.maps.Map(document.getElementById('map'), {
          zoom: 20, // overriden by bounds
          mapTypeId: 'satellite',
          disableDefaultUI: true, // a way to quickly hide all controls
          mapTypeControl: true,
          scaleControl: true,
          zoomControl: true,
          zoomControlOptions: {
            style: google.maps.ZoomControlStyle.LARGE,
          },
        });
      }

      const bounds = new google.maps.LatLngBounds();
      bounds.extend(activeBasketMarker.position);
      bounds.extend(activeTeeMarker.position);
      map.fitBounds(bounds);

      courseData.holes.map((hole) => {
        const activeHole = courseData.holes.indexOf(hole) === activeStep;
        const lineSymbol = {
          path: 'M 0,-1 0,1',
          strokeOpacity: activeHole ? 1 : 0.5,
          scale: 4,
        };
        const teePosition = { lat: hole.tee[0], lng: hole.tee[1] };
        const basketPosition = { lat: hole.basket[0], lng: hole.basket[1] };

        const distance = google.maps.geometry.spherical.computeDistanceBetween(
          new google.maps.LatLng(teePosition.lat, teePosition.lng),
          new google.maps.LatLng(basketPosition.lat, basketPosition.lng)
        );

        if (activeHole) {
          setHoleDistance(Math.round(distance / 0.3048));
        }
        const teeMarker = new google.maps.Marker({
          position: teePosition,
          icon: icons.tee.icon,
          map: map,
          label: new google.maps.Marker({
            text: `${courseData.holes.indexOf(hole) + 1} - ${Math.round(
              distance / 0.3048
            )} ft`,
            color: activeHole ? 'white' : 'yellow',
            fontWeight: 'bold',
          }),
          animation: google.maps.Animation.DROP,
        });

        const basketMarker = new google.maps.Marker({
          position: basketPosition,
          icon: icons.basket.icon,
          map: map,
          animation: google.maps.Animation.DROP,
        });

        playerPosition = new google.maps.Marker({
          icon: icons.minion.icon,
          map: map,
          animation: google.maps.Animation.DROP,
        });

        const playerPath = new google.maps.Polyline({
          geodesic: true,
          strokeColor: '#659DBD',
          strokeOpacity: 0,
          strokeWeight: 4,
          icons: [
            {
              icon: { path: 'M 0,-1 0,1', strokeOpacity: 0.5, scale: 4 },
              offset: '0',
              repeat: '20px',
            },
          ],
        });

        function error(err) {
          console.warn('ERROR(' + err.code + '): ' + err.message);
        }

        // Try HTML5 geolocation.
        if (navigator.geolocation) {
          navigator.geolocation.watchPosition(
            (position) => {
              currentPosition = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              };
              playerDistance = google.maps.geometry.spherical.computeDistanceBetween(
                new google.maps.LatLng(
                  currentPosition.lat,
                  currentPosition.lng
                ),
                new google.maps.LatLng(basketPosition.lat, basketPosition.lng)
              );
              playerPosition.setPosition(currentPosition);
              activeBasketMarker.setOptions({
                label: new google.maps.Marker({
                  text: `${Math.round(playerDistance / 0.3048)} ft`,
                  color: 'orange',
                  fontWeight: 'bold',
                }),
              });
              playerPath.setPath([
                activeBasketMarker.position,
                playerPosition.position,
              ]);
              playerPath.setMap(map);
              // bounds.extend(currentPosition);
              // map.fitBounds(bounds);
            },
            error,
            {
              enableHighAccuracy: true,
            }
          );
        }

        const flightPath = new google.maps.Polyline({
          path: [basketMarker.position, teeMarker.position],
          geodesic: true,
          strokeColor: activeHole ? 'white' : 'yellow',
          strokeOpacity: 0,
          icons: [
            {
              icon: lineSymbol,
              offset: '0',
              repeat: '20px',
            },
          ],
        });

        flightPath.setMap(map);
      });
    }
  }, [courseData, activeStep]);

  return (
    <div>
      <Grid container className={classes.root} spacing={1}>
        <Grid item xs={3}>
          <TextField
            id='par'
            label={`Par (${courseData.totalPar})`}
            defaultValue={courseData.holes[activeStep].par}
            InputProps={{
              readOnly: true,
            }}
            variant='outlined'
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            id='distance'
            label='Distance'
            value={`${holeDistance} ft`}
            InputProps={{
              readOnly: true,
            }}
            variant='outlined'
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            id='hole'
            type='number'
            label='Throws'
            variant='outlined'
            value={throws}
            onChange={() => setThrows(event.target.value)}
            onBlur={handleThrowChange}
          />
        </Grid>
        <Grid item xs={2}>
          <TextField
            id='total'
            type='number'
            label='Total'
            variant='outlined'
            value={totalThrows}
          />
        </Grid>
      </Grid>

      <Paper square elevation={0} className={classes.header}>
        <Typography> Hole {activeStep + 1}</Typography>
      </Paper>
      <div id='map' style={{ height: '25rem' }} />
      <MobileStepper
        steps={maxSteps}
        position='static'
        variant='text'
        activeStep={activeStep}
        className={classes.button}
        nextButton={
          <Button
            size='small'
            onClick={handleNext}
            disabled={activeStep === maxSteps - 1}
            className={classes.button}
          >
            Next Hole
            {theme.direction === 'rtl' ? (
              <KeyboardArrowLeft />
            ) : (
              <KeyboardArrowRight />
            )}
          </Button>
        }
        backButton={
          <Button
            size='small'
            onClick={handleBack}
            className={classes.button}
            disabled={activeStep === 0}
          >
            {theme.direction === 'rtl' ? (
              <KeyboardArrowRight />
            ) : (
              <KeyboardArrowLeft />
            )}
            Back
          </Button>
        }
      />
    </div>
  );
}
