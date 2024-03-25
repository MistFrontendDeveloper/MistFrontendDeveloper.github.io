import * as React from "react"
import { Link } from "gatsby"
import { ThemeToggler } from "gatsby-plugin-dark-mode"
import Toggle from "../components/toggle"
import sun from "../images/sun.png"
import moon from "../images/moon.png"

const Layout = ({ location, title, children }) => {
  const rootPath = `${__PATH_PREFIX__}/`
  const isRootPath = location.pathname === rootPath
  let header

  if (isRootPath) {
    header = (
      <h1
        className="main-heading"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          color: `inherit`,
        }}
      >
        <Link
          to="/"
          style={{
            boxShadow: `none`,
            color: `inherit`,
          }}
        >
          {title}
        </Link>
        <ThemeToggler>
          {({ theme, toggleTheme }) => (
            <Toggle
              icons={{
                checked: (
                  <img
                    src={moon}
                    width="16"
                    height="16"
                    role="presentation"
                    style={{ pointerEvents: "none" }}
                    alt="'dark' theme icon"
                  />
                ),
                unchecked: (
                  <img
                    src={sun}
                    width="16"
                    height="16"
                    role="presentation"
                    style={{ pointerEvents: "none" }}
                    alt="'light' theme icon"
                  />
                ),
              }}
              checked={theme === "dark"}
              onChange={e => toggleTheme(e.target.checked ? "dark" : "light")}
            />
          )}
        </ThemeToggler>
      </h1>
    )
  } else {
    header = (
      <Link
        className="header-link-home"
        to="/"
        style={{
          boxShadow: `none`,
          color: `inherit`,
        }}
      >
        {title}
      </Link>
    )
  }

  return (
    <div className="global-wrapper" data-is-root-path={isRootPath}>
      <header className="global-header">{header}</header>
      <main>{children}</main>
      <footer>
        © {new Date().getFullYear()}, Built with
        {` `}
        <a href="https://www.gatsbyjs.com">Gatsby</a>
      </footer>
    </div>
  )
}

export default Layout
