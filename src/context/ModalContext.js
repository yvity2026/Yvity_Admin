"use client";
import { createContext, useContext, useState } from "react";

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [trigger, setTrigger] = useState(null);

  const openModal = (type) => {
    setTrigger(type);
  };

  const clearTrigger = () => {
    setTrigger(null);
  };

  return (
    <ModalContext.Provider value={{ trigger, openModal, clearTrigger }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => useContext(ModalContext);