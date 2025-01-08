import SideBar from "../../component/SideBar";
import TopBar from "../../component/TopBar";
import Footer from "../../component/Footer";

function CoursePage() {
    return (
        <div>
            <SideBar />
            <TopBar name="hola"/>
            <div>
                <h1>Course Page</h1>
                <p>Welcome to the course page!</p>
            </div>
        </div>
    );
}

export default CoursePage;
