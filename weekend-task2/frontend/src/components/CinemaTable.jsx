import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";

import {
  Table,
  Input,
  Select,
  Space,
  Typography,
  Image,
  Modal,
  Pagination,
  Tag,
} from "antd";

import {
  DownOutlined,
  UpOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";

import {
  AddCinemaButton,
  ViewCinemaButton,
  EditCinemaButton,
  DeleteCinemaButton,
} from "../utils/buttons";

import CinemaDrawer from "./CinemaDrawer";
import AddEditCinemaModal from "./AddEditCinemaModal";

const { Text, Title } = Typography;

const CITY_OPTIONS = [
  { label: "All Cities", value: "All" },
  { label: "Trichy", value: "Trichy" },
  { label: "Chennai", value: "Chennai" },
  { label: "Madurai", value: "Madurai" },
  { label: "Coimbatore", value: "Coimbatore" },
];

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=150&q=80";

const DEFAULT_PAGE_SIZE = 5;
const MIN_PAGE_SIZE = 1;
const MAX_PAGE_SIZE = 30;

/*
 * Get columns
 */
const getColumns = (
  onView = () => {},
  onEdit = () => {},
  onDelete = () => {},
  canModify = false,
  canDelete = false
) => {
  const showDeleteConfirm = (record) => {
    Modal.confirm({
      title: "Delete Cinema",
      icon: <ExclamationCircleFilled />,
      content: `Are you sure you want to delete "${
        record.name || "this cinema"
      }"?`,
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "No",

      onOk() {
        onDelete(record._id || record.id);
      },
    });
  };

  return [
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      width: 90,

      render: (image, record) => {
        const imageUrl =
          image || record.imageUrl || record.poster;

        return (
          <Image
            width={50}
            height={50}
            src={imageUrl || DEFAULT_IMAGE}
            fallback={DEFAULT_IMAGE}
            style={{
              objectFit: "cover",
              borderRadius: 4,
            }}
            alt={record.name || "Cinema"}
            preview={{
              mask: "View",
            }}
          />
        );
      },
    },

    {
      title: "Cinema",
      dataIndex: "name",
      key: "name",

      sorter: (a, b) =>
        (a.name || "").localeCompare(b.name || ""),

      render: (text) => <strong>{text}</strong>,
    },

    {
      title: "City",
      dataIndex: "city",
      key: "city",

      sorter: (a, b) =>
        (a.city || "").localeCompare(b.city || ""),

      render: (text, record) =>
        text ||
        record.location ||
        record.cityName ||
        "N/A",
    },

    {
      title: "State",
      dataIndex: "state",
      key: "state",
    },

    {
      title: "Screens",
      dataIndex: "screens",
      key: "screens",
      align: "center",
      width: 100,

      sorter: (a, b) =>
        Number(a.screens || 0) -
        Number(b.screens || 0),
    },

    {
      title: "Capacity",
      dataIndex: "capacity",
      key: "capacity",
      align: "center",
      width: 110,

      sorter: (a, b) =>
        Number(a.capacity || 0) -
        Number(b.capacity || 0),
    },

    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
      width: 110,

      render: (status) => {
        const normalizedStatus = String(
          status || "Operational"
        ).toLowerCase();

        const isActive =
          normalizedStatus === "active" ||
          normalizedStatus === "operational";

        return (
          <Tag color={isActive ? "green" : "red"}>
            {(status || "Operational").toUpperCase()}
          </Tag>
        );
      },
    },

    {
      title: "Action",
      key: "action",

      width:
        canModify || canDelete
          ? 240
          : 100,

      render: (_, record) => (
        <Space size="small">
          <ViewCinemaButton
            onClick={() => onView(record)}
          />

          {canModify && (
            <EditCinemaButton
              onClick={() => onEdit(record)}
            />
          )}

          {canDelete && (
            <DeleteCinemaButton
              onClick={() =>
                showDeleteConfirm(record)
              }
            />
          )}
        </Space>
      ),
    },
  ];
};

