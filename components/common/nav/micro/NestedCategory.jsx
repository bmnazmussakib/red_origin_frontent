import Link from "next/link";
import React from "react";

const NestedCategory = ({
	id,
	parent_id,
	name,
	banner,
	icon,
	img1,
	img2,
	img3,
	megamenucategories,
	slug,
}) => {
	const child_categories = (cat, section) => {
		let child_cat = cat?.filter((item) => item.mega_section === section);
		return {
			name: "",
			child_cat,
		};
	};
	return (
		<>
			<li className="nav-item dropdown has-megamenu">
				<Link
					prefetch={true}
					className="nav-link dropdown-toggle "
					href={"/category/" + slug ?? "#"}
				>
					{name} <i class="ri-arrow-down-s-line"></i>
					<div className="dropdown-menu megamenu " role="menu">
						<div className="row g-3">
							<div className="col-xs-12 col-md-12 col-md-12 col-lg-12">
								<div className="menugrid-main">
									<div className="gridbox-single">
										<div className="left-image-box d-none">
											<a href="#" className="">
												<img
													src={img1}
													alt=""
													className="img-fluid"
												/>
												{/* <Image
                          src={img1}
                          alt="category image"
                          fill
                          className="img-fluid"
                          loading="lazy"
                        /> */}
											</a>
										</div>
										{/* <div className="left-image-box">
                      <a href="#" className="">
                        <img src={img1} alt="" className="img-fluid" />
                      </a>
                    </div> */}
									</div>
									<div className="gridbox-single">
										{child_categories(
											megamenucategories,
											1
										).child_cat?.map((item) => {
											return (
												<div
													className="col-megamenu"
													key={item?.name}
												>
													<h6 className="title">
														<Link
															prefetch={true}
															href={
																"/category/" + item.slug ?? "#"
															}
														>
															{item.name}
														</Link>
													</h6>
													<ul className="list-unstyled">
														{item.megamenucategories?.map(
															(subitem) => {
																return (
																	<li>
																		<Link
																			prefetch={true}
																			href={
																				"/category/" +
																					subitem.slug ??
																				"#"
																			}
																		>
																			{subitem.name}
																		</Link>
																	</li>
																);
															}
														)}
													</ul>
												</div>
											);
										})}
									</div>
									<div className="gridbox-single">
										{child_categories(
											megamenucategories,
											2
										).child_cat?.map((item) => {
											return (
												<div
													className="col-megamenu"
													key={item?.name}
												>
													<h6 className="title">
														<Link
															prefetch={true}
															href={
																"/category/" + item.slug ?? "#"
															}
														>
															{item.name}
														</Link>
													</h6>
													<ul className="list-unstyled">
														{item.megamenucategories?.map(
															(subitem) => {
																return (
																	<li>
																		<Link
																			prefetch={true}
																			href={
																				"/category/" +
																					subitem.slug ??
																				"#"
																			}
																		>
																			{subitem.name}
																		</Link>
																	</li>
																);
															}
														)}
													</ul>
												</div>
											);
										})}
									</div>
									<div className="gridbox-single">
										{child_categories(
											megamenucategories,
											3
										).child_cat?.map((item) => {
											return (
												<div
													className="col-megamenu"
													key={item?.name}
												>
													<h6 className="title">
														<Link
															prefetch={true}
															href={
																"/category/" + item.slug ?? "#"
															}
														>
															{item.name}
														</Link>
													</h6>
													<ul className="list-unstyled">
														{item.megamenucategories?.map(
															(subitem) => {
																return (
																	<li>
																		<Link
																			prefetch={true}
																			href={
																				"/category/" +
																					subitem.slug ??
																				"#"
																			}
																		>
																			{subitem.name}
																		</Link>
																	</li>
																);
															}
														)}
													</ul>
												</div>
											);
										})}
									</div>
									<div className="gridbox-single">
										{child_categories(
											megamenucategories,
											4
										).child_cat?.map((item) => {
											return (
												<div
													className="col-megamenu"
													key={item?.name}
												>
													<h6 className="title">
														<Link
															prefetch={true}
															href={
																"/category/" + item.slug ?? "#"
															}
														>
															{item.name}
														</Link>
													</h6>
													<ul className="list-unstyled">
														{item.megamenucategories?.map(
															(subitem) => {
																return (
																	<li>
																		<Link
																			prefetch={true}
																			href={
																				"/category/" +
																					subitem.slug ??
																				"#"
																			}
																		>
																			{subitem.name}
																		</Link>
																	</li>
																);
															}
														)}
													</ul>
												</div>
											);
										})}
									</div>
									<div className="gridbox-single">
										<a href="#" className="">
											<img src={img2} alt="" className="img-fluid" />
											{/* <Image
                        src={img2}
                        alt="category image"
                        fill
                        className="img-fluid"
                        loading="lazy"
                      /> */}
										</a>
									</div>
									{/* <div className="gridbox-single">
										<a href="#" className="">
											<img src={img3} alt="" className="img-fluid" />
											{/* <Image
                        src={img3}
                        alt="category image"
                        fill
                        className="img-fluid"
                        loading="lazy"
                      /> */}
										{/* </a>
									</div> */}
								</div>
							</div>
						</div>
					</div>{" "}
				</Link>
			</li>
		</>
	);
};

export default NestedCategory;
