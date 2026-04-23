"use client";
import { ModalWrapper } from "@/app/components/layout/ModalWrapper";
import React, { useRef, useState } from "react";
import { FiArrowRight } from "react-icons/fi";
import { IoClose } from "react-icons/io5";

const GiveTestimonialModal = ({ open, onClose }) => {
  const [mobile, setMobile] = useState("");
  const [testimonial, setTestimonial] = useState("");
  const [rating, setRating] = useState(0);
  const [name, setName] = useState("");
  const [activeTab, setActiveTab] = useState("text"); // text | audio | video
  const [audioBlob, setAudioBlob] = useState(null);
const [videoBlob, setVideoBlob] = useState(null);
const [mediaRecorder, setMediaRecorder] = useState(null);
const [isRecording, setIsRecording] = useState(false);
const videoRef = useRef(null);
const [loading, setLoading] = useState(false)

const startAudioRecording = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

  const recorder = new MediaRecorder(stream);
  setMediaRecorder(recorder);

  const chunks = [];

  recorder.ondataavailable = (e) => chunks.push(e.data);

  recorder.onstop = () => {
    const blob = new Blob(chunks, { type: "audio/webm" });
    setAudioBlob(blob);
  };

  recorder.start();
  setIsRecording(true);
};

const startVideoRecording = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
  });

  if (videoRef.current) {
    videoRef.current.srcObject = stream;
  }

  const recorder = new MediaRecorder(stream);
  setMediaRecorder(recorder);

  const chunks = [];

  recorder.ondataavailable = (e) => chunks.push(e.data);

  recorder.onstop = () => {
    const blob = new Blob(chunks, { type: "video/webm" });
    setVideoBlob(blob);
  };

  recorder.start();
  setIsRecording(true);
};

const stopRecording = () => {
  if (mediaRecorder) {
    mediaRecorder.stop();
    setIsRecording(false);
  }
};

const handleSubmit = async () => {
  let payload = {
    name,
    mobile,
    rating,
    type: activeTab,
  };

  if (activeTab === "text") {
    payload.testimonial = testimonial;
  }

  if (activeTab === "audio") {
    payload.file = audioBlob;
  }

  if (activeTab === "video") {
    payload.file = videoBlob;
  }

  console.log(payload);
};
  // if(open != "testimonial" ) return;
  return (
    <ModalWrapper onClose={() => onClose()}>
      <div className="bg-white rounded-[2rem] shadow-xl w-[calc(100vw-2rem)] sm:w-full max-w-lg overflow-hidden border border-gray-100 h-auto">
        {/* Header - Tightened padding for vertical fit */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📷</span>
            <h2 className="text-xl font-bold text-slate-900">
              Give Testimonial
            </h2>
          </div>

          <button
            onClick={() => onClose()}
            className="text-gray-400 hover:text-gray-600 bg-gray-100 p-1.5 rounded-full transition-colors"
          >
            <IoClose size={20} />
          </button>
        </div>

        {/* Body - Adjusted spacing from 5 to 4 to save vertical pixels */}
        <div className="p-6 space-y-4">
          {/* Tabs */}
          <div className="flex p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => setActiveTab("text")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold ${
                activeTab === "text"
                  ? "bg-white shadow-sm text-slate-800"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <span>📄</span> Text
            </button>

            <button
              onClick={() => setActiveTab("audio")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold ${
                activeTab === "audio"
                  ? "bg-white shadow-sm text-slate-800"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <span>🎵</span> Audio
            </button>

            <button
              onClick={() => setActiveTab("video")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold ${
                activeTab === "video"
                  ? "bg-white shadow-sm text-slate-800"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <span>🎬</span> Video
            </button>
          </div>

          {/* Form - Compact layout */}
          <div className="space-y-3">
  {/* COMMON FIELDS */}
  <div>
    <label className="block font-bold text-slate-800 mb-1.5 text-sm">
      Your Name <span className="text-red-500">*</span>
    </label>
    <input
      type="text"
      value={name}
      onChange={(e) => setName(e.target.value)}
      placeholder="Full name"
      className="w-full px-4 py-3 bg-slate-50/50 border border-gray-200 rounded-xl"
    />
  </div>

  <div>
    <label className="block font-bold text-slate-800 mb-1.5 text-sm">
      Mobile (OTP) <span className="text-red-500">*</span>
    </label>
    <input
      type="tel"
      value={mobile}
      onChange={(e) => setMobile(e.target.value)}
      placeholder="10 digit mobile number"
      className="w-full px-4 py-3 bg-slate-50/50 border border-gray-200 rounded-xl"
    />
  </div>

  {/* 🔥 TEXT MODE */}
  {activeTab === "text" && (
    <div>
      <label className="block font-bold text-slate-800 mb-1.5 text-sm">
        Testimonial <span className="text-red-500">*</span>
      </label>
      <textarea
        rows="3"
        value={testimonial}
        onChange={(e) => setTestimonial(e.target.value)}
        placeholder="Share your experience..."
        className="w-full px-4 py-3 bg-slate-50/50 border border-gray-200 rounded-xl"
      />
    </div>
  )}

  {/* 🔥 AUDIO MODE */}
  {activeTab === "audio" && (
    <div className="flex flex-col gap-3">
      <button
        onClick={startAudioRecording}
        className="bg-gray-200 px-4 py-2 rounded-lg"
      >
        {isRecording ? "Recording..." : "Start Recording"}
      </button>

      <button
        onClick={stopRecording}
        className="bg-red-400 px-4 py-2 rounded-lg text-white"
      >
        Stop
      </button>

      {audioBlob && (
        <audio controls src={URL.createObjectURL(audioBlob)} />
      )}
    </div>
  )}

  {/* 🔥 VIDEO MODE */}
  {activeTab === "video" && (
    <div className="flex flex-col gap-3">
      <video ref={videoRef} autoPlay className="rounded-lg" />

      <button
        onClick={startVideoRecording}
        className="bg-gray-200 px-4 py-2 rounded-lg"
      >
        Start Video
      </button>

      <button
        onClick={stopRecording}
        className="bg-red-400 px-4 py-2 rounded-lg text-white"
      >
        Stop
      </button>

      {videoBlob && (
        <video controls src={URL.createObjectURL(videoBlob)} />
      )}
    </div>
  )}
</div>

          {/* Submit */}
          <button
            className="w-full bg-[#0a4d4a] hover:bg-[#073a38] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Processing..." : "Submit & Verify OTP"}
            {loading ? (
              <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <FiArrowRight size={18} />
            )}
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default GiveTestimonialModal;
