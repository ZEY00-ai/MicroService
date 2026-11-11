import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const USERS = [1, 2, 3, 4, 5];

export default function Navbar({ userId, onUserChange }) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userPickerRef = useRef(null);
  const userMenuButtonRef = useRef(null);

  useEffect(() => {
    if (!isUserMenuOpen) return undefined;

    function handlePointerDown(event) {
      if (!userPickerRef.current?.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setIsUserMenuOpen(false);
        userMenuButtonRef.current?.focus();
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isUserMenuOpen]);

  return (
    <header className="navbar">
      <Link className="brand" to="/" aria-label="Beranda toko">
        <span className="brand-mark" aria-hidden="true">
          N
        </span>
        <span>
          <strong>WarungPakDep</strong>
          <small>.id</small>
        </span>
      </Link>
      <div className="user-picker" ref={userPickerRef}>
        <span className="user-avatar" aria-hidden="true">
          {userId}
        </span>
        <div className="user-label">
          <small>Masuk sebagai</small>
          <button
            ref={userMenuButtonRef}
            className="user-menu-trigger"
            type="button"
            aria-label={`Pilih user, saat ini User ${userId}`}
            aria-haspopup="menu"
            aria-expanded={isUserMenuOpen}
            aria-controls="user-menu"
            onClick={() => setIsUserMenuOpen((isOpen) => !isOpen)}
          >
            User {userId}
            <span
              className={`user-menu-chevron${isUserMenuOpen ? " is-open" : ""}`}
              aria-hidden="true"
            />
          </button>
        </div>
        {isUserMenuOpen && (
          <div
            className="user-menu"
            id="user-menu"
            role="menu"
            aria-label="Pilih user"
          >
            {USERS.map((id) => (
              <button
                className="user-menu-option"
                key={id}
                type="button"
                role="menuitemradio"
                aria-checked={userId === id}
                onClick={() => {
                  onUserChange(id);
                  setIsUserMenuOpen(false);
                  userMenuButtonRef.current?.focus();
                }}
              >
                <span>User {id}</span>
                {userId === id && (
                  <span className="user-menu-check" aria-hidden="true">
                    ✓
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
