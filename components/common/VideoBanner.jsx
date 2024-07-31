import Link from 'next/link'
import React from 'react'

export default function VideoBanner() {
    return (
        <section className='video-banner-main'>
            <section class="video-banner">
                <video autoPlay loop muted playsInline className="back-video">
                    <source src="assets/images/red-origin/banner/video/banner-video.mp4" type="video/mp4" />
                </video>
                <div class="banner-content text-center">
                    <h1 class="banner-title">
                        The Summer Sale
                    </h1>
                    <h5 class="banner-subtitle">Up to 60% off + extra 20% off sale styles</h5>
                    <div className="banner-btn-wrapper">
                        <div className="double-btn">
                            <Link href="" className="btn ">shop Men</Link>
                            <Link href="" className="btn ">shop Women</Link>
                        </div>
                        <div className="single-btn">
                        <Link href="" className="btn ">Details</Link>
                        </div>

                    </div>


                </div>
            </section>
        </section>
    )
}
