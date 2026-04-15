export default function WelcomeCard() {
  // Function to get greeting based on Indian time
  const getGreeting = () => {
    const now = new Date();
    // Convert to Indian time (IST = UTC+5:30)
    const indianTime = new Date(
      now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }),
    );
    const hour = indianTime.getHours();

    if (hour >= 5 && hour < 12) {
      return "Good Morning 🌞";
    } else if (hour >= 12 && hour < 17) {
      return "Good Afternoon 🌤️";
    } else if (hour >= 17 && hour < 21) {
      return "Good Evening 🌆";
    } else {
      return "Good Night 🌙";
    }
  };

  const greeting = getGreeting();

  return (
    <div className="bg-[#124B48] text-white rounded-2xl p-6 md:p-8 flex flex-col justify-center shadow-sm font-poppins">
      <div className="flex items-center gap-2 mb-1">
        <p className="lg:text-[] xl:text-[16px] text-[#89B5B7] font-['Nunito'] text-base font-bold leading-normal">
          {greeting}
        </p>
      </div>
      <h2 className=" lg:text-[26px] xl:text-[27px] tracking-wide font-cormorant mb-1 text-[#FFF]  text-base font-bold leading-normal">
        Krishna Mohan!
      </h2>
      <p className=" lg:text-[] xl:text-[14px] text-[#89B5B7]">
        Your credibility profile is active and growing{" "}
        <span className="ml-2"> 🚀</span>
      </p>
    </div>
  );
}
