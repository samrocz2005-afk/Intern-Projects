import React, {
  useEffect,
  useState,
  useCallback,
} from "react";

import { message, Layout } from "antd";
import { useSelector } from "react-redux";

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import CinemaTable from "../components/CinemaTable";
// Corrected import to use AddEditCinemaModal instead of CinemaDrawer
import AddEditCinemaModal from "../components/AddEditCinemaModal";

import {
  getCinemas,
  createCinema,
  updateCinema,
  deleteCinema,
} from "../services/cinemaApi";

const { Content } = Layout;

function Cinemas() {
  const { user } = useSelector(
    (state) => state.auth || {}
  );

  const [cinemas, setCinemas] = useState([]);
  const [loading, setLoading] = useState(false);

  // =========================
  // Search & Filter
  // =========================
  const [search, setSearch] = useState("");
  const [cityFilter, setCityFilter] = useState("All");

  // =========================
  // Modal State (Replaces Drawer states)
  // =========================
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedCinema, setSelectedCinema] =
    useState(null);
  const [drawerMode, setDrawerMode] = useState("view");

  // =========================
  // Load All Cinemas (from MongoDB via API)
  // =========================
  const loadCinemas = useCallback(
    async () => {
      try {
        setLoading(true);

        const res = await getCinemas();

        const cinemaList =
          res?.data?.cinemas ||
          res?.cinemas ||
          res?.data ||
          (Array.isArray(res)
            ? res
            : []);

        setCinemas(
          Array.isArray(cinemaList)
            ? cinemaList
            : []
        );
      } catch (error) {
        console.error(
          "Failed to load cinemas:",
          error
        );

        message.error(
          error?.response?.data?.message ||
            "Failed to load cinemas"
        );
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // =========================
  // Initial Load
  // =========================
  useEffect(() => {
    loadCinemas();
  }, [loadCinemas]);

  // =========================
  // Frontend Filtering for Search & City
  // =========================
  const getFilteredCinemas = useCallback(() => {
    return cinemas.filter((cinema) => {
      const cinemaCity = String(
        cinema.city ||
          cinema.location ||
          cinema.cityName ||
          "Unknown"
      ).trim();

      const matchesCity =
        cityFilter === "All" ||
        cinemaCity.toLowerCase() === cityFilter.toLowerCase();

      const trimmedSearch = search.trim().toLowerCase();
      let matchesSearch = true;

      if (trimmedSearch) {
        const name = String(cinema.name || "").toLowerCase();
        const address = String(cinema.address || "").toLowerCase();
        const cityStr = cinemaCity.toLowerCase();
        
        matchesSearch =
          name.includes(trimmedSearch) ||
          address.includes(trimmedSearch) ||
          cityStr.includes(trimmedSearch);
      }

      return matchesCity && matchesSearch;
    });
  }, [cinemas, search, cityFilter]);

  // =========================
  // View Cinema
  // =========================
  const handleView = useCallback(
    (cinema) => {
      setSelectedCinema(cinema);
      setDrawerMode("view");
      setDrawerOpen(true);
    },
    []
  );

  // =========================
  // Add Cinema
  // =========================
  const handleAdd = useCallback(() => {
    setSelectedCinema(null);
    setDrawerMode("add");
    setDrawerOpen(true);
  }, []);

  // =========================
  // Edit Cinema
  // =========================
  const handleEdit = useCallback(
    (cinema) => {
      setSelectedCinema(cinema);
      setDrawerMode("edit");
      setDrawerOpen(true);
    },
    []
  );

  // =========================
  // Delete Cinema
  // =========================
  const handleDelete = useCallback(
    async (id) => {
      if (!id) {
        message.error("Cinema ID is missing");
        return;
      }

      try {
        await deleteCinema(id);
        message.success("Cinema deleted successfully");
        await loadCinemas();
      } catch (error) {
        console.error("Failed to delete cinema:", error);
        message.error(
          error?.response?.data?.message ||
            "Failed to delete cinema"
        );
      }
    },
    [loadCinemas]
  );

  const handleSubmit = useCallback(
    async (values) => {
        console.log("🔥 CINEMAS handleSubmit CALLED");
        console.log("Submitting values:", values);
        console.log("drawerMode:", drawerMode);
        console.log("selectedCinema:", selectedCinema);

        try {
        setLoading(true);

        if (drawerMode === "add") {
            console.log("🚀 Calling createCinema API...");

            const response = await createCinema(values);

            console.log("✅ Create response:", response);

            message.success("Cinema created successfully");
        } else if (drawerMode === "edit") {
            const cinemaId =
            selectedCinema?._id || selectedCinema?.id;

            if (!cinemaId) {
            message.error("Cinema ID is missing");
            return;
            }

            console.log("🚀 Calling updateCinema API...", cinemaId);

            const response = await updateCinema(
            cinemaId,
            values
            );

            console.log("✅ Update response:", response);

            message.success("Cinema updated successfully");
        }

        setDrawerOpen(false);
        setSelectedCinema(null);

        await loadCinemas();
        } catch (error) {
        console.error("❌ Cinema operation failed:", error);

        console.error(
            "Response:",
            error?.response?.data
        );

        message.error(
            error?.response?.data?.message ||
            error?.message ||
            "Cinema operation failed"
        );
        } finally {
        setLoading(false);
        }
    },
    [drawerMode, selectedCinema, loadCinemas]
    );

  // =========================
  // Close Modal
  // =========================
  const handleDrawerClose =
    useCallback(() => {
      setDrawerOpen(false);
      setSelectedCinema(null);
    }, []);

  return (
    <Layout
      style={{
        height: "100vh",
        minHeight: 0,
        overflow: "hidden",
      }}
    >
      {/* =========================
          SIDEBAR
      ========================== */}
      <Sidebar />

      {/* =========================
          RIGHT SIDE
      ========================== */}
      <Layout
        style={{
          height: "100vh",
          minHeight: 0,
          overflow: "hidden",
        }}
      >
        {/* =========================
            HEADER
        ========================== */}
        <Header />

        {/* =========================
            CONTENT
        ========================== */}
        <Content
          style={{
            flex: 1,
            minHeight: 0,
            height: 0,
            padding: 20,
            overflow: "hidden",
            boxSizing: "border-box",
          }}
        >
          <CinemaTable
            cinemas={getFilteredCinemas()}
            loading={loading}
            userRole={
              user?.role || "Reader"
            }
            search={search}
            setSearch={setSearch}
            cityFilter={cityFilter}
            setCityFilter={
              setCityFilter
            }
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onAdd={handleAdd}
          />
        </Content>
      </Layout>
      
      <AddEditCinemaModal
        open={drawerOpen}
        onCancel={handleDrawerClose}
        onSubmit={handleSubmit}
        cinema={selectedCinema}
        loading={loading}
      />
    </Layout>
  );
}

export default Cinemas;