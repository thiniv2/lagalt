import "./Navbar.css"
import { NavLink } from "react-router-dom"
import { useEffect, useState } from "react"
import { config } from "../../Config"
import { PublicClientApplication } from "@azure/msal-browser"
import { useUser } from "../../Context/UserContext"
import { Button } from "@mui/material"
import { Login } from "../../Services/User"
import { storageRead, storageRemove, storageSave } from "../../Utils/Storage"

const Navbar = () => {
  const [error, setError] = useState(null)
  const { user, setUser } = useUser()

  let publicClientApplication = new PublicClientApplication({
    auth: {
      clientId: config.appId,
    //   redirectUri: config.redirectUri,
    },
    cache: {
      cacheLocation: "localStorage",
      storeAuthStateInCookie: true,
    },
  })

  useEffect(() => {
    if (!user && storageRead("Lagalt-user")) {
      const temp = storageRead("Lagalt-user")
      setUser(temp)
    }
  }, [setUser, user])

  const loginHandler = async () => {
    try {
      await publicClientApplication
        .loginPopup({
          scopes: config.scopes,
          prompt: "select_account",
        })
        .then((res) => {
          if (res) {
            setUser({
              name: res.account.name,
              token: "Bearer " + res.idToken,
              microsoftId: res.account.homeAccountId,
            })

            storageSave("Lagalt-user", {
              name: res.account.name,
              token: "Bearer " + res.idToken,
              microsoftId: res.account.homeAccountId,
            })
            const user = {
              Username: res.account.name,
              MicrosoftId: res.account.homeAccountId,
            }
            return Login(JSON.stringify(user))
          }
        })
        .then((res) =>
        {
          setUser((prev) => {
            // Set response data to user (history, projects etc...)
            return {
              ...prev,
              history: res.result.value.history,
              projects: res.result.value.projects,
              biography: res.result.value.biography,
              skills: res.result.value.skills
            }
          })
          return res
        }
        )
        .then(res => {
          const tempUser = storageRead('Lagalt-user')
          storageSave('Lagalt-user', {...tempUser, biography: res.result.value.biography, skills: res.result.value.skills})
        })
    } catch (err) {
		setError(err)
		console.log(error);
    }
  }

  const logout = async () => {
    await publicClientApplication.logoutPopup()
    setUser(null)
    storageRemove("Lagalt-user")
  }

  // visible navbar links going to change if user public/logged in

  const [isNavExpanded, setIsNavExpanded] = useState(false)

  return (
    <nav className="Navbar">
      <NavLink to="/" className="TitleLink">
        <h1 className="Title">Lagalt.no</h1>
      </NavLink>
      <button
        className="hamburger"
        onClick={() => {
          setIsNavExpanded(!isNavExpanded)
        }}
      >
        {/* icon from heroicons.com */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="white"
        >
          <path
            fillRule="evenodd"
            d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM9 15a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      <div className={isNavExpanded ? "NavMenu expanded" : "NavMenu"}>
        <ul>
			<li>
				<Button><NavLink to="/">Home</NavLink></Button>
			</li>
          {user && (
            <li>
				<Button><NavLink to="/profile">Profile</NavLink></Button>
            </li>
          )}

          {user ? (
            <li>
              <Button onClick={() => logout()}>Log out</Button>
            </li>
          ) : (
            <li>
              <Button
                onClick={() => loginHandler()}
                size="small"
                variant="outlined"
              >
                Sign in/Sign up
              </Button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
