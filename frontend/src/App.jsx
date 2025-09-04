import { AuthProvider } from "./context/Authcontext";
import AppRoutes from "./routes/AppRoutes";
// import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <AuthProvider>
      <AppRoutes /> 
    </AuthProvider>
  );
}

export default App;
