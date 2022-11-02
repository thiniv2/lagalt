import { createContext, useContext, useEffect, useState } from "react";
import { getAllProjectBanners } from "../Services/Projects";
const ProjectBannerContext = createContext();

export const useProjectBanners = () => {
  return useContext(ProjectBannerContext);
};

const ProjectBannerProvider = (props) => {
  const [projectBanners, setProjectBanners] = useState(null);

  useEffect(() => {
    getAllProjectBanners().then(res => {
      
      res.forEach((banner) => {
        banner.field = banner.field.split(/(?=[A-Z])/).join(" ")
      })

      setProjectBanners(res)})
  }, [])

  const state = {
    projectBanners,
    setProjectBanners,
  };

  return (
    <ProjectBannerContext.Provider value={state}>{props.children}</ProjectBannerContext.Provider>
  );
};

export default ProjectBannerProvider;