// // components/PricingModal.jsx
// import { useState } from 'react';

// const PricingModal = ({ isOpen, onClose }) => {
//   const [selectedPlan, setSelectedPlan] = useState(null);
//   const [expandedPlan, setExpandedPlan] = useState(null);

//   // Plan data based on your requirements
//   const plans = {
//     free: {
//       name: 'FREE',
//       price: '0',
//       period: 'Forever Free',
//       badge: null,
//       features: {
//         'Appears in Search': 'Yes',
//         'Identity Verified badge': 'Yes',
//         'IRDAI License Verified': 'No',
//         'Text Reviews': '5 max',
//         'Audio Reviews': 'No',
//         'Video Reviews': 'No',
//         'Recommendations': 'No',
//         'Intro Video': 'No',
//         'QR Code Download': 'No',
//         'Founding Advisor Badge': 'No',
//         'Priority Directory Listing': 'No'
//       }
//     },
//     silver: {
//       name: 'SILVER',
//       price: '999',
//       period: '/year',
//       badge: null,
//       features: {
//         'Appears in Search': 'Yes',
//         'Identity Verified badge': 'Yes',
//         'IRDAI License Verified': 'Yes',
//         'Text Reviews': 'Unlimited',
//         'Audio Reviews': 'Yes',
//         'Video Reviews': 'No',
//         'Recommendations': 'Yes',
//         'Intro Video': 'No',
//         'QR Code Download': 'No',
//         'Founding Advisor Badge': 'No',
//         'Priority Directory Listing': 'No'
//       }
//     },
//     gold: {
//       name: 'GOLD',
//       price: '2,999',
//       period: '/year',
//       badge: 'Most Popular',
//       features: {
//         'Appears in Search': 'Yes (Priority)',
//         'Identity Verified badge': 'Yes',
//         'IRDAI License Verified': 'Yes',
//         'Text Reviews': 'Unlimited',
//         'Audio Reviews': 'Yes',
//         'Video Reviews': 'Yes',
//         'Recommendations': 'Yes',
//         'Intro Video': 'Yes',
//         'QR Code Download': 'Yes',
//         'Founding Advisor Badge': 'Yes',
//         'Priority Directory Listing': 'Yes'
//       }
//     }
//   };

//   const handlePlanClick = (planKey) => {
//     setSelectedPlan(planKey);
//     // Toggle expansion: if same plan clicked, collapse; if different, expand new one
//     if (expandedPlan === planKey) {
//       setExpandedPlan(null);
//     } else {
//       setExpandedPlan(planKey);
//     }
//   };

//   const handleContinue = () => {
//     if (!selectedPlan) return;
    
//     if (selectedPlan === 'free') {
//       alert('Continuing with FREE plan...');
//       // Handle free plan signup here
//     } else {
//       alert(`Proceeding to payment for ${plans[selectedPlan].name} plan (₹${plans[selectedPlan].price}/year)`);
//       // Handle payment flow here
//     }
//     onClose(); // Optional: close modal after action
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50 overflow-y-auto">
//       {/* Backdrop */}
//       <div 
//         className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
//         onClick={onClose}
//       />
      
//       {/* Modal */}
//       <div className="flex min-h-full items-center justify-center p-4">
//         <div className="relative bg-white rounded-2xl shadow-xl max-w-4xl w-full mx-auto transition-all">
//           {/* Close button */}
//           <button
//             onClick={onClose}
//             className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
//           >
//             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//             </svg>
//           </button>

//           {/* Header */}
//           <div className="text-center pt-8 pb-4 px-6 border-b">
//             <h2 className="text-3xl font-bold text-gray-900">Choose Your Plan</h2>
//             <p className="text-gray-600 mt-2">Select the perfect plan for your needs</p>
//           </div>

//           {/* Plan buttons - vertical layout */}
//           <div className="px-6 py-6 space-y-4">
//             {/* FREE Plan Button */}
//             <div className="relative">
//               <button
//                 onClick={() => handlePlanClick('free')}
//                 className={`
//                   w-full text-left p-5 rounded-xl border-2 transition-all duration-300
//                   ${selectedPlan === 'free' 
//                     ? 'border-blue-500 bg-blue-50 shadow-md' 
//                     : 'border-gray-200 hover:border-blue-300 hover:shadow-sm'}
//                 `}
//               >
//                 <div className="flex justify-between items-center">
//                   <div>
//                     <h3 className="text-xl font-bold text-gray-900">FREE Plan</h3>
//                     <div className="mt-1">
//                       <span className="text-3xl font-bold text-gray-900">₹0</span>
//                       <span className="text-gray-600 ml-2">Forever Free</span>
//                     </div>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     {selectedPlan === 'free' && (
//                       <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
//                         Selected
//                       </span>
//                     )}
//                     <svg 
//                       className={`w-6 h-6 transform transition-transform ${expandedPlan === 'free' ? 'rotate-180' : ''}`}
//                       fill="none" 
//                       stroke="currentColor" 
//                       viewBox="0 0 24 24"
//                     >
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                     </svg>
//                   </div>
//                 </div>
//               </button>
              
