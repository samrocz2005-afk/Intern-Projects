import { Modal, Form, Input, Select } from "antd";
import { 
  VideoCameraOutlined, 
  CalendarOutlined, 
  UserOutlined, 
  ClockCircleOutlined, 
  GlobalOutlined, 
  SafetyCertificateOutlined, 
  TeamOutlined, 
  AppstoreOutlined, 
  DollarOutlined, 
  StarOutlined, 
  FileTextOutlined, 
  PictureOutlined
} from "@ant-design/icons";
import { useEffect, useState } from "react";

const DEFAULT_LANGUAGES = [
  { label: "Tamil", value: "Tamil" },
  { label: "English", value: "English" },
  { label: "Malayalam", value: "Malayalam" },
  { label: "Hindi", value: "Hindi" },
  { label: "Telugu", value: "Telugu" },
  { label: "Kannada", value: "Kannada" },
];

const RATED_OPTIONS = [
  { label: "G (General Audiences)", value: "G" },
  { label: "PG (Parental Guidance Suggested)", value: "PG" },
  { label: "PG-13 (Parents Strongly Cautioned)", value: "PG-13" },
  { label: "R (Restricted)", value: "R" },
  { label: "NC-17 (Adults Only)", value: "NC-17" },
  { label: "TV-MA (Mature Audience)", value: "TV-MA" },
  { label: "TV-14 (Parents Strongly Cautioned)", value: "TV-14" },
  { label: "TV-PG (Parental Guidance Suggested)", value: "TV-PG" },
  { label: "Not Rated / Unrated", value: "Not Rated" },
  { label: "N/A", value: "N/A" },
];

const GENRE_OPTIONS = [
  { label: "Action", value: "Action" },
  { label: "Adventure", value: "Adventure" },
  { label: "Animation", value: "Animation" },
  { label: "Biography", value: "Biography" },
  { label: "Comedy", value: "Comedy" },
  { label: "Crime", value: "Crime" },
  { label: "Documentary", value: "Documentary" },
  { label: "Drama", value: "Drama" },
  { label: "Family", value: "Family" },
  { label: "Fantasy", value: "Fantasy" },
  { label: "History", value: "History" },
  { label: "Horror", value: "Horror" },
  { label: "Music", value: "Music" },
  { label: "Musical", value: "Musical" },
  { label: "Mystery", value: "Mystery" },
  { label: "Romance", value: "Romance" },
  { label: "Sci-Fi", value: "Sci-Fi" },
  { label: "Sport", value: "Sport" },
  { label: "Thriller", value: "Thriller" },
  { label: "War", value: "War" },
  { label: "Western", value: "Western" },
];

