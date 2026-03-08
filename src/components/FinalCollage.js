import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './FinalCollage.css';

const FinalCollage = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  // Array of images from a to w
  // Array of images from 1 to 15
  const images = Array.from({ length: 15 }, (_, i) => `/${i + 1}.jpeg`);

  const TurkishMoon = ({ className = '' }) => (
    <svg className={className} viewBox="0 0 300 300" aria-hidden>
      <path
        fill="currentColor"
        d="M150 25C82.8 25 28.2 79.6 28.2 146.8c0 67.2 54.6 121.8 121.8 121.8 44.3 0 83-23.7 104.2-59.1-11.8 5.2-24.9 8.1-38.6 8.1-53.4 0-96.7-43.3-96.7-96.7S162.2 44.2 215.6 44.2c13.7 0 26.8 2.9 38.6 8.1C233 28.7 194.3 25 150 25z"
      />
    </svg>
  );

  return (
    <motion.div
      className="collage-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="collage-title">
        <TurkishMoon className="turkish-moon" />
        <TurkishMoon className="turkish-moon mirror" />
      </div>

      <div className="photo-grid">
        {images.map((img, index) => (
          <motion.div
            key={img}
            className="photo-container"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            whileHover={{ scale: 1.05, zIndex: 2 }}
          >
            <motion.img
              src={img}
              alt={`Memory ${index + 1}`}
              className="memory-photo"
              onClick={() => setSelectedImage(img)}
            />
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedImage && (
          <>
            <motion.div
              className="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedImage(null)}
            />
            <motion.div
              className="fixed inset-0 z-[1001] flex items-center justify-center p-4 sm:p-8 pointer-events-none"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <div className="relative max-w-full max-h-full flex items-center justify-center pointer-events-auto">
                <motion.img
                  src={selectedImage}
                  alt="Enlarged view"
                  className="enlarged-image"
                />
                <motion.button
                  className="close-button"
                  onClick={() => setSelectedImage(null)}
                  whileHover={{ scale: 1.1 }}
                >
                  ×
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default FinalCollage;