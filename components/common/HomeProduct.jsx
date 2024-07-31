import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export default function HomeProduct({ img }) {
    return (
        <div className='home-product-card'>

            <Link href={``}>
                <img src="assets/images/red-origin/category-card/category_holder_img.jpg" alt="" className='opacity-0' />
                <Image
                    src={img}
                    loading={"lazy"}
                    alt="image"
                    width={0}
                    height={0}
                    layout="responsive"
                    objectFit="cover"
                    className="product-image"
                />
                <div className="product-info text-center">
                    <h6 className='product-title'>The Linen Shop</h6>
                    <p className='product-price'>৳ 1200.00</p>
                </div>
            </Link>

            <a href="" className="quickview">
                <i class="fa-solid fa-eye"></i>
            </a>
            <a href="" className='wishlist'>
                <i class="fa-regular fa-heart"></i>
            </a>
            <a href="" className="cart-btn">
                <i class="fa-solid fa-cart-shopping"></i>
            </a>
        </div>
    )
}
