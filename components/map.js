import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import MobileStepper from '@material-ui/core/MobileStepper';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import TextField from '@material-ui/core/TextField';

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

  React.useEffect(() => {
    const icons = {
      basket: {
        icon: '/images/basket.png',
      },
      tee: {
        icon: {
          url: '/images/frisbee-throw.png',
          labelOrigin: new google.maps.Point(0, 50),
        },
      },
      minion: {
        icon: {
          url: '/images/minion.png',
          labelOrigin: new google.maps.Point(20, 30),
        },
      },
    };

    let map, currentPosition, playerPosition, playerDistance;

    const teePosition = {
      lat: courseData.holes[activeStep].tee[0],
      lng: courseData.holes[activeStep].tee[1],
    };
    const basketPosition = {
      lat: courseData.holes[activeStep].basket[0],
      lng: courseData.holes[activeStep].basket[1],
    };

    const distance = google.maps.geometry.spherical.computeDistanceBetween(
      new google.maps.LatLng(teePosition.lat, teePosition.lng),
      new google.maps.LatLng(basketPosition.lat, basketPosition.lng)
    );
    setHoleDistance(distance);

    if (google) {
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

      const bounds = new google.maps.LatLngBounds();

      playerPosition = new google.maps.Marker({
        icon: icons.minion.icon,
        map: map,
        animation: google.maps.Animation.DROP,
      });

      const playerPath = new google.maps.Polyline({
        geodesic: true,
        strokeColor: 'white',
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

      // Try HTML5 geolocation.
      if (navigator.geolocation) {
        navigator.geolocation.watchPosition(
          (position) => {
            currentPosition = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            playerDistance = google.maps.geometry.spherical.computeDistanceBetween(
              new google.maps.LatLng(currentPosition.lat, currentPosition.lng),
              new google.maps.LatLng(basketPosition.lat, basketPosition.lng)
            );
            playerPosition.setPosition(currentPosition);
            playerPosition.setOptions({
              label: new google.maps.Marker({
                text: `${Math.round(playerDistance / 0.3048)} feet`,
                color: 'white',
                fontWeight: 'bold',
              }),
            });
            playerPath.setPath([
              basketMarker.position,
              playerPosition.position,
            ]);
            playerPath.setMap(map);
            // bounds.extend(currentPosition);
            // map.fitBounds(bounds);
          },
          () => {},
          { enableHighAccuracy: true }
        );
      }

      var teeMarker = new google.maps.Marker({
        position: teePosition,
        icon: icons.tee.icon,
        map: map,
        label: new google.maps.Marker({
          text: `${Math.round(distance / 0.3048)} feet`,
          color: 'white',
          fontWeight: 'bold',
        }),
        animation: google.maps.Animation.DROP,
      });
      var basketMarker = new google.maps.Marker({
        position: basketPosition,
        icon: icons.basket.icon,
        map: map,
        // label: '#1 Basket',
        animation: google.maps.Animation.DROP,
      });
      bounds.extend(basketMarker.position);
      bounds.extend(teeMarker.position);
      map.fitBounds(bounds);

      var lineSymbol = {
        path: 'M 0,-1 0,1',
        strokeOpacity: 1,
        scale: 4,
      };

      const flightPath = new google.maps.Polyline({
        path: [basketMarker.position, teeMarker.position],
        geodesic: true,
        strokeColor: 'white',
        strokeOpacity: 0,
        strokeWeight: 4,
        icons: [
          {
            icon: lineSymbol,
            offset: '0',
            repeat: '20px',
          },
        ],
      });

      flightPath.setMap(map);
    }
  }, [courseData, activeStep]);

  return (
    <div className={classes.root}>
      <form className={classes.form} noValidate autoComplete='off'>
        <TextField
          style={{ width: '4rem' }}
          id='par'
          label={`Par (${courseData.totalPar})`}
          defaultValue={courseData.holes[activeStep].par}
          InputProps={{
            readOnly: true,
          }}
          variant='outlined'
        />
        <TextField
          style={{ width: '5.5rem', marginLeft: '1rem' }}
          id='distance'
          label='Distance'
          value={`${Math.round(holeDistance / 0.3048)} feet`}
          InputProps={{
            readOnly: true,
          }}
          variant='outlined'
        />
        <TextField
          style={{ width: '5.5rem', marginLeft: '1rem' }}
          id='hole'
          type='number'
          label='Throws'
          variant='outlined'
          value={throws}
          onChange={() => setThrows(event.target.value)}
          onBlur={handleThrowChange}
        />
        <TextField
          style={{ width: '4rem', marginLeft: '1rem' }}
          id='total'
          type='number'
          label='Total'
          variant='outlined'
          value={totalThrows}
        />
      </form>
      <Paper square elevation={0} className={classes.header}>
        <Typography> Hole {activeStep + 1}</Typography>
      </Paper>
      <div id='map' style={{ height: '25rem' }} />
      <MobileStepper
        steps={maxSteps}
        position='static'
        variant='text'
        activeStep={activeStep}
        className={classes.header}
        nextButton={
          <Button
            size='small'
            onClick={handleNext}
            disabled={activeStep === maxSteps - 1}
            className={classes.header}
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
            className={classes.header}
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
