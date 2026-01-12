import { Link } from "react-router-dom";

const NotFound = () => {
  return(
    <>
    <div className="flex-center h-full w-full bg-bg-pri">
      <div className="flex flex-col text-center">
        <h2 className="text-8xl font-bold mb-4 text-text-pri">404</h2>
        <p className="text-3xl mb-8"> Page Not found </p>
         <Link
          to="/"
          className="px-8 py-3 text-lg font-semibold rounded-full text-white bg-blue-600 hover:bg-blue-700 transition duration-300 shadow-lg hover:shadow-xl"
        > 
          Go to Home page
        </Link>
      </div>
    </div>
    </>
  )
}

export default NotFound;