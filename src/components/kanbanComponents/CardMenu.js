import React from "react";
import PropTypes from "prop-types";

const cardMenuPropTypes = {
  // listId : PropTypes.number.isRequired,
  // cardId : PropTypes.number.isRequired,
  hasDescription: PropTypes.bool.isRequired,
  onClickAddATask: PropTypes.func /*.isRequired*/,
  onClickEditTitle: PropTypes.func /*.isRequired*/,
  onClickEditDescription: PropTypes.func,
  onClickDeleteCard: PropTypes.func /*.isRequired*/,
  onClickNotify: PropTypes.func /*.isRequired*/,
  onClickToggleNotify: PropTypes.func /*.isRequired*/,
  menuPosition: PropTypes.object /*.isRequired*/,
  status: PropTypes.string
};

const CardMenu = props => (
  <div
    className="card-menu"
    style={props.menuPosition}
    onClick={e => e.stopPropagation()}
  >
    <div className="header">Ticket Actions</div>
    <hr />
    <div className="action" onClick={props.onClickAddATask}>
      Add a task...
    </div>
    <div className="action" onClick={props.onClickEditTitle}>
      Edit title...
    </div>
    <div className="action" onClick={props.onClickEditDescription}>
      {props.hasDescription === true
        ? "Edit description..."
        : "Add description..."}
    </div>
    {props.status !== "Deleted" && (
      <div className="action" onClick={props.onClickDeleteCard}>
        Delete ticket...
      </div>
    )}

    <div className="action" onClick={props.onClickNotify}>
      Notify client...
    </div>
    <div className="action" onClick={props.onClickToggleNotify}>
      Toggle notify...
    </div>
  </div>
);

CardMenu.propTypes = cardMenuPropTypes;

export default CardMenu;
