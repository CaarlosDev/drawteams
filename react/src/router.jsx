import { Navigate, createBrowserRouter } from "react-router-dom";
import Login from "./views/Login.jsx";
import Register from "./views/Register.jsx";
import NotFound from "./views/NotFound.jsx";
import DefaultLayout from "./components/DefaultLayout.jsx";
import GuestLayout from "./components/GuestLayout.jsx";
import Players from "./views/Players.jsx";
import Draw from "./views/Draw.jsx";
import PlayerForm from "./views/PlayerForm.jsx";

const router = createBrowserRouter([
    {
        path: '/',
        element: <GuestLayout />,
        children: [
            {
                path: '/',
                element: <Navigate to="/login" />
            },
            {
                path: '/login',
                element: <Login />
            },
            {
                path: '/register',
                element: <Register />
            },
        ]
    },
    {
        path: '/',
        element: <DefaultLayout />,
        children: [
            {
                path: '/',
                element: <Navigate to="/players" />
            },
            {
                path: '/players',
                element: <Players />
            },
            {
                path: '/players/create',
                element: <PlayerForm key='createPlayer' />
            },
            {
                path: '/players/:id',
                element: <PlayerForm key='updatePlayer' />
            },
            {
                path: '/draw',
                element: <Draw />
            }
        ]
    },
    {
        path: '*',
        element: <NotFound />
    },
])

export default router;