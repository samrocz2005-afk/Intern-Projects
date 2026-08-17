import React, { useState, useEffect, useRef, useCallback } from "react";

import {
  Table,
  Input,
  Select,
  Space,
  Typography,
  Image,
  Modal,
  Pagination,
} from "antd";

import {
  DownOutlined,
  UpOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";

import {
  AddMovieButton,
  ViewMovieButton,
  EditMovieButton,
  DeleteMovieButton,
} from "../utils/buttons";

const { Text, Title } = Typography;

const LANGUAGE_OPTIONS = [
  { label: "All Languages", value: "All" },
  { label: "Tamil", value: "Tamil" },
  { label: "English", value: "English" },
  { label: "Malayalam", value: "Malayalam" },
];

/* =========================================================
   PAGINATION SETTINGS
========================================================= */
const DEFAULT_PAGE_SIZE = 5;
const MIN_PAGE_SIZE = 3;

const MAX_PAGE_SIZE = 30;
//const ROW_HEIGHT = 76;

//const FIXED_HEIGHT = 220;

//const SAFETY_ROWS = 1;

/* =========================================================
   TABLE COLUMNS
========================================================= */

const getColumns = (
  onView = () => {},
  onEdit = () => {},
  onDelete = () => {},
  canEdit = false,
  canDelete = false,
) => {
  const showDeleteConfirm = (record) => {
    Modal.confirm({
      title: "Delete Movie",
      icon: <ExclamationCircleFilled />,

      content: `Are you sure you want to delete "${
        record.title || "this movie"
      }"?`,

      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "No",

      onOk() {
        onDelete(record);
      },
    });
  };

  return [
    {
      title: "Poster",
      dataIndex: "poster",
      key: "poster",
      width: 90,

      render: (poster, record) => {
        const fallback = "https://via.placeholder.com/50x70?text=No+Image";

        return (
          <Image
            width={40}
            height={60}
            src={poster && poster !== "N/A" ? poster : fallback}
            fallback={fallback}
            style={{
              objectFit: "cover",
              borderRadius: 4,
            }}
            alt={record.title || "Movie"}
            preview
          />
        );
      },
    },

    {
      title: "Title",
      dataIndex: "title",
      key: "title",

      sorter: (a, b) => (a.title || "").localeCompare(b.title || ""),

      render: (title) => title || "N/A",
    },

    {
      title: "Year",
      dataIndex: "year",
      key: "year",
      width: 100,

      sorter: (a, b) => Number(a.year || 0) - Number(b.year || 0),

      render: (year) => year || "N/A",
    },

    {
      title: "Language",
      dataIndex: "language",
      key: "language",

      render: (language) => language || "N/A",
    },

    {
      title: "Action",
      key: "action",

      width: canEdit || canDelete ? 240 : 100,

      render: (_, record) => (
        <Space size="small">
          <ViewMovieButton onClick={() => onView(record)} />

          {canEdit && <EditMovieButton onClick={() => onEdit(record)} />}

          {canDelete && (
            <DeleteMovieButton onClick={() => showDeleteConfirm(record)} />
          )}
        </Space>
      ),
    },
  ];
};

/* =========================================================
   MOVIE TABLE
========================================================= */

function MovieTable({
  movies = [],

  onView = () => {},
  onEdit = () => {},
  onDelete = () => {},
  onAdd = () => {},

  search = "",
  searchSet,
  setSearch,

  language = "All",
  setLanguage = () => {},

  loading = false,
  userRole = "Reader",
}) {
  const containerRef = useRef(null);

  const [currentPage, setCurrentPage] = useState(1);

  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  /*
   * Support both setSearch and searchSet.
   */
  const updateSearch = setSearch || searchSet || (() => {});

  /* =======================================================
     ROLE PERMISSIONS
  ======================================================= */

  const userRolesArray = Array.isArray(userRole)
    ? userRole.map((role) =>
        typeof role === "string" ? role.toLowerCase() : "",
      )
    : [typeof userRole === "string" ? userRole.toLowerCase() : "reader"];

  const isAdmin = userRolesArray.includes("admin");

  const isMember = userRolesArray.includes("member");

  const canCreate =
    isAdmin || isMember || userRolesArray.includes("movie create");

  const canEdit =
    isAdmin || isMember || userRolesArray.includes("movie update");

  const canDelete =
    isAdmin || isMember || userRolesArray.includes("movie delete");

  /* =======================================================
     COLUMNS
  ======================================================= */

  const columns = getColumns(onView, onEdit, onDelete, canEdit, canDelete);

  /* =======================================================
     DYNAMIC PAGE SIZE
  ======================================================= */

  const calculatePageSize = useCallback(() => {
  const container = containerRef.current;

  if (!container) {
    return;
  }

  const containerHeight =
    container.getBoundingClientRect().height;

  const tableHeader = container.querySelector(
    ".ant-table-thead"
  );

  const tableTitle = container.querySelector(
    ".ant-table-title"
  );

  const footer = container.querySelector(
    ".ant-pagination"
  )?.parentElement;

  const headerHeight =
    tableTitle?.getBoundingClientRect().height || 42;

  const columnHeaderHeight =
    tableHeader?.getBoundingClientRect().height || 39;

  const footerHeight =
    footer?.getBoundingClientRect().height || 58;

  const availableHeight =
    containerHeight -
    56 -
    headerHeight -
    columnHeaderHeight -
    footerHeight;

  const rowHeight =
    container.querySelector(
      ".ant-table-tbody > tr"
    )?.getBoundingClientRect().height || 76;

  const rows = Math.floor(
    availableHeight / rowHeight
  );

  const newPageSize = Math.max(
    MIN_PAGE_SIZE,
    Math.min(rows, MAX_PAGE_SIZE)
  );

  setPageSize((previousSize) =>
    previousSize === newPageSize
      ? previousSize
      : newPageSize
  );
}, []);

  /* =======================================================
     RESIZE OBSERVER
  ======================================================= */

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    /*
     * Initial calculation.
     */
    calculatePageSize();

    /*
     * Recalculate whenever
     * container size changes.
     */
    const resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(calculatePageSize);
    });

    resizeObserver.observe(container);

    /*
     * Browser resize.
     */
    window.addEventListener("resize", calculatePageSize);

    return () => {
      resizeObserver.disconnect();

      window.removeEventListener("resize", calculatePageSize);
    };
  }, [calculatePageSize]);

  /* =======================================================
     RESET PAGINATION WHEN FILTER CHANGES
  ======================================================= */

  useEffect(() => {
    setCurrentPage(1);
  }, [search, language]);

  /* =======================================================
     KEEP CURRENT PAGE VALID
  ======================================================= */

  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(movies.length / pageSize));

    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [movies.length, pageSize, currentPage]);

  /* =======================================================
     PAGINATED MOVIES
  ======================================================= */

  const startIndex = (currentPage - 1) * pageSize;

  const endIndex = startIndex + pageSize;

  const paginatedMovies = movies.slice(startIndex, endIndex);

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        minHeight: 0,

        display: "flex",
        flexDirection: "column",

        overflow: "hidden",

        border: "1px solid #d9d9d9",

        borderRadius: 8,

        background: "#fff",

        boxSizing: "border-box",
      }}
    >
      {/* =================================================
          HEADER
      ================================================= */}

      <div
        style={{
          flex: "0 0 56px",

          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",

          padding: "10px 16px",

          background: "#fafafa",

          borderBottom: "1px solid #f0f0f0",

          boxSizing: "border-box",
        }}
      >
        <Title
          level={4}
          style={{
            margin: 0,
          }}
        >
          Movie List
        </Title>

        <Space wrap align="center">
          <Text strong>Total: {movies.length}</Text>

          <Select
            value={language}
            style={{
              width: 150,
            }}
            onChange={setLanguage}
            options={LANGUAGE_OPTIONS}
          />

          {canCreate && <AddMovieButton onClick={onAdd} />}
        </Space>
      </div>

      {/* =================================================
          TABLE AREA
      ================================================= */}

      <div
        style={{
          flex: "1 1 auto",
          minHeight: 0,

          overflow: "hidden",

          display: "flex",
          flexDirection: "column",
        }}
      >
        <Table
          bordered
          rowKey={(record, index) =>
            record._id || record.id || record.imdbID || index
          }
          columns={columns}
          dataSource={paginatedMovies}
          loading={loading}
          pagination={false}
          size="small"
          scroll={false}
          style={{
            width: "100%",
          }}
          title={() => (
            <div
              style={{
                height: 42,

                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",

                padding: "4px 0",

                boxSizing: "border-box",
              }}
            >
              <Input
                placeholder="Search Movie..."
                value={search}
                onChange={(e) => updateSearch(e.target.value)}
                allowClear
                style={{
                  width: 260,
                }}
              />
            </div>
          )}
          expandable={{
            expandIcon: ({ expanded, onExpand, record }) =>
              expanded ? (
                <UpOutlined
                  onClick={(e) => onExpand(record, e)}
                  style={{
                    cursor: "pointer",
                  }}
                />
              ) : (
                <DownOutlined
                  onClick={(e) => onExpand(record, e)}
                  style={{
                    cursor: "pointer",
                  }}
                />
              ),

            expandedRowRender: (record) => (
              <div
                style={{
                  padding: 8,
                  background: "#fafafa",
                  borderRadius: 8,
                }}
              >
                <p
                  style={{
                    margin: "2px 0",
                  }}
                >
                  <b>Genre:</b> {record.genre || "N/A"}
                </p>

                <p
                  style={{
                    margin: "2px 0",
                  }}
                >
                  <b>Director:</b> {record.director || "N/A"}
                </p>

                <p
                  style={{
                    margin: "2px 0",
                  }}
                >
                  <b>Actors / Lead:</b> {record.actors || record.hero || "N/A"}
                </p>

                <p
                  style={{
                    margin: "2px 0",
                  }}
                >
                  <b>Plot:</b> {record.plot || "N/A"}
                </p>
              </div>
            ),

            rowExpandable: (record) => !!record.title,
          }}
        />
      </div>

      {/* =================================================
          PAGINATION FOOTER
      ================================================= */}

      <div
        style={{
          flex: "0 0 58px",

          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",

          padding: "8px 16px",

          background: "#fafafa",

          borderTop: "1px solid #f0f0f0",

          boxSizing: "border-box",

          overflow: "hidden",
        }}
      >
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={movies.length}
          onChange={(page) => {
            setCurrentPage(page);
          }}
          showSizeChanger={false}
          showTotal={(total, range) =>
            `Showing ${range[0]}-${range[1]} of ${total} movies`
          }
        />
      </div>
    </div>
  );
}

export default MovieTable;