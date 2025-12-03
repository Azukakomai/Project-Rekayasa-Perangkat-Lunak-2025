import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api";

const ProjectContext = createContext();

export function ProjectProvider({ children }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. Fetch Projects from Backend on Load
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await api.get("/projects");
      setProjects(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  // 2. Add Project (Send POST to Backend)
  const addProject = async (newProject) => {
    try {
      // We must map the frontend form data to the backend expected fields
      // Backend expects: { title, description, location, estimated_budget }
      const payload = {
        title: newProject.title,
        description: newProject.description || "No description",
        location: newProject.location || "Desa",
        estimated_budget: parseFloat(newProject.dana || 0), // Map 'dana' to 'estimated_budget'
      };

      const response = await api.post("/projects", payload);
      
      // Add the new real project to the list immediately
      setProjects((prev) => [...prev, response.data]);
    } catch (err) {
      console.error("Error adding project:", err);
      alert("Failed to save project to database.");
    }
  };

  return (
    <ProjectContext.Provider value={{ projects, loading, error, addProject, refreshProjects: fetchProjects }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjects() {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("useProjects must be used within a ProjectProvider");
  }
  return context;
}