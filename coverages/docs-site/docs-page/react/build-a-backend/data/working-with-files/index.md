[<- Back to index](../../../../../docs-pages.md)

#  Snippets

Page: https://docs.amplify.aws/react/build-a-backend/data/working-with-files/

Coverage: 0.0%

#### `amplify/data/resource.ts`

~~~
import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  Song: a
.model({
  id: a.id().required(),
  name: a.string().required(),
  coverArtPath: a.string(),
})
.authorization((allow) => [allow.publicApiKey()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
defaultAuthorizationMode: "apiKey",

apiKeyAuthorizationMode: {
  expiresInDays: 30,
},
  },
});

~~~

| | |
| -- | -- |
| Hash | `3bcf491dc036739b` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `amplify/storage/resource.ts`

~~~
import { defineStorage } from "@aws-amplify/backend";

export const storage = defineStorage({
  name: "amplify-gen2-files",
  access: (allow) => ({
"images/*": [allow.authenticated.to(["read", "write", "delete"])],
  }),
});

~~~

| | |
| -- | -- |
| Hash | `6679822de1d0953f` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `amplify/backend.ts`

~~~
import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data } from "./data/resource";
import { storage } from "./storage/resource";

export const backend = defineBackend({
  auth,
  data,
  storage,
});

~~~

| | |
| -- | -- |
| Hash | `1368a6d0f77630fd` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `src/App.tsx`

~~~
import { generateClient } from "aws-amplify/api";
import { uploadData, getUrl } from "aws-amplify/storage";
import type { Schema } from "../amplify/data/resource";

// Generating the client
const client = generateClient<Schema>({
  authMode: "apiKey",
});

// Create the API record:
const response = await client.models.Song.create({
  name: `My first song`,
});

const song = response.data;

if (!song) return;

// Upload the Storage file:
const result = await uploadData({
  path: `images/${song.id}-${file.name}`,
  data: file,
  options: {
contentType: "image/png", // contentType is optional
  },
}).result;

// Add the file association to the record:
const updateResponse = await client.models.Song.update({
  id: song.id,
  coverArtPath: result?.path,
});

const updatedSong = updateResponse.data;

setCurrentSong(updatedSong);

// If the record has no associated file, we can return early.
if (!updatedSong.coverArtPath) return;

// Retrieve the file's signed URL:
const signedURL = await getUrl({ path: updatedSong.coverArtPath });

~~~

| | |
| -- | -- |
| Hash | `029aeb50b55f5f09` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `src/App.tsx`

~~~
import { generateClient } from "aws-amplify/api";
import { uploadData, getUrl } from "aws-amplify/storage";
import type { Schema } from "../amplify/data/resource";

// Generating the client
const client = generateClient<Schema>({
  authMode: "apiKey",
});

// Upload the Storage file:
const result = await uploadData({
  path: `images/${currentSong.id}-${file.name}`,
  data: file,
  options: {
contentType: "image/png", // contentType is optional
  },
}).result;

// Add the file association to the record:
const response = await client.models.Song.update({
  id: currentSong.id,
  coverArtPath: result?.path,
});

const updatedSong = response.data;

setCurrentSong(updatedSong);

// If the record has no associated file, we can return early.
if (!updatedSong?.coverArtPath) return;

// Retrieve the file's signed URL:
const signedURL = await getUrl({ path: updatedSong.coverArtPath });

~~~

| | |
| -- | -- |
| Hash | `a5c47b142daa7dbd` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `src/App.tsx`

~~~
import { generateClient } from "aws-amplify/api";
import { getUrl } from "aws-amplify/storage";
import type { Schema } from "../amplify/data/resource";

// Generating the client
const client = generateClient<Schema>({
  authMode: "apiKey",
});

const response = await client.models.Song.get({
  id: currentSong.id,
});

const song = response.data;

// If the record has no associated file, we can return early.
if (!song?.coverArtPath) return;

// Retrieve the signed URL:
const signedURL = await getUrl({ path: song.coverArtPath });

~~~

| | |
| -- | -- |
| Hash | `2e56e96cc6a6b8fb` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `src/App.tsx`

~~~
import { generateClient } from "aws-amplify/api";
import type { Schema } from "../amplify/data/resource";

// Generating the client
const client = generateClient<Schema>({
  authMode: "apiKey",
});

const response = await client.models.Song.get({
  id: currentSong.id,
});

const song = response.data;

