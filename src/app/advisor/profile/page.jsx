"use client";
import Toggle from "@/app/components/ui/ToggleButton";
import React, { useState } from "react";
import { CgGirl } from "react-icons/cg";
import { CiGlobe } from "react-icons/ci";
import { FaCamera, FaFile, FaFolder, FaLightbulb, FaLock, FaPen, FaTrophy, FaUser } from "react-icons/fa";
import { FaTriangleExclamation } from "react-icons/fa6";
import { FiEye } from "react-icons/fi";
import { IoIosCamera, IoMdChatboxes } from "react-icons/io";
import { IoShieldHalfOutline } from "react-icons/io5";
import { MdClose } from "react-icons/md";
import { TfiGallery } from "react-icons/tfi";

const page = () => {
  const [isUpload, setIsUpload] = useState(false);

const [isJourney, setIsJourney] = useState(false);
const [isService, setIsService] = useState(false);
const [isAchievement, setIsAchievement] = useState(false);
const [isGallery, setIsGallery] = useState(false);
const [isTestimonial, setIsTestimonial] = useState(false);
const [isProfile, setIsProfile] = useState(false);

  
  return (
    <div className="p-4 md:p-8 flex flex-col gap-4 md:gap-6">
      {/* stage-1 */}
      <div className="md:h-[212px] border flex flex-col p-4 sm:p-6 md:py-[34px] xl:pl-[30px] md:pr-[87px] gap-4 rounded-2xl bg-white shadow-sm">
        <span className="flex items-center  justify-center md:justify-start md:text-left gap-2 font-nunito text-[clamp(12px,1.5vw,16px)]">
          <IoIosCamera />
          <p className="font-semibold font-poppins">Profile Photo</p> - Last
          updated 6 months ago
        </span>
        {/* <div className="w-[883px] flex flex-col md:flex-row items-center gap-[17px]"> */}
        <div className="w-full flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-[17px]">
          {/* profile image */}
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-26 md:h-26">
            <div className="w-26 h-26 rounded-full bg-blue-200"></div>

            {/* edit icon */}
            <div className="absolute bottom-0 right-0 w-8 h-8 bg-[#0A4A4A] rounded-full flex items-center justify-center text-white shadow-md cursor-pointer">
              <FaPen size={14} />
            </div>
          </div>
          <div className="flex flex-col h-full justify-between items-center md:items-start gap-6 xl:gap-0">
            <span className="flex items-start sm:items-center text-left gap-4 py-[12px] px-[10px] xl:pl-[21px] text-amber-600 text-[clamp(10px,1vw,14px)] font-semibold leading-4 font-nunito rounded-lg border border-[#ECE4C8] bg-[#FDF9ED] shadow-none">
              <FaTriangleExclamation />
              <p className="">
                You can update your profile photo only once a year. Next update
                will be available on your birthday.
              </p>
            </span>
            <button
              className="w-full sm:w-auto px-4 h-[40px] flex py-[14px] px-[14px] gap-2 rounded-lg bg-[#0A4A4A] items-center text-[#F8F6F1] text-[clamp(8px,1vw,12px)] font-semibold leading-normal font-poppins cursor-pointer"
              onClick={() => setIsUpload(true)}
            >
              <FaCamera />
              Update Selfie
            </button>
          </div>
        </div>
      </div>

      {/* stage-2 */}
      {/* <div className="h-[449px] bg-white pl-10 pr-[35px] py-[22px] rounded-2xl bg-white shadow-sm"> */}
      <div className="bg-white px-4 md:pl-10 md:pr-[35px] py-4 md:py-[22px] rounded-2xl shadow-sm">
        <span className=" text-[#111827] text-base font-bold leading-normal font-poppins flex items-center gap-2">
          <FaUser />
          Basic Information
        </span>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-[24px]">
          {/* Full name */}
          <div className="flex flex-col gap-2">
            <label className="font-poppins flex items-center gap-1 text-[#111827] text-sm font-semibold leading-normal">Full name <p className="text-[#D11717]">*</p></label>
            <input
              type="text"
              placeholder="Krishna Mohan"
              className="w-full rounded-lg border border-[#DBE1E0] bg-[#FAFCFB] py-3 md:py-[13px] px-4 sm:px-5 text-sm md:text-base font-nunito"
            />
          </div>
          {/* DOB */}
          <div className="flex flex-col gap-2">
            <label className="font-poppins flex items-center gap-1 text-[#111827] text-sm font-semibold leading-normal">Date of Birth<p className="text-[#D11717]">*</p></label>
            <input
              type="date"
              placeholder="15-06-1985"
              className="w-full rounded-lg border border-[#DBE1E0] bg-[#FAFCFB] py-3 md:py-[13px] px-4 sm:px-5 text-sm md:text-base font-nunito"
            />
          </div>
          {/* Gender */}
          <div className="flex flex-col gap-2">
            <label className="font-poppins flex items-center gap-1 text-[#111827] text-sm font-semibold leading-normal">Gender<p className="text-[#D11717]">*</p></label>

            <div className="flex gap-2 xl:gap-3 mt-2">
              {/* Male */}
              <label
                className="flex items-center justify-center flex-1 h-10 px-3 sm:px-4 border rounded-md cursor-pointer text-sm
hover:bg-gray-100 has-[:checked]:bg-blue-500 has-[:checked]:text-white"
              >
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  className="hidden w-full rounded-lg border border-[#DBE1E0] bg-[#FAFCFB] py-3 md:py-[16px] px-4 md:px-[24px] text-sm md:text-base font-nunito "
                />
                <span className="flex items-center gap-1">
                <FaUser />
                Male
                </span>
              </label>

              {/* Female */}
              <label
                className="flex items-center justify-center flex-1 h-10 px-3 sm:px-4 bg-[#FAFCFB] border-[##DBE1E0] border  rounded-md cursor-pointer text-sm
hover:bg-gray-100 has-[:checked]:bg-blue-500 has-[:checked]:text-white"
              >
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  className="hidden w-full rounded-lg border border-[##DBE1E0] bg-[#FAFCFB] py-3 md:py-[16px] px-4 md:px-[24px] text-sm md:text-base font-bold leading-4 font-nunito"
                />
                <span className="flex items-center gap-1">
<CgGirl />
                Female
                </span>
              </label>

              {/* Other */}
              <label
                className="flex items-center justify-center flex-1 h-10 px-3 sm:px-4 border rounded-md cursor-pointer text-sm
hover:bg-gray-100 has-[:checked]:bg-blue-500 has-[:checked]:text-white"
              >
                <input
                  type="radio"
                  name="gender"
                  value="other"
                  className="hidden w-full rounded-lg border border-[#DBE1E0] bg-[#FAFCFB] py-3 md:py-[16px] px-4 md:px-[24px] text-sm md:text-base font-nunito"
                />
                Other
              </label>
            </div>
          </div>
          {/* City/Location */}
          <div className="flex flex-col gap-2">
            <label className="font-poppins flex items-center gap-1 text-[#111827] text-sm font-semibold leading-normal">City / Location<p className="text-[#D11717]">*</p></label>
            <input
              type="text"
              placeholder="Nellore, AP"
              className="w-full rounded-lg border border-[#DBE1E0] bg-[#FAFCFB] py-3 md:py-[13px] px-4 sm:px-5 text-sm md:text-base font-nunito"
            />
          </div>
          {/* email */}
          <div className="flex flex-col gap-2">
            <label className="font-poppins flex items-center gap-1 text-[#111827] text-sm font-semibold leading-normal">Email<p className="text-[#D11717]">*</p></label>
            <input
              type="email"
              placeholder="Krishna@email.com"
              className="w-full rounded-lg border border-[#DBE1E0] bg-[#FAFCFB] py-3 md:py-[13px] px-4 sm:px-5 text-sm md:text-base font-nunito"
            />
          </div>
          {/* mobile */}
          <div className="flex flex-col gap-2">
            <label className="font-poppins flex items-center gap-1 text-[#111827] text-sm font-semibold leading-normal">Phone Number<p className="text-[#D11717]">*</p></label>
            <input
              type="tel"
              placeholder="+91  9876543210"
              className="w-full rounded-lg border border-[#DBE1E0] bg-[#FAFCFB] py-3 md:py-[13px] px-4 sm:px-5 text-sm md:text-base font-nunito"
            />
          </div>
          <div className="flex flex-col gap-2 lg:col-span-2">
            <label className="font-poppins flex items-center gap-1 text-[#111827] text-sm font-semibold leading-normal">IRDAI License Number <p className="text-[#D11717]">*</p><p className="text-primary-900 font-nunito text-xs font-semiboldame hover:underline cursor-pointer">What is this?</p></label>
            <input
              type="text"
              name="irdaiLicenseNumber"
              placeholder="CM123456789"
              className="w-full rounded-lg border border-[#DBE1E0] bg-[#FAFCFB] py-3 md:py-[13px] px-4 sm:px-5 text-sm md:text-base font-nunito"
              required
            />
          </div>
        </div>
      </div>

      {/* stage - 3 */}
      <div className="py-4 md:py-[35px] px-4 md:pl-[40px] md:pr-[35px] rounded-2xl bg-white shadow-sm">
        <span className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2 mb-4 md:mb-[24px] text-gray-500 text-xs md:text-sm font-bold font-nunito">
          <p className="text-sm md:text-[14px] font-bold font-poppins text-[#111827] flex items-center gap-2">
            <FaLock />
            Section Visibility
          </p>
          - Control what clients see on your public profile
        </span>
        <div className="flex flex-col justify-between gap-3 md:gap-[16px] bg-white">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between  gap-3 md:gap-0 px-4 md:px-10 py-3 md:py-[14px] rounded-lg border border-[#DBE1E0] bg-[#F0F8F8]">
            <span className="flex items-center justify-between sm:justify-start gap-3 md:gap-[23px] w-full md:w-auto">
              {/* icon */}
              <FaFolder className="text-sm md:text-base" />
              <span className="flex flex-col gap-1 md:gap-2">
                <p className="text-[14px] font-semibold leading-normal text-[var(--headings-important-text,#111827)]">
                  professional Journey
                </p>
                <p className="text-[14px] font-normal leading-[16px] text-[var(--Body-content,#374151)] self-stretch font-nunito">
                  Work history and career timeline
                </p>
              </span>
            </span>
            <span className="flex items-center justify-between sm:justify-start gap-3 md:gap-[23px] w-full md:w-auto">
              {/* public */}
              <p className="text-xs md:text-[14px] font-semibold leading-normal text-(--gradients-hover-state,#0D6060) text-center font-poppins">
                Public
              </p>
              <Toggle onColor="bg-[#0A4A4A]" offColor="bg-gray-400" isOn={isJourney} setIsOn={() =>setIsJourney(!isJourney)} />
            </span>
          </div>
          {/* 2ND */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between  gap-3 md:gap-0 px-4 md:px-10 py-3 md:py-[14px] rounded-lg border border-[#DBE1E0] bg-[#F0F8F8]">
            <span className="flex items-center justify-between sm:justify-start gap-3 md:gap-[23px] w-full md:w-auto">
              {/* icon */}
              <IoShieldHalfOutline className="text-md md:text-base" />
              <span className="flex flex-col gap-1 md:gap-2">
                <p className="text-[14px] font-semibold leading-normal text-[var(--headings-important-text,#111827)]">
                  Services
                </p>
                <p className="text-[14px] font-normal leading-[16px] text-[var(--Body-content,#374151)] self-stretch font-nunito">
                  Life & Health insurance offerings
                </p>
              </span>
            </span>
            <span className="flex items-center justify-between sm:justify-start gap-3 md:gap-[23px] w-full md:w-auto">
              {/* public */}
              <p className="text-xs md:text-[14px] font-semibold leading-normal text-(--gradients-hover-state,#0D6060) text-center font-poppins">
                Public
              </p>
              <Toggle onColor="bg-[#0A4A4A]" offColor="bg-gray-400" isOn={isService} setIsOn={() =>setIsService(!isService)} />
            </span>
          </div>
          {/* 3rd */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:gap-0 px-4 md:px-10 py-3 md:py-[14px] rounded-lg border border-[#DBE1E0] bg-[#F0F8F8]">
            <span className="flex items-center justify-between sm:justify-start gap-3 md:gap-[23px] w-full md:w-auto">
              {/* icon */}
              <FaTrophy className="text-sm md:text-base" />
              <span className="flex flex-col gap-1 md:gap-2">
                <p className="text-[14px] font-semibold leading-normal text-[var(--headings-important-text,#111827)]">
                  Achievements
                </p>
                <p className="text-[14px] font-normal leading-[16px] text-[var(--Body-content,#374151)] self-stretch font-nunito">
                  MDRT, awards & milestones
                </p>
              </span>
            </span>
            <span className="flex items-center justify-between sm:justify-start gap-3 md:gap-[23px] w-full md:w-auto">
              {/* public */}
              <p className="text-xs md:text-[14px] font-semibold leading-normal text-(--gradients-hover-state,#0D6060) text-center font-poppins">
                Public
              </p>
              <Toggle onColor="bg-[#0A4A4A]" offColor="bg-gray-400" isOn={isAchievement} setIsOn={() =>setIsAchievement(!isAchievement)}/>
            </span>
          </div>
          {/* 4th */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:gap-0 px-4 md:px-10 py-3 md:py-[14px] rounded-lg border border-[#DBE1E0] bg-[#F0F8F8]">
            <span className="flex items-center justify-between sm:justify-start gap-3 md:gap-[23px] w-full md:w-auto">
              {/* icon */}
              <TfiGallery  className="text-sm md:text-base" />
              <span className="flex flex-col gap-1 md:gap-2">
                <p className="text-[14px] font-semibold leading-normal text-[var(--headings-important-text,#111827)]">
                  Gallery
                </p>
                <p className="text-[14px] font-normal leading-[16px] text-[var(--Body-content,#374151)] self-stretch font-nunito">
                 Photos & event images
                </p>
              </span>
            </span>
            <span className="flex items-center justify-between sm:justify-start gap-3 md:gap-[23px] w-full md:w-auto">
              {/* public */}
              <p className="text-xs md:text-[14px] font-semibold leading-normal text-(--gradients-hover-state,#0D6060) text-center font-poppins">
                Public
              </p>
              <Toggle onColor="bg-[#0A4A4A]" offColor="bg-gray-400" isOn={isGallery} setIsOn={() =>setIsGallery(!isGallery)}/>
            </span>
          </div>
          {/* 5th */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:gap-0 px-4 md:px-10 py-3 md:py-[14px] rounded-lg border border-[#DBE1E0] bg-[#F0F8F8]">
            <span className="flex items-center justify-between sm:justify-start gap-3 md:gap-[23px] w-full md:w-auto">
              {/* icon */}
              <IoMdChatboxes className="text-sm md:text-base" />
              <span className="flex flex-col gap-1 md:gap-2">
                <p className="text-[14px] font-semibold leading-normal text-[var(--headings-important-text,#111827)]">
                  Testimonials
                </p>
                <p className="text-[14px] font-normal leading-[16px] text-[var(--Body-content,#374151)] self-stretch font-nunito">
                  Client reviews & ratings
                </p>
              </span>
            </span>
            <span className="flex items-center justify-between sm:justify-start gap-3 md:gap-[23px] w-full md:w-auto">
              {/* public */}
              <p className="text-xs md:text-[14px] font-semibold leading-normal text-(--gradients-hover-state,#0D6060) text-center font-poppins">
                Public
              </p>
              <Toggle onColor="bg-[#0A4A4A]" offColor="bg-gray-400"  isOn={isTestimonial} setIsOn={() =>setIsTestimonial(!isTestimonial)} />
            </span>
          </div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-0 px-4 md:px-10 py-3 md:py-[14px] rounded-lg border border-[#DBE1E0] bg-[#F0F8F8]">
            <span className="flex items-center justify-between sm:justify-start gap-3 md:gap-[23px] w-full md:w-auto">
              {/* icon */}
              <CiGlobe className="text-sm md:text-base" />
              <span className="flex flex-col gap-1 md:gap-2">
                <p className="text-[14px] font-semibold leading-normal text-[var(--headings-important-text,#111827)]">
                  Public Profile
                </p>
                <p className="text-[14px] font-normal leading-[16px] text-[var(--Body-content,#374151)] self-stretch font-nunito">
                  Anyone with the link can view your profile
                </p>
              </span>
            </span>
            <span className="flex items-center justify-between sm:justify-start gap-3 md:gap-[23px] w-full md:w-auto">
              {/* public */}
              <p className="text-xs md:text-[14px] font-semibold leading-normal text-(--gradients-hover-state,#0D6060) text-center font-poppins">
                Public
              </p>
              <Toggle onColor="bg-[#0A4A4A]" offColor="bg-gray-400" isOn={isProfile} setIsOn={() =>setIsProfile(!isProfile)} />
            </span>
          </div>
        </div>
      </div>
      {/* stage-4 */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 md:gap-0 px-4 md:px-6 py-4 md:py-[26px] bg-white">
        <p className="text-gray-500 ttext-[clamp(10px,1vw,14px)] font-normal leading-normal font-nunito">
          Make Changes Above To Save
        </p>
        <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3 md:gap-4">
          <button className="w-full md:w-auto  px-4 py-[7px] lg:px-[22px] lg:py-[14px] flex items-center justify-center gap-2 text-[clamp(8px,1vw,12px)] font-semibold font-poppins rounded-lg flex items-center gap-[8px] text-teal-950 text-xs font-semibold leading-normal font-poppins rounded-lg border border-[#D8D8D8] cursor-pointer">
            <FiEye size={16} />
            preview Proile
          </button>
          <button className="w-full md:w-auto px-4 md:px-[22px] flex items-center justify-center gap-2 text-xs text-[clamp(8px,1vw,12px)]  font-semibold font-poppins rounded-lg flex items-center gap-[8px] rounded-lg bg-[#0A4A4A] text-[#F8F6F1] text-xs font-semibold leading-normal font-poppins cursor-pointer">
            <FiEye size={16}/>
            Save changes
          </button>
        </div>
      </div>

      {isUpload && (
        <div className="fixed inset-0 z-[9999] flex items-start md:items-center justify-center">
          {/* 🔥 BACKDROP */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsUpload(false)}
          />

          {/* 🔥 MODAL */}
          <div className="relative w-[95%] sm:w-[500px] md:w-[600px] mt-10 md:mt-0 rounded-[20px] bg-white shadow-xl animate-fadeIn">
            {/* HEADER */}
            <div className="pt-[20px] pb-[10px] px-[20px] md:px-[30px] flex items-center justify-between border-b">
              <span className="flex gap-[11px] items-center font-semibold">
                <FaCamera />
                Update Profile Photo
              </span>
              <button onClick={() => setIsUpload(false)}>
                <MdClose />
              </button>
            </div>

            {/* BODY */}
            <div className="mt-5 flex flex-col gap-4 px-[20px] md:px-[35px] pb-6">
              <p className="text-[#6B7280] text-sm">
                A clear selfie builds trust with clients. Choose how to update
                your photo.
              </p>

              {/* OPTIONS */}
              <div className="flex flex-col gap-3">
                <button className="flex items-center gap-5 px-4 py-3 rounded-lg hover:bg-gray-100">
                  <FaCamera />
                  <div>
                    <p className="text-[#111827] font-medium">Take a Selfie</p>
                    <p className="text-[#6B7280] text-sm">
                      Use camera for a live photo
                    </p>
                  </div>
                </button>

                <button className="flex items-center gap-5 px-4 py-3 rounded-lg hover:bg-gray-100">
                  <FaFile />
                  <div>
                    <p className="text-[#111827] font-medium">
                      Upload from Gallery
                    </p>
                    <p className="text-[#6B7280] text-sm">JPG, PNG • Max 5MB</p>
                  </div>
                </button>
              </div>

              {/* TIP */}
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl border border-[#ECE4C8] bg-[#FDF9ED]">
                <FaLightbulb />
                <p className="text-[#D97706] text-xs font-semibold">
                  A professional photo increases client trust by up to 40%.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      
    </div>
  );
};

export default page;
