"use client"
import React, { useState, useCallback, ChangeEvent } from 'react';
import {
  ReactFlow, Background,
  Controls,
  useNodesState,
  useEdgesState,
  addEdge,
  MarkerType,
  Handle,
  Position,
  Node,
  Edge,
  Connection,
  NodeTypes,
} from '@xyflow/react';
import "@xyflow/react/dist/style.css";

// Define types for node data
type NodeData = {
  label?: string;
  condition?: string;
  operationType?: 'assign' | 'print' | 'math';
  variableName?: string;
  variableValue?: string;
  mathOperation?: 'add' | 'subtract' | 'multiply' | 'divide';
  secondOperand?: string;
  onConditionChange?: (id: string, value: string) => void;
  onOperationChange?: (id: string, value: string) => void;
  onVariableNameChange?: (id: string, value: string) => void;
  onVariableValueChange?: (id: string, value: string) => void;
  onMathOperationChange?: (id: string, value: string) => void;
  onSecondOperandChange?: (id: string, value: string) => void;
};

// Types for custom nodes
interface NodeProps {
  id: string;
  data: NodeData;
}

// Execution context type
interface ExecutionContext {
  variables: Record<string, any>;
  output: string[];
  currentNode: Node<NodeData> | undefined;
}

// Define custom node components
const StartNode: React.FC<NodeProps> = ({ id }) => (
  <div className="start-node" style={{ padding: '10px', borderRadius: '5px', background: '#b8e994', textAlign: 'center', width: '120px' }}>
    <div className="node-header">START</div>
    <Handle type="source" position={Position.Bottom} />
  </div>
);

const EndNode: React.FC<NodeProps> = () => (
  <div className="end-node" style={{ padding: '10px', borderRadius: '5px', background: '#ff7979', textAlign: 'center', width: '120px' }}>
    <div className="node-header">END</div>
    <Handle type="target" position={Position.Top} />
  </div>
);

const IfNode: React.FC<NodeProps> = ({ id, data }) => (
  <div className="if-node" style={{ padding: '10px', borderRadius: '5px', background: '#f6e58d', width: '180px' }}>
    <div className="node-header" style={{ fontWeight: 'bold', marginBottom: '8px' }}>IF</div>
    <div className="node-content">
      <input
        type="text"
        value={data.condition || ''}
        onChange={(e) => data.onConditionChange && data.onConditionChange(id, e.target.value)}
        placeholder="Enter condition (e.g. x > 10)"
        style={{ width: '100%', padding: '4px' }}
      />
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '12px' }}>
      <div>True ↓</div>
      <div>False →</div>
    </div>
    <Handle type="target" position={Position.Top} />
    <Handle type="source" position={Position.Bottom} id="true" />
    <Handle type="source" position={Position.Right} id="false" />
  </div>
);

const OperationNode: React.FC<NodeProps> = ({ id, data }) => (
  <div className="operation-node" style={{ padding: '10px', borderRadius: '5px', background: '#7ed6df', width: '200px' }}>
    <div className="node-header" style={{ fontWeight: 'bold', marginBottom: '8px' }}>OPERATION</div>
    <div className="node-content">
      <select
        value={data.operationType || 'assign'}
        onChange={(e) => data.onOperationChange && data.onOperationChange(id, e.target.value as 'assign' | 'print' | 'math')}
        style={{ width: '100%', padding: '4px', marginBottom: '8px' }}
      >
        <option value="assign">Assign Variable</option>
        <option value="print">Print</option>
        <option value="math">Math Operation</option>
      </select>
      {renderOperationFields(data, id)}
    </div>
    <Handle type="target" position={Position.Top} />
    <Handle type="source" position={Position.Bottom} />
  </div>
);

