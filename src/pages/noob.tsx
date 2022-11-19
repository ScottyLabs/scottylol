import { GetServerSideProps } from 'next';
import { isValidUrl, readCommands } from '../lib';

export default function NoobPage() {
  return null;
}

export const getServerSideProps: GetServerSideProps<{}> = async (ctx) => {
  const { mapping } = readCommands();
  const { url } = ctx.req;
  if (typeof url !== 'string') return { notFound: true };
  const q = url.replace(/^[^_]*=/, '').replaceAll('=', '');
  const match = q.match(/^(\S*)(?:\s(.*))?$/);
  if (match === null) return { notFound: true };
  const token = match[1].toLowerCase();
  const query = encodeURIComponent(match[2]);
  const config = mapping[token];
  const home = config?.home;
  const searchUrl = config?.searchUrl;
  const target =
    searchUrl === undefined || query === undefined ? home : searchUrl + query;
  if (isValidUrl(target))
    return { redirect: { destination: target, permanent: true } };
  return {
    redirect: {
      destination: `https://google.com/search?q=${encodeURIComponent(q)}`,
      permanent: false
    }
  };
};
