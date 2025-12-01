import { useState } from "react";

interface DragDropQuestionProps {
  blocks: string[];
  correctOrder: number[];
  onAnswer: (order: number[]) => void;
  disabled: boolean;
}

export function DragDropQuestion({
  blocks,
  correctOrder,
  onAnswer,
  disabled,
}: DragDropQuestionProps) {
  const [order, setOrder] = useState<number[]>(
    blocks.map((_, i) => i).sort(() => Math.random() - 0.5)
  );
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    if (disabled) return;
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetIndex: number) => {
    if (disabled || draggedIndex === null) return;

    const newOrder = [...order];
    const draggedItem = newOrder[draggedIndex];
    newOrder.splice(draggedIndex, 1);
    newOrder.splice(targetIndex, 0, draggedItem);
    setOrder(newOrder);
    setDraggedIndex(null);
  };

  const handleSubmit = () => {
    const isCorrect = JSON.stringify(order) === JSON.stringify(correctOrder);
    onAnswer(order);
  };

  return (
    <div className="drag-drop-question">
      <div className="blocks-container">
        {order.map((blockIndex, index) => (
          <div
            key={blockIndex}
            draggable={!disabled}
            onDragStart={() => handleDragStart(index)}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(index)}
            className={`code-block ${draggedIndex === index ? "dragging" : ""}`}
          >
            <span className="block-number">{index + 1}</span>
            <pre>{blocks[blockIndex]}</pre>
          </div>
        ))}
      </div>
      <button
        className="submit-dragdrop-button"
        onClick={handleSubmit}
        disabled={disabled}
      >
        Submit Order
      </button>
    </div>
  );
}

