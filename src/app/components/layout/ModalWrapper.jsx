
export const ModalWrapper = ({ children, onClose }) => {
  return (
    <div className="fixed inset-0 z-200 flex items-center justify-center">
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* MODAL CONTAINER */}
      <div className="relative min-w-[450px] h-full flex items-center justify-center px-0 sm:px-0 md:px-0 scrollbar-hide">
        {children}
      </div>
    </div>
  );
};