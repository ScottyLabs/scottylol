import { GetServerSideProps } from 'next';
import { isValidUrl, readCommands } from '../lib';

export default function NoobPage() {
  return null;
}

export const getServerSideProps: GetServerSideProps<{}> = async (ctx) => {
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
    searchUrl === undefined || query === undefined
      ? home
      : searchUrl + encodeURIComponent(query);
  if (isValidUrl(target))
    return { redirect: { destination: target, permanent: true } };
  return {
    redirect: {
      destination: `https://google.com/search?q=${encodeURIComponent(q)}`,
      permanent: false
    }
  };
};
