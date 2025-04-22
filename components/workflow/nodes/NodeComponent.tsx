import { NodeProps } from "@xyflow/react";
import { memo } from "react";
import NodeCard from "./NodeCard";

const NodeComponent = memo((props: NodeProps) => {
	return <NodeCard isSelected={!!props.selected} nodeId={props.id}>App node</NodeCard>
})

export default NodeComponent

NodeComponent.displayName = "NodeComponent"
