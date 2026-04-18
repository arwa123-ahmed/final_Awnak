import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FaFacebookF, FaTwitter, FaInstagram } from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import i18n from 'i18next';

const Footer = () => {
  const { t } = useTranslation();
  const isRTL = i18n.language === 'ar';

  // Dark mode state
  const [darkMode, setDarkMode] = useState(false);





  return (
    <footer className={`  text-gray-800 dark:text-white py-8 border-t border-gray-200 dark:border-gray-700 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div className={isRTL ? 'text-right' : 'text-left'}>
            <h3 className="text-xl font-bold mb-4 text-green-600 dark:text-green-400">{t("Awnak")}</h3>
            <p className="text-gray-600 dark:text-gray-300">{t("footerComanyInfo")}</p>
          </div>

          {/* Quick Links */}
          <div className='mr-6'>
            <div className={isRTL ? 'text-right' : 'text-left'}>
            <h4 className="text-lg font-semibold mb-4 text-green-600 dark:text-green-400">{t("quickLinks")}</h4>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition">
                  {t("home")}
                </a>
              </li>
              <li>
                <a href="/about" className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition">
                  {t("about")}
                </a>
              </li>
              <li>
                <a href="/contact" className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition">
                  {t("contact")}
                </a>
              </li>
            </ul>
          </div>
          </div>
          

          {/* Social Media */}
          <div className={isRTL ? 'text-right' : 'text-left'}>
            <h4 className="text-lg font-semibold mb-4 text-green-600 dark:text-green-400">{t("followUs")}</h4>
            <div className="flex gap-4 justify-start">
              <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition">
                <FaFacebookF className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition">
                <FaTwitter className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition">
                <FaInstagram className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-300 dark:border-gray-600 mt-8 pt-4 text-center">
          <p className="text-gray-600 dark:text-gray-300">
            &copy; {new Date().getFullYear()} {t("Awnak")} {t("companyPolicy")} |{' '}
            <a href="#" className="text-green-600 dark:text-green-400 hover:underline">
              {t("privacyPolicy")}
            </a>
          </p>
         
        </div>
      </div>
    </footer>
  );
};

export default Footer;
