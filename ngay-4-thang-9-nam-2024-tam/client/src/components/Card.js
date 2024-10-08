// frontend/src/components/Card.js
import React, { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import "./styles/Card.css";
import { Button, Form } from "react-bootstrap";
import { BsFillCircleFill } from "react-icons/bs"; // Import biểu tượng màu sắc

const Card = ({ card, index, list, setLists, lists }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [cardTitle, setCardTitle] = useState(card.title);
  const [cardDescription, setCardDescription] = useState(card.description);
  const [priority, setPriority] = useState(card.priority || "Medium"); // Trạng thái mức độ quan trọng

  const handleSave = () => {
    const updatedCard = {
      ...card,
      title: cardTitle,
      description: cardDescription,
      priority: priority, // Lưu mức độ quan trọng
    };
    const updatedList = {
      ...list,
      cards: list.cards.map((c) => (c.id === card.id ? updatedCard : c)),
    };

    setLists(lists.map((l) => (l.id === list.id ? updatedList : l)));
    setIsEditing(false);
  };

  // Đặt màu sắc cho thẻ dựa trên mức độ quan trọng
  const cardStyle = {
    backgroundColor: priority === "High" ? "#ffcccc" : priority === "Medium" ? "#ffe5cc" : "#ccffcc",
  };

  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided) => (
        <div
          className="card-item"
          style={cardStyle} // Áp dụng màu sắc cho thẻ
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          {/* Căn chỉnh tiêu đề và biểu tượng màu sắc */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ margin: 0 }}>{card.title}</h3> {/* Căn chỉnh tiêu đề */}
            <BsFillCircleFill
              style={{
                color: priority === "High" ? "red" : priority === "Medium" ? "orange" : "green",
                marginLeft: "10px", // Khoảng cách giữa tiêu đề và biểu tượng
              }}
            /> 
          </div>

          {isEditing ? (
            <div>
              <Form.Control
                type="text"
                value={cardTitle}
                onChange={(e) => setCardTitle(e.target.value)}
                placeholder="Card Title"
              />
              <Form.Control
                value={cardDescription}
                onChange={(e) => setCardDescription(e.target.value)}
                placeholder="Enter description"
                as="textarea"
                className="outline-secondary mt-2"
              />
              <Form.Select
                value={priority}
                onChange={(e) => setPriority(e.target.value)} 
                className="outline-secondary mt-2"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </Form.Select>
              <Button variant="outline-primary mt-2" onClick={handleSave}>
                Save
              </Button>
              <Button
                variant="outline-danger mt-2 ms-2"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            </div>
          ) : (
            <div>
              <p>{card.description}</p>
              <Button
                variant="outline-secondary"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </Button>
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
};

export default Card;
