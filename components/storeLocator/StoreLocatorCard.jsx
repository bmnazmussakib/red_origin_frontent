import React from "react";

const StoreLocatorCard = ({
	id,
	title,
	address,
	business_hour,
	contact,
	image,
	mdirection,
	status,
	store_code,
}) => {
	return (
		<>
			{/* <div className="single-store">
				<div className="inner">
					<div className="heading">
						<h4>{title}</h4>
					</div>
					<ul className="nav flex-column">
						<li className="nav-item">
							<a href="tel:+4733378901" className="nav-link">
								{contact}
							</a>
						</li>
						<li className="nav-item">
							<a className="nav-link" disabled>
								{address}
							</a>
						</li>
						<li className="nav-item">
							<a className="nav-link" disabled>
								{business_hour}
							</a>
						</li>
						<li className="nav-item">
							<a href={mdirection} className="nav-link">
								https://g.page/{title}?share
							</a>
						</li>
					</ul>
				</div>
			</div> */}
			<div className="solasta-location-area">
				<div className="row g-4">
					<div className="col-xl-4 col-lg-6">
						<div className="solasta-location__item">
							<div className="overflow-hidden">
								<img
									className="w-100"
									src={image}
									alt="image"
								/>
							</div>
							<h5>{title}</h5>
							<p>
								{address}
							</p>
							<ul>
								<li>
									<i class="fa-regular fa-clock"></i> Business Hours:
									{business_hour}
								</li>
								<li>
									<i class="fa-solid fa-phone"></i> Contact:
									{contact}
								</li>
								<li>
									<i className="fa-solid fa-location-dot"></i>
									<a href={mdirection}> Location</a>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default StoreLocatorCard;
