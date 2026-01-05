# AI Stock Analyzer

A modern stock analysis dashboard powered by AI, providing technical analysis, entry points, stop losses, and target prices.

## Phase 1: Functional Shell (Current) ✅

This is the **static/mock version** that demonstrates the complete UI flow without real API costs.

### Features Implemented

- ✅ Next.js 15 + TypeScript + Tailwind CSS
- ✅ Bloomberg-inspired dark mode professional theme
- ✅ Stock ticker search with loading states
- ✅ Mock technical chart using Recharts
- ✅ AI analysis section with formatted breakdown
- ✅ Entry Point, Stop Loss, and Target Price cards
- ✅ Mock data service simulating Perplexity API
- ✅ Responsive design for all screen sizes

### Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

4. **Try it out:**
   - Enter any stock ticker (e.g., AAPL, TSLA, NVDA)
   - Click "Search" and watch the loading state
   - View the mock technical analysis and charts

### Project Structure

```
/app
  /dashboard          # Main dashboard page
  layout.tsx          # Root layout with dark mode
  page.tsx            # Landing page
  globals.css         # Global styles and theme

/components
  StockChart.tsx      # Recharts price chart
  AnalysisCard.tsx    # AI analysis display
  MetricCard.tsx      # Entry/Stop/Target cards

/services
  mockStockData.ts    # Mock data service (Phase 1)

/config
  prompts.ts          # Claude AI prompt configuration
```

### Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Charts:** Recharts
- **AI (Future):** Claude API
- **Data (Future):** Perplexity Finance API

## Future Phases

### Phase 2: Data Integration 🔜
- Replace mock data with real Perplexity Finance API
- Map live market data to existing components
- Real-time price updates

### Phase 3: Intelligence Layer 🔮
- Integrate Claude AI for analysis
- Custom prompt engineering for technical analysis
- Dynamic entry/exit point calculations

## Development Notes

- All mock data includes realistic price movements and volume
- Loading states simulate actual API response times (1.5s)
- Analysis text is structured to match future Claude output format
- Components are designed for easy data source swapping

## License

MIT
