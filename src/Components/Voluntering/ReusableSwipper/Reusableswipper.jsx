import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

// Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import './vswipperStyle.css';

const CustomSwiper = ({
  images = [],
  delay = 4000,
  effect = 'fade',
  showNavigation = false,
  height = 'auto',
  margin = '50px auto'
}) => {
  const progressCircle = useRef(null);
  const progressContent = useRef(null);

  const onAutoplayTimeLeft = (s, time, progress) => {
    if (progressCircle.current && progressContent.current) {
      progressCircle.current.style.setProperty('--progress', 1 - progress);
      progressContent.current.textContent = `${Math.ceil(time / 1000)}s`;
    }
  };

  return (
    <div className="swiper-container" style={{ height }}>
      <Swiper
        spaceBetween={20}
        centeredSlides={true}
        effect={effect}
        autoplay={{
          delay: delay,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={showNavigation}
        modules={[Autoplay, Pagination, Navigation]}
        onAutoplayTimeLeft={onAutoplayTimeLeft}
        className="mySwiper"
      >
        {images.map((src, index) => (
          <SwiperSlide key={index}>
            <img src={src} alt={`Slide ${index + 1}`} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default CustomSwiper;
