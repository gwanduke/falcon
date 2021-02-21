import { useEffect, useState } from "react";

function App() {
  const [diaries, setDiaries] = useState(null);

  useEffect(() => {
    // GET, 다이어리 리스트
    fetch("http://localhost:5000/diaries")
      .then((res) => res.json())
      .then((json) => {
        setDiaries(json.diaries);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formElements = e.target.elements;

    // POST, 다이어리 생성
    fetch("http://localhost:5000/diaries", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        date: formElements.date.value,
        text: formElements.text.value,
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        setDiaries((prev) => [...prev, json.diary]);
        formElements.text.value = "";
      })
      .catch((err) => {
        console.log(err);
      });
  };

  if (!diaries) {
    return "Loading...";
  }

  return (
    <div className="App">
      <h1>일기</h1>
      <div>
        <ul>
          {diaries.map((diary, index) => (
            <li key={index}>
              {diary.date}: {diary.text}
            </li>
          ))}
        </ul>
        <form onSubmit={handleSubmit}>
          <input name="date" type="date" defaultValue="2021-02-21" />
          <input name="text" type="text" placeholder="내용" />
          <button type="submit">추가</button>
        </form>
      </div>
    </div>
  );
}

export default App;