// Function to render operation fields based on operation type
const renderOperationFields = (data: NodeData, id: string): React.ReactNode => {
  switch (data.operationType) {
    case 'assign':
      return (
        <>
          <div style={{ marginBottom: '4px' }}>
            <input
              type="text"
              value={data.variableName || ''}
              onChange={(e) => data.onVariableNameChange && data.onVariableNameChange(id, e.target.value)}
              placeholder="Variable name"
              style={{ width: '100%', padding: '4px', marginBottom: '4px' }}
            />
          </div>
          <div>
            <input
              type="text"
              value={data.variableValue || ''}
              onChange={(e) => data.onVariableValueChange && data.onVariableValueChange(id, e.target.value)}
              placeholder="Value"
              style={{ width: '100%', padding: '4px' }}
            />
          </div>
        </>
      );

    case 'print':
      return (
        <div>
          <input
            type="text"
            value={data.variableValue || ''}
            onChange={(e) => data.onVariableValueChange && data.onVariableValueChange(id, e.target.value)}
            placeholder="Expression to print"
            style={{ width: '100%', padding: '4px' }}
          />
        </div>
      );

    case 'math':
      return (
        <>
          <div style={{ marginBottom: '4px' }}>
            <input
              type="text"
              value={data.variableName || ''}
              onChange={(e) => data.onVariableNameChange && data.onVariableNameChange(id, e.target.value)}
              placeholder="Result variable"
              style={{ width: '100%', padding: '4px', marginBottom: '4px' }}
            />
          </div>
          <div style={{ marginBottom: '4px' }}>
            <input
              type="text"
              value={data.variableValue || ''}
              onChange={(e) => data.onVariableValueChange && data.onVariableValueChange(id, e.target.value)}
              placeholder="First operand"
              style={{ width: '100%', padding: '4px', marginBottom: '4px' }}
            />
          </div>
          <div style={{ marginBottom: '4px' }}>
            <select
              value={data.mathOperation || 'add'}
              onChange={(e) => data.onMathOperationChange && data.onMathOperationChange(id, e.target.value)}
              style={{ width: '100%', padding: '4px', marginBottom: '4px' }}
            >
              <option value="add">+</option>
              <option value="subtract">-</option>
              <option value="multiply">*</option>
              <option value="divide">/</option>
            </select>
          </div>
          <div>
            <input
              type="text"
              value={data.secondOperand || ''}
              onChange={(e) => data.onSecondOperandChange && data.onSecondOperandChange(id, e.target.value)}
              placeholder="Second operand"
              style={{ width: '100%', padding: '4px' }}
            />
          </div>
        </>
      );

    default:
      return null;
  }
};

const nodeTypes: NodeTypes = {
  start: StartNode,
  end: EndNode,
  if: IfNode,
  operation: OperationNode,
};

const initialNodes: Node<NodeData>[] = [
  {
    id: '1',
    type: 'start',
    position: { x: 250, y: 5 },
    data: { label: 'Start Node' },
  },
  {
    id: '2',
    type: 'operation',
    position: { x: 250, y: 100 },
    data: {
      operationType: 'assign',
      variableName: 'x',
      variableValue: '10',
    },
  },
  {
    id: '3',
    type: 'operation',
    position: { x: 250, y: 200 },
    data: {
      operationType: 'print',
      variableValue: 'x',
    },
  },
  {
    id: '4',
    type: 'end',
    position: { x: 250, y: 300 },
    data: { label: 'End Node' },
  },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e2-3', source: '2', target: '3' },
  { id: 'e3-4', source: '3', target: '4' },
];