// If the record has no associated file, we can return early.
if (!song?.coverArtPath) return;

const updatedSong = await client.models.Song.update({
  id: song.id,
  coverArtPath: null,
});

~~~

| | |
| -- | -- |
| Hash | `a40d2f553ca941bf` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `src/App.tsx`

~~~
import { generateClient } from "aws-amplify/api";
import { remove } from "aws-amplify/storage";
import type { Schema } from "../amplify/data/resource";

// Generating the client
const client = generateClient<Schema>({
  authMode: "apiKey",
});
const response = await client.models.Song.get({
  id: currentSong.id,
});
const song = response?.data;

// If the record has no associated file, we can return early.
if (!song?.coverArtPath) return;

// Remove associated file from record
const updatedSong = await client.models.Song.update({
  id: song.id,
  coverArtPath: null,
});

// Delete the file from S3:
await remove({ path: song.coverArtPath });

~~~

| | |
| -- | -- |
| Hash | `94503f216a88c5dd` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `src/App.tsx`

~~~
import { generateClient } from "aws-amplify/api";
import { remove } from "aws-amplify/storage";
import type { Schema } from "../amplify/data/resource";

// Generating the client
const client = generateClient<Schema>({
  authMode: "apiKey",
});
const response = await client.models.Song.get({
  id: currentSong.id,
});

const song = response.data;

// If the record has no associated file, we can return early.
if (!song?.coverArtPath) return;

await remove({ path: song.coverArtPath });

// Delete the record from the API:
await client.models.Song.delete({ id: song.id });

~~~

| | |
| -- | -- |
| Hash | `41626ca14e050c9f` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `amplify/data/resource.ts`

~~~
const schema = a.schema({
  PhotoAlbum: a
.model({
  id: a.id().required(),
  name: a.string().required(),
  imagePaths: a.string().array(),
})
.authorization((allow) => [allow.publicApiKey()]),
});

~~~

| | |
| -- | -- |
| Hash | `f401c7fceb6e060e` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `src/App.tsx`

~~~
import { generateClient } from "aws-amplify/api";
import { uploadData, getUrl } from "aws-amplify/storage";
import type { Schema } from "../amplify/data/resource";

// Generating the client
const client = generateClient<Schema>({
  authMode: "apiKey",
});

// Create the API record:
const response = await client.models.PhotoAlbum.create({
  name: `My first photoAlbum`,
});

const photoAlbum = response.data.createPhotoAlbum;

if (!photoAlbum) return;

// Upload all files to Storage:
const imagePaths = await Promise.all(
  Array.from(e.target.files).map(async (file) => {
const result = await uploadData({
  path: `images/${photoAlbum.id}-${file.name}`,
  data: file,
  options: {
    contentType: "image/png", // contentType is optional
  },
}).result;

return result.path;
  }),
);

const updatePhotoAlbumDetails = {
  id: photoAlbum.id,
  imagePaths: imagePaths,
};

// Add the file association to the record:
const updateResponse = await client.graphql({
  query: mutations.updatePhotoAlbum,
  variables: { input: updatePhotoAlbumDetails },
});

const updatedPhotoAlbum = updateResponse.data.updatePhotoAlbum;

// If the record has no associated file, we can return early.
if (!updatedPhotoAlbum.imageKeys?.length) return;

// Retrieve signed urls for all files:
const signedUrls = await Promise.all(
  updatedPhotoAlbum?.imagePaths.map(
async (path) => await getUrl({ path: path! }),
  ),
);

~~~

| | |
| -- | -- |
| Hash | `0c37acb6ac67ddb6` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `src/App.tsx`

~~~
import { generateClient } from "aws-amplify/api";
import { uploadData, getUrl } from "aws-amplify/storage";
import type { Schema } from "../amplify/data/resource";

// Generating the client
const client = generateClient<Schema>({
  authMode: "apiKey",
});

// Upload all files to Storage:
const newimagePaths = await Promise.all(
  Array.from(e.target.files).map(async (file) => {
const result = await uploadData({
  path: `images/${currentPhotoAlbum.id}-${file.name}`,
  data: file,
  options: {
    contentType: "image/png", // contentType is optional
  },
}).result;

return result.path;
  }),
);

// Query existing record to retrieve currently associated files:
const queriedResponse = await client.models.PhotoAlbum.get({
  id: currentPhotoAlbum.id,
});

const photoAlbum = queriedResponse.data;

