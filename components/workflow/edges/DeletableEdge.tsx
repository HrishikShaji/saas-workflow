import { Button } from "@/components/ui/button";
import { BaseEdge, EdgeLabelRenderer, EdgeProps, getSmoothStepPath, useReactFlow } from "@xyflow/react";
import { colorForEdge } from "../nodes/common";
import { TaskParamType } from "@/types/task";

export default function DeletableEdge(props: EdgeProps) {
	const [edgePath, labelX, labelY] = getSmoothStepPath(props)
	const { setEdges } = useReactFlow()
	console.log("these are edge props", props)
	const sourceHandleType = props.sourceHandleId?.split("-")[0] as TaskParamType

	return <>
		<BaseEdge path={edgePath} markerEnd={props.markerEnd} style={{ ...props.style, stroke: colorForEdge[sourceHandleType] }} />
		<EdgeLabelRenderer>
			<div style={{
				position: "absolute",
				transform: `translate(-50%,-50%) translate(${labelX}px,${labelY}px)`,
				pointerEvents: "all"
			}}>
				<Button
					variant="outline"
					size="icon"
					className="size-5 border cursor-pointer rounded-full text-xs leading-none hover:shadow-lg"
					onClick={() => {
						setEdges((edges) => edges.filter((edge) => edge.id !== props.id))
					}}
				>
					x
				</Button>
			</div>
		</EdgeLabelRenderer>
	</>
}
