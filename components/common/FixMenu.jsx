import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { cookie } from "../../helpers/helper";

export default function FixMenu() {
  let cart = useSelector((state) => state?.cartSlice?.cart);
  let wishList = useSelector((state) => {
    return state?.wishListSlice?.wishlist;
  });
  const [user, setUser] = useState();

  useEffect(() => {
    if (user == undefined) {
      setUser(cookie("user_data"));
    }
  }, [user]);

  return (
		<section className="fixmenu-main">
			<div className="container-fluid">
				<div className="row">
					<div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
						<ul className="nav">
							<li className="nav-item">
								<Link prefetch={true} className="nav-link" href="/">
									<i className="ri-home-4-line"></i>
								</Link>
							</li>
							<li className="nav-item">
								<Link
									prefetch={true}
									className="nav-link"
									href="/wishlist"
								>
									<i className="ri-heart-3-line"></i>{" "}
									<span className="badge badge-pill bg-info">
										<sup>{wishList?.length}</sup>
									</span>
								</Link>
							</li>

							<li className="nav-item">
								<Link prefetch={true} className="nav-link" href="/cart">
									<i className="ri-shopping-cart-line"></i>
									<span className="badge badge-pill bg-danger">
										<sup>{cart?.length}</sup>
									</span>
								</Link>
							</li>

							<li className="nav-item">
								<Link
									prefetch={true}
									className="nav-link"
									href={user ? "/profile" : "/login"}
								>
									<i className="ri-user-line"></i>
								</Link>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</section>
  );
}
