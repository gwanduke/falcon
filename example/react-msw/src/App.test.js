import { render, screen } from "@testing-library/react";
import App from "./App";
import { rest } from "msw";
import { setupServer } from "msw/node";
import userEvent from "@testing-library/user-event";

/**
 * 아래 설명되어있는 시나리오를 직접 브라우저에서 수행하고
 * Falcon 크롬 익스텐션에서 복사해온 코드
 */
const handlers = [
  rest.get("http://localhost:5000/diaries", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
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
      })
    );
  }),
  rest.post("http://localhost:5000/diaries", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        diary: {
          date: "2021-01-21",
          text: "새로만든 일기",
        },
      })
    );
  }),
];

const server = setupServer(...handlers);

beforeAll(() => {
  server.listen();
});
afterAll(() => {
  server.close();
});

/**
 * 아래 시나리오대로 Falcon 크롬 익스텐션을 설치한 채로 수행한 뒤
 * Falcon에서 응답을 복사해 위 코드 처럼 `handler`로 구성하고 msw에서 사용하면
 * (마치 사용자가 앱을 사용하는 것 처럼) 다음과 같이 API를 mock시킨 테스트를 작성할 수 있다.
 *
 * 1. `yarn start`로 앱을 실행한다. (빠르게 로딩 후 아이템이 3개 표시된다.)
 * 2. "내용" input에 "새로만든 일기"를 입력한다.
 * 3. [추가] 클릭
 * 4. 리스트에 "새로만든 일기"가 추가됨을 확인한다.
 * 5. input은 초기화된다.
 */
test("시나리오 테스트", async () => {
  // 1.
  render(<App />);
  expect(await screen.findByText(/loading/i)).toBeInTheDocument();
  expect(await screen.findAllByRole("listitem")).toHaveLength(3);

  // 2.
  const textInput = screen.getByPlaceholderText("내용");
  userEvent.type(textInput, "새로만든 일기");

  // 3.
  userEvent.click(screen.getByRole("button", { name: "추가" }));

  // 4.
  await screen.findByText(/새로만든 일기/);
  expect(screen.getAllByRole("listitem")).toHaveLength(4);

  // 5.
  expect(textInput.value).toBe("");
});
