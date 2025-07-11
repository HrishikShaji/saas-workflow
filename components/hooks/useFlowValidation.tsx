import { useContext } from "react";
import { FlowValidationContext } from "../contexts/FlowValidationContext";

export default function useFlowValidation() {
	const context = useContext(FlowValidationContext)

	if (!context) {
		throw new Error("useFlowValidation must be inside FlowValidationContext")
	}

	return context
}
