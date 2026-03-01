# 前台網站

以 **React** + **Vite** 建置的前台網站，含首頁、導覽列、頁尾與響應式版面。

## 技術棧

- React 18
- Vite 5
- React Router 6
- SCSS + CSS Modules + 全域設計變數（繁體中文字型：Noto Sans TC）

## 開發環境需求

- Node.js 18+（建議 20+）
- npm 或 yarn / pnpm

## 安裝與執行

```bash
# 安裝依賴
npm install

# 啟動開發伺服器（預設 http://localhost:5173）
npm run dev

# 建置正式版
npm run build

# 預覽建置結果
npm run preview
```

## 專案結構

```
├── public/           # 靜態資源（如 favicon）
├── src/
│   ├── components/   # 共用元件（Layout、Header、Footer）
│   ├── pages/        # 頁面（Home 等）
│   ├── App.jsx       # 根元件與路由
│   ├── main.jsx      # 入口
│   └── index.scss    # 全域樣式與 CSS 變數
├── index.html
├── vite.config.js
└── package.json
```

## 擴充建議

- 在 `src/pages/` 新增頁面元件，並在 `App.jsx` 的 `<Routes>` 中註冊路徑
- 在 `src/components/Header.jsx` 的 `navItems` 加入新導覽連結
- 在 `src/index.scss` 的 `:root` 調整主色、字型等設計變數
- 新樣式檔可使用 `.scss` 或 `.module.scss`（Vite 內建 SCSS 支援）
