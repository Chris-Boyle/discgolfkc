import Head from 'next/head';
import styles from './layout.module.css';
import utilStyles from '../styles/utils.module.css';
import Link from 'next/link';
import NavBar from './navbar';

const name = 'Disc Golf KC';
export const siteTitle = 'Disc Golf KC';

const APIKey = process.env.GOOGLE_MAPS_API_KEY;
const googleAPIURL = `https://maps.googleapis.com/maps/api/js?key=${APIKey}&libraries=drawing,geometry`;

export default function Layout({ children, home }) {
  return (
    <>
      <NavBar />
      <div className={styles.container}>
        <Head>
          <script type='text/javascript' src={googleAPIURL} />
          <link rel='icon' href='/images/8-frisbees.jpg' />
          <meta name='description' />
          <meta
            property='og:image'
            content={`https://og-image.now.sh/${encodeURI(
              siteTitle
            )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
          />
          <meta name='og:title' content={siteTitle} />
          <meta name='twitter:card' content='summary_large_image' />
        </Head>
        <header className={styles.header}>
          {home ? (
            <>
              <img
                src='/images/8-frisbees.jpg'
                className={`${styles.headerHomeImage} ${utilStyles.borderCircle}`}
                alt={name}
              />
              <h1 className={utilStyles.heading2Xl}>{name}</h1>
            </>
          ) : (
            <>
              <Link href='/'>
                <a>
                  <img
                    src='/images/8-frisbees.jpg'
                    className={`${styles.headerImage} ${utilStyles.borderCircle}`}
                    alt={name}
                  />
                </a>
              </Link>
              <h2 className={utilStyles.headingLg}>
                <Link href='/'>
                  <a className={utilStyles.colorInherit}>{name}</a>
                </Link>
              </h2>
            </>
          )}
        </header>
        <main>{children}</main>
        {!home && (
          <div className={styles.backToHome}>
            <Link href='/'>
              <a>← Back to home</a>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
