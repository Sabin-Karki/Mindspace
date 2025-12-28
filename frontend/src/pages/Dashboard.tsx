import { AllChats, CreateChat } from "../components/dashboard";

const Dashboard = () => {

  return(
    <>
    <div>
      <div>Recent notebooks</div>
      <div className="flex rounded-xl">
        <CreateChat />
        <AllChats />
      </div>
    </div>
    </>
  )
}

export default Dashboard;
