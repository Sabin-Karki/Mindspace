import WorkspaceContainer from "../components/workspace/WorkspaceContainer";

const Workspace = () =>{

return(
  <>
    <div className="flex h-full w-full border-4 border-gray-400
      scrollbar-hide">  
      <WorkspaceContainer />
    </div>
  </>
)
}

export default Workspace;