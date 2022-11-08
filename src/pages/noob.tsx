import { GetServerSideProps } from 'next';
import { isValidUrl, readCommands } from '../lib';

interface Props {
  query: string;
  currSearch: string;
}

export default function SearchPage() {
  return null;
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
  const target =
    searchUrl === undefined || query === undefined ? home : searchUrl + query;
  if (isValidUrl(target))
    return { redirect: { destination: target, permanent: true } };
  return {
    redirect: {
      destination: `https://google.com/search?q=${q}`,
      permanent: false
    }
  };
};
