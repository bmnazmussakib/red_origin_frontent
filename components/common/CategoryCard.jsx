import Image from 'next/image'
import React from 'react'

export default function CategoryCard({img}) {
    return (
        <div className='category-card'>
            <img src="assets/images/red-origin/category-card/category_holder_img.jpg" alt="" className='opacity-0' />
            <Image
                src={img}
                loading={"lazy"}
                alt="image"
                width={0}
                height={0}
                layout="responsive"
                objectFit="cover"
                className="category-card-image"
            />
            <div className="category-info text-center">
                <h4>The Linen Shop</h4>
                <div className='d-flex justify-content-center category-info-links'>
                    <p>
                        <a href="#">Shop Men</a>
                    </p>
                    <p>
                        <a href="#">Shop Women</a>
                    </p>
                </div>
            </div>
        </div>
    )
}
