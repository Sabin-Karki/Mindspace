import WorkspaceContainer from "../components/workspace/WorkspaceContainer";

const Workspace = () =>{

return(
  <>
    <div className="flex h-full w-full bg-red-900 scrollbar-hide border-6 border-gray-400 rounded-lg 
      scrollbar-hide">  
      <WorkspaceContainer />
    </div>
  </>
)
}

export default Workspace;