"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronIcon, LogOutIcon } from "@/components/ui/icons";

type AccountMenuProps = Readonly<{
  officeName: string;
  contactName: string;
}>;

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("");
}

export function AccountMenu({ officeName, contactName }: AccountMenuProps) {
  const router = useRouter();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  async function logout() {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      router.replace("/login");
      router.refresh();
    }
  }

  return (
    <div className="account-menu" ref={wrapperRef}>
      <button
        className="account-button"
        type="button"
        aria-label="תפריט משתמש"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="avatar" aria-hidden="true">{getInitials(contactName)}</span>
        <span><small>משתמש</small><strong>{contactName}</strong></span>
        <ChevronIcon className={open ? "account-chevron-open" : undefined} />
      </button>
      {open ? (
        <div className="account-dropdown" role="menu">
          <div className="account-dropdown-identity">
            <strong>{contactName}</strong>
            <span>{officeName}</span>
          </div>
          <button type="button" role="menuitem" onClick={logout} disabled={loggingOut}>
            <LogOutIcon />
            <span>{loggingOut ? "מתנתקים..." : "התנתקות"}</span>
          </button>
        </div>
      ) : null}
    </div>
  );
}
