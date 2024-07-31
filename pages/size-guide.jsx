import React, { useEffect, useState } from "react";
import { get } from "../helpers/helper";
import mainStore from "../store";

const Page = ({ pageInfo }) => {
	const [file, setFile] = useState(null);
	const getFilePdf = async () => {
		await get("/v2/image-link/" + pageInfo?.content).then((res) => {
			let fileData = res.data;
			setFile(fileData?.data);
		});
	};
	useEffect(() => {
		getFilePdf();
	}, []);

	const downloadFile = async () => {
		try {
			const { response } = get(
				`v2/sizeguidedownalod/${pageInfo?.content}`
			).then((response) => {
				const linkSource = `data:${response.data?.mimeType};base64,${response.data?.fileContent}`;
				const downloadLink = document.createElement("a");
				const fileName = response.data?.filename;
				downloadLink.href = linkSource;
				downloadLink.download = fileName;
				downloadLink.click();
			});
		} catch (error) {
			console.error("Error downloading the file", error);
		}
	};

	return (
		<>
			{" "}
			<div className="d-none">
				<img className="img-fluid" src={pageInfo?.image} alt="" />
			</div>
			<div className="solasta-page__gap">
				<div className="container">
					<h2 className="mb-2">{pageInfo?.title}</h2>

					{file && (
						<button
							className="solasta__btn mb-2 float-end"
							onClick={downloadFile}
						>
							Download Size Guide
						</button>
					)}

					{file && (
						<div className="embed-responsive embed-responsive-16by9">
							<object
								data={file}
								type="application/pdf"
								width="100%"
								height="800px"
							></object>
						</div>
					)}
				</div>
			</div>
		</>
	);
};

export const getServerSideProps = mainStore.getServerSideProps(
	(store) =>
		async ({ query, req }) => {
			try {
				const { data, status } = await get(
					`v2/pages?page_slug=Size-Guide`
				).catch((err) => {
					//console.log(err);
				});
				//console.log(data?.data);
				if (status == 200) {
					return {
						props: {
							pageInfo: data?.data[0],
						},
					};
				}
			} catch (error) {
				return {
					props: {},
					notFound: true,
				};
			}
		}
);
export default Page;