//               {/* Features slide down for FREE */}
//               {expandedPlan === 'free' && (
//                 <div className="mt-3 p-5 bg-gray-50 rounded-xl border border-gray-200 animate-slideDown">
//                   <h4 className="font-semibold text-gray-900 mb-3">Features included:</h4>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//                     {Object.entries(plans.free.features).map(([feature, value]) => (
//                       <div key={feature} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-0">
//                         <span className="text-gray-700">{feature}</span>
//                         <span className={`font-medium ${value === 'Yes' ? 'text-green-600' : value === 'No' ? 'text-red-500' : 'text-gray-800'}`}>
//                           {value}
//                         </span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* SILVER Plan Button */}
//             <div className="relative">
//               <button
//                 onClick={() => handlePlanClick('silver')}
//                 className={`
//                   w-full text-left p-5 rounded-xl border-2 transition-all duration-300
//                   ${selectedPlan === 'silver' 
//                     ? 'border-blue-500 bg-blue-50 shadow-md' 
//                     : 'border-gray-200 hover:border-blue-300 hover:shadow-sm'}
//                 `}
//               >
//                 <div className="flex justify-between items-center">
//                   <div>
//                     <h3 className="text-xl font-bold text-gray-900">SILVER Plan</h3>
//                     <div className="mt-1">
//                       <span className="text-3xl font-bold text-gray-900">₹999</span>
//                       <span className="text-gray-600 ml-2">/year</span>
//                     </div>
//                     <p className="text-sm text-gray-500 mt-1">Best value for professionals</p>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     {selectedPlan === 'silver' && (
//                       <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
//                         Selected
//                       </span>
//                     )}
//                     <svg 
//                       className={`w-6 h-6 transform transition-transform ${expandedPlan === 'silver' ? 'rotate-180' : ''}`}
//                       fill="none" 
//                       stroke="currentColor" 
//                       viewBox="0 0 24 24"
//                     >
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                     </svg>
//                   </div>
//                 </div>
//               </button>
              
//               {/* Features slide down for SILVER */}
//               {expandedPlan === 'silver' && (
//                 <div className="mt-3 p-5 bg-gray-50 rounded-xl border border-gray-200 animate-slideDown">
//                   <h4 className="font-semibold text-gray-900 mb-3">Features included:</h4>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//                     {Object.entries(plans.silver.features).map(([feature, value]) => (
//                       <div key={feature} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-0">
//                         <span className="text-gray-700">{feature}</span>
//                         <span className={`font-medium ${value === 'Yes' ? 'text-green-600' : value === 'No' ? 'text-red-500' : 'text-gray-800'}`}>
//                           {value}
//                         </span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* GOLD Plan Button */}
//             <div className="relative">
//               <button
//                 onClick={() => handlePlanClick('gold')}
//                 className={`
//                   w-full text-left p-5 rounded-xl border-2 transition-all duration-300 relative
//                   ${selectedPlan === 'gold' 
//                     ? 'border-blue-500 bg-blue-50 shadow-md' 
//                     : 'border-gray-200 hover:border-blue-300 hover:shadow-sm'}
//                 `}
//               >
//                 {/* Most Popular Badge */}
//                 <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
//                   <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg">
//                     ⭐ MOST POPULAR
//                   </span>
//                 </div>
//                 <div className="flex justify-between items-center">
//                   <div>
//                     <h3 className="text-xl font-bold text-gray-900">GOLD Plan</h3>
//                     <div className="mt-1">
//                       <span className="text-3xl font-bold text-gray-900">₹2,999</span>
//                       <span className="text-gray-600 ml-2">/year</span>
//                     </div>
//                     <p className="text-sm text-gray-500 mt-1">Ultimate experience with all features</p>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     {selectedPlan === 'gold' && (
//                       <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
//                         Selected
//                       </span>
//                     )}
//                     <svg 
//                       className={`w-6 h-6 transform transition-transform ${expandedPlan === 'gold' ? 'rotate-180' : ''}`}
//                       fill="none" 
//                       stroke="currentColor" 
//                       viewBox="0 0 24 24"
//                     >
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                     </svg>
//                   </div>
//                 </div>
//               </button>
              
//               {/* Features slide down for GOLD */}
//               {expandedPlan === 'gold' && (
//                 <div className="mt-3 p-5 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200 animate-slideDown">
//                   <h4 className="font-semibold text-gray-900 mb-3">Premium features included:</h4>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//                     {Object.entries(plans.gold.features).map(([feature, value]) => (
//                       <div key={feature} className="flex items-center justify-between py-2 border-b border-amber-200 last:border-0">
//                         <span className="text-gray-700">{feature}</span>
//                         <span className={`font-medium ${value.includes('Yes') ? 'text-green-600' : value === 'No' ? 'text-red-500' : 'text-amber-700 font-semibold'}`}>
//                           {value}
//                         </span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Continue Button - Disabled until plan selected */}
//           <div className="px-6 pb-8 pt-2 border-t bg-gray-50 rounded-b-2xl">
//             <button
//               onClick={handleContinue}
//               disabled={!selectedPlan}
//               className={`
//                 w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300
//                 ${selectedPlan 
//                   ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5' 
//                   : 'bg-gray-300 cursor-not-allowed text-gray-500'}
//               `}
//             >
//               {!selectedPlan && 'Select a plan to continue'}
//               {selectedPlan === 'free' && '✨ Continue with FREE Plan ✨'}
//               {selectedPlan === 'silver' && '💳 Continue to Payment (₹999/yr)'}
//               {selectedPlan === 'gold' && '💎 Continue to Payment (₹2,999/yr)'}
//             </button>
            
//             {selectedPlan && selectedPlan !== 'free' && (
//               <p className="text-center text-xs text-gray-500 mt-3">
//                 Secure payment • Instant activation • 30-day money-back guarantee
//               </p>
//             )}
//             {selectedPlan === 'free' && (
//               <p className="text-center text-xs text-gray-500 mt-3">
//                 No credit card required • Free forever • Upgrade anytime
//               </p>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Add custom animation CSS */}
//       <style jsx>{`
//         @keyframes slideDown {
//           from {
//             opacity: 0;
//             transform: translateY(-10px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
//         .animate-slideDown {
//           animation: slideDown 0.3s ease-out;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default PricingModal;