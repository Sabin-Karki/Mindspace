import AllChats from "../components/dashboard/AllChats";
import CreateChat from "../components/dashboard/CreateChat";

const Dashboard = () => {

  return(
    <>
    <div>
      <div>Recent notebooks</div>
      <CreateChat />
      <AllChats />
    </div>
    </>
  )
}

export default Dashboard;