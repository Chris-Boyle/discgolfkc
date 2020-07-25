import React from 'react';
import ReactPlayer from 'react-player/lazy';
import Head from 'next/head';
import Layout from '../../components/layout';
import Date from '../../components/date';
import utilStyles from '../../styles/utils.module.css';
import { getAllCourseIds, getCourseData } from '../../lib/courses';
import { TextareaAutosize } from '@material-ui/core';

const googleAPIURL = `https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_MAPS_API_KEY}&libraries=drawing`;

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

const icons = {
  basket: {
    icon: '/images/basket.png',
  },
  tee: {
    icon: '/images/frisbee-throw.png',
  },
};

export default function Courses({ courseData }) {
  React.useEffect(() => {
    if (courseData) {
      var map;
      map = new google.maps.Map(document.getElementById('map'), {
        zoom: 20, // overriden by bounds
        mapTypeId: 'satellite',
      });
      var teeMarker = new google.maps.Marker({
        position: {
          lat: courseData.holes[0].tee[0],
          lng: courseData.holes[0].tee[1],
        },
        icon: icons.tee.icon,
        map: map,
        // label: '#1 Tee Box',
        animation: google.maps.Animation.DROP,
      });
      var basketMarker = new google.maps.Marker({
        position: {
          lat: courseData.holes[0].basket[0],
          lng: courseData.holes[0].basket[1],
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
    }
  }, [courseData]);

  return (
    <Layout>
      <Head>
        <title>{courseData.title}</title>
        <script type='text/javascript' src={googleAPIURL}></script>
      </Head>
      <article>
        <h1 className={utilStyles.headingXl}>{courseData.title}</h1>
        <div className={utilStyles.lightText}>
          <Date dateString={courseData.date} />
        </div>
        <div id='map' style={{ height: '30rem', marginBottom: '2rem' }}></div>
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
