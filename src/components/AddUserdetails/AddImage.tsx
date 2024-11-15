"use client";
import React, { useState, ChangeEvent } from "react";
import { uploadImageToCloudinary, postImageUrl } from "@/services/infoServices";
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { HiOutlineChevronDoubleRight } from "react-icons/hi";
import Image from "next/image";

type Props = {};

const AddImage = (props: Props) => {
  const [imageSelected, setImageSelected] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined);
  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setImageSelected(file);
      const fileURL = URL.createObjectURL(file);
      setPreviewUrl(fileURL);
    }
  };

  const handleUpload = async () => {
    if (!imageSelected) return;

    setUploading(true);
    setError(null);

    try {
      const imageUrl = await uploadImageToCloudinary(imageSelected);

      const dbResponse = await postImageUrl(imageUrl);
    } catch (error) {
      console.error("Error handling upload: ", error);
      setError("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const pathname = usePathname()

  return (
    <>
    <div className="bg-gradient-to-b from-[#d4a4fa] to-[#6e7df0] h-[90vh] w-screen">
      <div className="flex flex-col items-center pt-[10vh]">
        <div className="text-cyan-50 text-[18px] mb-[5vh]">
          <h2>Upload Image</h2>
        </div>
        <div className="flex flex-col items-center mb-[5vh]">
          {previewUrl && (
            <Image
              src={previewUrl}
              alt="Preview"
              width={100}
              height={200}
              className="h-[30vh] w-[40vw] object-cover rounded-[0.5vh] mb-[2vh]"
            />
          )}
          <input
            type="file"
            onChange={handleChange}
            className="text-white mb-[2vh]"
          />
          <button
            className="bg-gradient-to-r from-purple-500 to-cyan-400 h-[5vh] w-[20vw] rounded-[0.5vh] text-pink-100 shadow-[2px_12px_20px_-6px_rgba(0,0,0,1)]"
            onClick={handleUpload}
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Add"}
          </button>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
        
      </div>
    </div>
    <div className="bg-[#6e7df0] h-[10vh]">
    <button className="bg-slate-800 h-[5vh] w-[18vw] ml-[70vw] rounded-[1vh] shadow-[5px_12px_15px_-6px_rgba(180,60,244,1)]">
    <Link
            className={`link ${pathname === '/hobby' ? 'active' : ''}`}
            href="/hobby"
          >
    <HiOutlineChevronDoubleRight className="size-[5vh] ml-[4vw]" color="#FB16FA"/>
    </Link>
  </button>
  </div>
  </>
  );
};

export default AddImage;
