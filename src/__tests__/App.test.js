import { 
    render,
    screen,
    fireEvent,
    waitFor,
} from "@testing-library/react";
import fetchMock from "jest-fetch-mock";
import App from "../components/App";
import { config } from "../config";
import { people } from "../people";

beforeEach(() => {
    // Fetchをモックする
    fetchMock.resetMocks(); // 毎回リセットしないとエラーが発生する
    fetchMock.mockResponse(JSON.stringify(people));
});

test("APIサーバーからデータを取得できる", async () => {
    render(<App />);

    const cards = await screen.findAllByTestId("card");
    expect(cards).toHaveLength(config.RESULT_COUNT);
});

test("人物カードを仕分けできる", async () => {
    render(<App />);
    
    const skipCount = Math.floor(Math.random() * config.RESULT_COUNT);
    const likeCount = config.RESULT_COUNT - skipCount;

    const skipButton = await screen.findByTestId("skip-button");
    const likeButton = await screen.findByTestId("like-button");

    for (let i = 0; i < config.RESULT_COUNT; i++) {
        if (i < skipCount) {
            fireEvent.click(skipButton);
        } else {
            fireEvent.click(likeButton);
        }

        // カードの枚数が減っているのを確認できるまで待機する
        if (i < config.RESULT_COUNT - 1) {
            await waitFor(() => {
                const cards = screen.getAllByTestId("card");
                if (cards.length === config.RESULT_COUNT - i) {
                    throw new Error();
                }
            });
        }
    }

    await waitFor(() => screen.getByTestId("skip-count"));

    expect(screen.getByTestId("skip-count")).toHaveTextContent(skipCount);
    expect(screen.getByTestId("like-count")).toHaveTextContent(likeCount);
}, 10000);

test("詳細画面を表示できる", async () => {
    render(<App />);

    const readMoreButtons = await screen.findAllByTestId("read-more-button");
    fireEvent.click(readMoreButtons[0]);

    await waitFor(() => screen.getByTestId("dialog"));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
});
