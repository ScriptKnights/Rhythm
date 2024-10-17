"use client";

import OptionModal from "@/app/(providers)/_components/OptionModal";
import { useModalStore } from "@/zustand/modalStore";
import React from "react";
import { SlOptions } from "react-icons/sl";

function OptionButton() {
  const openModal = useModalStore((state) => state.openModal);
  const handleClickOption = () => {
    openModal({ element: <OptionModal />, backdrop: false });
  };
  return (
    <button
      onClick={handleClickOption}
      className="text-gray-400 py-2 text-4xl transition-all duration-75 hover:text-white"
    >
      <SlOptions />
    </button>
  );
}

export default OptionButton;