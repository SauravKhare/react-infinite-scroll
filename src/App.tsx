import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useAsyncList } from "react-stately";

export interface Photo {
	id: number;
	width: number;
	height: number;
	url: string;
	photographer: string;
	photographer_url: string;
	photographer_id: number;
	avg_color: string;
	src: Src;
	liked: boolean;
	alt: string;
}

export interface Src {
	original: string;
	large2x: string;
	large: string;
	medium: string;
	small: string;
	portrait: string;
	landscape: string;
	tiny: string;
}

function App() {
	const { ref, inView } = useInView({ rootMargin: "100px" });

	const PEXELS_API_KEY: string = import.meta.env.VITE_PEXELS_API_KEY;
	const PEXELS_ENDPOINT: string = `https://api.pexels.com/v1/search`;

	const list = useAsyncList<Photo>({
		async load({ signal, cursor }) {
			const res = await fetch(
				cursor || `${PEXELS_ENDPOINT}?query=nature&per_page=5&page=1`,
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: PEXELS_API_KEY,
					},
					signal,
				}
			);
			const json = await res.json();
			return {
				items: json.photos,
				cursor: `${PEXELS_ENDPOINT}?query=nature&per_page=5&page=${
					json.page + 1
				}`,
			};
		},
	});

	useEffect(() => {
		if (inView) {
			list.loadMore();
		}
	}, [inView]);

	return (
		<section className="container">
			{list.items.map((img: Photo) => (
				<div
					key={img.id}
					className="img_container"
					style={{ aspectRatio: img.width / img.height }}
				>
					<img src={img.src.original} alt="" />
				</div>
			))}
			<div ref={ref} className="loader"></div>
		</section>
	);
}

export default App;
