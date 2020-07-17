import React from 'react';
import ReactPlayer from 'react-player/lazy';
import Head from 'next/head';
import Layout from '../../components/layout';
import Date from '../../components/date';
import utilStyles from '../../styles/utils.module.css';
import { getAllCourseIds, getCourseData } from '../../lib/courses';

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

export default function Courses({ courseData }) {
  return (
    <Layout>
      <Head>
        <title>{courseData.title}</title>
      </Head>
      <article>
        <h1 className={utilStyles.headingXl}>{courseData.title}</h1>
        <div className={utilStyles.lightText}>
          <Date dateString={courseData.date} />
        </div>
        <iframe src={courseData.hole1} width='100%' height='480'></iframe>
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
