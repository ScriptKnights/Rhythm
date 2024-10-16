'use client';
import { Track } from '@/schema/type';
import Link from 'next/link';
import Page from '../Page/Page';

interface ChartListProps {
  tracks: Track[];
  title: string;
}

function Musics({ tracks, title }: ChartListProps) {
  return (
    <>
      <div className="[&+&]:mt-10">
        <h3 className="text-2xl font-bold">{title}</h3>
        {tracks.length > 0 ? (
          <ul className="flex gap-x-3 overflow-auto scrollbar-hide">
            {tracks.map((track) => (
              <li key={track.id} className="flex flex-col min-w-[17%]">
                <Link href={`/music/${track.id}`}>
                  <img
                    src={track.album.images?.[0]?.url || '/default-image.jpg'}
                    alt="이미지"
                  />
                  <p className="text-xl font-semibold">{track.name}</p>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <Page>검색 결과가 존재하지 않습니다</Page>
        )}
      </div>
    </>
  );
}

export default Musics;