// Fixed name validation: prevents long random strings of numbers/gibberish while allowing actual names with dots, apostrophes, etc.
const nameValidation = {
  validator: (_, value) => {
    if (!value || value.trim() === "") {
      return Promise.resolve();
    }
    // Check if it's mostly numbers or random gibberish (e.g., long sequences of numbers mixed into names)
    if (/\d{4,}/.test(value)) {
      return Promise.reject(new Error("Names cannot contain long numeric sequences"));
    }
    const validPattern = /^[a-zA-Z\s.,'&\-/()"\u00C0-\u024F]+$/;
    if (!validPattern.test(value)) {
      return Promise.reject(new Error("Only letters, spaces, and standard punctuation (.,'/&-) are allowed"));
    }
    return Promise.resolve();
  },
};

// Title rule allowing proper movie titles with standard punctuation and numbers
const titleValidation = {
  validator: (_, value) => {
    if (!value || value.trim() === "") {
      return Promise.resolve();
    }
    // Disallow strings that look like random keyboard smashing / heavy number spam
    if (/^[a-zA-Z0-9]{15,}$/.test(value)) {
      return Promise.reject(new Error("Please enter a valid movie title"));
    }
    const validPattern = /^[a-zA-Z0-9\s.,'&\-/()"\u00C0-\u024F]+$/;
    if (!validPattern.test(value)) {
      return Promise.reject(new Error("Title contains invalid special characters"));
    }
    return Promise.resolve();
  },
};

function AddEditMovieModal({
  open,
  onCancel,
  onSubmit,
  movie,
  loading = false,
}) {
  const [form] = Form.useForm();
  const [posterUrl, setPosterUrl] = useState("");

  useEffect(() => {
    if (open) {
      if (movie) {
        form.setFieldsValue({
          title: movie.title || "",
          year: movie.year || "",
          rated: movie.rated || "N/A",
          runtime: movie.runtime || "N/A",
          language: movie.language || "English",
          director: movie.director || "N/A",
          writer: movie.writer || "N/A",
          actors: movie.actors || "",
          hero: movie.hero || "",
          heroine: movie.heroine || "",
          genre: movie.genre || "",
          poster: movie.poster || "",
          boxOffice: movie.boxOffice || "N/A",
          imdbRating: movie.imdbRating || "N/A",
          plot: movie.plot || "",
        });
        setPosterUrl(movie.poster || "");
      } else {
        form.resetFields();
        form.setFieldsValue({
          rated: "N/A",
          runtime: "N/A",
          language: "English",
          director: "N/A",
          writer: "N/A",
          boxOffice: "N/A",
          imdbRating: "N/A",
        });
        setPosterUrl("");
      }
    }
  }, [open, movie, form]);

  const handleBlur = (fieldName) => {
    const value = form.getFieldValue(fieldName);
    if (typeof value === "string") {
      const cleaned = value.trim().replace(/\s+/g, " ");
      form.setFieldValue(fieldName, cleaned);
      if (fieldName === "poster") {
        setPosterUrl(cleaned);
      }
    }
  };

  const handleFinish = (values) => {
    const trimmedValues = Object.entries(values).reduce((acc, [key, val]) => {
      acc[key] = typeof val === "string" ? val.trim().replace(/\s+/g, " ") : val;
      return acc;
    }, {});

    onSubmit({
      ...trimmedValues,
      _id: movie?._id,
      omdbId: movie?.omdbId,
    });
  };

  const handleCancel = () => {
    form.resetFields();
    setPosterUrl("");
    onCancel();
  };

  return (
    <Modal
      open={open}
      title={
        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "18px", fontWeight: 600 }}>
          <VideoCameraOutlined style={{ color: "#1890ff" }} />
          <span>{movie ? "Edit Movie Details" : "Add New Movie"}</span>
        </div>
      }
      okText={movie ? "Update Movie" : "Create Movie"}
      cancelText="Cancel"
      confirmLoading={loading}
      onCancel={handleCancel}
      onOk={() => form.submit()}
      destroyOnClose
      width={720}
      centered
      okButtonProps={{ style: { backgroundColor: "#1890ff", borderRadius: "6px" } }}
      cancelButtonProps={{ style: { borderRadius: "6px" } }}
    >
      <div style={{ marginBottom: "16px", color: "#666", fontSize: "13px" }}>
        {movie ? "Update the movie metadata below." : "Fill in the details below to add a new movie to the directory."}
      </div>

      <Form form={form} layout="vertical" onFinish={handleFinish} requiredMark="optional">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
          
          <Form.Item
            label={<span style={{ fontWeight: 500 }}>Title</span>}
            name="title"
            rules={[
              { required: true, message: "Please enter movie title" },
              titleValidation,
              { max: 100, message: "Maximum 100 characters allowed" },
            ]}
          >
            <Input 
              prefix={<VideoCameraOutlined style={{ color: "#bfbfbf" }} />} 
              placeholder="e.g. Avengers: Endgame" 
              onBlur={() => handleBlur("title")} 
              style={{ borderRadius: "6px" }}
            />
          </Form.Item>

          <Form.Item
            label={<span style={{ fontWeight: 500 }}>Release Year</span>}
            name="year"
            rules={[
              { required: true, message: "Please enter the release year" },
              {
                pattern: /^(18|19|20)\d{2}$/,
                message: "Please enter a valid 4-digit year (1800-2099)",
              },
            ]}
          >
            <Input 
              prefix={<CalendarOutlined style={{ color: "#bfbfbf" }} />} 
              placeholder="e.g. 2019" 
              maxLength={4} 
              onBlur={() => handleBlur("year")} 
              style={{ borderRadius: "6px" }}
            />
          </Form.Item>

          <Form.Item
            label={<span style={{ fontWeight: 500 }}>Director</span>}
            name="director"
            rules={[
              nameValidation,
              { max: 150, message: "Maximum 150 characters allowed" },
            ]}
          >
            <Input 
              prefix={<UserOutlined style={{ color: "#bfbfbf" }} />} 
              placeholder="e.g. Anthony Russo, Joe Russo" 
              onBlur={() => handleBlur("director")} 
              style={{ borderRadius: "6px" }}
            />
          </Form.Item>

          <Form.Item
            label={<span style={{ fontWeight: 500 }}>Runtime</span>}
            name="runtime"
            rules={[
              {
                pattern: /^(\d+\s*min|N\/A|\d+)$/i,
                message: "Format should be like '181 min' or 'N/A'",
              },
            ]}
          >
            <Input 
              prefix={<ClockCircleOutlined style={{ color: "#bfbfbf" }} />} 
              placeholder="e.g. 181 min" 
              onBlur={() => handleBlur("runtime")} 
              style={{ borderRadius: "6px" }}
            />
          </Form.Item>

          <Form.Item
            label={<span style={{ fontWeight: 500 }}>Language</span>}
            name="language"
            rules={[{ required: true, message: "Please select or enter a language" }]}
          >
            <Select
              allowClear
              showSearch
              options={DEFAULT_LANGUAGES}
              placeholder="Select or type Language"
              style={{ width: "100%" }}
              suffixIcon={<GlobalOutlined style={{ color: "#bfbfbf" }} />}
            />
          </Form.Item>

          <Form.Item
            label={<span style={{ fontWeight: 500 }}>Rated Classification</span>}
            name="rated"
            rules={[{ required: true, message: "Please select a rating classification" }]}
          >
            <Select
              allowClear
              showSearch
              placeholder="Select Rating Classification"
              options={RATED_OPTIONS}
              style={{ width: "100%" }}
              suffixIcon={<SafetyCertificateOutlined style={{ color: "#bfbfbf" }} />}
            />
          </Form.Item>

          <Form.Item
            label={<span style={{ fontWeight: 500 }}>Hero / Main Lead</span>}
            name="hero"
            rules={[
              nameValidation,
              { max: 100, message: "Maximum 100 characters allowed" },
            ]}
          >
            <Input 
              prefix={<UserOutlined style={{ color: "#bfbfbf" }} />} 
              placeholder="e.g. Robert Downey Jr." 
              onBlur={() => handleBlur("hero")} 
              style={{ borderRadius: "6px" }}
            />
          </Form.Item>

          <Form.Item
            label={<span style={{ fontWeight: 500 }}>Heroine</span>}
            name="heroine"
            rules={[
              nameValidation,
              { max: 100, message: "Maximum 100 characters allowed" },
            ]}
          >
            <Input 
              prefix={<UserOutlined style={{ color: "#bfbfbf" }} />} 
              placeholder="e.g. Scarlett Johansson" 
              onBlur={() => handleBlur("heroine")} 
              style={{ borderRadius: "6px" }}
            />
          </Form.Item>

          <Form.Item
            label={<span style={{ fontWeight: 500 }}>Cast / Actors</span>}
            name="actors"
            rules={[
              nameValidation,
              { max: 500, message: "Maximum 500 characters allowed" },
            ]}
          >
            <Input 
              prefix={<TeamOutlined style={{ color: "#bfbfbf" }} />} 
              placeholder="e.g. Chris Evans, Mark Ruffalo" 
              onBlur={() => handleBlur("actors")} 
              style={{ borderRadius: "6px" }}
            />
          </Form.Item>

          <Form.Item
            label={<span style={{ fontWeight: 500 }}>Genre</span>}
            name="genre"
            rules={[{ required: true, message: "Please select a genre" }]}
          >
            <Select
              allowClear
              showSearch
              placeholder="Select Primary Genre"
              options={GENRE_OPTIONS}
              style={{ width: "100%" }}
              suffixIcon={<AppstoreOutlined style={{ color: "#bfbfbf" }} />}
            />
          </Form.Item>

          <Form.Item
            label={<span style={{ fontWeight: 500 }}>Box Office</span>}
            name="boxOffice"
            rules={[
              {
                pattern: /^(\$[\d,]+|\d+|N\/A)$/i,
                message: "Format as currency (e.g. $2,797,800,564) or N/A",
              },
            ]}
          >
            <Input 
              prefix={<DollarOutlined style={{ color: "#bfbfbf" }} />} 
              placeholder="e.g. $2,797,800,564" 
              onBlur={() => handleBlur("boxOffice")} 
              style={{ borderRadius: "6px" }}
            />
          </Form.Item>

          <Form.Item
            label={<span style={{ fontWeight: 500 }}>IMDb Rating</span>}
            name="imdbRating"
            rules={[
              {
                pattern: /^([0-9](\.\d)?|10(\.0)?|N\/A)$/i,
                message: "Rating must be a score between 0.0 and 10.0 or N/A",
              },
            ]}
          >
            <Input 
              prefix={<StarOutlined style={{ color: "#faad14" }} />} 
              placeholder="e.g. 8.4" 
              maxLength={4} 
              onBlur={() => handleBlur("imdbRating")} 
              style={{ borderRadius: "6px" }}
            />
          </Form.Item>
        </div>

        <Form.Item
          label={<span style={{ fontWeight: 500 }}>Writer</span>}
          name="writer"
          rules={[
            nameValidation,
            { max: 300, message: "Maximum 300 characters allowed" },
          ]}
        >
          <Input 
            prefix={<FileTextOutlined style={{ color: "#bfbfbf" }} />} 
            placeholder="e.g. Christopher Markus, Stephen McFeely" 
            onBlur={() => handleBlur("writer")} 
            style={{ borderRadius: "6px" }}
          />
        </Form.Item>

        <Form.Item
          label={<span style={{ fontWeight: 500 }}>Poster URL</span>}
          name="poster"
          rules={[
            {
              type: "url",
              message: "Please enter a valid image URL starting with http:// or https://",
            },
          ]}
        >
          <Input 
            prefix={<PictureOutlined style={{ color: "#bfbfbf" }} />} 
            placeholder="e.g. https://m.media-amazon.com/images/M/...jpg" 
            onBlur={(e) => {
              handleBlur("poster");
              setPosterUrl(e.target.value);
            }} 
            style={{ borderRadius: "6px" }}
          />
        </Form.Item>

        {posterUrl && (
          <div style={{ 
            marginTop: "-8px", 
            marginBottom: "16px", 
            padding: "10px", 
            background: "#fafafa", 
            border: "1px dashed #d9d9d9", 
            borderRadius: "6px",
            display: "flex",
            alignItems: "center",
            gap: "12px"
          }}>
            <div style={{ fontSize: "12px", color: "#888", fontWeight: 500 }}>Poster Preview:</div>
            <img 
              src={posterUrl} 
              alt="Movie Poster Preview" 
              style={{ width: "40px", height: "60px", objectFit: "cover", borderRadius: "4px", border: "1px solid #eee" }}
              onError={(e) => { e.target.style.display = 'none'; }} 
            />
            <span style={{ fontSize: "11px", color: "#fa8c16" }}>Ensure link directs to a publicly accessible image format (.jpg, .png).</span>
          </div>
        )}

        <Form.Item
          label={<span style={{ fontWeight: 500 }}>Plot Summary</span>}
          name="plot"
          rules={[{ max: 1000, message: "Plot description cannot exceed 1000 characters" }]}
        >
          <Input.TextArea
            rows={3}
            placeholder="e.g. After the devastating events of Avengers: Infinity War..."
            onBlur={() => handleBlur("plot")}
            style={{ borderRadius: "6px" }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default AddEditMovieModal;