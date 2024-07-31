import React from 'react';
import { Navigation, Pagination, Scrollbar, A11y, Autoplay } from 'swiper';
import { Swiper } from 'swiper/react';
function Slider({
	children,
	perPage = 1,
	className = "",
	navigation = true,
	pagination = false,
	loop = false,
	breakpoints,
	...rest
}) {
	return (
		<Swiper
			modules={[Autoplay, Navigation, Pagination, Scrollbar, A11y]}
			className={className}
			spaceBetween={0}
			slidesPerView={perPage}
			navigation={navigation}
			pagination={{ clickable: pagination }}
			loop={loop}
			speed={800}
			autoplay={{
				delay: 3000,
				disableOnInteraction: false,
			}}
			breakpoints={breakpoints}
			// onSlideChange={() => console.log("slide change")}
			// onSwiper={(swiper) => console.log()}
			{...rest}
		>
			{children}
		</Swiper>
	);
}

export default Slider;

//  breakpoints={{
//     // when window width is >= 640px
//     640: {
//       width: 640,
//       slidesPerView: 1,
//     },
//     // when window width is >= 768px
//     768: {
//       width: 768,
//       slidesPerView: 2,
//     },
//   }}
