import type { IReportResponse } from "../../../types";

const ReportGet = ({report}: {report: IReportResponse}) => {

  return (
    <>
    <div className=" border-amber-600 p-4">
      <div>{report.reportContent}</div>
      <div>{report.title}</div>
      {/* <div>{report.sourceId.length === 0 ? "No sources" : report.sourceId.length}</div> */}
    </div>
    </>
  )
}

export default ReportGet;