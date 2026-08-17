import { useState } from "react";

import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";

export default function MainLayout({ children }) {

    const [sidebarOpen, setSidebarOpen] = useState(false);


    return (

        <div className="min-h-screen flex flex-col bg-gray-100">


            <Navbar
                onMenuClick={() => setSidebarOpen(true)}
            />


            <div className="flex flex-1 items-stretch">


                {/* Desktop Sidebar */}

                <div className="hidden md:block">

                    <Sidebar />

                </div>



                {/* Mobile Sidebar */}

                {
                    sidebarOpen && (

                        <div className="fixed inset-0 z-50 md:hidden">


                            {/* Overlay */}

                            <div
                                className="
                                    absolute
                                    inset-0
                                    bg-black/40
                                "
                                onClick={() =>
                                    setSidebarOpen(false)
                                }
                            />



                            {/* Drawer */}

                            <div
                                className="
                                    relative
                                    w-64
                                    h-full
                                    bg-gray-900
                                "
                            >

                                <Sidebar />

                            </div>


                        </div>

                    )
                }




                <main className="flex-1 p-6">

                    <div className="max-w-7xl mx-auto">

                        {children}

                    </div>

                </main>


            </div>


        </div>

    );

}