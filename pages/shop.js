import React from 'react';
import Head from 'next/head';
import Layout, { siteTitle } from '../components/layout';
import utilStyles from '../styles/utils.module.css';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
  div: {
    paddingTop: '2rem',
  },
}));

export default function Shop() {
  const classes = useStyles();

  return (
    <>
      <Layout>
        <Head>
          <title>{siteTitle}</title>
        </Head>
        <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
          <h2 className={utilStyles.headingLg}>Coming Soon!</h2>
        </section>
        <footer>
          <script src='https://sdks.shopifycdn.com/js-buy-sdk/v1/latest/index.umd.min.js'></script>
        </footer>
      </Layout>
    </>
  );
}
