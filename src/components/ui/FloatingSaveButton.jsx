import React, { useState, useEffect, useCallback, useRef } from 'react';
import { FaHeart, FaRegHeart, FaSpinner } from 'react-icons/fa';
import { motion, AnimatePresence, useMotionValue } from 'framer-motion';
import { useSavedProfiles } from '@/hooks/useSavedProfiles';

// Toast notification component
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 50, scale: 0.9 }}
      transition={{ type: 'spring', damping: 20 }}
      className={`fixed bottom-20 right-4 z-50 px-4 py-2.5 rounded-lg shadow-lg text-white text-sm font-medium backdrop-blur-sm ${
        type === 'error' ? 'bg-red-500' : 'bg-green-500'
      }`}
    >
      <div className="flex items-center gap-2">
        {type === 'success' ? '✓' : '⚠️'}
        {message}
      </div>
    </motion.div>
  );
};

// Main FloatingSaveButton component with drag functionality
const FloatingSaveButton = ({ 
  profileId, 
  profileName,
  profileImage,
  initialSaved = false,
  onSaveComplete,
  onRemoveComplete,
  className = '',
  initialPosition = { x: 0, y: 0 }
}) => {
  const { isSaved, isLoading, checkSaveStatus, toggleSaveProfile } = useSavedProfiles();
  const [showTooltip, setShowTooltip] = useState(false);
  const [toast, setToast] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartTime, setDragStartTime] = useState(0);
  const [hasCheckedStatus, setHasCheckedStatus] = useState(false);
  const hasInitialized = useRef(false);
  const constraintsRef = useRef(null);
  
  // Motion values for drag position
  const x = useMotionValue(initialPosition.x);
  const y = useMotionValue(initialPosition.y);
  
  // Check initial save status when component mounts
  useEffect(() => {
    if (!hasInitialized.current && profileId) {
      const checkStatus = async () => {
        await checkSaveStatus(profileId);
        setHasCheckedStatus(true);
      };
      checkStatus();
      hasInitialized.current = true;
    }
  }, [profileId, checkSaveStatus]);
  
  // Load saved position from localStorage
  useEffect(() => {
    try {
      const savedPosition = localStorage.getItem(`button_position_${profileId}`);
      if (savedPosition) {
        const pos = JSON.parse(savedPosition);
        x.set(pos.x);
        y.set(pos.y);
      }
    } catch (error) {
      console.error('Failed to load button position:', error);
    }
  }, [profileId, x, y]);
  
  // Save position when dragging ends
  const handleDragEnd = (event, info) => {
    setIsDragging(false);
    const newX = x.get();
    const newY = y.get();
    
    try {
      localStorage.setItem(`button_position_${profileId}`, JSON.stringify({
        x: newX,
        y: newY,
        timestamp: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Failed to save button position:', error);
    }
  };
  
  // Show toast message
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };
  
  // Handle save/unsave action
  const handleToggleSave = async () => {
    if (isDragging) return;
    
    const dragDuration = Date.now() - dragStartTime;
    if (dragDuration < 200 && !isDragging) {
      await performSaveAction();
    }
  };
  
  const performSaveAction = async () => {
    if (isLoading) return;
    
    const previousState = isSaved;
    
    try {
      const result = await toggleSaveProfile(profileId);
      
      if (!result.success) {
        showToast(`Failed to ${previousState ? 'remove' : 'save'} profile. Please try again.`, 'error');
        return;
      }
      
      showToast(
        isSaved 
          ? `Removed ${profileName || 'profile'} from saves` 
          : `Saved ${profileName || 'profile'} successfully!`,
        'success'
      );
      
      if (!isSaved && onSaveComplete) {
        onSaveComplete({ profileId, profileName, profileImage });
      } else if (isSaved && onRemoveComplete) {
        onRemoveComplete({ profileId });
      }
      
      // Google Analytics tracking
      if (window.gtag) {
        window.gtag('event', isSaved ? 'unsave_profile' : 'save_profile', {
          profile_id: profileId,
          profile_name: profileName,
          timestamp: new Date().toISOString(),
        });
      }
      
    } catch (error) {
      showToast(`Failed to ${previousState ? 'remove' : 'save'} profile. Please try again.`, 'error');
      console.error('Save operation failed:', error);
    }
  };
  
  const handleDragStart = () => {
    setDragStartTime(Date.now());
    setIsDragging(true);
    setShowTooltip(false);
  };
  
  return (
    <>
      <div ref={constraintsRef} className="fixed inset-0 pointer-events-none" />
      
      <motion.div
        className={`fixed bottom-4 right-4 z-40 ${className}`}
        drag
        dragConstraints={constraintsRef}
        dragMomentum={false}
        dragElastic={0.1}
        style={{ x, y }}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        whileDrag={{ cursor: 'grabbing' }}
        animate={isDragging ? { scale: 1.05 } : { scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {/* Tooltip - Now positioned ABOVE the icon */}
        <AnimatePresence>
          {showTooltip && !isLoading && !isDragging && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.8 }}
              transition={{ duration: 0.15 }}
              className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 whitespace-nowrap pointer-events-none"
            >
              <div className="relative">
                {/* Tooltip arrow */}
                <div className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-2 h-2 bg-gray-900 rotate-45"></div>
                {/* Tooltip content */}
                <div className="bg-gray-90 text-xs px-3 py-1.5 rounded-lg shadow-lg font-medium relative z-10 text-pink-600">
                  {isSaved ? 'Remove from saved' : 'Save this profile'}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Drag indicator - positioned above */}
        <AnimatePresence>
          {isDragging && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.8 }}
              className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 whitespace-nowrap pointer-events-none"
            >
              <div className="bg-gray-900/90 backdrop-blur-sm text-white text-[10px] px-2 py-1 rounded-full">
                Drag to move
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Main Button */}
        <motion.button
          onClick={handleToggleSave}
          onMouseEnter={() => !isDragging && setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          disabled={isLoading}
          className="relative group cursor-grab active:cursor-grabbing"
          whileTap={{ scale: isLoading || isDragging ? 1 : 0.92 }}
          animate={{ 
            scale: isLoading ? 0.98 : 1,
            boxShadow: isSaved ? '0 0 0 3px rgba(236, 72, 153, 0.3)' : 'none'
          }}
          aria-label={isSaved ? 'Remove from saved' : 'Save profile'}
          aria-pressed={isSaved}
        >
          <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-100">
            {isLoading ? (
              <FaSpinner className="text-pink-500 text-xl animate-spin" />
            ) : (
              <AnimatePresence mode="wait" initial={false}>
                {isSaved ? (
                  <motion.div
                    key="heart-filled"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 180 }}
                    transition={{ 
                      type: 'spring', 
                      stiffness: 400, 
                      damping: 25,
                      duration: 0.3
                    }}
                  >
                    <FaHeart className="text-pink-500 text-xl drop-shadow-sm" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="heart-empty"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <FaRegHeart className="text-gray-500 text-xl group-hover:text-pink-400 transition-colors" />
                  </motion.div>
                )}
              </AnimatePresence>
            )}
            
            {/* Save count badge - removed as new API only tracks save status */}
            
          </div>
          
          {/* Ripple effect on click */}
          {!isDragging && (
            <motion.div
              className="absolute inset-0 rounded-full bg-pink-500 pointer-events-none"
              initial={{ scale: 0, opacity: 0.5 }}
              whileTap={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 0.4 }}
            />
          )}
        </motion.button>
      </motion.div>
      
      {/* Toast notifications */}
      <AnimatePresence>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingSaveButton;