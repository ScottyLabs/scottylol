import { GetStaticProps } from 'next';
import { CommandHelpInfo, readCommands } from '../lib';

interface Props {
  helpInfo: CommandHelpInfo[];
}

export default function HelpPage({ helpInfo }: Props) {
  return (
    <div>
      <div className="container mx-auto px-20 py-10 text-white">
        <h1 className="font-inconsolata text-5xl text-white">
          scotty.lol command info
        </h1>
        <h4 className="my-4 text-xl font-semibold">
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
          <table className="rounded-md border-black outline outline-1 outline-black">
            <thead>
              <tr className="text-left align-top">
                <th className="p-3">Name</th>
                <th className="p-3">Description</th>
                <th className="p-3">Matches</th>
                <th className="p-3">Examples</th>
              </tr>
            </thead>
            <tbody>
              {helpInfo.map((help) => (
                <tr
                  key={help.name}
                  className="border-y border-y-zinc-600 text-left align-top odd:bg-zinc-700"
                >
                  <td className="p-3">{help.name}</td>
                  <td className="p-3">{help.description}</td>
                  <td>
                    <ul className="m-3 overflow-hidden rounded-lg bg-white text-black">
                      {help.matches.map((match) => (
                        <a
                          className="block border p-2 hover:backdrop-brightness-95"
                          key={match}
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
                    <ul className="m-3 overflow-hidden rounded-lg bg-white text-black">
                      {help.examples.map((example) => (
                        <a
                          className="block border p-2 hover:backdrop-brightness-95"
                          key={example.command}
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
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const { helpInfo } = readCommands();
  return { props: { helpInfo } };
};
