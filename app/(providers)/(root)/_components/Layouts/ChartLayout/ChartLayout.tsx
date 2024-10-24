import { Track } from '@/schema/type';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
interface ChartProps {
  tracks: Track[];
  title: string;
}
function ChartLayout({ title, tracks }: ChartProps) {
  return (
    <div className="[&+&]:mt-16 py-6 px-6">
      <h2 className="font-bold text-2xl mb-6">{title}</h2>
      <Swiper
        spaceBetween={10}
        slidesPerView={7}
        loop={false}
        className="overflow-hidden"
      >
        <ul className="grid grid-rows-3 gap-x-5 grid-flow-col gap-y-4 overflow-x-auto scrollbar-hide w-full">
          {tracks.map((track, idx) => (
            <SwiperSlide key={track.id}>
              <Link
                href={`/music/${track.id}`}
                className="w-full h-[50px] mr-5 flex gap-x-5"
              >
                <div className="h-full aspect-square bg-white">
                  <img
                    src={track.album.images[0]?.url}
                    alt={track.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="h-full">
                  <p className="font-bold">{idx + 1}</p>
                </div>
                <div className="w-full flex flex-col gap-y-[2px]">
                  <p className="font-bold line-clamp-1">{track.name}</p>
                  <p className="text-sm text-white/50 line-clamp-1">
                    {track.artists[0]?.name}
                  </p>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </ul>
      </Swiper>
    </div>
  );
}
export default ChartLayout;
