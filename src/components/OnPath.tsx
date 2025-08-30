"use client";
import React, { useEffect, useRef, useState } from "react";

type PathData = {
	length: number;
	x: number;
	y: number;
	angle?: number;
};

interface OnPathProps extends React.HTMLAttributes<HTMLDivElement> {
	children?: React.ReactNode;
	childAttrs?: React.HTMLAttributes<Element>;
	/** If provided (milliseconds), animates text sliding along the path in a seamless loop */
	duration?: number;
	/** Starting offset into the loop, expressed as a percentage (0-100) */
	startOffset?: number;
	/** A function that maps a percentage offset onto a point along a path within a certain bounds */
	path?: (offset: number, w: number, h: number, ...args: any[]) => PathData;
}

/** Evenly distributes its child elements along a path */
export default function OnPath({
	children,
	childAttrs,
	style,
	duration,
	startOffset = 0,
	path = pathRectangle,
	...props
}: OnPathProps) {
	const containerRef = useRef<HTMLDivElement | null>(null);
	const [size, setSize] = useState<{ width: number; height: number } | null>(null);
	const [perimeter, setPerimeter] = useState<number>(0);
	const animationRef = useRef<number | null>(null);
	const startTimeRef = useRef<number | null>(null);
	const [animOffset, setAnimOffset] = useState<number>(0);

	// force container position to relative so absolutely positioned children align
	style = { position: (style && (style as any).position) || "relative", ...(style || {}) };

	// measure container and update perimeter
	useEffect(() => {
		if (!containerRef.current) return;

		const container = containerRef.current;
		function update() {
			const [w, h] = [container.clientWidth, container.clientHeight];
			setSize({ width: w, height: h });
			setPerimeter(path(0, w, h).length);
		}
		update();
		const resizeObserver = new ResizeObserver(update);
		resizeObserver.observe(container);
		window.addEventListener("resize", update);

		// cleanup function
		return () => {
			resizeObserver.disconnect();
			window.removeEventListener("resize", update);
		};
	}, [path]);

	// animation loop
	useEffect(() => {
		// stop any previous animation
		if (animationRef.current !== null) {
			cancelAnimationFrame(animationRef.current);
			animationRef.current = null;
		}
		startTimeRef.current = null;

		if (!duration || duration <= 0 || perimeter <= 0) {
			setAnimOffset(0);
			return;
		}

		const loop = (now: number) => {
			if (startTimeRef.current === null) startTimeRef.current = now;
			const elapsed = now - startTimeRef.current;
			const progress = (elapsed % duration) / duration; // 0..1
			setAnimOffset(progress * perimeter);
			animationRef.current = requestAnimationFrame(loop);
		};
		animationRef.current = requestAnimationFrame(loop);

		return () => {
			if (animationRef.current !== null) {
				cancelAnimationFrame(animationRef.current);
				animationRef.current = null;
			}
			startTimeRef.current = null;
		};
	}, [duration, perimeter]);

	const count = React.Children.count(children);

	return (
		<div ref={containerRef} {...props} style={style}>
			{React.Children.map(children, (child, i) => {
				if (!React.isValidElement(child) || !size || count === 0) return child;

				const startOffsetPx = normalized(startOffset) * perimeter;

				// base position + animated offset + user offset
				const baseDistance = (i * perimeter) / count;
				const distance = normalized((baseDistance + animOffset + startOffsetPx), perimeter);
				const pos = path(distance * 100, size.width, size.height);

				// merge styles; center the child on the computed point
				const childInlineStyle = (child.props && (child.props as any).style) || {};
				const attrInlineStyle = (childAttrs && (childAttrs as any).style) || {};
				const combinedUserTransform = [attrInlineStyle.transform, childInlineStyle.transform].filter(Boolean).join(" ");

				const childStyle = {
					...childInlineStyle,
					...attrInlineStyle,
					position: "absolute",
					transform: `translate(-50%, -50%)
						translate3d(${pos.x}px, ${pos.y}px, 0)
						rotate(${pos.angle}deg)
						${combinedUserTransform}
					`.trim(),
					transition: "transform 80ms linear",
					willChange: "transform", // browser hint to improve performance a little
				};

				const { style: _s, ...restChildAttrs } = (childAttrs || {}) as any;
				return React.cloneElement(child, {
					...restChildAttrs,
					style: childStyle,
					key: child.key ?? `perimeter-child-${i}`,
				});
			})}
		</div>
	);
}

/** Normalizes an offset percentage to a fraction [0, max/100) */
const normalized = (offset: number, max = 100) => (((offset % max) + max) % max) / max;


// ===== Path Functions =============================================================

/** Maps a percentage offset onto the perimeter of a rectangle of dimensions w x h */
export function pathRectangle(offset: number, w: number, h: number) {
	const length = 2 * (w + h);
	let dist = ((offset / 100) * length) % length;

	if (dist <= w) return { x: dist, y: 0, angle: 30, length }; // top -> right
	dist -= w;
	if (dist <= h) return { x: w, y: dist, angle: 120, length }; // right -> down
	dist -= h;
	if (dist <= w) return { x: w - dist, y: h, angle: 210, length }; // bottom -> left
	dist -= w;
	return                { x: 0, y: h - dist, angle: 300, length }; // left -> up
}

/** Maps a percentage offset onto the perimeter of an ellipse of dimensions w x h,
 * where `inset` is optional pixels to inset the ellipse within the box.
 */
export function pathEllipse(offset: number, w: number, h: number, inset = 0) {
	const cx = w / 2;
	const cy = h / 2;
	const rx = Math.max(0, cx - inset);
	const ry = Math.max(0, cy - inset);

	// https://en.wikipedia.org/wiki/Perimeter_of_an_ellipse#First_approximation
	const length = Math.PI * (3 * (rx + ry) - Math.sqrt((3 * rx + ry) * (rx + 3 * ry)));

	const theta = normalized(offset) * 2 * Math.PI;
	const x = cx + rx * Math.cos(theta);
	const y = cy + ry * Math.sin(theta);
	const dx = -rx * Math.sin(theta);
	const dy =  ry * Math.cos(theta);
	const angleDeg = Math.atan2(dy, dx) * 180 / Math.PI;
	return { x, y,
		length,
		angle: angleDeg
	};
}

/** Maps a percentage offset onto the perimeter of the largest circle that can fit
 * within a box of dimensions w x h.
 */
export function pathCircle(offset: number, w: number, h: number) {
	const cx = w / 2;
	const cy = h / 2;
	const r = Math.min(w, h) / 2;
	const theta = normalized(offset) * 2 * Math.PI;
	const x = cx + r * Math.cos(theta);
	const y = cy + r * Math.sin(theta);
	const dx = -r * Math.sin(theta);
	const dy = r * Math.cos(theta);
	const angleDeg = Math.atan2(dy, dx) * 180 / Math.PI;
	return { x, y,
		length: 2 * Math.PI * r,
		angle: angleDeg
	};
}