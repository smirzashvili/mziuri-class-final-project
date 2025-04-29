import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const useDocumentTitle = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        switch (pathname) {
            case "/":
                document.title = "MelodyMatch - Where Musicians Meet & Create";
                break;
            case "/login":
                document.title = "Tune In - MelodyMatch";
                break;
            case "/registration":
                document.title = "Join the Jam - MelodyMatch";
                break;
            case "/explore":
                document.title = "Explore - MelodyMatch";
                break;
            case "/chat":
                document.title = "Chat - MelodyMatch";
                break;
            case "/profile":
                document.title = "Profile - MelodyMatch";
                break;
            case "/terms":
                document.title = "Terms & Conditions - MelodyMatch";
                break;
            case "/about":
                document.title = "About - MelodyMatch";
                break;
            case "/contact":
                document.title = "Contact - MelodyMatch";
                break;
            default:
                document.title = "Oops - MelodyMatch";
        }
    }, [pathname]);
};

export default useDocumentTitle;