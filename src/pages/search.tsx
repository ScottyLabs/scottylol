import { GetServerSideProps } from 'next';
import { closestMatch } from 'closest-match';
import { isValidUrl, readCommands } from '../lib';

interface Props {
  query: string;
  currSearch: string;
}

export default function SearchPage({ query, currSearch }: Props) {
  return (
    <div className="notfound h-screen w-screen bg-cover bg-no-repeat font-inconsolata text-2xl text-[#80ff80cc]">
      <div className="overlay pointer-events-none absolute z-10 h-full w-full before:absolute before:block before:h-full before:w-full before:bg-no-repeat" />
      <div className='pointer-events-none absolute z-10 h-full w-full bg-[url("https://media.giphy.com/media/oEI9uBYSzLpBK/giphy.gif")] bg-cover bg-no-repeat opacity-[0.02]' />
      <div className="absolute p-16 uppercase">
        <h1 className="my-5 text-5xl font-extrabold">404 - Not Found</h1>
        <div className="m-4">
          <h1 className="my-4 text-4xl font-bold">
            Error <span className="text-white">404</span>
          </h1>
          <p className='before:content-[">_"]'>
            We couldn&apos;t find anything for {currSearch}
          </p>
          <p className='before:content-[">_"]'>
            Did you mean{' '}
            <a
              className='text-white before:content-["["] after:content-["]"]'
              href={`/search?q=${query}`}
            >
              {query}
            </a>
            ?
          </p>
          <p className='before:content-[">_"]'>
            <a
              className='text-white before:content-["["] after:content-["]"]'
              href={`/search?q=g%20${currSearch}`}
            >
              Search Google for {currSearch}
            </a>
          </p>
          <p className='before:content-[">_"]'>Good luck.</p>
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const { mapping } = readCommands();
  const { q } = ctx.query;
  if (typeof q !== 'string') return { notFound: true };
  const match = q.match(/^(\S*)(?:\s(.*))?$/);
  if (match === null) return { notFound: true };
  const token = match[1].toLowerCase();
  const query = match[2];
  const config = mapping[token];
  const home = config?.home;
  const searchUrl = config?.searchUrl;
  const escapedQuery = config?.skipEscaping ? query : encodeURIComponent(query);
  const target =
    searchUrl === undefined || query === undefined
      ? home
      : searchUrl + escapedQuery;
  if (isValidUrl(target))
    return { redirect: { destination: target, permanent: true } };

  const closest = closestMatch(token, Object.keys(mapping));
  const currQuery = match[2] ? ` ${match[2]}` : '';
  return {
    props: {
      query: `${closest}${currQuery}`,
      currSearch: q
    }
  };
};
