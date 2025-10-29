import { Route, Routes } from 'react-router-dom'
import { adminRouter, publicRouter } from './routes'
import  {DefaultLayout}  from '~/components/layouts';

function AppRouter() {
    return (
        //public router
        <Routes>
            {publicRouter.map((item, index) => (
                <Route key={index} path={item.path} element={item.element}></Route>
            ))}
        {/* learner chỉ được vào */}
            {adminRouter.map((item, index) => (
                <Route key={index} path={item.path} element={
                    <DefaultLayout>
                        {item.element}
                    </DefaultLayout>
                }></Route>
            ))}
        </Routes>
    )
}
export default AppRouter;