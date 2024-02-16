// import styled from 'styled-components';
// import GlobalStyles from './styles/GlobalStyles';
// import Button from './ui/Button';
// import Input from './ui/Input';
// import Heading from './ui/Heading';
// import Row from './ui/Row';

import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Bookings from './pages/Bookings';
import Cabins from './pages/Cabins';
import NewUsers from './pages/Users';
import Settings from './pages/Settings';
import Account from './pages/Account';
import Login from './pages/Login';
import PageNotFound from './pages/PageNotFound';
import GlobalStyles from './styles/GlobalStyles';
import AppLayout from './ui/AppLayout';

// const StyledApp = styled.div`
//     padding: 20px;
// `;

// function App() {
//     return (
//         <>
//             <GlobalStyles />
//             <StyledApp>
//                 <Row>
//                     <Row type="horizontal">
//                         <Heading as="h1">The Wild Oasis</Heading>
//                         <div>
//                             <Heading as="h2">Check in and out</Heading>

//                             <Button>Check in</Button>
//                             <Button variation="secondary" size="small">
//                                 Check out
//                             </Button>
//                         </div>
//                     </Row>

//                     <Row>
//                         <Heading as="h3">Form</Heading>
//                         <form>
//                             <Input
//                                 type="number"
//                                 placeholder="Number of guests"
//                             />
//                         </form>
//                     </Row>
//                 </Row>
//             </StyledApp>
//         </>
//     );
// }

// export default App;

function App() {
    return (
        <>
            <GlobalStyles />
            <BrowserRouter>
                <Routes>
                    <Route element={<AppLayout />}>
                        <Route
                            index
                            element={<Navigate replace to="dashboard" />}
                        />
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="bookings" element={<Bookings />} />
                        <Route path="cabins" element={<Cabins />} />
                        <Route path="users" element={<NewUsers />} />
                        <Route path="settings" element={<Settings />} />
                        <Route path="account" element={<Account />} />
                    </Route>
                    <Route path="login" element={<Login />} />
                    <Route path="*" element={<PageNotFound />} />
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;
