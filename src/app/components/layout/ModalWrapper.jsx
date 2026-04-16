export const ModalWrapper = ({ children, onClose }) => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-start md:items-center justify-center">
      
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* MODAL */}
      <div className="relative w-[95%] sm:w-[500px] md:w-[600px] mt-10 md:mt-0 bg-white rounded-2xl shadow-xl animate-fadeIn">
        {children}
      </div>
    </div>
  );
};