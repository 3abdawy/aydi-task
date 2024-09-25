// @ts-nocheck
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./page.module.css";
import { v4 as uuidv4 } from "uuid";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { FaPencilAlt, FaTrash, FaSave, FaGamepad } from "react-icons/fa";
import ListItem from "./components/ListItem";

// Fake API functions
const fakeAPI = {
  getItems: () => [
    { id: uuidv4(), barcode: "1234567890" },
    { id: uuidv4(), barcode: "0987654321" },
    { id: uuidv4(), barcode: "4567891234" },
    { id: uuidv4(), barcode: "3216549870" },
  ],
  updateItem: (id, newBarcode) => {
    console.log(`Item ${id} updated with barcode: ${newBarcode}`);
  },
  deleteItem: (id) => {
    console.log(`Item ${id} deleted.`);
  },
  updateOrder: (newOrder) => {
    console.log("New order:", newOrder);
  },
};

const Home = () => {
  const [items, setItems] = useState([]);
  const [isGamified, setIsGamified] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isSwapping, setIsSwapping] = useState(false);

  useEffect(() => {
    // Simulate API call to get items
    const fetchedItems = fakeAPI.getItems();
    setItems(fetchedItems);
  }, []);
  const handleEditItem = (id, newBarcode) => {
    fakeAPI.updateItem(id, newBarcode);
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, barcode: newBarcode } : item
      )
    );
  };

  const handleDeleteItem = (id) => {
    fakeAPI.deleteItem(id);
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const moveItem = (fromIndex, toIndex) => {
    const updatedItems = [...items];
    const [movedItem] = updatedItems.splice(fromIndex, 1);
    updatedItems.splice(toIndex, 0, movedItem);
    setItems(updatedItems);
    fakeAPI.updateOrder(updatedItems);
  };
  const swapItemsTemporarily = () => {
    setIsSwapping(true);
    const updatedItems = [...items];
    const temp = updatedItems[0];
    setItems(updatedItems);

    setTimeout(() => {
      setIsSwapping(false); // Remove the swap animation
      setItems((prevItems) => {
        const revertedItems = [...prevItems];
        return revertedItems;
      });
    }, 1500);
  };

  const handleToggleGamifiedMode = () => {
    setIsGamified(!isGamified);
    if (!isGamified) {
      // Trigger initial animation when enabling gamified mode
      swapItemsTemporarily();
    }
  };

  return (
    <div>
      <main>
        <DndProvider backend={HTML5Backend}>
          <div style={{ padding: "20px" }}>
            <button
              onClick={handleToggleGamifiedMode}
              style={{
                backgroundColor: isGamified ? "red" : "#000",
                border: "none",
                color: "white",
                borderRadius: "100%",
                padding: "15px",
                alignItems: "center",
                justifyContent: "center",
                display: "flex",
                fontSize: "100px",
                cursor: "pointer",
                marginBottom: "20px",
              }}
            >
              <FaGamepad />
            </button>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                width: "60%",
                margin: "auto",
              }}
            >
              {items.map((item, index) => (
                <div
                  key={item.id}
                  className={`list-item ${
                    isSwapping && index < 2 ? "swapping" : ""
                  }`}
                >
                  <ListItem
                    key={item.id}
                    item={item}
                    index={index}
                    moveItem={moveItem}
                    isGamified={isGamified}
                    onEdit={handleEditItem}
                    onDelete={handleDeleteItem}
                  />
                </div>
              ))}
            </div>
          </div>
        </DndProvider>
      </main>
    </div>
  );
};

export default Home;
