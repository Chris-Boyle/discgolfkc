import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import MobileStepper from '@material-ui/core/MobileStepper';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';

const googleAPIURL = `https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_MAPS_API_KEY}&libraries=drawing`;

const icons = {
  basket: {
    icon: '/images/basket.png',
  },
  tee: {
    icon: '/images/frisbee-throw.png',
  },
};

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
    var map;
    map = new google.maps.Map(document.getElementById('map'), {
      zoom: 10, // overriden by bounds
      mapTypeId: 'satellite',
    });
    var teeMarker = new google.maps.Marker({
      position: {
        lat: courseData.holes[activeStep].tee[0],
        lng: courseData.holes[activeStep].tee[1],
      },
      icon: icons.tee.icon,
      map: map,
      // label: '#1 Tee Box',
      animation: google.maps.Animation.DROP,
    });
    var basketMarker = new google.maps.Marker({
      position: {
        lat: courseData.holes[activeStep].basket[0],
        lng: courseData.holes[activeStep].basket[1],
      },
      icon: icons.basket.icon,
      map: map,
      // label: '#1 Basket',
      animation: google.maps.Animation.DROP,
    });
    var bounds = new google.maps.LatLngBounds();
    bounds.extend(basketMarker.position);
    bounds.extend(teeMarker.position);
    map.fitBounds(bounds);
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
