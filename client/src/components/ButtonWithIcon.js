import React, { useState } from "react";

const SidebarButton = ({ text, iconDefault, onClick }) => {

  return (
    <button
      className="sidebar-button"
      onClick={onClick}
    >
      <div className="sidebar-content">
        <img
          src={iconDefault}
          alt="icon"
          className="sidebar-icon"
        />
        <span className="button-text">{text}</span>
      </div>
      <span className="sidebar-arrow">{">"}</span>
    </button>
  );
};

export default SidebarButton;