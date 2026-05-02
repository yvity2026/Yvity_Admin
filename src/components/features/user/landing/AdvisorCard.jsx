import { motion } from "framer-motion";

import ShieldIcon from "../../../../../public/svgs/home/advisor_card/twemoji_shield.svg";
import CapsuleIcon from "../../../../../public/svgs/home/advisor_card/bi_capsule.svg";
import TrophyIcon from "../../../../../public/svgs/home/advisor_card/noto_trophy.svg";
import StarIcon from "../../../../../public/svgs/home/advisor_card/noto_star.svg";

const tagConfig = {
  "Life Insurance": {
    bg: "bg-[rgba(232,244,244,0.60)]",
    text: "text-[#0A4A4A]",
    icon: ShieldIcon,
  },
  "Health Insurance": {
    bg: "bg-[rgba(232,244,244,0.60)]",
    text: "text-[#0A4A4A]",
    icon: CapsuleIcon,
  },
  MDRT: {
    bg: "bg-[rgba(232,244,244,0.60)]",
    text: "text-[#0A4A4A]",
    icon: TrophyIcon,
  },
  Founding: {
    bg: "bg-[rgba(232,244,244,0.60)]",
    text: "text-[#0A4A4A]",
    icon: StarIcon,
  },
};

export const AdvisorCard = ({
  name,
  title,
  location,
  score,
  scoreLabel,
  exp,
  reviews,
  recs,
  clients,
  tags,
}) => {
  return (
    <div className="bg-white rounded-[32px] p-2 sm:p-2.5 md:p-3 lg:p-2 xl:p-4 shadow-[0_0_4px_0_rgba(0,0,0,0.25)] hover:shadow-[0_0_6px_4px_rgba(255,169,70,0.25)]">
      <div className="bg-white rounded-[inherit] p-5 md:p-3 border-[1.5px] border-[#f59e0b] relative group shadow-sm flex flex-col h-full font-sans">
        <div className="flex items-center gap-3 sm:gap-4 md:gap-5">
          <div className="relative flex-shrink-0">
            <div className=" rounded-full border-[2.5px] border-[#f59e0b] flex items-center justify-center">
              <div className="w-[59px] h-[59px] sm:w-[64px] sm:h-[64px] md:w-[68px] md:h-[68px] xl:h-[73px] xl:w-[73px] rounded-full bg-[#115e59] text-center text-white font-poppins font-bold text-[12px] sm:text-[13px] md:text-[14px] lg:text-[16px] flex items-center justify-center justify-center">
                <p className="text-[16px] md:text-[19px] lg:text-[22px]">
                  {name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </p>
              </div>
            </div>

            <div className="absolute bottom-0 right-0 bg-white rounded-full p-[2px] shadow-sm">
              <div className="bg-white rounded-full flex items-center justify-center">
                <img
                  src="/svgs/home/advisor_card/verified.svg"
                  alt="Verified"
                  className="w-3.5 h-3.5"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-black font-poppins text-[13px] sm:text-[14px] md:text-[16px] lg:text-[16px] xl:lg:text-[15px] 2xl:text-[18px] font-semibold leading-none">
              {name}
            </h3>
            <p className="text-[#F59E0B] font-poppins text-[11px] sm:text-[12px] md:text-[14px] lg:text-[14px] xl:text-[15px] 2xl:text-[16px] font-normal leading-none mt-2">
              {title}
            </p>
            <div className="flex items-center gap-1.5 text-[#6B7280] font-poppins text-[9px] sm:text-[10px] md:text-[12px] lg:text-[12px] xl:text-[13px] 2xl:text-[14px] font-normal leading-none mt-2">
              <img
                src="/svgs/home/advisor_card/mdi_location.svg"
                alt="Location"
                className="w-3.5 h-3.5"
              />
              {location}
            </div>
          </div>
        </div>

        {/* Diamond Line Divider */}
        <div className="flex items-center w-[90%] sm:w-[85%] md:w-[80%] mx-auto my-3 text-[#c8ada7]">
          {/* Left Diamond (Concave edges) */}
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="flex-shrink-0"
          >
            <path d="M12 0C12 6.627 6.627 12 0 12C6.627 12 12 17.373 12 24C12 17.373 17.373 12 24 12C17.373 12 12 6.627 12 0Z" />
          </svg>
          {/* Left Circle */}
          <div className="w-1.5 h-1.5 rounded-full bg-current ml-0.5"></div>
          {/* Left Line */}
          <div className="h-[1.5px] bg-current flex-1"></div>
          {/* Center Circle */}
          <div className="w-1.5 h-1.5 rounded-full bg-current mx-0"></div>
          {/* Right Line */}
          <div className="h-[1.5px] bg-current flex-1"></div>
          {/* Right Circle */}
          <div className="w-1.5 h-1.5 rounded-full bg-current mr-0.5"></div>
          {/* Right Diamond (Concave edges) */}
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="flex-shrink-0"
          >
            <path d="M12 0C12 6.627 6.627 12 0 12C6.627 12 12 17.373 12 24C12 17.373 17.373 12 24 12C17.373 12 12 6.627 12 0Z" />
          </svg>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-6">
          {tags.map((tag) => {
            const config = tagConfig[tag];

            if (!config) return null; // safety

            return (
              <span
                key={tag}
                className={`${config.bg} ${config.text} text-[#0A4A4A] text-[10px] sm:text-[11px] md:text-[12px] px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full flex items-center gap-1.5 font-medium font-poppins`}
              >
                <img src={config.icon.src} alt={tag} className="w-3.5 h-3.5" />
                {tag}
              </span>
            );
          })}
        </div>

        <div className="w-full h-[2px] bg-gray-400 mb-5"></div>

        <div className="mb-6 relative">
          <h4 className="text-[15px] font-extrabold text-[#707b8c] mb-2 font-poppins tracking-wide">
            YVITY Score
          </h4>

          <div className="relative flex items-center w-full">
            <div className="w-[86%] h-[10px] rounded-full bg-gray-200 overflow-hidden relative z-10">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${score}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="h-full rounded-full"
                style={{
                  background:
                    "linear-gradient(90deg, #F59E0B 0%, #CFA24D 35%, #7A8B4F 65%, #0D6060 100%)",
                }}
              />
            </div>

            <div className="absolute right-0 w-[64px] h-[64px] sm:w-[72px] sm:h-[72px] md:w-[71px] md:h-[71px] lg:h-[71px] lg:w-[71px] xl:w-[75px] xl:h-[75px] rounded-full p-[3.5px] bg-gradient-to-br from-[#0a4d46] via-[#376b5d] to-[#F59E0B] shadow-[0_4px_12px_rgba(10,77,70,0.3)] z-20 flex items-center justify-center">
              {/*  Dynamic water waves Fill Layer */}
              <div className="w-full h-full bg-white rounded-full flex items-center justify-center p-1 relative overflow-hidden">
                <motion.div
                  initial={{ height: 0 }}
                  whileInView={{ height: `${score}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  className="absolute bottom-0 left-0 w-full"
                  style={{
                    background:
                      "linear-gradient(180deg, #F59E0B 0%, #CFA24D 35%, #7A8B4F 65%, #0D6060 100%)",
                    zIndex: 0,
                  }}
                >
                  {/*  Water Wave Effect */}
                  <div className="absolute bottom-full left-0 w-full h-[14px] translate-y-[2px] pointer-events-none">
                    <motion.div
                      animate={{ x: ["0%", "-50%"] }}
                      transition={{
                        repeat: Infinity,
                        duration: 1.5,
                        ease: "linear",
                      }}
                      className="w-[200%] h-full"
                      style={{
                        // The fill='%23F59E0B' exactly matches the top color of your linear gradient
                        backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='20' viewBox='0 0 100 20' preserveAspectRatio='none'%3E%3Cpath d='M0,10 Q25,0 50,10 T100,10 L100,20 L0,20 Z' fill='%23F59E0B'/%3E%3C/svg%3E")`,
                        backgroundSize: "50% 100%", // Ensures the wave pattern scales correctly to the container
                        backgroundRepeat: "repeat-x",
                      }}
                    />
                  </div>
                </motion.div>

                <div className="relative z-10 flex items-baseline translate-y-[1px] font-poppins">
                  <span className="text-[24px] sm:text-[26px] md:text-[24px] lg:text-[24px] xl:text-[24px] font-black text-[#0a4d46] leading-none tracking-tight">
                    {score}
                  </span>
                  <span className="text-[11px] sm:text-[12px] md:text-[13px] lg:text-[13px] font-extrabold text-[#0a4d46] leading-none">
                    /100
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="relative w-[85%]">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${score}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="absolute top-0 left-0 h-[35px] z-0 opacity-25 blur-[6px]"
              style={{
                background:
                  "linear-gradient(90deg, #F59E0B 0%, #CFA24D 35%, #7A8B4F 65%, #0D6060 100%)",
                WebkitMaskImage:
                  "linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,0))",
                maskImage:
                  "linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,0))",
              }}
            />

            <p className="text-[#F59E0B] font-poppins text-[14px] font-bold pt-1.5 relative z-10">
              {scoreLabel}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 lg:gap-2 xl:gap-3 mb-3">
          <div className="flex flex-col items-center justify-center p-1  lg:p-2 -pt-2 -lg:pt-8 xl:pt-2 gap-1 px-1 rounded-[8px] border border-[#C7C7C7] bg-[#F8F6F1] shadow-[0_0_4px_0_rgba(0,0,0,0.25)]">
            <img
              src="/svgs/home/advisor_card/uim_bag.svg"
              alt="Reviews"
              className="w-5 h-5 text-[#facc15] mb-1"
            />
            <span className="text-[#0A4A4A] text-center text-[10px] sm:text-[12] md:text-[13px] lg:text-[12px] xl:text-[15px] font-semibold leading-none font-poppins">
              {exp}
            </span>
            <span className="text-[#6B7280] text-center font-poppins text-[12px] sm:text-[13px] md:text-[14px] lg:text-[13px] xl:text-[15px] font-normal leading-none">
              Exp
            </span>
          </div>
          <div className="flex flex-col items-center justify-center p-1 sm:p-2.5 gap-1 rounded-[8px] border border-[#C7C7C7] bg-[#F8F6F1] shadow-[0_0_4px_0_rgba(0,0,0,0.25)] font-poppins">
            <img
              src="/svgs/home/advisor_card/noto_star.svg"
              alt="Reviews"
              className="w-5 h-5 text-[#facc15] mb-1"
            />
            <span className="font-bold text-[#115e59] text-[10px] sm:text-[12] md:text-[13px] lg:text-[12px] xl:text-[15px] leading-tight font-poppins">
              {reviews}
            </span>
            <span className="text-[#6B7280] text-center font-poppins text-[12px] sm:text-[13px] md:text-[14px] lg:text-[13px] xl:text-[15px] font-normal leading-none">
              Reviews
            </span>
          </div>
          <div className="flex flex-col items-center justify-center p-1 gap-1 px-1 rounded-[8px] border border-[#C7C7C7] bg-[#F8F6F1] shadow-[0_0_4px_0_rgba(0,0,0,0.25)]">
            <img
              src="/svgs/home/advisor_card/noto_thumbs-up.svg"
              alt="Reviews"
              className="w-5 h-5 text-[#facc15] mb-1"
            />
            <span className="font-bold text-[#115e59] text-[10px] sm:text-[12] md:text-[13px] lg:text-[12px] xl:text-[15px] leading-tight font-poppins">
              {recs}
            </span>
            <span className="text-[#6B7280] text-center font-poppins text-[12px] sm:text-[13px] md:text-[14px] lg:text-[13px] xl:text-[15px] font-normal leading-none">
              Recs
            </span>
          </div>
          <div className="flex flex-col items-center justify-center p-1 gap-1 px-1 rounded-[8px] border border-[#C7C7C7] bg-[#F8F6F1] shadow-[0_0_4px_0_rgba(0,0,0,0.25)]">
            <img
              src="/svgs/home/advisor_card/mdi_people.svg"
              alt="Reviews"
              className="w-5 h-5 text-[#facc15] mb-1"
            />
            <span className="font-bold text-[#115e59] text-[10px] sm:text-[12] md:text-[13px] lg:text-[12px] xl:text-[15px] leading-tight font-poppins">
              {clients}
            </span>
            <span className="text-[#6B7280] text-center font-poppins text-[12px] sm:text-[13px] md:text-[14px] lg:text-[13px] xl:text-[15px] font-normal leading-none">
              Clients
            </span>
          </div>
        </div>

        {/* Button */}
        <button className="cursor-pointer font-poppins w-full py-2.5 sm:py-3 text-[13px] sm:text-[14px] md:text-[15px] rounded-full border-[1.5px] border-[#115e59] text-[#115e59] font-extrabold  hover:bg-[#076868] hover:text-[#F59E0B] transition-colors flex items-center justify-center gap-2 mt-auto mb-2">
          View Profile
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};
