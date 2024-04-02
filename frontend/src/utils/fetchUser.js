export const fetchUserToken = ()=> {
    const userId = localStorage.getItem("token")
    ? localStorage.getItem("token")
    : localStorage.clear();
    return userId
}
export const fetchUserId = ()=>{
    const userId = localStorage.getItem("uid")
    ? localStorage.getItem("uid")
    : '';
    return userId
}