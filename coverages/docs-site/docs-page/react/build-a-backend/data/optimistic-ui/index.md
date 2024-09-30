[<- Back to index](../../../../../docs-pages.md)

#  Snippets

Page: https://docs.amplify.aws/react/build-a-backend/data/optimistic-ui/

Coverage: 0.0%

#### `Terminal`

~~~
# Install TanStack Query
npm i @tanstack/react-query @tanstack/react-query-devtools

~~~

| | |
| -- | -- |
| Hash | `4e3da2e6f7092d2c` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `amplify/data/resource.ts`

~~~
const schema = a.schema({
  RealEstateProperty: a
.model({
  name: a.string().required(),
  address: a.string(),
})
.authorization((allow) => [allow.guest()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
defaultAuthorizationMode: "iam",
  },
});

~~~

| | |
| -- | -- |
| Hash | `dbb4c22d4f36c962` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `src/main.tsx`

~~~
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

Amplify.configure(outputs);

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
<QueryClientProvider client={queryClient}>
  <App />
  <ReactQueryDevtools initialIsOpen={false} />
</QueryClientProvider>
  </React.StrictMode>,
);

~~~

| | |
| -- | -- |
| Hash | `bd73d70c34cc832c` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `src/App.tsx`

~~~
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { useQuery } from "@tanstack/react-query";

const client = generateClient<Schema>();

function App() {
  const {
data: realEstateProperties,
isLoading,
isSuccess,
isError: isErrorQuery,
  } = useQuery({
queryKey: ["realEstateProperties"],
queryFn: async () => {
  const response = await client.models.RealEstateProperty.list();

  const allRealEstateProperties = response.data;

  if (!allRealEstateProperties) return null;

  return allRealEstateProperties;
},
  });
  // return ...
}

~~~

| | |
| -- | -- |
| Hash | `0d73bcd54827e0ec` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `Unnamed Snippet`

~~~
import { generateClient } from "aws-amplify/api";
import type { Schema } from "../amplify/data/resource";
import { useQueryClient, useMutation } from "@tanstack/react-query";

const client = generateClient<Schema>();

function App() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
mutationFn: async (input: { name: string; address: string }) => {
  const { data: newRealEstateProperty } =
    await client.models.RealEstateProperty.create(input);
  return newRealEstateProperty;
},
// When mutate is called:
onMutate: async (newRealEstateProperty) => {
  // Cancel any outgoing refetches
  // (so they don't overwrite our optimistic update)
  await queryClient.cancelQueries({ queryKey: ["realEstateProperties"] });

  // Snapshot the previous value
  const previousRealEstateProperties = queryClient.getQueryData([
    "realEstateProperties",
  ]);

  // Optimistically update to the new value
  if (previousRealEstateProperties) {
    queryClient.setQueryData(
["realEstateProperties"],
(old: Schema["RealEstateProperty"]["type"][]) => [
  ...old,
  newRealEstateProperty,
],
    );
  }

  // Return a context object with the snapshotted value
  return { previousRealEstateProperties };
},
// If the mutation fails,
// use the context returned from onMutate to rollback
onError: (err, newRealEstateProperty, context) => {
  console.error("Error saving record:", err, newRealEstateProperty);
  if (context?.previousRealEstateProperties) {
    queryClient.setQueryData(
["realEstateProperties"],
context.previousRealEstateProperties,
    );
  }
},
// Always refetch after error or success:
onSettled: () => {
  queryClient.invalidateQueries({ queryKey: ["realEstateProperties"] });
},
  });
  // return ...
}

~~~

| | |
| -- | -- |
| Hash | `ec4b53720e5434bb` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `Unnamed Snippet`

~~~
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../amplify/data/resource";
import { useQuery } from "@tanstack/react-query";

const client = generateClient<Schema>();

function App() {
  const currentRealEstatePropertyId = "SOME_ID";
  const {
data: realEstateProperty,
isLoading,
isSuccess,
isError: isErrorQuery,
  } = useQuery({
queryKey: ["realEstateProperties", currentRealEstatePropertyId],
queryFn: async () => {
  if (!currentRealEstatePropertyId) {
    return;
  }

  const { data: property } = await client.models.RealEstateProperty.get({
    id: currentRealEstatePropertyId,
  });
  return property;
},
  });
}

~~~

| | |
| -- | -- |
| Hash | `8bb7e8634af3b304` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `src/App.tsx`

