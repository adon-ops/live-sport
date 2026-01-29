import { Routes, Route, Outlet, Link } from 'react-router-dom';

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<App />} />
                <Route path="*" element={<NoMatch />} />
            </Route>
        </Routes>
    );
}

function Layout() {
    return <Outlet />;
}

function NoMatch() {
    return (
        <div>
            <h2>Nothing to see here!</h2>
            <p>
                <Link to="/">Go to the home page</Link>
            </p>
        </div>
    );
}
