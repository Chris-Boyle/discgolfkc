import React from 'react';
import ReactPlayer from 'react-player/lazy';
import Head from 'next/head';
import Layout from '../../components/layout';
import utilStyles from '../../styles/utils.module.css';
import { getAllCourseIds, getCourseData } from '../../lib/courses';
import Map from '../../components/map';

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

export default function Courses({ courseData }) {
  return (
    <Layout>
      <Head>
        <title>{courseData.title}</title>
        <script type='text/javascript' src={googleAPIURL} />
      </Head>
      <article>
        <h1 className={utilStyles.headingXl}>{courseData.title}</h1>
        <div className={utilStyles.lightText}>
          <h2>{courseData.address}</h2>
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
