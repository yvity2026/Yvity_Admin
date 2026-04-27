"use client";
import { ModalWrapper } from "@/app/components/layout/ModalWrapper";
import React, { useRef, useState } from "react";
import { FiArrowRight, FiMic, FiVideo, FiStopCircle, FiCheckCircle, FiRefreshCw } from "react-icons/fi";
import { IoClose } from "react-icons/io5";

const GiveTestimonialModal = ({ open, onClose, advisorId, userId }) => {
  const [mobile, setMobile] = useState("");
  const [testimonial, setTestimonial] = useState("");
  const [rating, setRating] = useState(0);
  const [name, setName] = useState("");
  const [activeTab, setActiveTab] = useState("text");
  const [audioBlob, setAudioBlob] = useState(null);
  const [videoBlob, setVideoBlob] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingComplete, setRecordingComplete] = useState(false);
  const videoRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const startAudioRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    setMediaRecorder(recorder);
    const chunks = [];

    recorder.ondataavailable = (e) => chunks.push(e.data);
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: "audio/webm" });
      setAudioBlob(blob);
      setRecordingComplete(true);
      setShowPreview(true);
      stream.getTracks().forEach(track => track.stop());
    };

    recorder.start();
    setIsRecording(true);
    setRecordingComplete(false);
    setShowPreview(false);
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
      setRecordingComplete(true);
      setShowPreview(true);
      stream.getTracks().forEach(track => track.stop());
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };

    recorder.start();
    setIsRecording(true);
    setRecordingComplete(false);
    setShowPreview(false);
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const retryRecording = () => {
    setAudioBlob(null);
    setVideoBlob(null);
    setRecordingComplete(false);
    setShowPreview(false);
    if (activeTab === "video" && videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const uploadToS3 = async (blob, type) => {
    const formData = new FormData();
    const fileName = `${type}_${Date.now()}_${Math.random().toString(36).substring(7)}.${type === 'audio' ? 'webm' : 'webm'}`;
    formData.append('file', blob, fileName);
    formData.append('type', type);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const data = await response.json();
    return data.url;
  };

  const generateOTP = async (mobileNumber) => {
    const response = await fetch('/api/generate-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ mobileNumber }),
    });

    if (!response.ok) {
      throw new Error('OTP generation failed');
    }

    return await response.json();
  };

  const handleSubmit = async () => {
    setLoading(true);
    
    try {
      let mediaUrl = null;
      let content = null;

      // Handle file uploads for audio/video
      if (activeTab === "audio" && audioBlob) {
        mediaUrl = await uploadToS3(audioBlob, 'audio');
      } else if (activeTab === "video" && videoBlob) {
        mediaUrl = await uploadToS3(videoBlob, 'video');
      } else if (activeTab === "text" && testimonial) {
        content = testimonial;
      }

      // Generate OTP
      const otpData = await generateOTP(mobile);

      // Prepare payload for backend
      const payload = {
        advisor_id: advisorId,
        user_id: userId,
        name: name,
        mobile_number: mobile,
        is_mobile_verified: false,
        testimonial_type: activeTab,
        content: content,
        media_url: mediaUrl,
        otp_code: otpData.otp_code,
        otp_expires_at: otpData.otp_expires_at,
        is_verified: false,
        status: 'pending',
        is_public: true,
        rating: rating
      };

      // Send to backend
      const response = await fetch('/api/testimonials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to submit testimonial');
      }

      const result = await response.json();
      
      // Show OTP verification modal or redirect
      alert('OTP sent successfully! Please verify your mobile number.');
      onClose();
      
    } catch (error) {
      console.error('Error submitting testimonial:', error);
      alert('Failed to submit testimonial. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalWrapper onClose={() => onClose()}>
      <div className="bg-white rounded-[2rem] shadow-xl w-[calc(100vw-2rem)] sm:w-full max-w-lg overflow-hidden border border-gray-100 h-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📷</span>
            <h2 className="text-[clamp(12px,1.5vw,16px)] font-bold text-slate-900">
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

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Tabs */}
          <div className="flex p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => {
                setActiveTab("text");
                setRecordingComplete(false);
                setShowPreview(false);
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold ${
                activeTab === "text"
                  ? "bg-white shadow-sm text-slate-800"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <span>📄</span> Text
            </button>

            <button
              onClick={() => {
                setActiveTab("audio");
                setRecordingComplete(false);
                setShowPreview(false);
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold ${
                activeTab === "audio"
                  ? "bg-white shadow-sm text-slate-800"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <span>🎵</span> Audio
            </button>

            <button
              onClick={() => {
                setActiveTab("video");
                setRecordingComplete(false);
                setShowPreview(false);
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold ${
                activeTab === "video"
                  ? "bg-white shadow-sm text-slate-800"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <span>🎬</span> Video
            </button>
          </div>

          {/* Form */}
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

            <div>
              <label className="block font-bold text-slate-800 mb-1.5 text-sm">
                Rating <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className={`text-2xl ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            {/* TEXT MODE */}
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

            {/* AUDIO MODE */}
            {activeTab === "audio" && (
              <div className="flex flex-col gap-3">
                {!showPreview ? (
                  <div className="flex gap-3">
                    <button
                      onClick={startAudioRecording}
                      disabled={isRecording}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold ${
                        isRecording 
                          ? 'bg-red-100 text-red-600 cursor-not-allowed'
                          : 'bg-blue-500 hover:bg-blue-600 text-white'
                      }`}
                    >
                      <FiMic size={20} />
                      {isRecording ? 'Recording...' : 'Start Recording'}
                    </button>

                    {isRecording && (
                      <button
                        onClick={stopRecording}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold"
                      >
                        <FiStopCircle size={20} />
                        Stop
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <audio controls src={URL.createObjectURL(audioBlob)} className="w-full" />
                    <div className="flex gap-3">
                      <button
                        onClick={retryRecording}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold"
                      >
                        <FiRefreshCw size={20} />
                        Record Again
                      </button>
                      <button
                        onClick={() => setShowPreview(false)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold"
                      >
                        <FiCheckCircle size={20} />
                        Use This
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* VIDEO MODE */}
            {activeTab === "video" && (
              <div className="flex flex-col gap-3">
                {!showPreview && !recordingComplete && (
                  <video ref={videoRef} autoPlay muted className="rounded-lg w-full bg-black" />
                )}
                
                {!showPreview && !recordingComplete && (
                  <div className="flex gap-3">
                    <button
                      onClick={startVideoRecording}
                      disabled={isRecording}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold ${
                        isRecording 
                          ? 'bg-red-100 text-red-600 cursor-not-allowed'
                          : 'bg-blue-500 hover:bg-blue-600 text-white'
                      }`}
                    >
                      <FiVideo size={20} />
                      {isRecording ? 'Recording...' : 'Start Recording'}
                    </button>

                    {isRecording && (
                      <button
                        onClick={stopRecording}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold"
                      >
                        <FiStopCircle size={20} />
                        Stop
                      </button>
                    )}
                  </div>
                )}

                {showPreview && videoBlob && (
                  <div className="space-y-3">
                    <video controls src={URL.createObjectURL(videoBlob)} className="w-full rounded-lg" />
                    <div className="flex gap-3">
                      <button
                        onClick={retryRecording}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold"
                      >
                        <FiRefreshCw size={20} />
                        Record Again
                      </button>
                      <button
                        onClick={() => setShowPreview(false)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold"
                      >
                        <FiCheckCircle size={20} />
                        Use This
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            className="w-full bg-[#0a4d4a] hover:bg-[#073a38] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            onClick={handleSubmit}
            disabled={loading || (activeTab === 'text' && !testimonial) || (activeTab === 'audio' && !audioBlob) || (activeTab === 'video' && !videoBlob) || !name || !mobile || rating === 0}
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