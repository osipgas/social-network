import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "./pages/MainLayout";
import { ProfilePage } from "./pages/ProfilePage";
import { LoginPage } from "./pages/LoginPage";
// Допустим, у тебя есть и эти компоненты:
import { SearchPage } from "./pages/SearchPage";
import ChatsPage from "./pages/ChatsPage"; // Убери фигурные скобки
import { HomeContent } from "./pages/HomeContent"; // <-- Это будет "домашняя" начинка

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Маршруты БЕЗ навбара (например, логин)
          идут отдельно.
        */}
        <Route path="/login" element={<LoginPage />} />

        {/* А вот и наша "рама"!
          MainLayout теперь оборачивает все дочерние маршруты.
        */}
        <Route path="/" element={<MainLayout />}>
          
          {/* `index` - это маршрут по умолчанию.
            Он будет отрендерен в <Outlet />, когда 
            пользователь зайдет на "/".
          */}
          <Route index element={<HomeContent />} />

          {/* Эти маршруты тоже будут рендериться 
            в <Outlet /> внутри MainLayout
          */}
          <Route path="search" element={<SearchPage />} />
          <Route path="chats" element={<ChatsPage />} />
          <Route path="profile/:userId/:username" element={<ProfilePage />} />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;