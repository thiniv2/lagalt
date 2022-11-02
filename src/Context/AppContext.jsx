import ProjectBannerProvider from "./ProjectBannerContext"
import UserProvider from "./UserContext"

const AppContext = (props) => {
    return(

        <UserProvider>
            <ProjectBannerProvider>
                {props.children}
            </ProjectBannerProvider>
        </UserProvider>
    )
}
export default AppContext