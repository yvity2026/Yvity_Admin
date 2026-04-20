import { testimonialsData } from '@/app/advisor/testimonials/page'
import React from 'react'

const Testimonial_Stats = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full">
          {testimonialsData.map((item, index) => (
            <div
              key={index}
              className="min-h-[70px] md:h-[86px] w-full  py-4 md:py-[12.5px] px-4 md:px-[55px] rounded-2xl border border-[#E2E1DC] bg-white"
            >
              <span className="flex items-center flex-col gap-1">
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-[#111827] text-center font-poppins text-[28px] leading-normal">
                  {item.count}
                </p>
                <p className="text-gray-500 text-[10px] sm:text-xs font-medium">
                  {item.label}
                </p>
              </span>
            </div>
          ))}
        </div>
  )
}

export default Testimonial_Stats