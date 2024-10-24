'use client';
import { Track } from '@/schema/type';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';

interface ChartListProps {
  artists: Track[];
  title: string;
}

function ArtistsLayout({ artists, title }: ChartListProps) {
  return (
    <div className="[&+&]:mt-10 relative max-w-full">
      <h3 className="text-2xl font-bold mb-6">{title}</h3>
      {artists.length > 0 ? (
        <Swiper
          spaceBetween={10}
          slidesPerView={7}
          loop={false}
          className="overflow-hidden"
        >
          <ul className="flex gap-x-4 overflow-auto scrollbar-hide max-w-full">
            {artists.map((artist) => (
              <SwiperSlide key={artist.id}>
                <Link href={`/artist/${artist.id}`}>
                  {artist.images.length === 0 ? (
                    <div className="rounded-full overflow-hidden w-full aspect-square"></div>
                  ) : (
                    <div className="rounded-full overflow-hidden w-full aspect-square bg-red-500">
                      <img
                        src={artist.images[1].url}
                        className="object-cover"
                        alt="아티스트 이미지"
                      />
                    </div>
                  )}

                  <p className="text-xl font-semibold line-clamp-1">
                    {artist.name}
                  </p>
                </Link>
              </SwiperSlide>
            ))}
          </ul>
        </Swiper>
      ) : (
        <>검색 결과가 존재하지 않습니다</>
      )}
    </div>
  );
}

export default ArtistsLayout;
