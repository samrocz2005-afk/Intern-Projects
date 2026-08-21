const mongoose = require("mongoose");
const { GridFSBucket, ObjectId } = require("mongodb");

/*
|--------------------------------------------------------------------------
| GridFS Bucket
|--------------------------------------------------------------------------
*/

let gridFSBucket = null;

/*
|--------------------------------------------------------------------------
| Initialize GridFS
|--------------------------------------------------------------------------
*/

const initializeGridFS = () => {
  if (gridFSBucket) {
    return gridFSBucket;
  }

  if (
    mongoose.connection.readyState !== 1 ||
    !mongoose.connection.db
  ) {
    throw new Error(
      "MongoDB connection is not ready"
    );
  }

  gridFSBucket = new GridFSBucket(
    mongoose.connection.db,
    {
      bucketName: "profileImages",
    }
  );

  console.log(
    "MongoDB GridFS initialized: profileImages"
  );

  return gridFSBucket;
};

/*
|--------------------------------------------------------------------------
| Get GridFS Bucket
|--------------------------------------------------------------------------
*/

const getGridFSBucket = () => {
  if (!gridFSBucket) {
    return initializeGridFS();
  }

  return gridFSBucket;
};

/*
|--------------------------------------------------------------------------
| Upload Buffer to GridFS
|--------------------------------------------------------------------------
*/

const uploadToGridFS = (
  buffer,
  filename,
  contentType,
  metadata = {}
) => {
  return new Promise((resolve, reject) => {
    try {
      const bucket = getGridFSBucket();

      const uploadStream =
        bucket.openUploadStream(
          filename,
          {
            contentType,
            metadata,
          }
        );

      uploadStream.on(
        "error",
        (error) => {
          console.error(
            "GridFS upload error:",
            error
          );

          reject(error);
        }
      );

      uploadStream.on(
        "finish",
        () => {
          console.log(
            "GridFS upload completed:",
            uploadStream.id.toString()
          );

          resolve(uploadStream.id);
        }
      );

      uploadStream.end(buffer);
    } catch (error) {
      reject(error);
    }
  });
};

/*
|--------------------------------------------------------------------------
| Delete File from GridFS
|--------------------------------------------------------------------------
*/

const deleteFromGridFS = async (
  fileId
) => {
  if (!fileId) {
    return;
  }

  if (!ObjectId.isValid(fileId)) {
    const error = new Error(
      "Invalid GridFS file ID"
    );

    error.statusCode = 400;

    throw error;
  }

  const bucket = getGridFSBucket();

  const objectId =
    fileId instanceof ObjectId
      ? fileId
      : new ObjectId(fileId);

  try {
    await bucket.delete(objectId);

    console.log(
      "GridFS file deleted:",
      objectId.toString()
    );
  } catch (error) {
    /*
     * If the old file doesn't exist,
     * don't crash the profile update.
     */

    if (
      error.message?.includes(
        "File not found"
      )
    ) {
      console.warn(
        "GridFS file already missing:",
        objectId.toString()
      );

      return;
    }

    console.error(
      "GridFS delete error:",
      error
    );

    throw error;
  }
};

/*
|--------------------------------------------------------------------------
| Get GridFS File
|--------------------------------------------------------------------------
*/

const getGridFSFile = async (
  fileId
) => {
  if (!ObjectId.isValid(fileId)) {
    const error = new Error(
      "Invalid GridFS file ID"
    );

    error.statusCode = 400;

    throw error;
  }

  const bucket = getGridFSBucket();

  const objectId =
    fileId instanceof ObjectId
      ? fileId
      : new ObjectId(fileId);

  const files = await bucket
    .find({
      _id: objectId,
    })
    .toArray();

  if (
    !files ||
    files.length === 0
  ) {
    const error = new Error(
      "GridFS file not found"
    );

    error.statusCode = 404;

    throw error;
  }

  return files[0];
};

/*
|--------------------------------------------------------------------------
| Stream File from GridFS
|--------------------------------------------------------------------------
*/

const streamFileFromGridFS = async (
  fileId,
  res
) => {
  if (!ObjectId.isValid(fileId)) {
    const error = new Error(
      "Invalid GridFS file ID"
    );

    error.statusCode = 400;

    throw error;
  }

  const file =
    await getGridFSFile(fileId);

  const bucket =
    getGridFSBucket();

  const objectId =
    new ObjectId(fileId);

  /*
  |--------------------------------------------------------------------------
  | Headers
  |--------------------------------------------------------------------------
  */

  res.set(
    "Content-Type",
    file.contentType ||
      "application/octet-stream"
  );

  res.set(
    "Content-Length",
    String(file.length)
  );

  res.set(
    "Cache-Control",
    "public, max-age=31536000, immutable"
  );

  /*
  |--------------------------------------------------------------------------
  | Stream
  |--------------------------------------------------------------------------
  */

  const downloadStream =
    bucket.openDownloadStream(
      objectId
    );

  return new Promise(
    (resolve, reject) => {
      downloadStream.on(
        "error",
        (error) => {
          console.error(
            "GridFS download error:",
            error
          );

          if (!res.headersSent) {
            reject(error);
          }
        }
      );

      downloadStream.on(
        "end",
        () => {
          resolve();
        }
      );

      downloadStream.pipe(res);
    }
  );
};

/*
|--------------------------------------------------------------------------
| Initialize After MongoDB Connection
|--------------------------------------------------------------------------
*/

if (
  mongoose.connection.readyState === 1
) {
  initializeGridFS();
} else {
  mongoose.connection.once(
    "connected",
    () => {
      try {
        initializeGridFS();
      } catch (error) {
        console.error(
          "GridFS initialization failed:",
          error
        );
      }
    }
  );
}

/*
|--------------------------------------------------------------------------
| Export
|--------------------------------------------------------------------------
*/

module.exports = {
  initializeGridFS,
  getGridFSBucket,
  uploadToGridFS,
  deleteFromGridFS,
  getGridFSFile,
  streamFileFromGridFS,
};