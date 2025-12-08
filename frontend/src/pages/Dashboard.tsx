import { AllChats, CreateChat } from "../components/dashboard";

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