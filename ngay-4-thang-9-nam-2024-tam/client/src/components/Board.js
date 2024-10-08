import React, { useState, useEffect } from "react";
import List from "./List";
import { DragDropContext } from "react-beautiful-dnd";
import { Button, Form, Container, Row, Col } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify"; // Import Toast
import "react-toastify/dist/ReactToastify.css"; // Import Toast styles
import "./styles/Board.css";

const Board = () => {
  const getInitialLists = () => {
    const storedLists = localStorage.getItem("boardLists");
    return storedLists
      ? JSON.parse(storedLists)
      : [
          {
            id: "1",
            title: "To Do",
            cards: [{ id: "1", title: "Task 1", description: "" }],
          },
          {
            id: "2",
            title: "In Progress",
            cards: [{ id: "2", title: "Task 2", description: "" }],
          },
        ];
  };

  const [lists, setLists] = useState(getInitialLists());
  const [isAddingList, setIsAddingList] = useState(false);
  const [newListTitle, setNewListTitle] = useState("");

  useEffect(() => {
    localStorage.setItem("boardLists", JSON.stringify(lists));
  }, [lists]);

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    const sourceList = lists.find((list) => list.id === source.droppableId);
    const destinationList = lists.find(
      (list) => list.id === destination.droppableId
    );
    const sourceCards = [...sourceList.cards];
    const [movedCard] = sourceCards.splice(source.index, 1);

    if (sourceList === destinationList) {
      sourceCards.splice(destination.index, 0, movedCard);
      setLists((prev) =>
        prev.map((list) =>
          list.id === sourceList.id ? { ...list, cards: sourceCards } : list
        )
      );
    } else {
      const destinationCards = [...destinationList.cards];
      destinationCards.splice(destination.index, 0, movedCard);
      setLists((prev) =>
        prev.map((list) =>
          list.id === sourceList.id
            ? { ...list, cards: sourceCards }
            : list.id === destinationList.id
            ? { ...list, cards: destinationCards }
            : list
        )
      );
    }
    toast.success("Card moved successfully!");
  };

  const addNewList = () => {
    if (newListTitle.trim() === "") return;
    setLists([
      ...lists,
      { id: (lists.length + 1).toString(), title: newListTitle, cards: [] },
    ]);
    setNewListTitle("");
    setIsAddingList(false);
    toast.success("New list added!"); // Show success toast when a new list is added
  };

  return (
    <Container className="mt-4">
      <DragDropContext onDragEnd={onDragEnd}>
        <Row className="board-container">
          {lists.map((list) => (
            <Col key={list.id} md={3}>
              <List list={list} setLists={setLists} lists={lists} />
            </Col>
          ))}
          <Col md={3}>
            <div className="add-list-section">
              {isAddingList ? (
                <div className="new-list">
                  <Form.Control
                    type="text"
                    placeholder="Enter list title..."
                    value={newListTitle}
                    onChange={(e) => setNewListTitle(e.target.value)}
                    className="mb-2"
                  />
                  <Button
                    variant="outline-success"
                    onClick={addNewList}
                    className="mr-2"
                  >
                    Add List
                  </Button>
                  <Button
                    variant="outline-danger mt-2"
                    onClick={() => setIsAddingList(false)}
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline-light mt-3"
                  onClick={() => setIsAddingList(true)}
                >
                  + Add another list
                </Button>
              )}
            </div>
          </Col>
        </Row>
      </DragDropContext>
      <ToastContainer // Toast container to display toasts
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Container>
  );
};

export default Board;
