import React, { useState, useEffect } from "react";
import { Card, Button, Form, Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { ToastContainer, toast } from "react-toastify"; // Import Toast
import "react-toastify/dist/ReactToastify.css"; // Import Toast styles
import "./styles/ProjectsList.css";

const ProjectsList = () => {
  const getInitialProjects = () => {
    const storedProjects = localStorage.getItem("projects");
    return storedProjects
      ? JSON.parse(storedProjects)
      : [
          { id: "1", name: "Project 1", description: "Test" },
          { id: "2", name: "Project 2", description: "Test" },
        ];
  };

  const [projects, setProjects] = useState(getInitialProjects());
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDescription, setNewProjectDescription] = useState("");

  // Update localStorage whenever projects change
  useEffect(() => {
    localStorage.setItem("projects", JSON.stringify(projects));
  }, [projects]);

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;
    if (source.index === destination.index) return; // No movement

    // Reorder the projects array
    const reorderedProjects = Array.from(projects);
    const [movedProject] = reorderedProjects.splice(source.index, 1);
    reorderedProjects.splice(destination.index, 0, movedProject);
    setProjects(reorderedProjects); // Update state with reordered projects
    toast.success("Project moved successfully!"); // Show success toast on drag end
  };

  const addNewProject = () => {
    if (newProjectName.trim() === "") return; // Prevent empty names

    const newProject = {
      id: Date.now().toString(), // Unique ID based on timestamp
      name: newProjectName,
      description: newProjectDescription,
    };

    setProjects([...projects, newProject]); // Add new project
    setNewProjectName(""); // Clear input field
    setNewProjectDescription(""); // Clear input field
    setIsAddingProject(false); // Close add project section
    toast.success(`Project "${newProjectName}" added successfully!`); // Show success toast when project is added
  };

  return (
    <Container className="mt-4">
      <h2>Projects</h2>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="projects">
          {(provided) => (
            <Row {...provided.droppableProps} ref={provided.innerRef}>
              {projects.map((project, index) => (
                <Draggable
                  key={project.id}
                  draggableId={project.id}
                  index={index}
                >
                  {(provided) => (
                    <Col
                      md={4}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <Card className="mb-3">
                        <Card.Body>
                          <Card.Title>{project.name}</Card.Title>
                          <Card.Text>{project.description}</Card.Text>
                          <Link to={`/project/${project.id}`}>
                            <Button variant="primary">View Project</Button>
                          </Link>
                        </Card.Body>
                      </Card>
                    </Col>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
              <Col md={4}>
                <div className="add-project-section">
                  {isAddingProject ? (
                    <div className="new-project">
                      <Form.Control
                        type="text"
                        placeholder="Project Name"
                        value={newProjectName}
                        onChange={(e) => setNewProjectName(e.target.value)}
                        className="mb-2"
                      />
                      <Form.Control
                        type="text"
                        placeholder="Project Description"
                        value={newProjectDescription}
                        onChange={(e) =>
                          setNewProjectDescription(e.target.value)
                        }
                        className="mb-2"
                      />
                      <Button
                        variant="outline-success"
                        onClick={addNewProject}
                        className="mr-2"
                      >
                        Add Project
                      </Button>
                      <Button
                        variant="outline-danger mt-2"
                        onClick={() => setIsAddingProject(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="outline-light"
                      onClick={() => setIsAddingProject(true)}
                    >
                      + Add New Project
                    </Button>
                  )}
                </div>
              </Col>
            </Row>
          )}
        </Droppable>
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

export default ProjectsList;
