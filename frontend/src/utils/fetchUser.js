export const fetchUser = ()=> {
    const userId = localStorage.getItem("uid")
    ? localStorage.getItem("uid")
    : localStorage.clear();
    return userId
}