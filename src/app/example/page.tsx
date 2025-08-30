"use client";

import React from "react";
import { useThemeClasses } from "@/hooks/useThemeClasses";
import OnPath, { pathCircle, pathEllipse, pathRectangle } from "@/components/OnPath";

export default function Home() {
	const { text, border, bg } = useThemeClasses();

	return (
		<div className={`flex items-stretch min-h-screen ${bg} ${text} ${border}`}>
			<OnPath className="flex-grow -rotate-12 text-3xl m-20"
				path={pathRectangle}
				// path={pathEllipse}
				// path={pathCircle}
				duration={60000}
				childAttrs={{ className: "font-mono" }}
			>
				{"ESPAÇO EFÊMERO DE ESCUTA ININTERRUPTA ".split("").map((char, index) => (
					<span key={index}>{char}</span>
				))}
			</OnPath>
		</div>
	);
}
