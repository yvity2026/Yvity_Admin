// export const ModalWrapper = ({ children, onClose }) => {
//   return (
//     <div className="fixed inset-0 z-[9999] flex items-start md:items-center justify-center">
      
//       {/* BACKDROP */}
//       <div
//         className="absolute inset-0 bg-black/40 backdrop-blur-sm"
//         onClick={onClose}
//       />

//       {/* MODAL */}
//       <div className="relative mt-10 md:mt-0 bg-white rounded-2xl overflow-y-auto shadow-xl animate-fadeIn">
//         {children}
//       </div>
//     </div>
//   );
// };

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