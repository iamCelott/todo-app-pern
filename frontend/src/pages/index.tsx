import { useEffect, useState } from "react";

interface Todo {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

const Index = () => {
  const [data, setData] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = "http://localhost:3000/todos";
        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error("failed to fetch data!");
        }

        const result = await response.json();

        if (Array.isArray(result.data)) {
          setData(result.data);
        } else {
          console.error("Data is not an array", result);
          setData([]);
        }

        setLoading(false);
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unknown error occurred");
        }

        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="max-w-2xl mt-10 mx-auto">
      {loading && (
        <div className="flex items-center justify-center min-h-screen">
          <h1 className="text-center">loading data..</h1>
        </div>
      )}
      {error && <h1>Error : {error}</h1>}

      {!loading && !error && (
        <div className="overflow-x-auto">
          <button className="btn btn-outline btn-sm btn-primary mb-5">
            Primary
          </button>
          <table className="table">
            <thead>
              <tr className="bg-primary-content">
                <th>No</th>
                <th>Title</th>
                <th>Description</th>
                <th>Completed</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data.map((todo, Index) => {
                return (
                  <tr key={todo.id} className="bg-base-200">
                    <th>{Index + 1}</th>
                    <td>{todo.title}</td>
                    <td>{todo.description}</td>
                    <td>{todo.completed ? "completed" : "not complete"}</td>
                    <td>
                      {todo.completed ? (
                        "no action"
                      ) : (
                        <form
                          action={`http://localhost:3000/todo/${todo.id}/mark-done`}
                          method="post"
                          onSubmit={(e) => {
                            e.preventDefault();
                            fetch(
                              `http://localhost:3000/todo/${todo.id}/mark-done`,
                              { method: "PATCH" }
                            ).then((response) => {
                              if (response.ok) {
                                alert("todo marked as completed");
                                window.location.reload();
                              }
                            });
                          }}
                        >
                          <button
                            type="submit"
                            className="btn btn-outline btn-success btn-sm"
                          >
                            Mark Done
                          </button>
                        </form>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Index;
