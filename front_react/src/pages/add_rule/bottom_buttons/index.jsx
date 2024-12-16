import React from 'react';
import { motion } from 'framer-motion';
import {
  BOTTOM_BUTTON_CONTAINER_VARIANTS,
  LEFT_BUTTON_VARIANTS,
  RIGHT_BUTTON_VARIANTS,
} from '@/utils/modalConstants';

const deviceIconSvg = "data:image/svg+xml,%3csvg%20width='48'%20height='48'%20viewBox='0%200%2048%2048'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3crect%20width='48'%20height='48'%20rx='8'%20fill='%23353535'/%3e%3cpath%20d='M24%2022C21.2386%2022%2019%2024.2386%2019%2027C19%2029.7614%2021.2386%2032%2024%2032C26.7614%2032%2029%2029.7614%2029%2027C29%2024.2386%2026.7614%2022%2024%2022ZM24%2020C27.866%2020%2031%2023.134%2031%2027C31%2030.866%2027.866%2034%2024%2034C20.134%2034%2017%2030.866%2017%2027C17%2023.134%2020.134%2020%2024%2020ZM28%2015C28.5523%2015%2029%2015.4477%2029%2016C29%2016.5523%2028.5523%2017%2028%2017H20C19.4477%2017%2019%2016.5523%2019%2016C19%2015.4477%2019.4477%2015%2020%2015H28Z'%20fill='%23BABABA'/%3e%3c/svg%3e";

const actionIconSvg = "data:image/svg+xml,%3csvg%20width='48'%20height='48'%20viewBox='0%200%2048%2048'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3crect%20width='48'%20height='48'%20rx='8'%20fill='%23353535'/%3e%3cpath%20d='M24%2012C24.5523%2012%2025%2012.4477%2025%2013V35C25%2035.5523%2024.5523%2036%2024%2036C23.4477%2036%2023%2035.5523%2023%2035V13C23%2012.4477%2023.4477%2012%2024%2012ZM12%2024C12%2023.4477%2012.4477%2023%2013%2023H35C35.5523%2023%2036%2023.4477%2036%2024C36%2024.5523%2035.5523%2025%2035%2025H13C12.4477%2025%2012%2024.5523%2012%2024Z'%20fill='%23BABABA'/%3e%3c/svg%3e";

function BottomButtons({ bottomButtonsControls, onDeviceClick, onActionClick, handleImageLoad }) {
  return (
    <motion.div
      className="flex items-center justify-center w-full h-[80px] px-4"
      style={{
        position: 'fixed',
        bottom: '20px',
        zIndex: 1000
      }}
      variants={BOTTOM_BUTTON_CONTAINER_VARIANTS}
      initial="hidden"
      animate={bottomButtonsControls}
    >
      <div className="flex items-center justify-between w-[120px]">
        <motion.div
          className="flex items-center justify-center w-[60px] h-[60px] cursor-pointer"
          onClick={onDeviceClick}
          variants={LEFT_BUTTON_VARIANTS}
          whileHover="whileHover"
          whileTap="whileTap"
        >
          <img
            src={deviceIconSvg}
            alt="Device Icon"
            className="w-[52px] h-[52px]"
            onLoad={handleImageLoad}
          />
        </motion.div>

        <motion.div
          className="flex items-center justify-center w-[60px] h-[60px] cursor-pointer"
          onClick={onActionClick}
          variants={RIGHT_BUTTON_VARIANTS}
          whileHover="whileHover"
          whileTap="whileTap"
        >
          <img
            src={actionIconSvg}
            alt="Action Icon"
            className="w-[52px] h-[52px]"
            onLoad={handleImageLoad}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}

export default BottomButtons;