if (!photoAlbum?.imagePaths) return;

// Merge existing and new file paths:
const updatedimagePaths = [...newimagePaths, ...photoAlbum.imagePaths];

// Update record with merged file associations:
const response = await client.models.PhotoAlbum.update({
  id: currentPhotoAlbum.id,
  imagePaths: updatedimagePaths,
});

const updatedPhotoAlbum = response.data;

// If the record has no associated file, we can return early.
if (!updatedPhotoAlbum?.imageKeys) return;

// Retrieve signed urls for merged image paths:
const signedUrls = await Promise.all(
  updatedPhotoAlbum?.imagePaths.map(
async (path) => await getUrl({ path: path! }),
  ),
);

~~~

| | |
| -- | -- |
| Hash | `bf7c47146a1f7b61` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `src/App.tsx`

~~~
import { generateClient } from "aws-amplify/api";
import { uploadData, getUrl } from "aws-amplify/storage";
import type { Schema } from "../amplify/data/resource";

// Generating the client
const client = generateClient<Schema>({
  authMode: "apiKey",
});

// Upload new file to Storage:
const result = await uploadData({
  path: `images/${currentPhotoAlbum.id}-${file.name}`,
  data: file,
  options: {
contentType: "image/png", // contentType is optional
  },
}).result;

const newFilePath = result.path;

// Query existing record to retrieve currently associated files:
const queriedResponse = await client.models.PhotoAlbum.get({
  id: currentPhotoAlbum.id,
});

const photoAlbum = queriedResponse.data;

if (!photoAlbum?.imagePaths?.length) return;

// Retrieve last image path:
const [lastImagePath] = photoAlbum.imagePaths.slice(-1);

// Remove last file association by path
const updatedimagePaths = [
  ...photoAlbum.imagePaths.filter((path) => path !== lastImagePath),
  newFilePath,
];

// Update record with updated file associations:
const response = await client.models.PhotoAlbum.update({
  id: currentPhotoAlbum.id,
  imagePaths: updatedimagePaths,
});

const updatedPhotoAlbum = response.data;

// If the record has no associated file, we can return early.
if (!updatedPhotoAlbum?.imagePaths) return;

// Retrieve signed urls for merged image paths:
const signedUrls = await Promise.all(
  updatedPhotoAlbum?.imagePaths.map(
async (path) => await getUrl({ path: path! }),
  ),
);

~~~

| | |
| -- | -- |
| Hash | `af889ca92491fe0b` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `src/App.tsx`

~~~
async function getImagesForPhotoAlbum() {
  import { generateClient } from "aws-amplify/api";
  import { uploadData, getUrl } from "aws-amplify/storage";
  import type { Schema } from "../amplify/data/resource";

  // Generating the client
  const client = generateClient<Schema>({
authMode: "apiKey",
  });

  // Query the record to get the file paths:
  const response = await client.models.PhotoAlbum.get({
id: currentPhotoAlbum.id,
  });

  const photoAlbum = response.data;

  // If the record has no associated files, we can return early.
  if (!photoAlbum?.imagePaths) return;

  // Retrieve the signed URLs for the associated images:
  const signedUrls = await Promise.all(
photoAlbum.imagePaths.map(async (imagePath) => {
  if (!imagePath) return;
  return await getUrl({ path: imagePath });
}),
  );
}

~~~

| | |
| -- | -- |
| Hash | `4fdf4d5d37bed3a9` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `src/App.tsx`

~~~
import { generateClient } from "aws-amplify/api";
import type { Schema } from "../amplify/data/resource";

// Generating the client
const client = generateClient<Schema>({
  authMode: "apiKey",
});

const response = await client.models.PhotoAlbum.get({
  id: currentPhotoAlbum.id,
});

const photoAlbum = response.data;

// If the record has no associated file, we can return early.
if (!photoAlbum?.imagePaths) return;

const updatedPhotoAlbum = await client.models.PhotoAlbum.update({
  id: photoAlbum.id,
  imagePaths: null,
});

~~~

| | |
| -- | -- |
| Hash | `fe8b7733d3c4a338` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `src/App.tsx`

~~~
import { generateClient } from "aws-amplify/api";
import { remove } from "aws-amplify/storage";
import type { Schema } from "../amplify/data/resource";

// Generating the client
const client = generateClient<Schema>({
  authMode: "apiKey",
});

const response = await client.models.PhotoAlbum.get({
  id: currentPhotoAlbum.id,
});

