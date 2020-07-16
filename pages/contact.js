import FormControl from '@material-ui/core/FormControl';
import React from 'react';
import Head from 'next/head';
import Layout, { siteTitle } from '../components/layout';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import FormHelperText from '@material-ui/core/FormHelperText';
import utilStyles from '../styles/utils.module.css';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import SendIcon from '@material-ui/icons/Send';

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
  div: {
    paddingTop: '2rem',
  },
}));

export default function Contact() {
  const [email, setEmail] = React.useState('');
  const [message, setMessage] = React.useState('');

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleSubmit = (event) => {
    setEmail('');
    setMessage('');
  };

  const classes = useStyles();

  return (
    <>
      <Layout>
        <Head>
          <title>{siteTitle}</title>
        </Head>
        <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
          <FormControl fullWidth>
            <InputLabel htmlFor='email'>Email address</InputLabel>
            <Input
              fullWidth
              id='email'
              aria-describedby='email-helper-text'
              value={email}
              onChange={handleEmailChange}
            />
            <FormHelperText id='email-helper-text'>
              We'll never share your email.
            </FormHelperText>
          </FormControl>
          <div className={classes.div}>
            <FormControl
              fullWidth
              style={{ display: 'block' }}
              variant='outlined'
            >
              <InputLabel htmlFor='message'>Message</InputLabel>
              <OutlinedInput
                value={message}
                onChange={handleMessageChange}
                fullWidth
                multiline
                rows={5}
                id='message'
                aria-describedby='message-text'
                labelWidth={72}
              />
              <FormHelperText id='message-text'>
                What would you like to tell us?
              </FormHelperText>
            </FormControl>
          </div>
          <div style={{ float: 'right' }}>
            <Button
              variant='contained'
              color='primary'
              className={classes.button}
              endIcon={<SendIcon />}
              onClick={handleSubmit}
            >
              Send
            </Button>
          </div>
        </section>
      </Layout>
    </>
  );
}
