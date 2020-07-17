import Head from 'next/head';
import Link from 'next/link';
import Layout, { siteTitle } from '../components/layout';
import Date from '../components/date';
import utilStyles from '../styles/utils.module.css';
import { getSortedCoursesData } from '../lib/courses';

export async function getStaticProps() {
  const allCourseData = getSortedCoursesData();
  return {
    props: {
      allCourseData,
    },
  };
}

export default function Courses({ allCourseData }) {
  return (
    <>
      <Layout home>
        <Head>
          <title>{siteTitle}</title>
        </Head>
        <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
          <h2 className={utilStyles.headingLg}>Disc Golf Courses</h2>
          <ul className={utilStyles.list}>
            {allCourseData.map(({ id, date, title }) => (
              <li className={utilStyles.listItem} key={id}>
                <Link href='/courses/[id]' as={`/courses/${id}`}>
                  <a>{title}</a>
                </Link>
                <br />
                <small className={utilStyles.lightText}>
                  <Date dateString={date} />
                </small>
              </li>
            ))}
          </ul>
        </section>
      </Layout>
    </>
  );
}
