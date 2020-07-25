import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import MobileStepper from '@material-ui/core/MobileStepper';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';

const APIKey = process.env.GOOGLE_MAPS_API_KEY;
const googleAPIURL = `https://maps.googleapis.com/maps/api/js?key=${APIKey}&libraries=drawing,geometry`;

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
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
  const maxSteps = courseData.holes.length;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
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

    var map, currentPosition;

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

    var bounds = new google.maps.LatLngBounds();

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        currentPosition = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        var playerPosition = new google.maps.Marker({
          position: currentPosition,
          icon: icons.minion.icon,
          map: map,
          label: new google.maps.Marker({
            text: 'You',
            color: 'white',
            fontWeight: 'bold',
          }),
          animation: google.maps.Animation.DROP,
        });
        bounds.extend(currentPosition);
        map.fitBounds(bounds);
      });
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

    new google.maps.Marker({
      position: new google.maps.LatLng(50, 50),
      label: 'distancedistancedistancedistancedistancedistance',
      map: map,
      icon: icons.basket.icon,
    });

    flightPath.setMap(map);
  }, [courseData, activeStep]);

  return (
    <div className={classes.root}>
      <script type='text/javascript' src={googleAPIURL} />
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
            Next
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
