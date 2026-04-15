import Toggle from "@/app/components/ui/ToggleButton";
import React from "react";
import { FaCamera, FaFolder } from "react-icons/fa";
import { FiEye } from "react-icons/fi";

const page = () => {
  return (
    <div className="p-8 flex flex-col gap-6">
      {/* stage-1 */}
      <div className="h-[212px] border flex flex-col py-[34px] pl-[30px] pr-[87px] gap-4">
        <span className="flex items-center text-left">
          <p className="font-semibold">Profile Photo</p> - Last updated 6 months
          ago
        </span>
        <div className="w-[883px] bg-red-300 flex items-center gap-[17px]">
          {/* profile image */}
          <div className="w-26 h-26 rounded-full bg-blue-200"></div>
          <div className="flex flex-col h-full justify-between">
            <span className="felx">
              <p>
                You can update your profile photo only once a year. Next update
                will be available on your birthday.
              </p>
            </span>
            <button className="w-[139px] h-[40px] text-xs flex py-[14px] px-[22px] gap-[8px] bg-amber-200 items-center">
              <FaCamera />
              Update Selfie
            </button>
          </div>
        </div>
      </div>

      {/* stage-2 */}
      <div className="h-[449px] bg-green-200 pl-10 pr-[35px] py-[22px]">
        <span className="">Basic Information</span>
        <div className=" grid grid-cols-2 gap-6">
          {/* Full name */}
          <div className="flex flex-col">
            <label>Full name</label>
            <input type="text" className="border p-2" />
          </div>
          {/* DOB */}
          <div className="flex flex-col">
            <label>Date of Birth</label>
            <input type="date" className="border p-2" />
          </div>
          {/* Gender */}
          <div className="flex flex-col">
            <label>Gender</label>

            <div className="flex gap-3 mt-2">
              {/* Male */}
              <label
                className="flex items-center justify-center w-[124px] h-[42px] px-6 py-4 gap-2 border rounded-md cursor-pointer
      hover:bg-gray-100 has-[:checked]:bg-blue-500 has-[:checked]:text-white"
              >
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  className="hidden"
                />
                Male
              </label>

              {/* Female */}
              <label
                className="flex items-center justify-center w-[124px] h-[42px] px-6 py-4 gap-2 border rounded-md cursor-pointer
      hover:bg-gray-100 has-[:checked]:bg-blue-500 has-[:checked]:text-white"
              >
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  className="hidden"
                />
                Female
              </label>

              {/* Other */}
              <label
                className="flex items-center justify-center w-[124px] h-[42px] px-6 py-4 gap-2 border rounded-md cursor-pointer
      hover:bg-gray-100 has-[:checked]:bg-blue-500 has-[:checked]:text-white"
              >
                <input
                  type="radio"
                  name="gender"
                  value="other"
                  className="hidden"
                />
                Other
              </label>
            </div>
          </div>
          {/* City/Location */}
          <div className="flex flex-col">
            <label>City / Location</label>
            <input type="text" className="border p-2" />
          </div>
          {/* email */}
          <div className="flex flex-col">
            <label>Email</label>
            <input type="email" className="border p-2" />
          </div>
          {/* mobile */}
          <div className="flex flex-col">
            <label>Phone Number</label>
            <input type="tel" className="border p-2" />
          </div>
          <div className="flex flex-col col-span-2">
            <label>IRDAI License Number</label>
            <input
              type="text"
              name="irdaiLicenseNumber"
              className="border p-2 w-full"
              required
            />
          </div>
        </div>
      </div>

      {/* stage - 3 */}
      <div className="h-[630px] bg-yellow-100 py-[35px] pl-[40px] pr-[35px]">
        <span className="flex mb-[24px]">
          <p>Section Visibility</p>- Control what clients see on your public profile
        </span>
        <div className="flex flex-col justify-between gap-[16px] bg-white">
          <div className="h-[72px] px-10 py-[14px] bg-red flex justify-between bg-red-400">
            <span className="flex items-center gap-[23px]">
              {/* icon */}
              <FaFolder />
              <span className="flex gap-2">
                <p className="text-[14px] font-semibold leading-normal text-[var(--headings-important-text,#111827)]">professional Journey</p>
                <p className="text-[14px] font-normal leading-[16px] text-[var(--Body-content,#374151)] self-stretch font-nunito">Work history and career timeline</p>
              </span>
            </span>
            <span className="flex items-center gap-[23px]">
              {/* public */}
              <p className="text-[14px] font-semibold leading-normal text-[var(--gradients-hover-state,#0D6060)] text-center font-poppins">Public</p>
              <Toggle onColor="bg-blue-500" offColor="bg-gray-400" />
            </span>
          </div>
          <div className=" h-[72px] px-10 py-[14px] bg-red flex justify-between bg-red-400">
            <span className="flex items-center gap-[23px]">
              {/* icon */}
              <FaFolder />
              <span className="flex gap-2">
                <p>professional Journey</p>
                <p>Work history and career timeline</p>
              </span>
            </span>
            <span className="flex items-center gap-[23px]">
              {/* public */}
              <p>Public</p>
              <Toggle onColor="bg-blue-500" offColor="bg-gray-400" />
            </span>
          </div>
          <div className=" h-[72px] px-10 py-[14px] bg-red flex justify-between bg-red-400">
            <span className="flex items-center gap-[23px]">
              {/* icon */}
              <FaFolder />
              <span className="flex gap-2">
                <p>professional Journey</p>
                <p>Work history and career timeline</p>
              </span>
            </span>
            <span className="flex items-center gap-[23px]">
              {/* public */}
              <p>Public</p>
              <Toggle onColor="bg-blue-500" offColor="bg-gray-400" />
            </span>
          </div>
          <div className="h-[72px] px-10 py-[14px] bg-red flex justify-between bg-red-400">
            <span className="flex items-center gap-[23px]">
              {/* icon */}
              <FaFolder />
              <span className="flex gap-2">
                <p>professional Journey</p>
                <p>Work history and career timeline</p>
              </span>
            </span>
            <span className="flex items-center gap-[23px]">
              {/* public */}
              <p>Public</p>
              <Toggle onColor="bg-blue-500" offColor="bg-gray-400" />
            </span>
          </div>
          <div className="h-[72px] px-10 py-[14px] bg-red flex justify-between bg-red-400">
            <span className="flex items-center gap-[23px]">
              {/* icon */}
              <FaFolder />
              <span className="flex gap-2">
                <p>professional Journey</p>
                <p>Work history and career timeline</p>
              </span>
            </span>
            <span className="flex items-center gap-[23px]">
              {/* public */}
              <p>Public</p>
              <Toggle onColor="bg-blue-500" offColor="bg-gray-400" />
            </span>
          </div>
          <div className="h-[72px] px-10 py-[14px] bg-red flex justify-between bg-red-400">
            <span className="flex items-center gap-[23px]">
              {/* icon */}
              <FaFolder />
              <span className="flex gap-2">
                <p>professional Journey</p>
                <p>Work history and career timeline</p>
              </span>
            </span>
            <span className="flex items-center gap-[23px]">
              {/* public */}
              <p>Public</p>
              <Toggle onColor="bg-blue-500" offColor="bg-gray-400" />
            </span>
          </div>
        </div>
      </div>
      {/* stage-4 */}
      <div className="h-[76px] bg-red-200 flex justify-between items-center px-6 py-[26px]">
        <p className="">Make Changes Above To Save</p>
        <div className="flex items-center gap-4 ">
            <button className="h-[40px] py-[14px] px-[22px] flex items-center gap-[8px] bg-blue-400">
                <FiEye />
                preview Proile
            </button>
            <button className="h-[40px] py-[14px] px-[22px] flex items-center gap-[8px] bg-emerald-300">
                <FiEye />
                preview Proile
            </button>
        </div>
      </div>
    </div>
  );
};

export default page;