const photoAlbum = response.data;

// If the record has no associated files, we can return early.
if (!photoAlbum?.imagePaths) return;

// Remove associated files from record
const updateResponse = await client.models.PhotoAlbum.update({
  id: photoAlbum.id,
  imagePaths: null, // Set the file association to `null`
});

const updatedPhotoAlbum = updateResponse.data;

// Delete the files from S3:
await Promise.all(
  photoAlbum?.imagePaths.map(async (imagePath) => {
if (!imagePath) return;
await remove({ path: imagePath });
  }),
);

~~~

| | |
| -- | -- |
| Hash | `815d4373de20c7b5` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `src/App.tsx`

~~~
import { generateClient } from "aws-amplify/api";
import { remove } from "aws-amplify/storage";
import type { Schema } from "../amplify/data/resource";

// Generating the client
const client = generateClient<Schema>({
  authMode: "apiKey",
});

const response = await client.models.PhotoAlbum.get({
  id: currentPhotoAlbum.id,
});

const photoAlbum = response.data;

if (!photoAlbum) return;

await client.models.PhotoAlbum.delete({
  id: photoAlbum.id,
});

setCurrentPhotoAlbum(null);

// If the record has no associated file, we can return early.
if (!photoAlbum?.imagePaths) return;

await Promise.all(
  photoAlbum?.imagePaths.map(async (imagePath) => {
if (!imagePath) return;
await remove({ path: imagePath });
  }),
);

~~~

| | |
| -- | -- |
| Hash | `2fccce5d41438e41` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `src/App.tsx`

~~~
import "./App.css";
import { generateClient } from "aws-amplify/api";
import { uploadData, getUrl, remove } from "aws-amplify/storage";
import React, { useState } from "react";
import type { Schema } from "../amplify/data/resource";
import "@aws-amplify/ui-react/styles.css";
import {
  type WithAuthenticatorProps,
  withAuthenticator,
} from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";

Amplify.configure(outputs);

// Generating the client
const client = generateClient<Schema>({
  authMode: "apiKey",
});

type Song = Schema["Song"]["type"];

function App({ signOut, user }: WithAuthenticatorProps) {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);

  // Used to display image for current song:
  const [currentImageUrl, setCurrentImageUrl] = useState<
