import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Fade from '@material-ui/core/Fade';
import { useRouter } from 'next/router';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    paddingBottom: '2rem',
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

export default function NavBar() {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const isMenuOpen = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const router = useRouter();

  return (
    <div className={classes.root}>
      <AppBar position='fixed'>
        <Toolbar>
          <IconButton
            edge='start'
            className={classes.menuButton}
            color='inherit'
            aria-label='menu'
            aria-controls='fade-menu'
            aria-haspopup='true'
            onClick={handleClick}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            id='fade-menu'
            style={{ top: '2rem' }}
            keepMounted
            anchorEl={anchorEl}
            open={isMenuOpen}
            onClose={handleClose}
            TransitionComponent={Fade}
          >
            <MenuItem onClick={() => router.push('/')}>Home</MenuItem>
            <MenuItem onClick={() => router.push('/workouts')}>
              Workouts
            </MenuItem>
          </Menu>
          <Typography variant='h6' className={classes.title}>
            HIIT KC
          </Typography>
          <Button color='inherit' onClick={() => router.push('/contact')}>
            Contact Us
          </Button>
        </Toolbar>
      </AppBar>
    </div>
  );
}
