import { closestMatch } from 'closest-match';
import { GetServerSideProps } from 'next';
import React from 'react';

import { isValidUrl, readCommands } from '../lib';

type Props = {
	query: string;
	currSearch: string;
};

const SearchPage: React.FC<Props> = ({ query, currSearch }) => (
	<>
		<style jsx>{`
      .notfound {
        background-image: radial-gradient(#11581e, #041607);
        text-shadow: 0 0 1ex #33ff33, 0 0 2px #ffffffcc;
      }
      .overlay {
        background: repeating-linear-gradient(
          180deg,
          rgba(0, 0, 0, 0) 0,
          rgba(0, 0, 0, 0.3) 50%,
          rgba(0, 0, 0, 0) 100%
        );
        background-size: auto 4px;
      }
    `}</style>
		<div className="notfound w-screen h-screen bg-no-repeat bg-cover font-inconsolata text-2xl text-[#80ff80cc]">
			<div className="pointer-events-none overlay absolute w-full h-full before:absolute before:block before:w-full before:h-full z-10 before:bg-no-repeat" />
			<div className='pointer-events-none absolute w-full h-full bg-[url("https://media.giphy.com/media/oEI9uBYSzLpBK/giphy.gif")] z-10 bg-no-repeat bg-cover opacity-[0.02]' />
			<div className="absolute p-16 uppercase">
				<h1 className="text-5xl my-5 font-extrabold">404 - Not Found</h1>
				<div className="m-4">
					<h1 className="text-4xl font-bold my-4">
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
	</>
);

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
	const target = searchUrl === undefined || query === undefined ? home : searchUrl + query;
	if (isValidUrl(target)) return { redirect: { destination: target, permanent: true } };

	const closest = closestMatch(token, Object.keys(mapping));
	const currQuery = match[2] ? ` ${match[2]}` : '';
	return {
		props: {
			query: `${closest}${currQuery}`,
			currSearch: q,
		},
	};
};

export default SearchPage;
