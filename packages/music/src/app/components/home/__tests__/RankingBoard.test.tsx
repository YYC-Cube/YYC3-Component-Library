import { render, screen } from "@testing-library/react"
import RankingBoard from "../RankingBoard"

describe("RankingBoard", () => {
  it("renders the ranking board title", () => {
    render(<RankingBoard />)
    const titleElement = screen.getByText("排行榜")
    expect(titleElement).toBeInTheDocument()
  })

  // Add more tests as needed
})
