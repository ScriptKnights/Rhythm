import axios from 'axios';

const SPOTIFY_AUTHORIZE_URL = 'https://accounts.spotify.com/authorize';
const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token';
const scopes =
  'playlist-modify-private playlist-modify-public streaming user-read-playback-state user-modify-playback-state user-read-currently-playing';
const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID!;
const clientSecret = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET!;
const redirectUri = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI!;

/**
 * spotify에 동의를 구하는 url(spotify 계정으로 로그인 할 시 뜨는 동의 창 url)
 * @returns
 */
export const getAuthorizeUrl = () => {
  return `${SPOTIFY_AUTHORIZE_URL}?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(
    redirectUri,
  )}&scope=${encodeURIComponent(scopes)}`;
};

/**
 * 그냥 getAccessToken하는 것 (이게 있어야 spotify로 로그인 하지 않은 유저들도 페이지의 기능들을 조금 이용할 수 있음(검색 노래 찾기))
 * @returns
 */
export const getAccessToken = async () => {
  const response = await axios.post(
    SPOTIFY_TOKEN_URL,
    new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
    }).toString(),

    {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    },
  );

  const { access_token } = response.data;
  return access_token;
};

/**
 * spotify로 로그인한 유저의 accessToken을 가져오는 것 (이걸 해줘야 노래를 재생하거나 플레이 리스트를 만들 수 있음, code에 id를 넣어줘야함)
 * @param code
 * @returns
 */
export const getAuthAccessToken = async (code: string) => {
  try {
    const response = await axios.post(
      SPOTIFY_TOKEN_URL,
      new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
        client_id: clientId,
        client_secret: clientSecret,
      }).toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );

    const { access_token } = response.data;
    return access_token;
  } catch (error) {
    console.error('Access Token 요청 중 오류 발생:', error);
    throw new Error('Access Token을 가져오는 데 실패했습니다.');
  }
};

// accessToken이 만료되었을때 다시 accessToken을 불러오는 것
export const getRefreshToken = async () => {
  const refreshToken = localStorage.getItem('refresh_token');
  try {
    const response = await axios.post(
      SPOTIFY_TOKEN_URL,
      new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken!,
        client_id: clientId,
        client_secret: clientSecret,
      }).toString(),
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      },
    );

    const { access_token, refresh_token: newRefreshToken } = response.data;
    localStorage.setItem('access_token', access_token);

    if (newRefreshToken) {
      localStorage.setItem('refresh_token', newRefreshToken);
    }

    return access_token;
  } catch (error) {
    console.error('Refresh token을 가져오는 중 오류 발생:', error);
    throw new Error('Refresh token을 가져오는 데 실패했습니다.');
  }
};
