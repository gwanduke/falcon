const express = require("express");
const cors = require("cors");

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

app.get("/diaries", (req, res) => {
  res.send({
    diaries: [
      {
        date: "2020-12-31",
        text: "오늘은 헌해입니다.",
      },
      {
        date: "2021-01-01",
        text: "오늘은 새해입니다.",
      },
      {
        date: "2021-12-31",
        text: "내일은 한살 추가",
      },
    ],
  });
});

app.post("/diaries", (req, res) => {
  const diary = {
    date: req.body.date,
    text: req.body.text,
  };

  res.send({
    diary,
  });
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
