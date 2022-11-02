import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import "./SkillItem.css"


const SkillItem = (props) => {

  const handleDelete = () => {
    if(window.confirm("Are you sure?")) {

      props.deleteItem(props.text)
    }
  }

  return (
      <li>
        {props.text}
        <IconButton aria-label="delete" onClick={handleDelete}>
          <DeleteIcon />
        </IconButton>
      </li>
  )
}

export default SkillItem