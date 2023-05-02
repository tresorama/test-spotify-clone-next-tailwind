import React from 'react';
import { useRecoilState } from 'recoil';
import { signOut, useSession } from 'next-auth/react';
import { HomeIcon, MagnifyingGlassIcon, BuildingLibraryIcon, HeartIcon, PlusCircleIcon, RssIcon } from '@heroicons/react/24/outline';
import cx from 'classnames';
import { selectedPlaylistIdAtom } from '@/data/playlists.atom';
import { useUserPlaylists } from '@/data/spotify.react-hooks';

const LoggedStatus = () => {
  const session = useSession();
  const isLoggedIn = session.status === 'authenticated';
  const handleLogout = signOut;

  return (
    <div>
      <p>You are {isLoggedIn ? '' : 'NOT'} logged</p>
      {isLoggedIn && <button onClick={handleLogout}>Logout</button>}
    </div>
  );
};

export const Sidebar = () => {
  const playlists = useUserPlaylists();
  const [selectedPlaylistId, setSelectedPlaylistId] = useRecoilState(selectedPlaylistIdAtom);
  console.log({ playlists });

  return (
    <div className={cx(
      "hidden md:block",
      'h-screen overflow-y-auto scrollbar-hide max-w-[29vw] p-5 text-xs lg:text-sm text-gray-500 border-r border-gray-900',
      //"relative before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:from-80% before:to-black"
    )}>
      <div className="space-y-2">

        {/* ONE */}
        <LoggedStatus />
        <button className='flex items-center gap-2 text-gray-500 hover:text-gray-50'>
          <HomeIcon className='h-5 w-5' />
          <p>Home</p>
        </button>
        <button className='flex items-center gap-2 text-gray-500 hover:text-gray-50'>
          <MagnifyingGlassIcon className='h-5 w-5' />
          <p>Search</p>
        </button>
        <button className='flex items-center gap-2 text-gray-500 hover:text-gray-50'>
          <BuildingLibraryIcon className='h-5 w-5' />
          <p>Your Library</p>
        </button>
        <hr className='border-t[0.1px] border-gray-900' />

        {/* TWO */}
        <button className='flex items-center gap-2 text-gray-500 hover:text-gray-50'>
          <PlusCircleIcon className='h-5 w-5' />
          <p>Create Playlist</p>
        </button>
        <button className='flex items-center gap-2 text-gray-500 hover:text-gray-50'>
          <HeartIcon className='h-5 w-5' />
          <p>Songs you like</p>
        </button>
        <button className='flex items-center gap-2 text-gray-500 hover:text-gray-50'>
          <RssIcon className='h-5 w-5' />
          <p>Your Episodes</p>
        </button>
        <hr className='border-t[0.1px] border-gray-900' />

        {/* Playlists */}
        {playlists.map((playlist, i) => (
          <p
            key={playlist.id}
            onClick={() => setSelectedPlaylistId(playlist.id)}
            className={cx(
              "hover:text-white cursor-pointer", {
              "text-white": selectedPlaylistId === playlist.id,
            })}
          >{playlist.name}</p>
        ))}
      </div>
    </div>
  );
};
