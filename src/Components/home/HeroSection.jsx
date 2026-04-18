import { motion } from "framer-motion";
import hero from "../../images/logoA.png";

const HeroSection = () => (
  <motion.section
    className="min-h-screen flex items-center justify-center px-4 md:px-16  dark:bg-gray-900"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 1 }}
  >
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center justify-center">

      {/* Text Section */}
      <motion.div
        className="text-center md:text-left space-y-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
      >
        <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white leading-[1.3]">
          Welcome to <span className="text-green-600">Awnak</span>
        </h1>

        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300">
          Looking for services delivered by trusted professionals? Request your
          service now and benefit from expertise ready to meet your needs with
          top quality.
        </p>

        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mt-4">
          Do you have skills or experience you’d like to share? Join us as a
          volunteer and help make a real impact in the community.
        </p>
      </motion.div>

      {/* Illustration Section */}
      <motion.div
        className="hidden md:flex justify-center"
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
      >
        <img
          src={hero}
          alt="Hero Illustration"
          className="w-96 h-auto rounded-2xl shadow-2xl"
        />
      </motion.div>

    </div>
  </motion.section>
);

export default HeroSection;