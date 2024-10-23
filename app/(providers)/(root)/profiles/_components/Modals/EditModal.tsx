'use client';

import { supabaseProfile } from '@/api/supabaseProfile';
import Input from '@/components/Input';
import { Database } from '@/database.types';
import { supabase } from '@/supabase/client';
import { useAuthStore } from '@/zustand/authStore';
import { useModalStore } from '@/zustand/modalStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { nanoid } from 'nanoid';
import { ComponentProps, useEffect, useState } from 'react';

type EditModalProps = {
  id: string;
};

function EditModal({ id }: EditModalProps) {
  // table에 들어있는 정보 가져오기, 지정하기
  const [userName, setUserName] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [previewProfile, setPreviewProfile] = useState<string | null>('');

  const queryClient = useQueryClient();

  // 현재 유저 정보
  const currentUser = useAuthStore((state) => state.currentUser);
  const setCurrentUser = useAuthStore((state) => state.setCurrentUser);
  const profileId = currentUser?.id;

  // 모달 닫기
  const closeModal = useModalStore((state) => state.closeModal);

  // 이미지 정보 가져오기
  const handleChangeFileInput: ComponentProps<'input'>['onChange'] = (e) => {
    const files = e.target.files;

    if (!files) return;
    if (files.length === 0) return setImage(null);

    const file = files[0];

    const previewProfile = URL.createObjectURL(file); // 첫 번째 파일로 URL 생성
    setImage(file); // 파일 상태 저장
    setPreviewProfile(previewProfile); // 미리보기 URL 저장
  };

  // 글 수정하기
  const { mutate: handleSubmitModifyDeal } = useMutation({
    mutationFn: async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (image) {
        const uploadImage = await supabase.storage
          .from('img')
          .upload(nanoid(), image, { upsert: true });

        const imageUrl = uploadImage.data?.fullPath;

        const data: Database['public']['Tables']['users']['Update'] = {
          userName,
          content: String(content),
          imgUrl: String(imageUrl),
        };

        const response = await supabaseProfile.updateProfile(data, id);
        setCurrentUser(data);

        if (response.error) {
          return alert('프로필 수정에 실패했습니다!...');
        } else {
          alert('프로필 수정에 성공했습니다!');
          closeModal();
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', profileId] });
    },
  });

  // 현재 프로필의 정보 가져오기
  useEffect(() => {
    (async () => {
      const response = await supabaseProfile.getProfile(id);

      if (response) {
        setUserName(response.userName);
        setContent(String(response.content));
      }
    })();
  }, [id]);

  return (
    <div
      className="absolute top-[50%] left-[50%] w-[500px] h-[530px] bg-[#121212] -translate-x-[50%] -translate-y-[50%] rounded-2xl text-white"
      onClick={(e) => e.stopPropagation()}
    >
      <h2 className="text-center mt-10 font-semibold text-3xl mb-4">
        프로필 수정
      </h2>
      <form
        className="flex items-center justify-center flex-col gap-y-3"
        onSubmit={handleSubmitModifyDeal}
      >
        <div className="flex flex-col w-2/3 text-center gap-y-3">
          <input
            className="w-0 h-0 p-0 overflow-hidden border border-0 absolute"
            type="file"
            id="profileImg"
            onChange={handleChangeFileInput}
          />
          <label htmlFor="profileImg">
            <span className="pb-1 border-b cursor-pointer font-bold">
              사진 변경
            </span>
          </label>
          <Input value={image?.name} disabled />
        </div>

        <label htmlFor="userName">유저 이름</label>
        <Input
          className="w-2/3"
          size={'large'}
          padding={'md'}
          id="userName"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />

        <label htmlFor="content">소개글</label>
        <Input
          className="w-2/3"
          size={'large'}
          padding={'md'}
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <button className="border border-white bg-[#121212] text-white w-[400px] h-[60px] mt-5 hover:-translate-y-2 transition-all">
          정보 수정하기
        </button>
      </form>
    </div>
  );
}

export default EditModal;
