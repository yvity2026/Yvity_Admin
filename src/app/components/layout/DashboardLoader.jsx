// components/MotionLoader.jsx
'use client';
import { motion, AnimatePresence } from 'framer-motion';

const DashboardLoader = ({ message = 'Loading...' }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800"
    >
      <div className="text-center">
        {/* Spinning Loader */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-blue-200 dark:border-blue-900 rounded-full border-t-blue-600 dark:border-t-blue-400"
        />
        
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-4 text-gray-600 dark:text-gray-400 font-medium"
        >
          {message}
        </motion.p>
      </div>
    </motion.div>
  );
};

export default DashboardLoader;