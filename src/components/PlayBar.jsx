import { useRecoilState } from "recoil";
import { playStateAtom, playingTrackIdAtom } from "@/data/song.atom";
import { PlayIcon, PauseIcon } from '@heroicons/react/24/solid';
import { useEffect } from "react";
import { useSpotifyClient } from "../lib/spotify/spotify.helpers.react";

export const PlayBar = () => {
  const spotifyClient = useSpotifyClient();
  const [playState, setPlayState] = useRecoilState(playStateAtom);
  const [playingTrackId] = useRecoilState(playingTrackIdAtom);
  const handlePlayPauseClick = () => {
    if (playState === 'playing') setPlayState('paused');
    else if (playState === 'paused') setPlayState('playing');
  };

  // handle media play / pause when state changes
  useEffect(() => {
    (async () => {
      if (!spotifyClient) return;
      if (!playingTrackId) return;
      if (playState === 'playing') {
        const response1 = await spotifyClient.getMyDevices();
        const activeDevice = response1.body.devices.find(d => d.is_active);
        console.log({ activeDevice });
        if (!activeDevice) return;
        const response2 = await spotifyClient.play({
          // uris: [playingTrackId.uri],
          device_id: activeDevice.id,
        });
      }
    })();
  }, [playState, playingTrackId, spotifyClient]);


  return (
    <div className="h-20 bg-black text-gray-500 flex justify-center items-center">

      <div className="flex gap-4">
        <button type="button">Prev</button>
        <button type="button" onClick={handlePlayPauseClick}>
          {{
            idle: <PlayIcon className="w-10 h-10" />,
            paused: <PlayIcon className="w-10 h-10" />,
            playing: <PauseIcon className="w-10 h-10" />,
          }[playState]}
        </button>
        <button type="button">Next</button>
      </div>

    </div>
  );
};
