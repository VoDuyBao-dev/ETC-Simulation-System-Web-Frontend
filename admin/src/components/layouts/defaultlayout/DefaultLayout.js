import Header from '../header/Header'

import Footer from '../footer/Footer'
import Sidebar from '../Sidebar/Sidebar';

function DefaultLayout({children}){
    return(
        <>
            <Header/>
            <Sidebar/>
                <main>
                    {children}
                </main>
            <Footer/>
        </>
    )
}
export default DefaultLayout;