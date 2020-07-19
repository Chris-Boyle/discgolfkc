import Head from 'next/head';
import Link from 'next/link';
import ReactPlayer from 'react-player/lazy';
import Layout, { siteTitle } from '../components/layout';
import Date from '../components/date';
import utilStyles from '../styles/utils.module.css';
import { getSortedCoursesData } from '../lib/courses';

export async function getStaticProps() {
  const allCoursesData = getSortedCoursesData();
  return {
    props: {
      allCoursesData,
    },
  };
}

export default function Home({ allCoursesData }) {
  return (
    <>
      <Layout home>
        <Head>
          <title>{siteTitle}</title>
        </Head>
        <section className={utilStyles.headingMd}>
          <p>Welcome! Check out the courses and maps.</p>
        </section>
        <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
          <Link href='/courses'>
            <a className={utilStyles.headingLg}>Disc Golf Courses</a>
          </Link>
          <br />
          <h2 className={utilStyles.headingLg}>
            2019 GBO TOP SHOTS | DISC GOLF HIGHLIGHT REEL
          </h2>
          <ReactPlayer
            url='https://youtu.be/c-htzJXJnKk'
            className='react-player'
            width='100%'
            height='30rem'
            controls
          />
        </section>
      </Layout>
    </>
  );
}
