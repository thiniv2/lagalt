import { createContext, useContext, useState } from "react";
const UserContext = createContext();

export const useUser = () => {
  return useContext(UserContext);
};

const UserProvider = (props) => {
  const [user, setUser] = useState(null);

  const state = {
    user,
    setUser,
  };

  return (
    <UserContext.Provider value={state}>{props.children}</UserContext.Provider>
  );
};


export default UserProvider;