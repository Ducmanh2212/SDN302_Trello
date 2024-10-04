import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import SideBar from "./components/SideBar";
import ProjectsList from "./components/ProjectsList";
import ProfilePage from "./components/AcoountDetail/Profile";
import Board from "./components/Board";
import ActivityPage from "./components/AcoountDetail/Activity";
import ProfileLayout from "./components/AcoountDetail/ProfileLayout";

const App = () => {
  const user = {
    name: 'John Doe',
    username: 'johndoe',
    bio:''
  };

  const activities = [
    {
      name: user.name,
      action: 'added',
      card: 'Project planning',
      list: 'To do',
      date: '9 Jan 2024',
      time: '21:52',
      board: 'My Trello board',
    },
    {
      name: user.name,
      action: 'added',
      card: 'Kickoff meeting',
      list: 'To do',
      date: '9 Jan 2024',
      time: '21:52',
      board: 'My Trello board',
    },
    {
      name: user.name,
      action: 'added',
      list: 'To do',
      date: '9 Jan 2024',
      time: '21:52',
      board: 'My Trello board',
    },
];
  

  return (
    <Router>
      <Header />
      <div className="app-layout">
        <SideBar />
        <div className="content">
          <Routes>
            <Route path="/" element={<ProjectsList />} />
            <Route path="/profile" element={<ProfileLayout user={user} />}>
              <Route path="" element={<ProfilePage user={user}/>} />
              <Route path="activity" element={<ActivityPage activities={activities}/>} /> 
            </Route>
            <Route path="/project/:projectId" element={<Board />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
