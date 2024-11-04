# 🎧 음악 재생 및 음악 취향 공유 서비스앱 RHYTHM

![서비스 이미지](https://github.com/ScriptKnights/Rhythm/blob/develop/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202024-11-01%20%E1%84%8B%E1%85%A9%E1%84%8C%E1%85%A5%E1%86%AB%2010.31.40.png)

- 배포 URL: https://rhythm-wheat.vercel.app/

> 테스트용 계정
 >> 테스트 ID: aa@gmail.com
 >> <br>
 >> 테스트 PW: qqwwee11
> > <br>
>> ⚠️ 프리미엄 계정은 개인의 스포티파이 프리미엄 계정 필요

<br>

## ℹ️ 프로젝트 소개
1. RHYTHM 자신의 음악 취향을 공유함과 동시에 남들의 음악 취향을 볼 수 있고 서로 공유 할 수 있도록 만든사이트 입니다.
2. 개인의 프로필 페이지에 자신이 좋아요 누른 트랙, 자신이 작성한 글, 개인이 만든 플레이 리스트를 볼 수 있습니다.
3. 투데이 페이지를 통해 다른 유저의 프로필을 구경함으로써 개개인의 음악적 취향을 볼 수 있습니다.
4. userRhythm의 각 카테고리 페이지마다 유저들이 만들어둔 작성글들을 구경 할 수 있습니다.

## 🔥 핵심 기능
1. spotifyApi를 활용해 노래 재생 기능, 노래 검색 기능, 플레이 리스트를 만드는 기능, 트랙 넘기는 기능, 반복 기능
2. geniusApi를 활용해 노래를 검색해 해당 트랙 정보 페이지와 가사 모달에서 가사를 추출 해오는 기능
3. supabase를 활용해 로그인 및 회원가입 로그아웃 기능, 서버와 통신 후 노래 좋아요 및 취소 기능, 사용자들이 글을 작성하고 작성한 글을 투데이 페이지에서 보여주는 기능
4. supabase 로그인과 spotify 로그인을 구별하여 기능을 제한하는 기능
5. 모달 사용(가사 보여주기, 로그인 하기, 옵션 넣기 등)

## 💻 개발 기간
- 2024/10/10 ~ 2024/11/1

## 👤 개발자 소개

<div align="center">

김서진 | 신우진 | 이강희 | 신현성 
--- | --- | --- | --- |
| [<img src="https://avatars.githubusercontent.com/u/183989838?v=4 " height=150 width=150> <br/> @Mye247](https://github.com/Mye247) | [<img src="https://avatars.githubusercontent.com/u/184204580?v=4" height=150 width=150> <br/> @sinwoojin](https://github.com/sinwoojin) | [<img src="https://avatars.githubusercontent.com/u/178550762?v=4" height=150 width=150> <br/> @lgheae1125](https://github.com/lgheae1125) | [<img src="https://avatars.githubusercontent.com/u/175573383?v=4" height=150 width=150> <br/> @shinhs626](https://github.com/shinhs626) |

</div>

<br>

## 🧑‍💻 맏은 역할

- 김서진: 사용자 개개인의 프로필 페이지 만들기, 유저 팔로우 & 언팔로우 기능, 유저가 좋아요 누른 노래 혹은 해당 유저가 만든 플레이리스트를 볼 수 있는 기능, 프로필 정보 수정 기능을 담당함
- 신우진: geniusApi를 활용해 가사 불러오기, 로그인(모달) & 회원가입 페이지 만들기, 사이드바의 프로필을 컴포넌트화 하고 로그인 전과 후 디자인을 분리함
- 신현성: spotify api를 사용해서 현재 사용자의 플레이 리스트 만들기, 검색 기능, 각종 노래, 앨범 ,플레이 리스트의 디테일 페이지를 담당
- 이강희: 페이지 레이아웃 및 ui 제작을 담당함, spotify API로 볼륨 기능 제작 담당

## 🛠️ 개발 환경
- Front : React, zustnad, nextJs, typeScript, dayJs, framer-motion 등 각종 프레임 워크 및 라이브러리
- BaaS : supabase, nextJs 내부 기능 활용
- Api : spotifyApi, geniusApi
- 버전 및 이슈관리 : Github, Github Issues, Github Project
- 협업 툴 : Discord, Slack
