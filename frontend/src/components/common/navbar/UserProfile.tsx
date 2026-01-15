import { User } from "lucide-react";
import { useAuthStore } from "../../../store/authStore";

interface UserProfileProps{
  handleLogout: () => void;
  handleHideMenu: () => void;
}

const UserProfile = ( {handleLogout, handleHideMenu} : UserProfileProps ) =>{
  
  const firstName = useAuthStore((state) => state.firstName)
  const lastName = useAuthStore((state) => state.lastName)
  

  return(
    <>
    <div onClick={ (e) => { e.stopPropagation(); } }
    className="inline-block absolute top-10 right-0 z-20 min-w-[20%] p-2 m-2 rounded shadow-lg bg-bg-sec border border-border-pri" >
      <div className="flex flex-col items-center text-xl">
        
        <div className="border border-border-sec rounded-full w-16 h-16  flex-center">
          <User size={50}/>
        </div>
        <div className="whitespace-nowrap mb-2">{firstName}</div>
        {/* <div>{lastName}</div> */}
        <button
          onClick={() => { handleLogout(), handleHideMenu()}}
          className="bg-red-500/80 hover:bg-red-500 text-white px-4 p-2  rounded-md text-sm font-medium transition duration-150"
          >
          Logout
        </button>
      </div>
    </div>
    </>
  )
}

export default UserProfile;