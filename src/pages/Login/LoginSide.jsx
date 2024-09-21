import { motion, useScroll, useTransform } from "framer-motion";
import React from "react";

export default function LoginSide() {
  const { scrollYProgress } = useScroll();

  // 第一區塊：根據滑動比例縮放圖片
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.6]);

  // 第二區塊：方塊的淡入和翻轉效果
  const gridItemVariants = {
    hidden: { opacity: 0, rotateY: -90 },
    visible: {
      opacity: 1,
      rotateY: 0,
      transition: { duration: 0.8, ease: "easeInOut" },
    },
  };

  // 第三區塊：簡單的淡入效果
  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 1, ease: "easeInOut" },
    },
  };

  return (
    <div className="landing-page">
      {/* 第一個區塊 */}
      <motion.section className="relative flex h-screen w-full items-center justify-center bg-gray-200">
        <div className="absolute top-0 flex h-[150px] w-full items-center justify-center bg-gray-200 text-4xl">
          MoneyTrack 新世代的理財選擇
        </div>
        <motion.div
          className="absolute inset-0 mt-[150px]" // 圖片下方留出灰色區塊
          style={{ scale }}
        >
          <div className="flex h-full w-full items-center justify-center">
            <div className="h-full w-full bg-gray-400 text-center">
              圖片區塊 - 撐滿視窗
            </div>
          </div>
        </motion.div>
      </motion.section>

      {/* 第二個區塊 - 四格方塊，方塊有翻轉效果 */}
      <motion.section
        className="flex flex-col items-center justify-center bg-white py-20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.h2 className="mb-8 text-4xl font-bold">我們的特色</motion.h2>
        <div className="grid grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              className="h-[200px] w-[200px] bg-gray-300"
              variants={gridItemVariants}
            >
              特色 {i}
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* 第三個區塊 - 標題與兩個圖片，淡入動畫 */}
      <motion.section
        className="flex flex-col items-center justify-center bg-gray-100 py-20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.h2 className="mb-8 text-4xl font-bold">我們的產品</motion.h2>
        <div className="grid grid-cols-2 gap-8">
          {[1, 2].map((i) => (
            <motion.div
              key={i}
              className="h-[300px] w-[400px] bg-gray-300"
              variants={imageVariants}
            >
              產品圖 {i}
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* 第四個區塊 - CTA 區塊 */}
      <motion.section
        className="flex h-screen flex-col items-center justify-center bg-white py-20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.h2 className="mb-8 text-4xl font-bold">
          準備好開始了嗎？
        </motion.h2>
        <motion.p className="mb-4 text-xl">與我們一起創造未來。</motion.p>
        <motion.button
          className="rounded-lg bg-yellow-500 px-8 py-3 text-white shadow-lg"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          立即開始
        </motion.button>
      </motion.section>
    </div>
  );
}