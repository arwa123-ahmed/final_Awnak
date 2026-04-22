import { motion } from "framer-motion";
import handshake from "../../images/hand3.jpg";

const FirstSection = () => {
  return (
    <section className="w-full flex items-center justify-center py-10  transition-colors duration-300">

      <div className="relative w-[95%] h-[85vh] rounded-3xl overflow-hidden shadow-2xl">

        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-300 dark:brightness-75"
          style={{ backgroundImage: `url(${handshake})` }}
        />

        {/* Overlay */}
        <div className="absolute inset-0 
          bg-gradient-to-r from-black/60 via-green-900/30 to-green-600/20
          dark:from-black/80 dark:via-gray-900/60 dark:to-green-900/40
          transition-all duration-300"
        />

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6" dir="rtl">

          <motion.p
            className="mt-6 text-white/70 dark:text-green-100/50 text-sm md:text-lg font-extralight tracking-widest"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            قال رسول الله ﷺ
          </motion.p>

          <motion.h1
            className="text-3xl md:text-5xl lg:text-6xl font-light leading-relaxed 
              text-white dark:text-gray-100 
              tracking-wide transition-colors duration-300"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1 }}
          >
            واللهُ في{" "}
            <span className="text-green-400 dark:text-green-300 font-medium transition-colors duration-300">
              عونِ
            </span>{" "}
            العبدِ
            <br />
            ما دام العبدُ في{" "}
            <span className="text-green-400 dark:text-green-300 font-medium transition-colors duration-300">
              عونِ
            </span>{" "}
            أخيه
          </motion.h1>

          <motion.button
            className="mt-8 px-8 py-3 
              bg-green-600 hover:bg-green-700 
              dark:bg-green-700 dark:hover:bg-green-600
              text-white rounded-full shadow-lg 
              dark:shadow-green-900/50
              transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ابدأ رحلتك معنا
          </motion.button>

        </div>
      </div>
    </section>
  );
};

export default FirstSection;