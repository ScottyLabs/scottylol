import { GetStaticProps } from 'next';
import React from 'react';

import { CommandHelpInfo, readCommands } from '../lib';

type Props = {
	helpInfo: CommandHelpInfo[];
};

const HelpPage: React.FC<Props> = ({ helpInfo }) => (
	<div>
		<div className="container px-20 py-10 text-white mx-auto">
			<h1 className="text-white text-5xl font-inconsolata">
				scotty.lol command info
			</h1>
			<h4 className="text-xl font-bold my-4">
				Want to set up scotty.lol as your default search engine? Check out our{' '}
				<a
					className="text-blue-600 underline"
					href="https://github.com/ScottyLabs/scottylol#readme"
					target="_blank"
					rel="noreferrer"
				>
					README
				</a>
				!
				<br />
				<br />
				Want a new command to be added? Open an{' '}
				<a
					className="text-blue-600 underline"
					href="https://github.com/ScottyLabs/scottylol/issues/new?assignees=&labels=enhancement&template=feature-request.yml&title=%5BFeature%5D+Add+scottylol+macro:+"
					target="_blank"
					rel="noreferrer"
				>
					issue
				</a>
				!
			</h4>
			<div>
				<table className="rounded-md outline outline-1 outline-black border-black">
					<thead>
						<tr className="align-top text-left">
							<th className="p-3">Name</th>
							<th className="p-3">Description</th>
							<th className="p-3">Matches</th>
							<th className="p-3">Examples</th>
						</tr>
					</thead>
					<tbody>
						{helpInfo.map((help, index) => (
							<tr
								key={index}
								className="odd:bg-zinc-700 border-y border-y-zinc-600 align-top text-left"
							>
								<td className="p-3">{help.name}</td>
								<td className="p-3">{help.description}</td>
								<td>
									<ul className="m-3 bg-white rounded-lg text-black overflow-hidden">
										{help.matches.map((match, index) => (
											<a
												className="block p-2 border hover:backdrop-brightness-95"
												key={index}
												href={`/search?q=${match}`}
												target="_blank"
												rel="noreferrer"
											>
												{match}
											</a>
										))}
									</ul>
								</td>
								<td>
									<ul className="m-3 bg-white rounded-lg text-black overflow-hidden">
										{help.examples.map((example, index) => (
											<a
												className="block p-2 border hover:backdrop-brightness-95"
												key={index}
												href={`/search?q=${example.uriCommand}`}
												target="_blank"
												rel="noreferrer"
											>
												{example.command}
											</a>
										))}
									</ul>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	</div>
);

export const getStaticProps: GetStaticProps<Props> = async () => {
	const { helpInfo } = readCommands();
	return { props: { helpInfo } };
};

export default HelpPage;
