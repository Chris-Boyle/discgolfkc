import React from 'react';
import ReactPlayer from 'react-player/lazy';
import Head from 'next/head';
import { makeStyles } from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import Layout from '../../components/layout';
import utilStyles from '../../styles/utils.module.css';
import { getAllCourseIds, getCourseData } from '../../lib/courses';
import Map from '../../components/map';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: '1rem',
  },
}));

export async function getStaticPaths() {
  const paths = getAllCourseIds();
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const courseData = await getCourseData(params.id);
  return {
    props: {
      courseData,
    },
  };
}

const APIKey = process.env.GOOGLE_MAPS_API_KEY;
const googleAPIURL = `https://maps.googleapis.com/maps/api/js?key=${APIKey}&libraries=drawing,geometry`;

const openMap = (courseData) => {
  if (
    /* if we're on iOS, open in Apple Maps */
    navigator.platform.indexOf('iPhone') != -1 ||
    navigator.platform.indexOf('iPad') != -1 ||
    navigator.platform.indexOf('iPod') != -1
  )
    window.open(
      `maps://maps.google.com/maps/dir/?daddr=${courseData.parking}&amp;ll=`
    );
  /* else use Google */ else
    window.open(
      `https://maps.google.com/maps/dir/?daddr=${courseData.parking}&amp;ll=`
    );
};

export default function Courses({ courseData }) {
  const classes = useStyles();

  return (
    <Layout>
      <Head>
        <title>{courseData.title}</title>
        <script type='text/javascript' src={googleAPIURL} />
      </Head>
      <article>
        <h1 className={utilStyles.headingXl}>{courseData.title}</h1>
        <div className={utilStyles.lightText}>
          <Typography className={classes.root}>
            <Link
              onClick={() => openMap(courseData)}
              component='button'
              variant='body1'
            >
              {courseData.address}
            </Link>
          </Typography>
        </div>
        {courseData.holes?.length > 0 && <Map courseData={courseData} />}
        {courseData.map && (
          <img
            src={courseData.map}
            width='100%'
            height='480'
            alt={courseData.name}
          />
        )}
        {courseData.url && (
          <ReactPlayer
            url={courseData.url}
            className='react-player'
            width='100%'
            height='30rem'
            controls
            style={{ backgroundColor: 'black' }}
          />
        )}
        <div dangerouslySetInnerHTML={{ __html: courseData.contentHtml }} />
      </article>
    </Layout>
  );
}