~~~
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../amplify/data/resource";
import { useQueryClient, useMutation } from "@tanstack/react-query";

const client = generateClient<Schema>();

function App() {
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
mutationFn: async (realEstatePropertyDetails: {
  id: string;
  name?: string;
  address?: string;
}) => {
  const { data: updatedProperty } =
    await client.models.RealEstateProperty.update(
realEstatePropertyDetails,
    );

  return updatedProperty;
},
// When mutate is called:
onMutate: async (newRealEstateProperty: {
  id: string;
  name?: string;
  address?: string;
}) => {
  // Cancel any outgoing refetches
  // (so they don't overwrite our optimistic update)
  await queryClient.cancelQueries({
    queryKey: ["realEstateProperties", newRealEstateProperty.id],
  });

  await queryClient.cancelQueries({
    queryKey: ["realEstateProperties"],
  });

  // Snapshot the previous value
  const previousRealEstateProperty = queryClient.getQueryData([
    "realEstateProperties",
    newRealEstateProperty.id,
  ]);

  // Optimistically update to the new value
  if (previousRealEstateProperty) {
    queryClient.setQueryData(
["realEstateProperties", newRealEstateProperty.id],
/**
 * `newRealEstateProperty` will at first only include updated values for
 * the record. To avoid only rendering optimistic values for updated
 * fields on the UI, include the previous values for all fields:
 */
{ ...previousRealEstateProperty, ...newRealEstateProperty },
    );
  }

  // Return a context with the previous and new realEstateProperty
  return { previousRealEstateProperty, newRealEstateProperty };
},
// If the mutation fails, use the context we returned above
onError: (err, newRealEstateProperty, context) => {
  console.error("Error updating record:", err, newRealEstateProperty);
  if (context?.previousRealEstateProperty) {
    queryClient.setQueryData(
["realEstateProperties", context.newRealEstateProperty.id],
context.previousRealEstateProperty,
    );
  }
},
// Always refetch after error or success:
onSettled: (newRealEstateProperty) => {
  if (newRealEstateProperty) {
    queryClient.invalidateQueries({
queryKey: ["realEstateProperties", newRealEstateProperty.id],
    });
    queryClient.invalidateQueries({
queryKey: ["realEstateProperties"],
    });
  }
},
  });
}

~~~

| | |
| -- | -- |
| Hash | `5527db08ca1ee1bb` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `src/App.tsx`

~~~
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../amplify/data/resource";
import { useQueryClient, useMutation } from "@tanstack/react-query";

const client = generateClient<Schema>();

function App() {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
mutationFn: async (realEstatePropertyDetails: { id: string }) => {
  const { data: deletedProperty } =
    await client.models.RealEstateProperty.delete(
realEstatePropertyDetails,
    );
  return deletedProperty;
},
// When mutate is called:
onMutate: async (newRealEstateProperty) => {
  // Cancel any outgoing refetches
  // (so they don't overwrite our optimistic update)
  await queryClient.cancelQueries({
    queryKey: ["realEstateProperties", newRealEstateProperty.id],
  });

  await queryClient.cancelQueries({
    queryKey: ["realEstateProperties"],
  });

  // Snapshot the previous value
  const previousRealEstateProperty = queryClient.getQueryData([
    "realEstateProperties",
    newRealEstateProperty.id,
  ]);

  // Optimistically update to the new value
  if (previousRealEstateProperty) {
    queryClient.setQueryData(
["realEstateProperties", newRealEstateProperty.id],
newRealEstateProperty,
    );
  }

  // Return a context with the previous and new realEstateProperty
  return { previousRealEstateProperty, newRealEstateProperty };
},
// If the mutation fails, use the context we returned above
onError: (err, newRealEstateProperty, context) => {
  console.error("Error deleting record:", err, newRealEstateProperty);
  if (context?.previousRealEstateProperty) {
    queryClient.setQueryData(
["realEstateProperties", context.newRealEstateProperty.id],
context.previousRealEstateProperty,
    );
  }
},
// Always refetch after error or success:
onSettled: (newRealEstateProperty) => {
  if (newRealEstateProperty) {
    queryClient.invalidateQueries({
queryKey: ["realEstateProperties", newRealEstateProperty.id],
    });
    queryClient.invalidateQueries({
queryKey: ["realEstateProperties"],
    });
  }
},
  });
}

