import { useState } from "react";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import Settings from "@/pages/Settings";

export default function Index() {
  const [page, setPage] = useState("home");

  return (
    <Layout currentPage={page} onNavigate={setPage}>
      {page === "home" && <Home />}
      {page === "settings" && <Settings />}
    </Layout>
  );
}