string | null | undefined
  >("");

  async function createSongWithImage(e: React.ChangeEvent<HTMLInputElement>) {
if (!e.target.files) return;
const file = e.target.files[0];
try {
  // Create the API record:
  const response = await client.models.Song.create({
    name: `My first song`,
  });

  const song = response.data;

  if (!song) return;

  // Upload the Storage file:
  const result = await uploadData({
    path: `images/${song.id}-${file.name}`,
    data: file,
    options: {
contentType: "image/png", // contentType is optional
    },
  }).result;

  // Add the file association to the record:
  const updateResponse = await client.models.Song.update({
    id: song.id,
    coverArtPath: result?.path,
  });

  const updatedSong = updateResponse.data;
  setCurrentSong(updatedSong);

  // If the record has no associated file, we can return early.
  if (!updatedSong?.coverArtPath) return;

  // Retrieve the file's signed URL:
  const signedURL = await getUrl({ path: updatedSong.coverArtPath });

  setCurrentImageUrl(signedURL.url.toString());
} catch (error) {
  console.error("Error create song / file:", error);
}
  }

  // Upload image, add to song, retrieve signed URL and retrieve the image.
  // Also updates image if one already exists.
  async function addNewImageToSong(e: React.ChangeEvent<HTMLInputElement>) {
if (!currentSong) return;

if (!e.target.files) return;

const file = e.target.files[0];

try {
  // Upload the Storage file:
  const result = await uploadData({
    path: `images/${currentSong.id}-${file.name}`,
    data: file,
    options: {
contentType: "image/png", // contentType is optional
    },
  }).result;

  // Add the file association to the record:
  const response = await client.models.Song.update({
    id: currentSong.id,
    coverArtPath: result?.path,
  });

  const updatedSong = response.data;

  setCurrentSong(updatedSong);

  // If the record has no associated file, we can return early.
  if (!updatedSong?.coverArtPath) return;

  // Retrieve the file's signed URL:
  const signedURL = await getUrl({ path: updatedSong.coverArtPath });
  setCurrentImageUrl(signedURL.url.toString());
} catch (error) {
  console.error("Error uploading image / adding image to song: ", error);
}
  }

  async function getImageForCurrentSong() {
if (!currentSong) return;

try {
  // Query the record to get the file path:
  const response = await client.models.Song.get({
    id: currentSong.id,
  });

  const song = response.data;

  // If the record has no associated file, we can return early.
  if (!song?.coverArtPath) return;

  // Retrieve the signed URL:
  const signedURL = await getUrl({ path: song.coverArtPath });
  setCurrentImageUrl(signedURL.url.toString());
} catch (error) {
  console.error("Error getting song / image:", error);
}
  }

  // Remove the file association, continue to persist both file and record
  async function removeImageFromSong() {
if (!currentSong) return;

try {
  const response = await client.models.Song.get({
    id: currentSong.id,
  });

  const song = response.data;

  // If the record has no associated file, we can return early.
  if (!song?.coverArtPath) return;

  const updatedSong = await client.models.Song.update({
    id: song.id,
    coverArtPath: null,
  });

  // If successful, the response here will be `null`:
  setCurrentSong(updatedSong.data);

  setCurrentImageUrl(updatedSong.data?.coverArtPath);
} catch (error) {
  console.error("Error removing image from song: ", error);
}
  }

  // Remove the record association and delete the file
  async function deleteImageForCurrentSong() {
if (!currentSong) return;

try {
  const response = await client.models.Song.get({
    id: currentSong.id,
  });

  const song = response?.data;

  // If the record has no associated file, we can return early.
  if (!song?.coverArtPath) return;

  // Remove associated file from record
  const updatedSong = await client.models.Song.update({
    id: song.id,
    coverArtPath: null,
  });

  // Delete the file from S3:
  await remove({ path: song.coverArtPath });

  // If successful, the response here will be `null`:
  setCurrentSong(updatedSong.data);

  setCurrentImageUrl(updatedSong.data?.coverArtPath);
} catch (error) {
  console.error("Error deleting image: ", error);
}
  }

  // Delete both file and record
  async function deleteCurrentSongAndImage() {
if (!currentSong) return;
try {
  const response = await client.models.Song.get({
    id: currentSong.id,
  });
  const song = response.data;

  // If the record has no associated file, we can return early.
  if (!song?.coverArtPath) return;

  await remove({ path: song.coverArtPath });

  // Delete the record from the API:
  await client.models.Song.delete({ id: song.id });

  clearLocalState();
} catch (error) {
  console.error("Error deleting song: ", error);
}
  }

  function clearLocalState() {
setCurrentSong(null);
setCurrentImageUrl("");
  }

  return (
<>
  <h1>Hello {user?.username}</h1>
  <button onClick={signOut}>Sign out</button>
  <div>
    <label>
<h2>{`Current Song: ${currentSong?.id}`}</h2>
Create song with file:
<input id="name" type="file" onChange={createSongWithImage} />
    </label>
    <label>
Add / update song image:
<input
  id="name"
  type="file"
  onChange={addNewImageToSong}
  disabled={!currentSong}
/>
    </label>
    <button
onClick={getImageForCurrentSong}
disabled={!currentSong || !currentImageUrl}
    >
Get image for current song
    </button>
    <button
onClick={removeImageFromSong}
disabled={!currentSong || !currentImageUrl}
    >
Remove image from current song (does not delete image)
    </button>
    <button
onClick={deleteImageForCurrentSong}
disabled={!currentSong || !currentImageUrl}
    >
Remove image from current song, then delete image
    </button>
    <button onClick={deleteCurrentSongAndImage} disabled={!currentSong}>
Delete current song (and image, if it exists)
    </button>
    <button onClick={signOut} className="app-button">
Sign out
    </button>
  </div>
</>
  );
}

export default withAuthenticator(App);

~~~

| | |
| -- | -- |
| Hash | `5d3534d04eccf558` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `src/App.tsx`

~~~
import "./App.css";
import { generateClient } from "aws-amplify/api";
import { uploadData, getUrl, remove } from "aws-amplify/storage";
import React, { useState } from "react";
import type { Schema } from "../amplify/data/resource";
import "@aws-amplify/ui-react/styles.css";
import {
  type WithAuthenticatorProps,
  withAuthenticator,
} from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";

Amplify.configure(outputs);

// Generating the client
const client = generateClient<Schema>({
  authMode: "apiKey",
});

type PhotoAlbum = Schema["PhotoAlbum"]["type"];

