/* eslint-disable @next/next/no-img-element */
'use client';
import { api } from '@/api/spotifyApi';
import { Playlist } from '@/schema/type';
import useSpotifyStore from '@/zustand/spotifyStore';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaPlay } from 'react-icons/fa';
import { IoIosAddCircleOutline } from 'react-icons/io';
import PlaylistDetailLayout from '../../_components/Layouts/PlaylistDetailLayout/PlaylistDetailLayout';
import Page from '../../_components/Page/Page';

function PlayListDetail() {
  const { playlistId } = useParams();
  const [playlist, setPlaylist] = useState<Playlist | undefined>(undefined);

  const accessToken = useSpotifyStore((state) => state.accessToken);
  const deviceId = useSpotifyStore((state) => state.deviceId);
  const play = useSpotifyStore((state) => state.play);

  useEffect(() => {
    (async () => {
      const playlist = await api.playlist.getPlaylist(String(playlistId));
      setPlaylist(playlist);
    })();
  }, [playlistId]);

  const track = playlist?.tracks.items;

  return (
    <Page>
      <article className="py-4 border-b mb-4 border-white">
        <div className="flex gap-x-6 mb-6 h-[200px]">
          <div className="aspect-square bg-white/20 h-full">
            <img src={playlist?.images[0].url} alt="image" />
          </div>
          <div className="flex flex-col gap-y-4">
            <h2 className="text-7xl font-bold line-clamp-1">
              {playlist?.name}
            </h2>
            <div className="line-clamp-1">{playlist?.description}</div>
            <div className="flex gap-x-4">
              <button
                onClick={() =>
                  play(
                    String(playlist!.uri),
                    String(accessToken),
                    String(deviceId),
                  )
                }
                aria-label="재생"
                className="bg-red-500 py-4 pl-5 pr-3 text-white rounded-full transition-all duration-300 hover:scale-110 text-4xl"
              >
                <FaPlay />
              </button>
              <button aria-label="추가" className="text-5xl">
                <IoIosAddCircleOutline />
              </button>
            </div>
          </div>
        </div>
      </article>
      <article>
        <PlaylistDetailLayout playlistTracks={track} />
      </article>
    </Page>
  );
}

export default PlayListDetail;