function CinemaTable({
  cinemas = [],
  data = [],

  onDelete = () => {},
  onSubmitCinema = () => {},

  search: externalSearch,
  searchSet,
  setSearch: externalSetSearch,

  cityFilter: externalCityFilter,
  setCityFilter: externalSetCityFilter,

  loading = false,
  modalLoading = false,

  userRole = "Reader",
  role,
}) {
  /*
   * Main container
   */
  const containerRef = useRef(null);

  /*
   * Actual table area
   */
  const tableAreaRef = useRef(null);

  const [internalCityFilter, setInternalCityFilter] =
    useState("All");

  const [internalSearch, setInternalSearch] =
    useState("");

  const [drawerOpen, setDrawerOpen] =
    useState(false);

  const [modalOpen, setModalOpen] =
    useState(false);

  const [selectedCinema, setSelectedCinema] =
    useState(null);

  const [currentPage, setCurrentPage] =
    useState(1);

  /*
   * Start with safe value.
   * It will be recalculated from real DOM size.
   */
  const [pageSize, setPageSize] =
    useState(DEFAULT_PAGE_SIZE);

  /*
   * External / internal city filter
   */
  const cityFilter =
    externalCityFilter !== undefined
      ? externalCityFilter
      : internalCityFilter;

  const setCityFilter =
    externalSetCityFilter ||
    setInternalCityFilter;

  /*
   * External / internal search
   */
  const search =
    externalSearch !== undefined
      ? externalSearch
      : internalSearch;

  const setSearch =
    externalSetSearch ||
    searchSet ||
    setInternalSearch;

  /*
   * Data source
   */
  const dataSource =
    cinemas.length > 0
      ? cinemas
      : data;

  /*
   * Roles
   */
  const activeRole =
    userRole || role;

  const userRolesArray =
    Array.isArray(activeRole)
      ? activeRole.map((r) =>
          typeof r === "string"
            ? r.toLowerCase()
            : ""
        )
      : [
          typeof activeRole === "string"
            ? activeRole.toLowerCase()
            : "reader",
        ];

  const isAdmin =
    userRolesArray.includes("admin");

  const isMember =
    userRolesArray.includes("member");

  const canAdd =
    isAdmin ||
    isMember ||
    userRolesArray.includes(
      "cinema create"
    );

  const canModify =
    isAdmin ||
    isMember ||
    userRolesArray.includes(
      "cinema update"
    );

  const canDelete =
    isAdmin ||
    isMember ||
    userRolesArray.includes(
      "cinema delete"
    );

  /*
   * View
   */
  const handleView = useCallback(
    (cinema) => {
      setSelectedCinema(cinema);
      setDrawerOpen(true);
    },
    []
  );

  /*
   * Edit
   */
  const handleEdit = useCallback(
    (cinema) => {
      setSelectedCinema(cinema);
      setModalOpen(true);
    },
    []
  );

  /*
   * Add
   */
  const handleAdd = useCallback(() => {
    setSelectedCinema(null);
    setModalOpen(true);
  }, []);

  /*
   * Close modal
   */
  const handleModalClose = useCallback(() => {
    setModalOpen(false);
    setSelectedCinema(null);
  }, []);

  /*
   * Submit
   */
  const handleModalSubmit =
    useCallback(
      async (formData) => {
        await onSubmitCinema(formData);
        handleModalClose();
      },
      [
        onSubmitCinema,
        handleModalClose,
      ]
    );

  /*
   * Columns
   */
  const columns = useMemo(
    () =>
      getColumns(
        handleView,
        handleEdit,
        onDelete,
        canModify,
        canDelete
      ),
    [
      handleView,
      handleEdit,
      onDelete,
      canModify,
      canDelete,
    ]
  );

  /*
   * Filter data
   */
  const filteredCinemas = useMemo(() => {
    const targetCity = String(
      cityFilter || "All"
    )
      .trim()
      .toLowerCase();

    const query = String(search || "")
      .trim()
      .toLowerCase();

    return dataSource.filter(
      (cinema) => {
        const rawCity =
          cinema.city ||
          cinema.location ||
          cinema.cityName ||
          "";

        const cinemaCity =
          String(rawCity)
            .trim()
            .toLowerCase();

        const cinemaName =
          String(
            cinema.name || ""
          ).toLowerCase();

        const matchesCity =
          targetCity === "all" ||
          cinemaCity === targetCity;

        const matchesSearch =
          !query ||
          cinemaName.includes(query) ||
          cinemaCity.includes(query);

        return (
          matchesCity &&
          matchesSearch
        );
      }
    );
  }, [
    dataSource,
    search,
    cityFilter,
  ]);

  /*
   * =====================================================
   * IMPORTANT
   * =====================================================
   *
   * Calculate page size using ACTUAL DOM dimensions.
   *
   * We measure:
   *
   * 1. Available table area
   * 2. Search/title area
   * 3. Table header
   * 4. Actual cinema row height
   *
   * This prevents:
   *
   * "Showing 1-7"
   *
   * while only 6 rows are visible.
   */
  const calculatePageSize =
    useCallback(() => {
      const container =
        containerRef.current;

      const tableArea =
        tableAreaRef.current;

      if (!container || !tableArea) {
        return;
      }

      /*
       * Table area height.
       *
       * Footer is outside this area,
       * so footer will NEVER overlap
       * table rows.
       */
      const tableAreaHeight =
        tableArea.getBoundingClientRect()
          .height;

      if (tableAreaHeight <= 0) {
        return;
      }

      /*
       * Ant Design table title/search area
       */
      const titleElement =
        tableArea.querySelector(
          ".ant-table-title"
        );

      /*
       * Ant Design table header
       */
      const headerElement =
        tableArea.querySelector(
          ".ant-table-thead"
        );

      /*
       * Actual first data row
       */
      const rowElement =
        tableArea.querySelector(
          ".ant-table-tbody > tr"
        );

      const titleHeight =
        titleElement?.getBoundingClientRect()
          .height || 0;

      const headerHeight =
        headerElement?.getBoundingClientRect()
          .height || 0;

      /*
       * If a row exists, use its REAL
       * height instead of guessing.
       *
       * Otherwise use a safe fallback.
       */
      const rowHeight =
        rowElement?.getBoundingClientRect()
          .height || 66;

      /*
       * Space available for rows.
       */
      const availableHeight =
        tableAreaHeight -
        titleHeight -
        headerHeight;

      /*
       * Small safety buffer prevents
       * the last row from touching
       * the footer because of borders,
       * sub-pixel calculations, etc.
       */
      const safetyBuffer = 2;

      const rows = Math.floor(
        (availableHeight -
          safetyBuffer) /
          rowHeight
      );

      const newPageSize = Math.max(
        MIN_PAGE_SIZE,
        Math.min(
          rows,
          MAX_PAGE_SIZE
        )
      );

      setPageSize(
        (previousPageSize) => {
          if (
            previousPageSize !==
            newPageSize
          ) {
            setCurrentPage(1);

            return newPageSize;
          }

          return previousPageSize;
        }
      );
    }, []);

  /*
   * Recalculate after data / loading / search
   * changes because Ant Design changes the
   * table DOM.
   */
  useEffect(() => {
    const frame1 =
      requestAnimationFrame(() => {
        const frame2 =
          requestAnimationFrame(
            calculatePageSize
          );

        return () =>
          cancelAnimationFrame(
            frame2
          );
      });

    return () =>
      cancelAnimationFrame(frame1);
  }, [
    filteredCinemas.length,
    loading,
    search,
    cityFilter,
    calculatePageSize,
  ]);

  /*
   * ResizeObserver
   *
   * Handles:
   * - Browser resize
   * - Maximize
   * - Restore
   * - Browser zoom
   * - Sidebar/layout changes
   */
  useEffect(() => {
    const container =
      containerRef.current;

    const tableArea =
      tableAreaRef.current;

    if (!container || !tableArea) {
      return;
    }

    const resizeObserver =
      new ResizeObserver(() => {
        requestAnimationFrame(
          calculatePageSize
        );
      });

    resizeObserver.observe(
      container
    );

    resizeObserver.observe(
      tableArea
    );

    window.addEventListener(
      "resize",
      calculatePageSize
    );

    calculatePageSize();

    return () => {
      resizeObserver.disconnect();

      window.removeEventListener(
        "resize",
        calculatePageSize
      );
    };
  }, [calculatePageSize]);

  /*
   * Reset page on search/filter.
   */
  useEffect(() => {
    setCurrentPage(1);
  }, [
    search,
    cityFilter,
  ]);

  /*
   * Make sure page is valid.
   */
  useEffect(() => {
    const totalPages = Math.max(
      1,
      Math.ceil(
        filteredCinemas.length /
          pageSize
      )
    );

    if (
      currentPage > totalPages
    ) {
      setCurrentPage(
        totalPages
      );
    }
  }, [
    filteredCinemas.length,
    pageSize,
    currentPage,
  ]);

  /*
   * Client-side pagination
   */
  const paginatedCinemas =
    filteredCinemas.slice(
      (currentPage - 1) *
        pageSize,
      currentPage * pageSize
    );

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        minHeight: 0,

        border:
          "1px solid #d9d9d9",

        borderRadius: "8px",

        overflow: "hidden",

        background: "#fff",

        display: "flex",
        flexDirection: "column",

        boxSizing: "border-box",
      }}
    >
      {/* =========================
          CINEMA HEADER
      ========================== */}
      <div
        style={{
          flexShrink: 0,

          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",

          background: "#fafafa",

          padding:
            "12px 16px",

          borderBottom:
            "1px solid #f0f0f0",

          boxSizing:
            "border-box",
        }}
      >
        <Title
          level={4}
          style={{
            margin: 0,
          }}
        >
          Cinema List
        </Title>

        <Space
          wrap
          align="center"
        >
          <Text strong>
            Total:{" "}
            {filteredCinemas.length}
          </Text>

          <Select
            value={cityFilter}
            style={{
              width: 150,
            }}
            onChange={
              setCityFilter
            }
            options={
              CITY_OPTIONS
            }
          />

          {canAdd && (
            <AddCinemaButton
              onClick={handleAdd}
            />
          )}
        </Space>
      </div>

      {/* =========================
          TABLE AREA
      ========================== */}
      <div
        ref={tableAreaRef}
        style={{
          flex: 1,
          minHeight: 0,

          /*
           * IMPORTANT:
           * Nothing inside the table area
           * can go behind the footer.
           */
          overflow: "hidden",

          display: "flex",
          flexDirection:
            "column",
        }}
      >
        <Table
          bordered
          rowKey={(record, index) =>
            record._id ||
            record.id ||
            index
          }
          columns={columns}
          dataSource={
            paginatedCinemas
          }
          loading={loading}
          pagination={false}
          size="small"
          scroll={false}
          title={() => (
            <div
              style={{
                display: "flex",
                justifyContent:
                  "flex-end",

                padding:
                  "4px 0",
              }}
            >
              <Input
                placeholder="Search Cinema..."
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                allowClear
                style={{
                  width: 260,
                }}
              />
            </div>
          )}
          expandable={{
            expandIcon: ({
              expanded,
              onExpand,
              record,
            }) =>
              expanded ? (
                <UpOutlined
                  onClick={(e) =>
                    onExpand(
                      record,
                      e
                    )
                  }
                  style={{
                    cursor:
                      "pointer",
                  }}
                />
              ) : (
                <DownOutlined
                  onClick={(e) =>
                    onExpand(
                      record,
                      e
                    )
                  }
                  style={{
                    cursor:
                      "pointer",
                  }}
                />
              ),

            expandedRowRender:
              (record) => (
                <div
                  style={{
                    padding: 12,
                    background:
                      "#fafafa",
                    borderRadius: 8,
                  }}
                >
                  <p
                    style={{
                      margin:
                        "4px 0",
                    }}
                  >
                    <b>Address:</b>{" "}
                    {record.address ||
                      "N/A"}
                  </p>

                  <p
                    style={{
                      margin:
                        "4px 0",
                    }}
                  >
                    <b>
                      Contact / Phone:
                    </b>{" "}
                    {record.phone ||
                      record.contact ||
                      "N/A"}
                  </p>

                  <p
                    style={{
                      margin:
                        "4px 0",
                    }}
                  >
                    <b>
                      Facilities:
                    </b>{" "}
                    {record.facilities ||
                      record.amenities ||
                      "N/A"}
                  </p>
                </div>
              ),

            rowExpandable:
              (record) =>
                !!record.name,
          }}
        />
      </div>

      {/* =========================
          FIXED FOOTER
      ========================== */}
      <div
        style={{
          flexShrink: 0,

          height: 58,
          minHeight: 58,

          display: "flex",
          justifyContent:
            "flex-end",
          alignItems: "center",

          padding:
            "8px 16px",

          background: "#fafafa",

          borderTop:
            "1px solid #f0f0f0",

          boxSizing:
            "border-box",
        }}
      >
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={
            filteredCinemas.length
          }
          onChange={(page) => {
            setCurrentPage(page);
          }}
          showSizeChanger={false}
          showTotal={(
            total,
            range
          ) =>
            `Showing ${range[0]}-${range[1]} of ${total} cinemas`
          }
        />
      </div>

      {/* =========================
          VIEW DRAWER
      ========================== */}
      <CinemaDrawer
        open={drawerOpen}
        cinema={selectedCinema}
        onClose={() =>
          setDrawerOpen(false)
        }
      />

      {/* =========================
          ADD / EDIT MODAL
      ========================== */}
      <AddEditCinemaModal
        open={modalOpen}
        cinema={selectedCinema}
        onCancel={
          handleModalClose
        }
        onSubmit={
          handleModalSubmit
        }
        loading={modalLoading}
      />
    </div>
  );
}

export default CinemaTable;