import Home from '~/pages/home/Home';

import LoginPage from '../pages/account/login/Login';
import Users from '../pages/users/Users';
import Vehicles from '../pages/vehicles/Vehicles';
import TollStations from '../pages/tollstations/Tollstations';
import Transactions from '../pages/transactions/Transactions';
import Reports from '../pages/reports/Reports';


const publicRouter = [
    {path: '/Login', element: <LoginPage/>},
]

const adminRouter = [
    {path: '/', element: <Home/>},
    {path: '/users', element: <Users/>},
    {path: '/vehicles', element: <Vehicles/>},
    {path: '/tollstations', element: <TollStations/>},
    {path: '/transactions', element: <Transactions/>},
    {path: '/reports', element: <Reports/>},

]

export {adminRouter, publicRouter };