import { api } from '@/api/spotifyApi';
import Page from '../_components/Page/Page';
import MusicsLayout from '../_components/layouts/MusicsLayout/MusicsLayout';

const TOP_100_MUSIC_ID = '5ABHKGoOzxkaa28ttQV9sE';

async function TodayPage() {
  /*spotify Top 100 음악 가져오는 api */
  const response = await api.playlist.getPlaylists(TOP_100_MUSIC_ID);
  const tracks = response?.tracks.items.map((item) => item.track);

  return (
    <Page title="투데이">
      <div id="popular-music">
        <MusicsLayout title="Music-100" tracks={tracks!} />
      </div>
    </Page>
  );
}

export default TodayPage;
