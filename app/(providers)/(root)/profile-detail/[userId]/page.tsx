"use client";

import { api } from "@/api/spotifyApi";
import Button from "@/components/Button";
import { Database } from "@/database.types";
import { baseURL, User } from "@/schema/type";
import { supabase } from "@/supabase/client";
import { useFollowStore } from "@/zustand/followStore";
import { useEffect, useState } from "react";
import Page from "../../_components/Page/Page";
import EditModal from "../_components/Modals/EditModal";
import FollowModal from "../_components/Modals/FollowModal";

interface ProfileDetailPageProps {
  params: {
    userId: string;
  };
}

function ProfileDetailPage(props: ProfileDetailPageProps) {
  // 유저 정보
  const profileId = props.params.userId;
  const [user, setUser] = useState<User | null>(null);

  // 수정, 팔로우 모달 상태 State
  const [isEditModal, setIsEditModal] = useState(false);
  const [isFollowModal, setIsFollowModal] = useState(false);
  const [modalType, setModalType] = useState<"followers" | "following" | null>(
    null
  );

  // 로그인 상태에 따라 보여주는 버튼의 State
  const [isButtonVisibility, setIsButtonVisibility] = useState(false);

  // 팔로워, 팔로잉 수
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  // 팔로우 상태관리 (zustand)
  const isFollowing = useFollowStore((state) => state.isFollowing);
  const follow = useFollowStore((state) => state.follow);
  const unFollow = useFollowStore((state) => state.unFollow);

  // 모달 관련 핸들러
  const handleClickToggleEditModal = () => {
    setIsEditModal((prev) => !prev);
    userUpdate();
  };

  const handleClickToggleFollowModal = (type: "followers" | "following") => {
    setModalType(type); // 클릭한 버튼에 따라 모달 타입 설정
    setIsFollowModal((prev) => !prev);
  };

  // 팔로워, 팔로잉 수 가져오는 함수
  const updateFollowCounts = async () => {
    // 팔로워 수 가져오기
    const { data: followers } = await supabase
      .from("follow")
      .select("*")
      .eq("following", profileId);
    setFollowerCount(followers ? followers.length : 0);

    // 팔로잉 수 가져오기
    const { data: following } = await supabase
      .from("follow")
      .select("*")
      .eq("follower", profileId);
    setFollowingCount(following ? following.length : 0);
  };

  // 팔로우, 언팔로우 버튼 핸들러
  const handleClickToggleFollowButton = async () => {
    const user = await api.getUser.getUser();
    if (!user) return;

    const follower = user.id;
    const following = profileId;

    if (!isFollowing) {
      if (follower === following)
        return alert("자기 자신을 팔로우 할 수 없습니다");

      const data: Database["public"]["Tables"]["follow"]["Insert"] = {
        follower,
        following,
      };

      const response = await supabase.from("follow").insert(data);

      follow();
      alert("사용자를 팔로우 하셨습니다.");
    } else {
      const response = await supabase
        .from("follow")
        .delete()
        .eq("follower", follower)
        .eq("following", following);

      unFollow();
      alert("사용자를 언팔로우 하셨습니다");
    }

    // 팔로우,언팔로우 이후 업데이트
    updateFollowCounts();
  };

  // 유저 정보 리렌더링 (useEffect)
  const userUpdate = async (loginUserId: string) => {
    // 유저 정보 가져오기
    const response = await supabase
      .from("users")
      .select("*")
      .eq("id", profileId)
      .single();
    setUser(response.data);

    setIsButtonVisibility(loginUserId === profileId);

    // 팔로워, 팔로잉 수 업데이트
    updateFollowCounts();
  };

  // 팔로우 상태 확인 (useEffect)
  const checkIfFollowing = async (loginUserId: string) => {
    if (!loginUserId) return;

    // 현재 로그인한 사람의 id
    const follower = loginUserId;

    // 현재 프로필 페이지의 id
    const following = profileId;

    // 팔로우 상태 지정
    const { data } = await supabase
      .from("follow")
      .select("*")
      .eq("follower", follower)
      .eq("following", following);

    if (data && data.length > 0) {
      follow();
    } else {
      unFollow();
    }
  };

  // 유저 정보, 팔로워 ,팔로잉 수 가져오기, 팔로우 상태 확인 실행
  useEffect(() => {
    const fetchData = async () => {
      const user = await api.getUser.getUser();
      const loginUserId = user?.id;

      if (!loginUserId) return;

      await userUpdate(loginUserId);
      await checkIfFollowing(loginUserId);
    };

    fetchData();
  }, [profileId]);

  return (
    <Page>
      {isEditModal && (
        <EditModal
          id={profileId}
          modal={isEditModal}
          onClose={handleClickToggleEditModal}
        />
      )}

      {isFollowModal && (
        <FollowModal
          onClose={() => {
            handleClickToggleFollowModal(
              modalType === "followers" ? "followers" : "following"
            );
          }}
          userId={profileId}
          modalType={modalType!}
        />
      )}
      <div className="grid grid-cols-5 gap-x-10 place-items-center border-b border-white/20 pb-16 mb-10">
        <div className="h-[162px] rounded-full aspect-square bg-white opacity-90 overflow-hidden">
          <img
            src={baseURL + user?.imgUrl}
            alt="프로필 이미지"
            className="z-50 aspect-square"
          />
        </div>
        <div className="flex flex-col gap-y-2 w-full h-full col-span-2 relative">
          <span>userName: {user?.userName}</span>
          <span className="absolute top-8">내 소개: {user?.content}</span>
          <span className="bg-white/20 w-full h-full"></span>
        </div>
        <div className="w-full h-full flex flex-col-reverse items-center gap-y-8 col-span-2">
          {isButtonVisibility && (
            <Button
              className="w-full text-center"
              onClick={handleClickToggleEditModal}
            >
              수정하기
            </Button>
          )}

          {isButtonVisibility ? null : (
            <Button
              className="w-full text-center"
              onClick={handleClickToggleFollowButton}
            >
              {isFollowing ? "언팔로우" : "팔로우"}
            </Button>
          )}

          <div className="flex gap-x-5 w-full">
            <Button
              className="flex flex-col w-full items-center py-4"
              onClick={() => handleClickToggleFollowModal("followers")}
            >
              <span>{followerCount}명</span>
              <span>팔로워</span>
            </Button>
            <Button
              className="flex flex-col w-full items-center py-4"
              onClick={() => handleClickToggleFollowModal("following")}
            >
              <span>{followingCount}명</span>
              <span>팔로잉</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-y-4">
        <span>나의 플레이리스트</span>
        <div>{/* <PlayLists playListsId={playListsId} /> */}</div>
        <span>좋아요 한 플레이리스트</span>
        <div>{/* <PlayLists likedPlayListsId={likedPlayListsId} /> */}</div>
      </div>
    </Page>
  );
}

export default ProfileDetailPage;