~~~

| | |
| -- | -- |
| Hash | `74b0b5f0ccd6d7dd` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `Unnamed Snippet`

~~~
function GlobalLoadingIndicator() {
  const isFetching = useIsFetching();
  return isFetching ? <div style={styles.globalLoadingIndicator}></div> : null;
}

~~~

| | |
| -- | -- |
| Hash | `8126f5215dc69347` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `Unnamed Snippet`

~~~
<>
  {updateMutation.isError && updateMutation.error instanceof Error ? (
<div>An error occurred: {updateMutation.error.message}</div>
  ) : null}

  {updateMutation.isSuccess ? <div>Real Estate Property updated!</div> : null}

  <button
onClick={() =>
  updateMutation.mutate({
    id: realEstateProperty.id,
    address: `${Math.floor(1000 + Math.random() * 9000)} Main St`,
  })
}
  >
Update Address
  </button>
</>;

~~~

| | |
| -- | -- |
| Hash | `be047723724475e7` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `src/main.tsx`

~~~
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

Amplify.configure(outputs);

export const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
<QueryClientProvider client={queryClient}>
  <App />
  <ReactQueryDevtools initialIsOpen={false} />
</QueryClientProvider>
  </React.StrictMode>,
);

~~~

| | |
| -- | -- |
| Hash | `5a0aff3caf6ca3be` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `src/App.tsx`

