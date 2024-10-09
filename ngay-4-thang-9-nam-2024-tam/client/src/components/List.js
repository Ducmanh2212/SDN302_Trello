import React, { useState } from "react";
import Card from "./Card";
import { Droppable } from "react-beautiful-dnd";
import { Button, Form } from "react-bootstrap";
import { toast } from "react-toastify"; // Import Toast
import axios from "axios"; // Import Axios
import "./styles/List.css";

const List = ({ list, setLists, lists }) => {
  const [newCardTitle, setNewCardTitle] = useState("");
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [listTitle, setListTitle] = useState(list.title);

  const addCard = async () => {
    if (newCardTitle.trim() === "") return;

    const newCard = {
      id: (list.cards.length + 1).toString(),
      title: newCardTitle,
      description: "",
    };

    const updatedList = { ...list, cards: [...list.cards, newCard] };
    setLists(lists.map((l) => (l.id === list.id ? updatedList : l)));
    setNewCardTitle("");
    setIsAddingCard(false);
    
    toast.success(`Card "${newCardTitle}" added successfully!`); // Show success toast when card is added
  };

  const handleListTitleChange = async () => {
    const updatedList = { ...list, title: listTitle };
    setLists(lists.map((l) => (l.id === list.id ? updatedList : l)));
    setIsEditingTitle(false);

    toast.success(`List title changed to "${listTitle}" successfully!`); // Show success toast when list title is updated
  };

  const deleteCard = (cardId) => {
    const updatedCards = list.cards.filter((card) => card.id !== cardId);
    const updatedList = { ...list, cards: updatedCards };
    setLists(lists.map((l) => (l.id === list.id ? updatedList : l)));
    toast.success(`Card deleted successfully!`); // Show success toast when card is deleted
  };

  return (
    <Droppable droppableId={list.id}>
      {(provided) => (
        <div
          className="list"
          {...provided.droppableProps}
          ref={provided.innerRef}
        >
          {/* List Title Editing */}
          <div className="list-header mb-3">
            {isEditingTitle ? (
              <Form.Control
                type="text"
                value={listTitle}
                onChange={(e) => setListTitle(e.target.value)}
                onBlur={handleListTitleChange}
                autoFocus
                className="mb-2"
              />
            ) : (
              <h4
                onClick={() => setIsEditingTitle(true)}
                className="list-title"
              >
                {list.title}
              </h4>
            )}
          </div>

          {/* Cards */}
          {list.cards.map((card, index) => (
            <Card
              key={card.id}
              card={card}
              index={index}
              list={list}
              setLists={setLists}
              lists={lists}
              onDelete={deleteCard} // Pass delete function to Card
            />
          ))}

          {provided.placeholder}

          {/* Add Card Section */}
          {isAddingCard ? (
            <div className="add-card-section">
              <Form.Control
                type="text"
                placeholder="Enter card title..."
                value={newCardTitle}
                onChange={(e) => setNewCardTitle(e.target.value)}
                className="mb-2"
              />
              <Button
                variant="outline-success"
                onClick={addCard} // Gọi hàm addCard khi nhấn nút
                className="mr-2"
              >
                Add Card
              </Button>
              <Button
                variant="outline-danger ms-2"
                onClick={() => setIsAddingCard(false)}
              >
                Cancel
              </Button>
            </div>
          ) : (
            <Button
              variant="outline-primary"
              onClick={() => setIsAddingCard(true)}
            >
              + Add a card
            </Button>
          )}
        </div>
      )}
    </Droppable>
  );
};

export default List;
