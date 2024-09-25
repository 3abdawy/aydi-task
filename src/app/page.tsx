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
  items: [
    { id: uuidv4(), barcode: "1234567890" },
    { id: uuidv4(), barcode: "0987654321" },
    { id: uuidv4(), barcode: "4567891234" },
    { id: uuidv4(), barcode: "3216549870" },
  ],

  getItems: function () {
    return this.items;
  },

  updateItem: (id, newBarcode) => {
    console.log(`Item ${id} updated with barcode: ${newBarcode}`);
  },
  deleteItem: (id) => {
    console.log(`Item ${id} deleted.`);
  },
  updateOrder: (sortedIds) => {
    console.log("Sending sorted IDs to backend:", sortedIds);

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const reorderedItems = sortedIds
          .map((id) => {
            // Find the item by its ID
            const foundItem = fakeAPI.items.find((item) => item.id === id);
            if (!foundItem) {
              console.error(`Item with ID ${id} not found!`);
              return null; // Return null if the item doesn't exist
            }
            return foundItem;
          })
          .filter(Boolean); // Remove any null values

        // Check if all items were found
        if (reorderedItems.length !== sortedIds.length) {
          reject(new Error("Some items could not be found based on the IDs."));
        } else {
          // Update the internal items array with the reordered items
          fakeAPI.items = reorderedItems;
          console.log(
            "New order saved on backend:",
            fakeAPI.items.map((item) => item.id)
          );
          resolve(fakeAPI.items); // Return the reordered items
        }
      }, 3000); // Simulate network delay
    });
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

    // Get the new sorted IDs based on the updated items array
    const sortedIds = updatedItems.map((item) => item.id);
    setItems(updatedItems);
    // Send the sorted IDs to the backend
    fakeAPI
      .updateOrder(sortedIds)
      .then((returnedItems) => {
        console.log("Order updated successfully:", returnedItems);
      })
      .catch((error) => {
        console.error("Error updating order:", error);
      });
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
