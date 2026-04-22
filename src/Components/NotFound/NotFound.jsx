import React from 'react';
import { useTranslation } from 'react-i18next';

const NotFoundPage = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-100 dark:!bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white dark:!bg-gray-800 rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <svg className="w-16 h-16 mx-auto text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">{t("notFoundTitle")}</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">{t("notFoundDesc")}</p>
        <a
          href="/"
          className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition duration-300"
        >
          {t("goBackHome")}
        </a>
      </div>
    </div>
  );
};

export default NotFoundPage;