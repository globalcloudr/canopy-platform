"use client";

import { useEffect, useState } from "react";

export function InviteAcceptanceHandler() {
  const [status, setStatus] = useState<"idle" | "processing" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const hash = window.location.hash.startsWith("#") ? window.location.hash.slice(1) : "";
    if (!hash) {
      return;
    }

    const params = new URLSearchParams(hash);
    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");
    const expiresIn = Number(params.get("expires_in") ?? "0");

    if (!accessToken || !refreshToken) {
      return;
    }

    setStatus("processing");
    setMessage("Finishing your invitation and preparing your workspace...");

    void fetch("/auth/accept-invite", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        access_token: accessToken,
        refresh_token: refreshToken,
        expires_in: Number.isFinite(expiresIn) ? expiresIn : undefined,
      }),
    })
      .then(async (response) => {
        const body = (await response.json()) as { ok?: boolean; redirectTo?: string; error?: string };
        if (!response.ok || !body.ok) {
          throw new Error(body.error ?? "Invite acceptance failed.");
        }

        window.history.replaceState({}, "", window.location.pathname + window.location.search);
        window.location.assign(body.redirectTo ?? "/");
      })
      .catch((error) => {
        setStatus("error");
        setMessage(error instanceof Error ? error.message : "Invite acceptance failed.");
      });
  }, []);

  if (status === "idle") {
    return null;
  }

  return (
    <div
      className={`mt-4 rounded-xl px-4 py-3 text-[0.875rem] ${
        status === "error"
          ? "border border-[rgba(220,38,38,0.18)] bg-[rgba(220,38,38,0.06)] text-[rgb(153,27,27)]"
          : "border border-[rgba(37,99,235,0.14)] bg-[rgba(37,99,235,0.06)] text-[rgb(29,78,216)]"
      }`}
    >
      {message}
    </div>
  );
}
