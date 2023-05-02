import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRecoilState } from "recoil";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import shuffle from 'lodash/shuffle';
import { selectedPlaylistIdAtom } from "@/data/playlists.atom";
import { playStateAtom, playingTrackIdAtom } from "@/data/song.atom";
import { usePlaylist } from "@/data/spotify.react-hooks";
import cx from 'classnames';

const formatDuration = (timeInMs: number) => {
  // timeInMs = 167066
  const timeInSeconds = timeInMs / 1000;// 167.066
  const timeInMinutes = timeInSeconds / 60;// 2.78
  const fullMinutes = Math.floor(timeInMinutes);// 2
  let partialMinute = (timeInSeconds % 60).toFixed(0);// 47
  if (partialMinute.length === 1) partialMinute = "0" + partialMinute;// 9 -> 09
  return fullMinutes + ":" + partialMinute;// 2:47
};

const headerColors = [
  "from-indigo-500",
  "from-blue-500",
  "from-green-500",
  "from-red-500",
  "from-yellow-500",
  "from-pink-500",
  "from-purple-500",
];


export const MainContent = () => {
  const session = useSession();
  const [selectedPlaylistId] = useRecoilState(selectedPlaylistIdAtom);
  const { playlist } = usePlaylist(selectedPlaylistId);
  const [headerColor, setHeaderColor] = useState(headerColors[0]);
  useEffect(
    () => setHeaderColor(shuffle(headerColors)[0]),
    [selectedPlaylistId]
  );

  return (
    <div className="flex-grow relative text-white overflow-y-auto h-full">

      <header className="absolute top-4 right-4">
        <div className="flex items-center gap-2 bg-black rounded-full p-1 opacity-90 hover:opacity-80 cursor-pointer">
          <img src={session.data?.user?.image ?? ''} alt="" className="h-10 w-10 rounded-full" />
          <h2>{session.data?.user?.name}</h2>
          <ChevronDownIcon className="w-5 h-5" />
        </div>
      </header>

      <section className={`h-80 flex items-end gap-7 bg-gradient-to-b ${headerColor} to-black p-8`}>
        <img
          className="w-44 h-44 shadow-2xl"
          src={playlist?.images?.[0].url}
        />
        <div>
          <p className="uppercase">Playlist</p>
          <h2 className="text-2xl md:text-3xl xl:text-5xl font-bold">{playlist?.name}</h2>
        </div>
      </section>
      <section className={`p-8`}>
        <div className="">
          {playlist?.tracks?.items.filter(t => t.track).map(({ track }, index) => (
            <Track
              key={track?.id}
              track={track as SpotifyApi.TrackObjectFull}
              trackNumber={index + 1}
            />
          ))}
          {/* <div className="whitespace-pre">
            {JSON.stringify({ playlist }, null, 2)}
          </div> */}
        </div>
      </section>
    </div>
  );
};

const Track = ({
  track,
  trackNumber,
}: {
  track: SpotifyApi.TrackObjectFull,
  trackNumber: number,
}) => {
  const [playingTrackId, setPlayingTrackId] = useRecoilState(playingTrackIdAtom);
  const [playState, setPlayState] = useRecoilState(playStateAtom);
  const handleTrackClick = () => {
    setPlayingTrackId({
      id: track.id,
      uri: track.uri,
    });
    setPlayState('playing');
  };
  const isPlayingTrack = playingTrackId?.id === track.id;

  return (
    <div
      onClick={handleTrackClick}
      className="py-2 px-5 grid grid-cols-12 gap-4 items-center rounded hover:bg-gray-900 text-lg text-gray-500"
    >
      <div className="col-[1/6] flex items-center gap-6">
        <span className={cx({
          "text-white": !isPlayingTrack,
          "text-green-500": isPlayingTrack,
        })}>{trackNumber}</span>
        <img className="w-10 h-10" src={track.album.images[2]?.url} alt="" />
        <div>
          <p className={cx(
            "truncate", {
            "text-white": !isPlayingTrack,
            "text-green-500": isPlayingTrack,
          })}>{track.name}</p>
          <p>{track.artists.map(a => a.name).join(', ')}</p>
        </div>
      </div>
      <div className="col-[6/9]">
        <p className="truncate">{track.album.name}</p>
      </div>
      <div className="col-[9/-1]">
        <p>{formatDuration(track.duration_ms)}</p>
      </div>
    </div>
  );
};