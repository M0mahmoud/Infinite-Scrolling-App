import { useRef, useState, useCallback } from "react";
import useBookSearch from "./useBookSearch";

function App() {
  const [query, setQuery] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const { loading, error, books, hasMore } = useBookSearch(query, pageNumber);

  // Store the reference of IntersectionObserver instance
  const observer = useRef();

  // Use callback hook to create and observe the last book element in the list
  const lastBookElement = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) {
        observer.current.disconnect();
      }

      observer.current = new IntersectionObserver((entries) => {
        // If the last book element is intersecting with the viewport and there are more books to load
        if (entries[0].isIntersecting && hasMore) {
          setPageNumber((prev) => prev + 1);
          console.log("Last Element Is Visble Now...");
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const searchHandler = (e) => {
    setQuery(e.target.value);
    setPageNumber(1);
  };

  return (
    <>
      <div>
        <h2>Infinite Scrolling</h2>
      </div>
      <div>
        <label htmlFor="book">Search For Book</label>
        <input type="text" id="book" value={query} onChange={searchHandler} />
      </div>

      {books.map((book, index) => {
        if (books.length === index + 1) {
          return (
            <div className="book" ref={lastBookElement} key={book}>
              {book}
            </div>
          );
        } else {
          return (
            <div className="book" key={book}>
              {book}
            </div>
          );
        }
      })}
      <div className="main-color">{loading && "Loading..."}</div>
      <div className="main-color">{error && "Error..."}</div>
    </>
  );
}

export default App;
