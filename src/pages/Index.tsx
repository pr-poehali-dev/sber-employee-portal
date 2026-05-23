import { useState } from "react";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import Settings from "@/pages/Settings";
import Tickets from "@/pages/Tickets";
import Queue from "@/pages/Queue";
import Operator from "@/pages/Operator";

export default function Index() {
  const [page, setPage] = useState("home");

  return (
    <Layout currentPage={page} onNavigate={setPage}>
      {page === "home" && <Home />}
      {page === "tickets" && <Tickets />}
      {page === "queue" && <Queue />}
      {page === "operator" && <Operator />}
      {page === "settings" && <Settings />}
    </Layout>
  );
}