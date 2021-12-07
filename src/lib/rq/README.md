Lightweight library for fetching asynchronous data on Preact.

## Getting started

```jsx
import { useQuery } from 'rq';

async function fetchPosts (key, id) {
  const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
  return response.json();
}

function App () {
  const { status, data, error, fetching, mutate } = useQuery({
    key: ['post', 1],
    fetch: fetchPosts,
  });

  if (status === 'loading') {
    return (
      <div>Loading...</div>
    );
  }

  if (status === 'error') {
    return (
      <div>
        <p>Error has occured</p>
        <pre>{JSON.stringify(error, null, 2)}</pre>
        <button onClick={() => mutate()}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <h3>{data.title}</h3>
      <p>{data.body}</p>
      {fetching && <div>Updating...</div>}
    </div>
  );
}
```
