import React, { useState } from "react";
import img2 from "../assets/Images/kumbh image 2.png";
import img3 from "../assets/Images/kumbh image 3.jpeg";
import ContactImage from "../assets/Images/Contact Image.png";

import MapBanner from "../assets/MonitoringImages/Landing/map_banner.png";
import CleanScared from "../assets/MonitoringImages/Landing/clean_scared.png";

import TentImage from "../assets/MonitoringImages/Landing/tentimage.jpg";

import {
  Carousel,
  CarouselItem,
  CarouselControl,
  CarouselIndicators,
  CarouselCaption,
} from "reactstrap";
import { Link, useOutletContext } from "react-router-dom";

const items = (dict, lang) => {
  return [
    {
      img: (
        <div className="h-72 sm:80 md:h-96 w-full overflow-hidden flex  item-center justify-between">
          <div className="absolute h-72 sm:80 md:h-96 grid grid-cols-1 md:grid-cols-2 justify-between w-full p-4 bg-ffe">
            <div className=" flex flex-col items-center justify-center text-white gap-3">
              <div className="text-1d text-base md:text-2xl xl:text-4xl font-bold text-center">
                {/* {dict.bring_fam[lang]} */}
                Track, Analyze, Optimize Elevating Sanitation and Tentage
                Standards
              </div>
              <div className="text-90  text-sm md:text-2xl xl:text-4xl font-bold">
                {dict.toll_free[lang]}
              </div>
              <div className="flex justify-around w-full text-xs md:text-sm xl:text-base">
                <div className="flex">
                  <div className="flex gap-1 flex-col text-center">
                    <div>
                      <span className="text-orange-900 font-semibold">
                        IURS:{" "}
                      </span>{" "}
                      <span className="text-1d font-semibold">
                        {dict.call_free[lang]}
                      </span>
                    </div>
                    <div>
                      <span className="text-orange-900 font-semibold">
                        {dict.email[lang]}:
                      </span>{" "}
                      <span className="text-1d font-semibold">
                        {" "}
                        support@kumbhmonitoringsystem.in
                      </span>
                    </div>
                    <div>
                      <span className="text-orange-900 font-semibold">
                        {dict.web_portal[lang]}:{" "}
                      </span>
                      <span className="font-semibold">
                        <Link
                          to={"http://103.86.182.148:3001/dashboard"}
                          className="font-semibold no-underline text-1d"
                        >
                          http://103.86.182.148:3001/dashboard
                        </Link>
                      </span>
                    </div>
                    <div>
                      <span className="text-orange-900 font-semibold">
                        {dict.download_app[lang]}:
                      </span>
                      <span className="text-1d font-semibold"> Download</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-col items-center gap-2 hidden md:flex justify-center">
              <img className="w-10/12" src={ContactImage} alt="" />
            </div>
          </div>
        </div>
      ),
      key: 1,
      caption: "",
    },
    {
      img: (
        <div className="h-72 sm:80  md:h-96 overflow-hidden flex item-center">
          <img src={TentImage} alt="" className="w-full overflow-hidden" />
        </div>
      ),
      key: 2,
      caption: "",
    },
    {
      img: (
        <div className="h-72 sm:80 md:h-96 overflow-hidden flex item-center justify-center bg-white">
          <img src={CleanScared} alt="" className=" overflow-hidden" />
        </div>
      ),
      key: 3,
      caption: "",
    },
    // {
    //   img: (
    //     <div className="h-72 sm:80 md:h-96 overflow-hidden flex item-center">
    //       <img src={img4} alt="" className="w-full overflow-hidden" />
    //     </div>
    //   ),
    //   key: 4,
    //   caption: "",
    // },
    // {
    //   img: (
    //     <div className="h-72 sm:80 md:h-96 overflow-hidden flex item-center">
    //       <img src={img5} alt="" className="w-full overflow-hidden" />
    //     </div>
    //   ),
    //   key: 5,
    //   caption: "",
    // },
    // {
    //   img: (
    //     <div className="h-72 sm:80 md:h-96 overflow-hidden flex item-center">
    //       <img src={img6} alt="" className="w-full overflow-hidden" />
    //     </div>
    //   ),
    //   key: 6,
    //   caption: "",
    // },
  ];
};
function UncontrolledCarouselLogin(args) {
  const [dict, lang] = useOutletContext();

  const [activeIndex, setActiveIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const next = () => {
    if (animating) return;
    const nextIndex =
      activeIndex === items(dict, lang).length - 1 ? 0 : activeIndex + 1;
    setActiveIndex(nextIndex);
  };

  const previous = () => {
    if (animating) return;
    const nextIndex =
      activeIndex === 0 ? items(dict, lang).length - 1 : activeIndex - 1;
    setActiveIndex(nextIndex);
  };

  const goToIndex = (newIndex) => {
    if (animating) return;
    setActiveIndex(newIndex);
  };

  const slides = items(dict, lang).map((item) => {
    return (
      <CarouselItem
        onExiting={() => setAnimating(true)}
        onExited={() => setAnimating(false)}
        key={item.src}
      >
        {item.img}
        <CarouselCaption
          captionText={item.caption}
          captionHeader={item.caption}
        />
      </CarouselItem>
    );
  });

  return (
    <Carousel
      activeIndex={activeIndex}
      next={next}
      previous={previous}
      {...args}
    >
      <CarouselIndicators
        items={items(dict, lang)}
        activeIndex={activeIndex}
        onClickHandler={goToIndex}
      />
      {slides}
      <CarouselControl
        direction="prev"
        directionText="Previous"
        onClickHandler={previous}
      />
      <CarouselControl
        direction="next"
        directionText="Next"
        onClickHandler={next}
      />
    </Carousel>
  );
}

export default UncontrolledCarouselLogin;
