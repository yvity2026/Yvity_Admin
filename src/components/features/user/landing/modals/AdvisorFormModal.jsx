import React, { useEffect, useRef, useState } from "react";
import { IoClose, IoChevronDown, IoCloudUploadOutline } from "react-icons/io5";
import { HiOutlineArrowLeft, HiOutlineArrowRight } from "react-icons/hi";
import { LuPlus } from "react-icons/lu";
import Image from "next/image";
import toast from "react-hot-toast";

const AdvisorFormModal = ({ isOpen, onClose, onContinue, onBack, form }) => {
  // Available services list
  const initialServices = [
    "Life Insurance",
    "Health Insurance",
    "General Insurance",
    "Mutual Funds",
  ];

  const resetForm = () => {
    setFormData({
      services: [],
      bio: "",
      certificate_url: "",
    });

    setServiceData({
      service: "",
      company: "",
      license: "",
      experience: "",
    });

    setFile(null);
    setPreview(null);
  };

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        services: [],
        certificate_url: "",
        bio: "",
      });

      setServiceData({
        service: "",
        company: "",
        license: "",
        experience: "",
      });

      setFile(null);
      setPreview(null);
    }
  }, [isOpen]);

  useEffect(() => {
    if (form) {
      setFormData({
        services: form?.services || [],
        certificate_url: form?.certificate_url || "",
        bio: form?.bio || "",
      });

      setFile(form?.certificate_file || null);
    }
  }, [form]);

  const [errors, setErrors] = useState({});
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const validateForm = () => {
    if (formData.services.length === 0) {
      toast.error("Add at least one service");
      return false;
    }

    if (!file) {
      toast.error("Upload certificate image");
      return false;
    }

    return true;
  };

  const [formData, setFormData] = useState({
    services: [],
    bio: "",
    certificate_url: "",
  });

  const [serviceData, setServiceData] = useState({
    service: "",
    company: "",
    license: "",
    experience: "",
  });

  // Filter dropdown to hide already added services
  const availableServices = initialServices.filter(
    (s) => !formData.services.some((as) => as.service === s),
  );

  const handleAddService = () => {
    if (!serviceData.service) return toast.error("Select a service");
    if (!serviceData.company) return toast.error("Select a company");
    if (!serviceData.license) return toast.error("License required");
    if (!serviceData.experience) return toast.error("Experience required");

    const newService = {
      ...serviceData,
      experience: Number(serviceData.experience),
      id: Date.now(),
    };

    setFormData((prev) => ({
      ...prev,
      services: [...prev.services, newService],
    }));

    setServiceData({
      service: "",
      company: "",
      license: "",
      experience: "",
    });

    toast.success("Service added");
  };

  const handleRemoveService = (id) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.filter((s) => s.id !== id),
    }));
  };

  {
    errors.service && (
      <p className="text-red-500 text-xs mt-1">{errors.service}</p>
    );
  }

  const useSounds = () => {
    const sounds = useRef({});

    useEffect(() => {
      sounds.current = {
        success: new Audio("/sounds/success.mp3"),
      };
    }, []);

    const play = (type) => {
      const sound = sounds.current[type];
      if (sound) {
        sound.currentTime = 0;
        sound.volume = 0.5; // 
        sound.play().catch(() => {});
      }
    };

    return { play };
  };

  const { play } = useSounds();

  const handleSubmit = () => {
    if (!validateForm()) return;

    console.log("MODAL DATA:", {
      ...formData,
      file,
    });

    play('success');

    const cleanServices = formData.services.map(({ id, ...rest }) => rest);

    onContinue({
      ...formData,
      services: cleanServices,
      certificate_file: file,
    });
    // toast.success("Profile submitted");
  };

  useEffect(() => {
    if (!isOpen) resetForm();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm  ">
      <div className="relative w-full max-w-[600px] bg-white shadow-[0_0_8px_2px_rgba(245,158,11,0.25)] rounded-3xl overflow-hidden flex flex-col max-h-[95vh] no-scrollbar">
        {/* Header */}
        <div className="bg-[#0D4D4D] p-6 text-white shrink-0 cursor-pointer">
          <button
            onClick={() => {
              resetForm();
              onClose();
            }}
            className="absolute top-6 right-6 p-2 bg-white/10 rounded-full hover:bg-white/20 cursor-pointer"
          >
            <IoClose size={20} />
          </button>
          <div className="">
            <Image
              src="/images/yvity.png"
              height={100}
              width={100}
              alt="Navbar logo"
            />
          </div>
          <h2 className="text-[32px] font-cormorant font-bold rounded-lg">
            Insurance Advisor Profile
          </h2>
          <p className="text-[A9A9A9] text-[16px] font-poppins rounded-lg">
            Fill your advisor details—this is your public profile
          </p>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto flex-1 bg-[#F9F8F6] no-scrollbar">
          <button
            className="flex items-center gap-2 text-gray-500 text-sm mb-4 cursor-pointer"
            onClick={() => onBack()}
          >
            <HiOutlineArrowLeft /> Change role
          </button>

          <div className="px-6">
            <div className="bg-[#EBF3F3] border-l-4 border-[#0D4D4D] py-4 pl-[20px] pr-[104px] rounded-lg mb-6 text-xs text-[#0D4D4D]">
              Insurance Advisor profile. This will be your public credibility
              profile on YVITY.
            </div>
          </div>

          {/* Render Added Services (Summary View) */}
          {formData.services.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-gray-200 rounded-xl p-4 mb-4 shadow-sm relative"
            >
              <span className="text-[10px] font-bold text-[#0D4D4D] uppercase bg-gray-100 px-2 py-1 rounded mb-2 inline-block">
                Added Service
              </span>
              <h3 className="font-bold text-gray-800">{item.service}</h3>
              <p className="text-sm text-gray-600">
                {item.company} • {item.experience} yrs
              </p>
              <button
                onClick={() => handleRemoveService(item.id)}
                className="absolute top-4 right-4 text-red-400 text-xs hover:underline"
              >
                Remove
              </button>
            </div>
          ))}

          {/* The Active Form */}
          <div className="bg-white  p-6 space-y-4">
            <div className="bg-[#E8F4F4] px-[16px] py-[24px] rounded-2xl space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-gray-700">
                  Service <span className="text-red-500">*</span>
                </label>
                <button
                  onClick={handleAddService}
                  className="flex items-center gap-1 text-[#0D4D4D] text-xs font-bold border border-[#0D4D4D] px-3 py-1 rounded-md hover:bg-[#0D4D4D] hover:text-white transition-all cursor-pointer"
                >
                  <LuPlus /> Add
                </button>
              </div>

              <select
                value={serviceData.service}
                onChange={(e) =>
                  setServiceData({ ...serviceData, service: e.target.value })
                }
                className="w-full p-3 rounded-xl border border-gray-200 bg-white appearance-none outline-none focus:ring-2 ring-[#0D4D4D]/20"
              >
                <option value="">Select Service</option>
                {availableServices.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>

              <div className="space-y-1 ">
                <label className="text-sm font-bold text-gray-700">
                  Insurance Company <span className="text-red-500">*</span>
                </label>
                <select
                  value={serviceData.company}
                  onChange={(e) =>
                    setServiceData({ ...serviceData, company: e.target.value })
                  }
                  className="w-full p-3 rounded-xl border border-gray-200 bg-[#F8F6F1]"
                >
                  <option value="" className="">
                    Select Company
                  </option>
                  <option value="Bajaj Allianz">
                    Bajaj Allianz Life Insurance
                  </option>
                  <option value="LIC">LIC of India</option>
                  <option value="HDFC Life">HDFC Life Insurance</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-bold text-gray-700">
                    IRDAI License No.
                  </label>
                  <input
                    value={serviceData.license}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, "");
                      setServiceData({
                        ...serviceData,
                        license: value,
                      });
                    }}
                    onKeyPress={(e) => {
                      if (!/[0-9]/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    type="text"
                    placeholder="e.g. 1234567"
                    inputMode="numeric"
                    maxLength="7"
                    className="w-full p-3 rounded-xl border bg-white border-gray-200"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-bold text-gray-700">
                    Years of Experience
                  </label>
                  <input
                    value={serviceData.experience}
                    onChange={(e) =>
                      setServiceData({
                        ...serviceData,
                        experience: e.target.value,
                      })
                    }
                    type="text"
                    className="w-full p-3 rounded-xl border border-gray-200 bg-white"
                    inputMode="numeric"
                    placeholder="e.g. 1"
                  />
                </div>
              </div>
            </div>
            <p className="text-[#374151] text-base sm:text-[16px] font-medium font-poppins leading-normal">
              Upload IRDAI Certificate
            </p>
            <div className="px-3 sm:px-5 pt-6 sm:pt-[29px] pb-6 sm:pb-[23px] flex flex-col gap-4 rounded-lg border border-[#E6E6E6] bg-[#F8F6F1]">
              <p className="text-[#6B7280] text-[12px] font-normal font-poppins leading-[20px]">
                Upload a single screenshot or image of your IRDAI license. It
                should show all your registered companies and details.
              </p>
              <p className="py-[10px] pr-[14px] pl-[20px] text-[#6B7280] text-[12px] font-normal font-poppins leading-[20px] rounded-lg border-l-[3px] border-l-[#0D6060] bg-[#E8F4F4]">
                Take a screenshot from the IRDAI website showing your license
                details. One image is sufficient - it will show all companies
                registered under your license.
              </p>

              {/* Upload Box */}
              <div
                className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition
  ${file ? "border-green-400 bg-green-50" : "border-gray-300 bg-white"}`}
                onClick={() => document.getElementById("fileUpload").click()}
              >
                <input
                  type="file"
                  id="fileUpload"
                  className="hidden"
                  accept=".png,.jpg,.jpeg,.pdf"
                  onChange={(e) => {
                    const selectedFile = e.target.files[0];
                    if (!selectedFile) return;

                    const validTypes = [
                      "image/jpeg",
                      "image/png",
                      "application/pdf",
                    ];

                    if (!validTypes.includes(selectedFile.type)) {
                      toast.error("Only JPG, PNG, or PDF files are allowed");
                      return;
                    }

                    if (selectedFile.size > 5 * 1024 * 1024) {
                      toast.error("File size must be under 5MB");
                      return;
                    }

                    setFile(selectedFile);

                    // Preview only for images
                    if (selectedFile.type.startsWith("image/")) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setPreview(reader.result);
                      };
                      reader.readAsDataURL(selectedFile);
                    } else {
                      setPreview(null);
                    }

                    toast.success("Certificate Uploaded Successfully");
                  }}
                />

                {!file ? (
                  <>
                    <IoCloudUploadOutline
                      size={36}
                      className="text-gray-400 mb-2"
                    />
                    <p className="font-semibold text-gray-700">
                      Tap to upload certificate
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      JPG, PNG, PDF • Max 5MB • Single file
                    </p>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2 text-green-600 font-semibold">
                      ✅ Certificate Uploaded Successfully
                    </div>
                    <p className="text-[#6B7280] text-center text-xs sm:text-[14px] font-normal font-poppins leading-[20px] sm:leading-[24px]">
                      Click to simulate upload
                    </p>
                  </>
                )}
              </div>
              {file && (
                <div className="mt-4 p-4 bg-white border rounded-xl flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-700 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setFile(null);
                      setPreview(null);
                      document.getElementById("fileUpload").value = null;
                    }}
                    className="text-red-500 text-sm font-semibold hover:underline"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-[#374151] text-[16px] font-medium font-poppins leading-normal mb-2">
                Short Bio
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
                placeholder="e.g. 10+ years helping families secure their future with life and health insurance..."
                className="w-full p-3 rounded-xl border border-gray-200 min-h-[100px] bg-[#FDFCFB] text-[#6B7280] text-[14px] font-normal font-poppins leading-[24px]"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-white shrink-0 border-t">
          <button
            disabled={!validateForm}
            className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 font-bold transition-all
    ${
      file
        ? "bg-[#F39C12] hover:bg-[#E67E22] text-white cursor-pointer"
        : "bg-gray-300 text-gray-500 cursor-not-allowed"
    }`}
            onClick={handleSubmit}
          >
            Submit for Review <HiOutlineArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdvisorFormModal;
