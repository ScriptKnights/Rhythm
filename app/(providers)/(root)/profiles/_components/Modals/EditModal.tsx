'use client';

import Input from '@/components/Input';
import { Database } from '@/database.types';
import { supabase } from '@/supabase/client';
import { useModalStore } from '@/zustand/modalStore';
import { nanoid } from 'nanoid';
import { ComponentProps, useEffect, useState } from 'react';

type EditModalProps = {
  id: string;
  userUpdate: (loginUserId: string) => void;
};

function EditModal({ id, userUpdate }: EditModalProps) {
  // table에 들어있는 정보 가져오기, 지정하기
  const [userName, setUserName] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState<File | null>(null);

  const closeModal = useModalStore((state) => state.closeModal);

  // 이미지 정보 가져오기
  const handleChangeFileInput: ComponentProps<'input'>['onChange'] = (e) => {
    const files = e.target.files;

    if (!files) return;
    if (files.length === 0) return setImage(null);

    const file = files[0];
    setImage(file);
  };

  // 글 수정하기
  const handleSubmitModifyDeal = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    if (!image) return alert('이미지를 업로드해주세요!');
    if (!userName) return alert('유저 이름을 작성해주세요!');
    if (!content) return alert('소개글 내용을 작성해주세요!');

    const uploadImage = await supabase.storage
      .from('img')
      .upload(nanoid(), image, { upsert: true });

    const imageUrl = uploadImage.data?.fullPath;

    const data: Database['public']['Tables']['users']['Update'] = {
      userName,
      content,
      imgUrl: imageUrl,
    };

    const response = await supabase.from('users').update(data).eq('id', id);

    if (response.error) {
      return alert('프로필 수정에 실패했습니다!...');
    } else {
      alert('프로필 수정에 성공했습니다!');
      closeModal();
      userUpdate(id);
    }
  };

  useEffect(() => {
    (async () => {
      const response = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();

      if (response.data) {
        setUserName(response.data.userName);
        setContent(String(response.data.content));
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
