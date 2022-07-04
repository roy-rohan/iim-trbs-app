import { sendMessage } from ".";
import axios from "../../axios-iim";
import * as actionTypes from "./actionTypes";
import { startLoading, stopLoading } from "./common";

export const addMemberSuccess = (category, members) => {
  return {
    type: actionTypes.ADD_MEMBER_SUCCESS,
    members: members,
    category: category,
  };
};

export const addMemberFail = (error) => {
  return {
    type: actionTypes.ADD_MEMBER_FAIL,
    error: error,
  };
};

export const addMemberStart = () => {
  return {
    type: actionTypes.ADD_MEMBER_START,
  };
};

export const fetchMemberSuccess = (category, members) => {
  return {
    type: actionTypes.FETCH_MEMBER_SUCCESS,
    members: members,
    category: category,
  };
};

export const fetchMemberFail = (error) => {
  return {
    type: actionTypes.FETCH_MEMBER_FAIL,
    error: error,
  };
};

export const fetchMemberStart = () => {
  return {
    type: actionTypes.FETCH_MEMBER_START,
  };
};

export const fetchMembers = (category, queryCriteria) => {
  return (dispatch) => {
    dispatch(fetchMemberStart());
    const queryParams = "";
    axios
      .post("/member/read.php" + queryParams, queryCriteria)
      .then((res) => {
        const fetchedMembers = [];
        for (let key in res.data) {
          fetchedMembers.push({
            ...res.data[key],
            id: key,
          });
        }
        dispatch(fetchMemberSuccess(category, fetchedMembers));
      })
      .catch((err) => {
        dispatch(fetchMemberFail(err));
      });
  };
};

export const addMember = (member, cb) => {
  return (dispatch) => {
    dispatch(addMemberStart());

    let memberData = {
      name: member.name,
      designation: member.designation,
      more_info: member.more_info,
      visible: member.visible,
    };
    dispatch(startLoading());
    axios
      .post("/member/create.php", JSON.stringify(memberData))
      .then((response) => {
        cb(response.data.id);
      })
      .catch((error) => {
        dispatch(stopLoading());
      });
  };
};

export const editMember = (member, cb) => {
  return (dispatch) => {
    dispatch(addMemberStart());

    let memberData = {
      member_id: member.member_id,
      name: member.name,
      designation: member.designation,
      more_info: member.more_info,
      visible: member.visible,
    };
    dispatch(startLoading());
    axios
      .post("/member/update.php", JSON.stringify(memberData))
      .then((response) => {
        cb();
      })
      .catch((error) => {
        dispatch(stopLoading());
        dispatch(sendMessage("Something went wrong", "error"));
      });
  };
};

export const deleteMember = (memberId) => {
  return (dispatch) => {
    axios
      .post("/member/delete.php", JSON.stringify({ id: memberId }))
      .then((response) => {
        dispatch(sendMessage("Member Deleted", "success"));
        setTimeout(() => {
          window.location.href = "/dashboard/memberSummary";
        }, 1000);
      })
      .catch((error) => {
        dispatch(sendMessage("Something went wrong", "error"));
      });
  };
};
