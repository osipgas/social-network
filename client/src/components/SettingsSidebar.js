import React, { useState, useEffect } from "react";
import SidebarButton from "./ButtonWithIcon.js";

export default function SidebarMenu({ isEditing, setIsEditing }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  useEffect(() => {
    if (isEditing) {
      // когда редактируем — закрываем sidebar, но toggle остаётся
      setIsOpen(false);
    }
  }, [isEditing]);

  return (
    <div>
      {/* Toggle всегда виден */}
      <button
        className={`sidebar-toggle ${isEditing ? "editing" : ""}`}
        onClick={() => {
          if (!isEditing) setIsOpen(true);
        }}
      >
        <svg
          className="sidebar-3lines"
          width="30"
          height="30"
          viewBox="0 0 502 406"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M25 25H476.858" stroke="currentColor" strokeWidth="50" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M25 202.778H476.858" stroke="currentColor" strokeWidth="50" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M25 380.556H476.858" stroke="currentColor" strokeWidth="50" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>


      {/* Sidebar плавно открывается/закрывается */}
      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        {isOpen && (
          <button className="sidebar-back" onClick={() => {setIsOpen(false)}}>{"<"}</button>
        )}
        <SidebarButton
          text="Edit Profile"
          iconDefault="/icons/edit.svg"
          onClick={() => setIsEditing(true)}
        />

        <SidebarButton
          text="Data and Storage"
          iconDefault="/icons/data.svg"
          onClick={() => console.log("Data and Storage clicked")}
        />

        <SidebarButton
          text="Wallet"
          iconDefault="/icons/wallet.svg"
          onClick={() => console.log("Wallet clicked")}
        />

        <SidebarButton
          text="Customize"
          iconDefault="/icons/customize.svg"
          onClick={() => console.log("Customize clicked")}
        />

        <SidebarButton
          text="Log Out"
          iconDefault="/icons/log-out.svg"
          onClick={handleLogout}
        />
      </div>
    </div>
  );
}

