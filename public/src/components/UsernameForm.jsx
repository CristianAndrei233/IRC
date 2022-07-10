import React from "react";

function Form(props) {
    return(
        <form>
            <input type="text" placeholder="Rooms section username" value={props.username} onChange={props.onChange}/>
            <button onClick={props.connect}>Go to Rooms</button>
        </form>
    )
}
export default Form;