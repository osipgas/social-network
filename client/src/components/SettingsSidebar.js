import React, { useState, useEffect } from "react";
import SidebarButton from "./ButtonWithIcon.js";

export default function SidebarMenu({ isEditing, setIsEditing }) {
  const [isOpen, setIsOpen] = useState(false);

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
        <img src="/icons/sidebar.svg" alt="Sidebar" className="sidebar-3lines" />
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
      </div>
    </div>
  );
}