~~~
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../amplify/data/resource";
import "./App.css";
import { useIsFetching, useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "./main";
import { useState } from "react";

const client = generateClient<Schema>({
  authMode: "iam",
});

function GlobalLoadingIndicator() {
  const isFetching = useIsFetching();

  return isFetching ? <div style={styles.globalLoadingIndicator}></div> : null;
}

function App() {
  const [currentRealEstatePropertyId, setCurrentRealEstatePropertyId] =
useState<string | null>(null);

  const {
data: realEstateProperties,
isLoading,
isSuccess,
isError: isErrorQuery,
  } = useQuery({
queryKey: ["realEstateProperties"],
queryFn: async () => {
  const response = await client.models.RealEstateProperty.list();

  const allRealEstateProperties = response.data;

  if (!allRealEstateProperties) return null;

  return allRealEstateProperties;
},
  });

  const createMutation = useMutation({
mutationFn: async (input: { name: string; address: string }) => {
  const { data: newRealEstateProperty } =
    await client.models.RealEstateProperty.create(input);
  return newRealEstateProperty;
},
// When mutate is called:
onMutate: async (newRealEstateProperty) => {
  // Cancel any outgoing refetches
  // (so they don't overwrite our optimistic update)
  await queryClient.cancelQueries({ queryKey: ["realEstateProperties"] });

  // Snapshot the previous value
  const previousRealEstateProperties = queryClient.getQueryData([
    "realEstateProperties",
  ]);

  // Optimistically update to the new value
  if (previousRealEstateProperties) {
    queryClient.setQueryData(
["realEstateProperties"],
(old: Schema["RealEstateProperty"]["type"][]) => [
  ...old,
  newRealEstateProperty,
],
    );
  }

  // Return a context object with the snapshotted value
  return { previousRealEstateProperties };
},
// If the mutation fails,
// use the context returned from onMutate to rollback
onError: (err, newRealEstateProperty, context) => {
  console.error("Error saving record:", err, newRealEstateProperty);
  if (context?.previousRealEstateProperties) {
    queryClient.setQueryData(
["realEstateProperties"],
context.previousRealEstateProperties,
    );
  }
},
// Always refetch after error or success:
onSettled: () => {
  queryClient.invalidateQueries({ queryKey: ["realEstateProperties"] });
},
  });

  function RealEstatePropertyDetailView() {
const {
  data: realEstateProperty,
  isLoading,
  isSuccess,
  isError: isErrorQuery,
} = useQuery({
  queryKey: ["realEstateProperties", currentRealEstatePropertyId],
  queryFn: async () => {
    if (!currentRealEstatePropertyId) {
return;
    }

    const { data: property } = await client.models.RealEstateProperty.get({
id: currentRealEstatePropertyId,
    });
    return property;
  },
});

const updateMutation = useMutation({
  mutationFn: async (realEstatePropertyDetails: {
    id: string;
    name?: string;
    address?: string;
  }) => {
    const { data: updatedProperty } =
await client.models.RealEstateProperty.update(
  realEstatePropertyDetails,
);

    return updatedProperty;
  },
  // When mutate is called:
  onMutate: async (newRealEstateProperty: {
    id: string;
    name?: string;
    address?: string;
  }) => {
    // Cancel any outgoing refetches
    // (so they don't overwrite our optimistic update)
    await queryClient.cancelQueries({
queryKey: ["realEstateProperties", newRealEstateProperty.id],
    });

    await queryClient.cancelQueries({
queryKey: ["realEstateProperties"],
    });

    // Snapshot the previous value
    const previousRealEstateProperty = queryClient.getQueryData([
"realEstateProperties",
newRealEstateProperty.id,
    ]);

    // Optimistically update to the new value
    if (previousRealEstateProperty) {
queryClient.setQueryData(
  ["realEstateProperties", newRealEstateProperty.id],
  /**
   * `newRealEstateProperty` will at first only include updated values for
   * the record. To avoid only rendering optimistic values for updated
   * fields on the UI, include the previous values for all fields:
   */
  { ...previousRealEstateProperty, ...newRealEstateProperty },
);
    }

    // Return a context with the previous and new realEstateProperty
    return { previousRealEstateProperty, newRealEstateProperty };
  },
  // If the mutation fails, use the context we returned above
  onError: (err, newRealEstateProperty, context) => {
    console.error("Error updating record:", err, newRealEstateProperty);
    if (context?.previousRealEstateProperty) {
queryClient.setQueryData(
  ["realEstateProperties", context.newRealEstateProperty.id],
  context.previousRealEstateProperty,
);
    }
  },
  // Always refetch after error or success:
  onSettled: (newRealEstateProperty) => {
    if (newRealEstateProperty) {
queryClient.invalidateQueries({
  queryKey: ["realEstateProperties", newRealEstateProperty.id],
});
queryClient.invalidateQueries({
  queryKey: ["realEstateProperties"],
});
    }
  },
});

const deleteMutation = useMutation({
  mutationFn: async (realEstatePropertyDetails: { id: string }) => {
    const { data: deletedProperty } =
await client.models.RealEstateProperty.delete(
  realEstatePropertyDetails,
);
    return deletedProperty;
  },
  // When mutate is called:
  onMutate: async (newRealEstateProperty) => {
    // Cancel any outgoing refetches
    // (so they don't overwrite our optimistic update)
    await queryClient.cancelQueries({
queryKey: ["realEstateProperties", newRealEstateProperty.id],
    });

    await queryClient.cancelQueries({
queryKey: ["realEstateProperties"],
    });

    // Snapshot the previous value
    const previousRealEstateProperty = queryClient.getQueryData([
"realEstateProperties",
newRealEstateProperty.id,
    ]);

    // Optimistically update to the new value
    if (previousRealEstateProperty) {
queryClient.setQueryData(
  ["realEstateProperties", newRealEstateProperty.id],
  newRealEstateProperty,
);
    }

    // Return a context with the previous and new realEstateProperty
    return { previousRealEstateProperty, newRealEstateProperty };
  },
  // If the mutation fails, use the context we returned above
  onError: (err, newRealEstateProperty, context) => {
    console.error("Error deleting record:", err, newRealEstateProperty);
    if (context?.previousRealEstateProperty) {
queryClient.setQueryData(
  ["realEstateProperties", context.newRealEstateProperty.id],
  context.previousRealEstateProperty,
);
    }
  },
  // Always refetch after error or success:
  onSettled: (newRealEstateProperty) => {
    if (newRealEstateProperty) {
queryClient.invalidateQueries({
  queryKey: ["realEstateProperties", newRealEstateProperty.id],
});
queryClient.invalidateQueries({
  queryKey: ["realEstateProperties"],
});
    }
  },
});

return (
  <div style={styles.detailViewContainer}>
    <h2>Real Estate Property Detail View</h2>
    {isErrorQuery && <div>{"Problem loading Real Estate Property"}</div>}
    {isLoading && (
<div style={styles.loadingIndicator}>
  {"Loading Real Estate Property..."}
</div>
    )}
    {isSuccess && (
<div>
  <p>{`Name: ${realEstateProperty?.name}`}</p>
  <p>{`Address: ${realEstateProperty?.address}`}</p>
</div>
    )}
    {realEstateProperty && (
<div>
  <div>
    {updateMutation.isPending ? (
      "Updating Real Estate Property..."
    ) : (
      <>
        {updateMutation.isError &&
        updateMutation.error instanceof Error ? (
          <div>An error occurred: {updateMutation.error.message}</div>
        ) : null}

        {updateMutation.isSuccess ? (
          <div>Real Estate Property updated!</div>
        ) : null}

        <button
          onClick={() =>
            updateMutation.mutate({
              id: realEstateProperty.id,
              name: `Updated Home ${Date.now()}`,
            })
          }
        >
          Update Name
        </button>
        <button
          onClick={() =>
            updateMutation.mutate({
              id: realEstateProperty.id,
              address: `${Math.floor(
                1000 + Math.random() * 9000,
              )} Main St`,
            })
          }
        >
          Update Address
        </button>
      </>
    )}
  </div>

  <div>
    {deleteMutation.isPending ? (
      "Deleting Real Estate Property..."
    ) : (
      <>
        {deleteMutation.isError &&
        deleteMutation.error instanceof Error ? (
          <div>An error occurred: {deleteMutation.error.message}</div>
        ) : null}

        {deleteMutation.isSuccess ? (
          <div>Real Estate Property deleted!</div>
        ) : null}

        <button
          onClick={() =>
            deleteMutation.mutate({
              id: realEstateProperty.id,
            })
          }
        >
          Delete
        </button>
      </>
    )}
  </div>
</div>
    )}
    <button onClick={() => setCurrentRealEstatePropertyId(null)}>
Back
    </button>
  </div>
);
  }
  return (
<div>
  {!currentRealEstatePropertyId && (
    <div style={styles.appContainer}>
<h1>Real Estate Properties:</h1>
<div>
  {createMutation.isPending ? (
    "Adding Real Estate Property..."
  ) : (
    <>
      {createMutation.isError &&
      createMutation.error instanceof Error ? (
        <div>An error occurred: {createMutation.error.message}</div>
      ) : null}

      {createMutation.isSuccess ? (
        <div>Real Estate Property added!</div>
      ) : null}

      <button
        onClick={() => {
          createMutation.mutate({
            name: `New Home ${Date.now()}`,
            address: `${Math.floor(
              1000 + Math.random() * 9000,
            )} Main St`,
          });
        }}
      >
        Add RealEstateProperty
      </button>
    </>
  )}
</div>
<ul style={styles.propertiesList}>
  {isLoading && (
    <div style={styles.loadingIndicator}>
      {"Loading Real Estate Properties..."}
    </div>
  )}
  {isErrorQuery && (
    <div>{"Problem loading Real Estate Properties"}</div>
  )}
  {isSuccess &&
    realEstateProperties?.map((realEstateProperty, idx) => {
      if (!realEstateProperty) return null;
      return (
        <li
          style={styles.listItem}
          key={`${idx}-${realEstateProperty.id}`}
        >
          <p>{realEstateProperty.name}</p>
          <button
            style={styles.detailViewButton}
            onClick={() =>
              setCurrentRealEstatePropertyId(realEstateProperty.id)
            }
          >
            Detail View
          </button>
        </li>
      );
    })}
</ul>
    </div>
  )}
  {currentRealEstatePropertyId && <RealEstatePropertyDetailView />}
  <GlobalLoadingIndicator />
</div>
  );
}

export default App;

const styles = {
  appContainer: {
display: "flex",
flexDirection: "column",
alignItems: "center",
  },
  detailViewButton: { marginLeft: "1rem" },
  detailViewContainer: { border: "1px solid black", padding: "3rem" },
  globalLoadingIndicator: {
position: "fixed",
top: 0,
left: 0,
width: "100%",
height: "100%",
border: "4px solid blue",
pointerEvents: "none",
  },
  listItem: {
display: "flex",
justifyContent: "space-between",
border: "1px dotted grey",
padding: ".5rem",
margin: ".1rem",
  },
  loadingIndicator: {
border: "1px solid black",
padding: "1rem",
margin: "1rem",
  },
  propertiesList: {
display: "flex",
flexDirection: "column",
alignItems: "center",
justifyContent: "start",
width: "50%",
border: "1px solid black",
padding: "1rem",
listStyleType: "none",
  },
} as const;

~~~

| | |
| -- | -- |
| Hash | `c229fca239cbad11` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

[<- Back to index](../../../../../docs-pages.md)
