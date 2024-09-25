import React, { useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { FaPencilAlt, FaSave, FaTimes, FaTrash } from "react-icons/fa";
import Barcode from "react-barcode";

interface ItemProps {
  item: { id: string; barcode: string };
  index: number;
  moveItem: (fromIndex: number, toIndex: number) => void;
  isGamified: boolean;
  onEdit: (id: string, newBarcode: string) => void;
  onDelete: (id: string) => void;
}

const ItemType = "ITEM";

const ListItem: React.FC<ItemProps> = ({
  item,
  index,
  moveItem,
  isGamified,
  onEdit,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [barcode, setBarcode] = useState(item.barcode);

  const [{ isDragging }, dragRef] = useDrag({
    type: ItemType,
    item: { index },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const [, dropRef] = useDrop({
    accept: ItemType,
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveItem(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  const handleEditClick = () => {
    if (isEditing) {
      onEdit(item.id, barcode);
    }
    setIsEditing(!isEditing);
  };

  const handleDiscardClick = () => {
    setBarcode(item.barcode);
    setIsEditing(false);
  };

  const handleDeleteClick = () => {
    onDelete(item.id);
  };

  return (
    <div
      ref={isGamified ? (node) => dragRef(dropRef(node)) : null}
      className={`list-item ${isGamified ? "gamified-hover" : ""}`} // Apply hover styles only in gamified mode
      style={{
        display: "flex",
        alignItems: "center",
        opacity: isDragging ? 0.5 : 1,
        transition: "transform 0.3s ease",
        borderRadius: "10px",
        padding: "10px",
        marginBottom: "10px",
      }}
    >
      <div style={{ marginRight: "20px" }}>
        <Barcode value={barcode} width={1} height={18} />
      </div>

      <input
        type="text"
        value={barcode}
        style={{
          border: "none",
          backgroundColor: isEditing ? "#fff" : "#e0f7fa",
          color: "#333",
          padding: "5px",
          borderRadius: "5px",
        }}
        onChange={(e) => setBarcode(e.target.value)}
        disabled={!isEditing}
      />
      {!isGamified && (
        <div style={{ marginLeft: "auto", display: "flex", gap: "10px" }}>
          <button
            onClick={handleEditClick}
            style={{
              backgroundColor: isEditing ? "#4caf50" : "#03a9f4",
              border: "none",
              color: "white",
              borderRadius: "5px",
              padding: "5px",
              cursor: "pointer",
            }}
          >
            {isEditing ? <FaSave /> : <FaPencilAlt />}
          </button>
          <button
            onClick={isEditing ? handleDiscardClick : handleDeleteClick}
            className="action-button"
            style={{
              backgroundColor: isEditing ? "#f44336" : "#ff9800",
              border: "none",
              color: "white",
              borderRadius: "5px",
              padding: "5px",
              cursor: "pointer",
            }}
          >
            {isEditing ? <FaTimes /> : <FaTrash />}
          </button>
        </div>
      )}
    </div>
  );
};

export default ListItem;
