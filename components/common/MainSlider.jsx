import React from "react";
import { SwiperSlide } from "swiper/react";
import Slider from "./Slider";

function MainSlider({ banners }) {
	console.log("banners", banners);
	return (
		<>
			<section className="main-slider">
				<Slider
					className="home-slider"
					perPage={1}
					responsivePerPage={1}
					navigation={false}
					autoplay={{
						delay: 5000,
						disableOnInteraction: false,
					}}
					loop={true}
				>
					{/* {banners?.map((banner,index)=>{
                     return (
					<SwiperSlide>
						<Link prefetch={true} href={banner?.link??"#"} target="_self">
						<Image fill={true} loading="lazy" alt="" className="img-fluid" src={banner?.img} /> */}
					{/* <img
								src="/assets/images/solasta/banner/Cover-4.png"
								alt="image"
							/> */}
					{/* </Link>
					</SwiperSlide>
					 )
					})} */}
					{/* <SwiperSlide>
						<Link prefetch={true} href={"#"} target="_self">
							<img
								src="/assets/images/solasta/banner/Cover-5.png"
								alt="image"
							/>
						</Link>
					</SwiperSlide> */}
					<SwiperSlide>
						<a href="#0">
							<img
								src="/assets/images/rise/banner/banner1.jpg"
								alt="Rise Banner"
							/>
						</a>
					</SwiperSlide>
					<SwiperSlide>
						<a href="#0">
							<img
								src="/assets/images/rise/banner/banner2.jpg"
								alt="Rise Banner"
							/>
						</a>
					</SwiperSlide>
				</Slider>
			</section>
		</>
	);
}

export default MainSlider;
