import './CategoryButton.css'
import { Button } from '@mui/material'
import { useProjectBanners } from '../../Context/ProjectBannerContext'
import { createTheme, ThemeProvider } from '@mui/material/styles';

const CategoryButton = (props) => {

  const theme = createTheme({
    palette: {
      themeColor: {
        main: '#0092ca',
        contrastText: '#fff',
      },
    },
  });


  const {projectBanners} = useProjectBanners()

  const filterCategories = (category) => {
    props.setVisibleBanners(projectBanners.filter(banner => banner.field.toUpperCase() === category))
  }

  const showAllCategories = () => {
    props.setVisibleBanners(projectBanners)
  }

  const handleFilter = (event) => {
    event.preventDefault()
    if(event.target.innerText === "VIEW ALL") {
      showAllCategories()
    } else {
      filterCategories(event.target.innerText)
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <Button onClick={handleFilter}  variant="outlined" color = "themeColor" size = "medium">{props.title}</Button>
    </ThemeProvider>
  )
}

export default CategoryButton