function App({ signOut, user }: WithAuthenticatorProps) {
  // State to hold the recognized text
  const [currentPhotoAlbum, setCurrentPhotoAlbum] = useState<PhotoAlbum | null>(
null,
  );

  // Used to display images for current photoAlbum:
  const [currentImages, setCurrentImages] = useState<
(string | null | undefined)[] | null | undefined
  >([]);

  async function createPhotoAlbumWithFirstImage(
e: React.ChangeEvent<HTMLInputElement>,
  ) {
if (!e.target.files) return;

const file = e.target.files[0];

try {
  // Create the API record:
  const response = await client.models.PhotoAlbum.create({
    name: `My first photoAlbum`,
  });

  const photoAlbum = response.data;

  if (!photoAlbum) return;

  // Upload the Storage file:
  const result = await uploadData({
    path: `images/${photoAlbum.id}-${file.name}`,
    data: file,
    options: {
contentType: "image/png", // contentType is optional
    },
  }).result;

  const updatePhotoAlbumDetails = {
    id: photoAlbum.id,
    imagePaths: [result.path],
  };

  // Add the file association to the record:
  const updateResponse = await client.models.PhotoAlbum.update({
    id: photoAlbum.id,
    imagePaths: [result.path],
  });

  const updatedPhotoAlbum = updateResponse.data;

  setCurrentPhotoAlbum(updatedPhotoAlbum);

  // If the record has no associated file, we can return early.
  if (!updatedPhotoAlbum?.imagePaths?.length) return;

  // Retrieve the file's signed URL:
  const signedURL = await getUrl({
    path: updatedPhotoAlbum.imagePaths[0]!,
  });
  setCurrentImages([signedURL.url.toString()]);
} catch (error) {
  console.error("Error create photoAlbum / file:", error);
}
  }

  async function createPhotoAlbumWithMultipleImages(
e: React.ChangeEvent<HTMLInputElement>,
  ) {
if (!e.target.files) return;

try {
  const photoAlbumDetails = {
    name: `My first photoAlbum`,
  };

  // Create the API record:
  const response = await client.models.PhotoAlbum.create({
    name: `My first photoAlbum`,
  });

  const photoAlbum = response.data;

  if (!photoAlbum) return;

  // Upload all files to Storage:
  const imagePaths = await Promise.all(
    Array.from(e.target.files).map(async (file) => {
const result = await uploadData({
  path: `images/${photoAlbum.id}-${file.name}`,
  data: file,
  options: {
    contentType: "image/png", // contentType is optional
  },
}).result;

return result.path;
    }),
  );

  // Add the file association to the record:
  const updateResponse = await client.models.PhotoAlbum.update({
    id: photoAlbum.id,
    imagePaths: imagePaths,
  });
  const updatedPhotoAlbum = updateResponse.data;

  setCurrentPhotoAlbum(updatedPhotoAlbum);

  // If the record has no associated file, we can return early.
  if (!updatedPhotoAlbum?.imagePaths?.length) return;

  // Retrieve signed urls for all files:
  const signedUrls = await Promise.all(
    updatedPhotoAlbum.imagePaths.map(
async (path) => await getUrl({ path: path! }),
    ),
  );

  if (!signedUrls) return;
  setCurrentImages(signedUrls.map((signedUrl) => signedUrl.url.toString()));
} catch (error) {
  console.error("Error create photoAlbum / file:", error);
}
  }

  async function addNewImagesToPhotoAlbum(
e: React.ChangeEvent<HTMLInputElement>,
  ) {
if (!currentPhotoAlbum) return;

if (!e.target.files) return;

try {
  // Upload all files to Storage:
  const newimagePaths = await Promise.all(
    Array.from(e.target.files).map(async (file) => {
const result = await uploadData({
  path: `images/${currentPhotoAlbum.id}-${file.name}`,
  data: file,
  options: {
    contentType: "image/png", // contentType is optional
  },
}).result;

return result.path;
    }),
  );

  // Query existing record to retrieve currently associated files:
  const queriedResponse = await client.models.PhotoAlbum.get({
    id: currentPhotoAlbum.id,
  });

  const photoAlbum = queriedResponse.data;

  if (!photoAlbum?.imagePaths) return;

  // Merge existing and new file paths:
  const updatedimagePaths = [...newimagePaths, ...photoAlbum.imagePaths];

  // Update record with merged file associations:
  const response = await client.models.PhotoAlbum.update({
    id: currentPhotoAlbum.id,
    imagePaths: updatedimagePaths,
  });

  const updatedPhotoAlbum = response.data;
  setCurrentPhotoAlbum(updatedPhotoAlbum);

  // If the record has no associated file, we can return early.
  if (!updatedPhotoAlbum?.imagePaths) return;

  // Retrieve signed urls for merged image paths:
  const signedUrls = await Promise.all(
    updatedPhotoAlbum?.imagePaths.map(
async (path) => await getUrl({ path: path! }),
    ),
  );

  if (!signedUrls) return;

  setCurrentImages(signedUrls.map((signedUrl) => signedUrl.url.toString()));
} catch (error) {
  console.error(
    "Error uploading image / adding image to photoAlbum: ",
    error,
  );
}
  }

  // Replace last image associated with current photoAlbum:
  async function updateLastImage(e: React.ChangeEvent<HTMLInputElement>) {
if (!currentPhotoAlbum) return;

if (!e.target.files) return;

const file = e.target.files[0];

try {
  // Upload new file to Storage:
  const result = await uploadData({
    path: `images/${currentPhotoAlbum.id}-${file.name}`,
    data: file,
    options: {
contentType: "image/png", // contentType is optional
    },
  }).result;

  const newFilePath = result.path;

  // Query existing record to retrieve currently associated files:
  const queriedResponse = await client.models.PhotoAlbum.get({
    id: currentPhotoAlbum.id,
  });

  const photoAlbum = queriedResponse.data;

  if (!photoAlbum?.imagePaths?.length) return;

  // Retrieve last image path:
  const [lastImagePath] = photoAlbum.imagePaths.slice(-1);

  // Remove last file association by path
  const updatedimagePaths = [
    ...photoAlbum.imagePaths.filter((path) => path !== lastImagePath),
    newFilePath,
  ];

  // Update record with updated file associations:
  const response = await client.models.PhotoAlbum.update({
    id: currentPhotoAlbum.id,
    imagePaths: updatedimagePaths,
  });

  const updatedPhotoAlbum = response.data;

  setCurrentPhotoAlbum(updatedPhotoAlbum);

  // If the record has no associated file, we can return early.
  if (!updatedPhotoAlbum?.imagePaths) return;

  // Retrieve signed urls for merged image paths:
  const signedUrls = await Promise.all(
    updatedPhotoAlbum?.imagePaths.map(
async (path) => await getUrl({ path: path! }),
    ),
  );

  if (!signedUrls) return;

  setCurrentImages(signedUrls.map((signedUrl) => signedUrl.url.toString()));
} catch (error) {
  console.error(
    "Error uploading image / adding image to photoAlbum: ",
    error,
  );
}
  }

  async function getImagesForPhotoAlbum() {
if (!currentPhotoAlbum) {
  return;
}
try {
  // Query the record to get the file paths:
  const response = await client.models.PhotoAlbum.get({
    id: currentPhotoAlbum.id,
  });
  const photoAlbum = response.data;

  // If the record has no associated files, we can return early.
  if (!photoAlbum?.imagePaths) return;

  // Retrieve the signed URLs for the associated images:
  const signedUrls = await Promise.all(
    photoAlbum.imagePaths.map(async (imagePath) => {
if (!imagePath) return;
return await getUrl({ path: imagePath });
    }),
  );

  setCurrentImages(
    signedUrls.map((signedUrl) => signedUrl?.url.toString()),
  );
} catch (error) {
  console.error("Error getting photoAlbum / image:", error);
}
  }

  // Remove the file associations, continue to persist both files and record
  async function removeImagesFromPhotoAlbum() {
if (!currentPhotoAlbum) return;

try {
  const response = await client.models.PhotoAlbum.get({
    id: currentPhotoAlbum.id,
  });

  const photoAlbum = response.data;

  // If the record has no associated file, we can return early.
  if (!photoAlbum?.imagePaths) return;

  const updatedPhotoAlbum = await client.models.PhotoAlbum.update({
    id: photoAlbum.id,
    imagePaths: null,
  });

  // If successful, the response here will be `null`:
  setCurrentPhotoAlbum(updatedPhotoAlbum.data);
  setCurrentImages(updatedPhotoAlbum.data?.imagePaths);
} catch (error) {
  console.error("Error removing image from photoAlbum: ", error);
}
  }

  // Remove the record association and delete the file
  async function deleteImagesForCurrentPhotoAlbum() {
if (!currentPhotoAlbum) return;

try {
  const response = await client.models.PhotoAlbum.get({
    id: currentPhotoAlbum.id,
  });

  const photoAlbum = response.data;

  // If the record has no associated files, we can return early.
  if (!photoAlbum?.imagePaths) return;

  // Remove associated files from record
  const updateResponse = await client.models.PhotoAlbum.update({
    id: photoAlbum.id,
    imagePaths: null, // Set the file association to `null`
  });

  const updatedPhotoAlbum = updateResponse.data;

  // Delete the files from S3:
  await Promise.all(
    photoAlbum?.imagePaths.map(async (imagePath) => {
if (!imagePath) return;
await remove({ path: imagePath });
    }),
  );

  // If successful, the response here will be `null`:
  setCurrentPhotoAlbum(updatedPhotoAlbum);
  setCurrentImages(null);
} catch (error) {
  console.error("Error deleting image: ", error);
}
  }

  // Delete both files and record
  async function deleteCurrentPhotoAlbumAndImages() {
if (!currentPhotoAlbum) return;

try {
  const response = await client.models.PhotoAlbum.get({
    id: currentPhotoAlbum.id,
  });

  const photoAlbum = response.data;

  if (!photoAlbum) return;

  await client.models.PhotoAlbum.delete({
    id: photoAlbum.id,
  });

  setCurrentPhotoAlbum(null);

  // If the record has no associated file, we can return early.
  if (!photoAlbum?.imagePaths) return;

  await Promise.all(
    photoAlbum?.imagePaths.map(async (imagePath) => {
if (!imagePath) return;
await remove({ path: imagePath });
    }),
  );

  clearLocalState();
} catch (error) {
  console.error("Error deleting photoAlbum: ", error);
}
  }

  function clearLocalState() {
setCurrentPhotoAlbum(null);
setCurrentImages([]);
  }

  return (
<main className="app-container">
  <h1 className="greeting">Hello {user?.username}!</h1>
  <h2 className="current-album">
    Current PhotoAlbum: {currentPhotoAlbum?.id}
  </h2>

  <div className="file-input-container">
    <label className="file-input-label">
Create photoAlbum with one file:
<input
  type="file"
  accept="image/*"
  onChange={createPhotoAlbumWithFirstImage}
  className="file-input"
/>
    </label>

    <label className="file-input-label">
Create photoAlbum with multiple files:
<input
  type="file"
  accept="image/*"
  onChange={createPhotoAlbumWithMultipleImages}
  multiple
  className="file-input"
/>
    </label>

    <label className="file-input-label">
Add multiple images to current photoAlbum:
<input
  type="file"
  accept="image/*"
  onChange={addNewImagesToPhotoAlbum}
  disabled={!currentPhotoAlbum}
  multiple
  className="file-input"
/>
    </label>

    <label className="file-input-label">
Replace last image:
<input
  type="file"
  accept="image/*"
  onChange={updateLastImage}
  disabled={!currentPhotoAlbum || !currentImages}
  className="file-input"
/>
    </label>
  </div>

  <div className="button-container">
    <button
onClick={getImagesForPhotoAlbum}
disabled={!currentPhotoAlbum || !currentImages}
className="app-button"
    >
Get Images for Current Photo Album
    </button>
    <button
onClick={removeImagesFromPhotoAlbum}
disabled={!currentPhotoAlbum || !currentImages}
className="app-button"
    >
Remove images from current PhotoAlbum (does not delete images)
    </button>
    <button
onClick={deleteImagesForCurrentPhotoAlbum}
disabled={!currentPhotoAlbum || !currentImages}
className="app-button"
    >
Remove images from current PhotoAlbum, then delete images
    </button>
    <button
onClick={deleteCurrentPhotoAlbumAndImages}
disabled={!currentPhotoAlbum}
className="app-button"
    >
Delete current PhotoAlbum (and images, if they exist)
    </button>
    <button onClick={signOut} className="app-button">
Sign out
    </button>
  </div>

  <div className="image-container">
    {currentImages &&
currentImages.map((url, idx) => {
  if (!url) return undefined;
  return (
    <img src={url} key={idx} alt="Storage file" className="image" />
  );
})}
  </div>
</main>
  );
}

export default withAuthenticator(App);

~~~

| | |
| -- | -- |
| Hash | `2aa2fbfd92b49cdf` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

[<- Back to index](../../../../../docs-pages.md)