export default function NewFlow() {
  const [nodes, setNodes, onNodesChange] = useNodesState<NodeData>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [executionOutput, setExecutionOutput] = useState<string[]>([]);

  // Define Node handlers
  const handleConditionChange = useCallback((id: string, value: string) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          return { ...node, data: { ...node.data, condition: value } };
        }
        return node;
      })
    );
  }, [setNodes]);

  const handleOperationChange = useCallback((id: string, value: string) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          return { ...node, data: { ...node.data, operationType: value as 'assign' | 'print' | 'math' } };
        }
        return node;
      })
    );
  }, [setNodes]);

  const handleVariableNameChange = useCallback((id: string, value: string) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          return { ...node, data: { ...node.data, variableName: value } };
        }
        return node;
      })
    );
  }, [setNodes]);

  const handleVariableValueChange = useCallback((id: string, value: string) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          return { ...node, data: { ...node.data, variableValue: value } };
        }
        return node;
      })
    );
  }, [setNodes]);

  const handleMathOperationChange = useCallback((id: string, value: string) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          return { ...node, data: { ...node.data, mathOperation: value as 'add' | 'subtract' | 'multiply' | 'divide' } };
        }
        return node;
      })
    );
  }, [setNodes]);

  const handleSecondOperandChange = useCallback((id: string, value: string) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          return { ...node, data: { ...node.data, secondOperand: value } };
        }
        return node;
      })
    );
  }, [setNodes]);

  // Connect the event handlers to the nodes
  React.useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.type === 'if') {
          return {
            ...node,
            data: {
              ...node.data,
              onConditionChange: handleConditionChange
            }
          };
        }
        if (node.type === 'operation') {
          return {
            ...node,
            data: {
              ...node.data,
              onOperationChange: handleOperationChange,
              onVariableNameChange: handleVariableNameChange,
              onVariableValueChange: handleVariableValueChange,
              onMathOperationChange: handleMathOperationChange,
              onSecondOperandChange: handleSecondOperandChange,
            }
          };
        }
        return node;
      })
    );
  }, [
    setNodes,
    handleConditionChange,
    handleOperationChange,
    handleVariableNameChange,
    handleVariableValueChange,
    handleMathOperationChange,
    handleSecondOperandChange
  ]);

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // Add a new node to the flow
  const addNode = (type: string) => {
    const newNodeId = (nodes.length + 1).toString();
    const lastNodeY = Math.max(...nodes.map(node => node.position.y));

    let newNode: Node<NodeData> = {
      id: newNodeId,
      type: type as 'start' | 'end' | 'if' | 'operation',
      position: { x: 250, y: lastNodeY + 100 },
      data: {}
    };

    // Set default values based on node type
    switch (type) {
      case 'if':
        newNode.data = {
          condition: 'x > 0',
          onConditionChange: handleConditionChange
        };
        break;

      case 'operation':
        newNode.data = {
          operationType: 'assign',
          variableName: '',
          variableValue: '',
          onOperationChange: handleOperationChange,
          onVariableNameChange: handleVariableNameChange,
          onVariableValueChange: handleVariableValueChange,
          onMathOperationChange: handleMathOperationChange,
          onSecondOperandChange: handleSecondOperandChange
        };
        break;
    }

    setNodes([...nodes, newNode]);
  };

  // Function to execute the flow
  const executeFlow = () => {
    // Reset output
    setExecutionOutput([]);

    // Find the start node
    const startNode = nodes.find(node => node.type === 'start');
    if (!startNode) {
      setExecutionOutput(['Error: No start node found']);
      return;
    }

    // Create execution context
    const context: ExecutionContext = {
      variables: {},
      output: [],
      currentNode: startNode,
    };

    // Execute nodes in order
    while (context.currentNode && context.currentNode.type !== 'end') {
      try {
        context.currentNode = executeNode(context.currentNode, context);
      } catch (error) {
        context.output.push(`Error: ${(error as Error).message}`);
        break;
      }
    }

    // Display results
    setExecutionOutput([...context.output, 'Execution complete']);
  };

  // Function to execute individual nodes
  const executeNode = (node: Node<NodeData>, context: ExecutionContext): Node<NodeData> | undefined => {
    switch (node.type) {
      case 'start':
        context.output.push('Starting execution');
        return getNextNode(node.id);

      case 'operation':
        return executeOperation(node, context);

      case 'if':
        return executeIf(node, context);

      default:
        return getNextNode(node.id);
    }
  };

  // Execute an operation node
  const executeOperation = (node: Node<NodeData>, context: ExecutionContext): Node<NodeData> | undefined => {
    const { operationType, variableName, variableValue, mathOperation, secondOperand } = node.data;

    switch (operationType) {
      case 'assign':
        if (!variableName) {
          throw new Error('Variable name is required for assign operation');
        }

        // Evaluate the value (might be a variable reference or literal)
        let value: any = variableValue;
        if (variableValue && variableValue.trim() in context.variables) {
          value = context.variables[variableValue.trim()];
        } else if (variableValue) {
          // Try to parse as number if possible
          const numValue = Number(variableValue);
          if (!isNaN(numValue)) {
            value = numValue;
          }
        }

        context.variables[variableName] = value;
        context.output.push(`Assigned ${variableName} = ${value}`);
        break;

      case 'print':
        if (!variableValue) {
          context.output.push('(empty print)');
          break;
        }

        // Check if it's a variable reference or a string literal
        if (variableValue.trim() in context.variables) {
          context.output.push(`Print: ${context.variables[variableValue.trim()]}`);
        } else {
          context.output.push(`Print: ${variableValue}`);
        }
        break;

      case 'math':
        if (!variableName || !variableValue || !secondOperand) {
          throw new Error('All fields are required for math operation');
        }

        // Get the first operand
        let firstOperandValue: number;
        if (variableValue.trim() in context.variables) {
          firstOperandValue = Number(context.variables[variableValue.trim()]);
        } else {
          firstOperandValue = Number(variableValue);
        }

        // Get the second operand
        let secondOperandValue: number;
        if (secondOperand.trim() in context.variables) {
          secondOperandValue = Number(context.variables[secondOperand.trim()]);
        } else {
          secondOperandValue = Number(secondOperand);
        }

        // Check if the operands are valid numbers
        if (isNaN(firstOperandValue) || isNaN(secondOperandValue)) {
          throw new Error('Operands must be valid numbers');
        }

        // Perform the operation
        let result: number;
        switch (mathOperation) {
          case 'add':
            result = firstOperandValue + secondOperandValue;
            break;
          case 'subtract':
            result = firstOperandValue - secondOperandValue;
            break;
          case 'multiply':
            result = firstOperandValue * secondOperandValue;
            break;
          case 'divide':
            if (secondOperandValue === 0) {
              throw new Error('Division by zero');
            }
            result = firstOperandValue / secondOperandValue;
            break;
          default:
            throw new Error('Invalid math operation');
        }

        context.variables[variableName] = result;
        context.output.push(`Math: ${variableName} = ${firstOperandValue} ${mathOperation} ${secondOperandValue} = ${result}`);
        break;
    }

    return getNextNode(node.id);
  };

  // Execute an if node
  const executeIf = (node: Node<NodeData>, context: ExecutionContext): Node<NodeData> | undefined => {
    const { condition } = node.data;
    if (!condition) {
      throw new Error('Condition is required for if node');
    }

    let result: boolean;
    try {
      // Create a safe evaluation function
      const evalCondition = (condition: string, variables: Record<string, any>): boolean => {
        // Replace variable names with their values
        let processedCondition = condition;

        // Sort variable names by length (descending) to avoid partial replacements
        const varNames = Object.keys(variables).sort((a, b) => b.length - a.length);

        for (const varName of varNames) {
          const regex = new RegExp('\\b' + varName + '\\b', 'g');
          processedCondition = processedCondition.replace(regex, variables[varName]);
        }

        // Use a simple comparison evaluation
        if (processedCondition.includes('==')) {
          const [left, right] = processedCondition.split('==').map(s => s.trim());
          return Number(left) == Number(right);
        } else if (processedCondition.includes('!=')) {
          const [left, right] = processedCondition.split('!=').map(s => s.trim());
          return Number(left) != Number(right);
        } else if (processedCondition.includes('>=')) {
          const [left, right] = processedCondition.split('>=').map(s => s.trim());
          return Number(left) >= Number(right);
        } else if (processedCondition.includes('<=')) {
          const [left, right] = processedCondition.split('<=').map(s => s.trim());
          return Number(left) <= Number(right);
        } else if (processedCondition.includes('>')) {
          const [left, right] = processedCondition.split('>').map(s => s.trim());
          return Number(left) > Number(right);
        } else if (processedCondition.includes('<')) {
          const [left, right] = processedCondition.split('<').map(s => s.trim());
          return Number(left) < Number(right);
        }

        // If it's just a variable, check if it's truthy
        if (processedCondition in variables) {
          return Boolean(variables[processedCondition]);
        }

        return Boolean(Number(processedCondition));
      };

      result = evalCondition(condition, context.variables);
    } catch (error) {
      throw new Error(`Error evaluating condition: ${condition}`);
    }

    context.output.push(`If: ${condition} is ${result}`);
    return getNextNode(node.id, result ? 'true' : 'false');
  };

  // Get the next node in the flow
  const getNextNode = (currentNodeId: string, outputHandle: string | null = null): Node<NodeData> | undefined => {
    const edge = edges.find(e =>
      e.source === currentNodeId &&
      (outputHandle ? e.sourceHandle === outputHandle : true)
    );

    if (!edge) {
      throw new Error(`No connection found from node ${currentNodeId}${outputHandle ? ` (${outputHandle})` : ''}`);
    }

    return nodes.find(n => n.id === edge?.target);
  };

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ height: '70vh' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>

      <div style={{ display: 'flex', padding: '10px', borderTop: '1px solid #ddd' }}>
        <div className="node-buttons" style={{ flex: '1', marginRight: '20px' }}>
          <div style={{ marginBottom: '10px' }}>
            <strong>Add Node:</strong>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => addNode('operation')}
              style={{ padding: '8px 12px', background: '#7ed6df', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              Operation
            </button>
            <button
              onClick={() => addNode('if')}
              style={{ padding: '8px 12px', background: '#f6e58d', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              If
            </button>
            <button
              onClick={() => addNode('end')}
              style={{ padding: '8px 12px', background: '#ff7979', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              End
            </button>
          </div>
          <div style={{ marginTop: '20px' }}>
            <button
              onClick={executeFlow}
              style={{ padding: '10px 16px', background: '#6ab04c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              Execute Flow
            </button>
          </div>
        </div>

        <div className="output-console" style={{ flex: '1', background: '#f8f9fa', padding: '10px', borderRadius: '4px', height: '200px', overflowY: 'auto' }}>
          <div style={{ marginBottom: '10px' }}>
            <strong>Execution Output:</strong>
          </div>
          {executionOutput.length === 0 ? (
            <div style={{ color: '#777', fontStyle: 'italic' }}>No output yet. Click "Execute Flow" to run the flowchart.</div>
          ) : (
            executionOutput.map((line, i) => (
              <div key={i} style={{ fontFamily: 'monospace', padding: '2px 0' }}>{line}</div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

