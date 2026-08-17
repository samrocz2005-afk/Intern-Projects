import { Drawer, Descriptions, Image } from "antd";

function MovieDrawer({ open, onClose, movie }) {
  if (!movie) return null;

  return (
    <Drawer
      title={movie.Title}
      open={open}
      onClose={onClose}
      width={500}
    >
      <Image
        src={movie.Poster}
        width={200}
      />

      <Descriptions column={1} bordered>
        <Descriptions.Item label="Title">
          {movie.Title}
        </Descriptions.Item>

        <Descriptions.Item label="Year">
          {movie.Year}
        </Descriptions.Item>

        <Descriptions.Item label="Actors">
          {movie.Actors}
        </Descriptions.Item>

        <Descriptions.Item label="Director">
          {movie.Director}
        </Descriptions.Item>

        <Descriptions.Item label="Genre">
          {movie.Genre}
        </Descriptions.Item>

        <Descriptions.Item label="Language">
          {movie.Language}
        </Descriptions.Item>

        <Descriptions.Item label="Runtime">
          {movie.Runtime}
        </Descriptions.Item>

        <Descriptions.Item label="Plot">
          {movie.Plot}
        </Descriptions.Item>
      </Descriptions>
    </Drawer>
  );
}

export default MovieDrawer;