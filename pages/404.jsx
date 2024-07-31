import Link from "next/link";

export default function NotFound() {
	return (
		<section className="notFound">
			<div className="container">
				<div className="content text-center">
					<img
						src="/assets/images/not-found.png"
						alt=""
						className="img-fluid"
					/>
					<div class="d-grid gap-2 col-6 mx-auto">
						<Link
							href={"/"}
							class="btn continue-btn"
							type="button"
							style={{ backgroundColor: "#CC9933" }}
						>
							Go to Home
						</Link>
						{/* <Link href={'/contact-us'} class="btn continue-btn" type="button" style={{backgroundColor: '#CC9933'}}>Contact</Link> */}
					</div>
				</div>
			</div>
		</section>
	);
}
