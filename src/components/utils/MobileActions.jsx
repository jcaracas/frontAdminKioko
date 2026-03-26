import { useState, useRef, useEffect } from "react";

function MobileActions({ actions = [] }) {
  const [open, setOpen] = useState(false);
  const [openUp, setOpenUp] = useState(false);
  const ref = useRef();

  const toggleMenu = () => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;

    setOpenUp(spaceBelow < 180); // calcula dirección
    setOpen(prev => !prev);
  };

  // cerrar al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="d-md-none position-relative" ref={ref}>
      <button
        className="btn btn-sm btn-outline-secondary"
        onClick={toggleMenu}
      >
        <i className="bi bi-three-dots-vertical"></i>
      </button>

      {open && (
        <div className={`mobile-dropdown shadow ${openUp ? "up" : "down"}`}>
          {actions.map((action, i) => (
            <button
              key={i}
              className={`dropdown-item-action ${action.className || ""}`}
              onClick={() => {
                action.onClick();
                setOpen(false);
              }}
            >
              <i className={`${action.icon} me-2`}></i>
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default MobileActions;