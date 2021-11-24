import clsx from "clsx";
import { AlertOctagon, BatteryCharging, PhoneIncoming } from "react-feather";
import { useSelector } from "react-redux";
import { RootState } from "../../redux";

export const FooterPanel = () => {
	const isBundling = useSelector<RootState, any>((s) => s.bundler.isBundling);
	const isInitialized = useSelector<RootState, any>((s) => s.bundler.initialized);
	const hasError = useSelector<RootState, any>((s) => s.bundler.hasError);

	return (
		<div className="absolute bottom-0 flex items-center justify-between w-full px-3 py-1 bg-gray-900 ">
			<div className="flex items-center max-w-sm ">
				{isBundling || !isInitialized ? (
					<Loader />
				) : hasError ? (
					<AlertOctagon className="w-4 h-4 mr-2 text-red-500 " />
				) : (
					<BatteryCharging className="w-4 h-4 mr-2 text-cyan-500 " />
				)}
				<span className="block py-0.5 text-xs  text-gray-500">
					Bundler state:{" "}
					<span className={clsx(hasError ? "text-red-500" : "text-cyan-500")}>
						{!hasError && !isInitialized
							? "Initializing..."
							: hasError
							? "Bundling Error"
							: isBundling
							? "Bundling..."
							: "Idle"}
					</span>
				</span>
			</div>
		</div>
	);
};

const Loader = () => {
	return (
		<svg
			className="w-3 h-3 mr-2 -ml-1 text-white animate-spin"
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
		>
			<circle
				className="opacity-25"
				cx={12}
				cy={12}
				r={10}
				stroke="currentColor"
				strokeWidth={4}
			/>
			<path
				className="opacity-75"
				fill="currentColor"
				d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
			/>
		</svg>
	);
};